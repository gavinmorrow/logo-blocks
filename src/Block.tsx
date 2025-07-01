import { DragEventHandler, DragEvent, useState, useEffect } from 'react';
import './Block.css';
import { stmtToString, Stmt } from './Program';
import { ParamInput } from './ParamInput';
import stopPropogation from './stopPropogation';

const updateProp =
  <P,>(setProp: (newProp: P) => void) =>
  <
    P1 extends P,
    V extends K extends keyof P1 ? P1[K] : null,
    K extends keyof P1 | ((newProp: P1, newValue: V) => void),
  >(
    prop: P1,
    setValue: K,
  ) =>
  (newValue?: V) => {
    const newProp = structuredClone(prop);
    if (typeof setValue == 'function') {
      setValue(newProp, newValue);
    } else {
      newProp[setValue as keyof P1] = newValue;
    }
    setProp(newProp);
  };

type BlockProps = {
  stmt: Stmt | { type: 'hole' } | { type: 'trash' };
  setStmt: (stmt: Stmt) => void;
  delStmt: () => void;
  transparentBg?: boolean;
  parentHover?: boolean;
};

const Block = ({
  stmt,
  setStmt,
  delStmt,
  transparentBg = false,
  parentHover = false,
}: BlockProps) => {
  if (stmt.type == 'trash') {
    let [drag, setDrag] = useState(false);
    return (
      <div
        className="block"
        onDragEnter={() => setDrag(true)}
        onDragExit={() => setDrag(false)}
        onDrop={() => setDrag(false)}
        onDragOver={(e) => e.preventDefault()}
        style={{ backgroundColor: drag ? 'lightcoral' : '', color: 'coral' }}
      >
        Remove
      </div>
    );
  }

  const updateStmt = updateProp(setStmt);

  let [isDrag, setIsDrag] = useState(false);
  let [isDrop, setIsDrop] = useState(false);
  let hover = parentHover || isDrop;

  let acceptsDrop = !transparentBg && stmt.type == 'hole';

  const onDragStart: DragEventHandler<HTMLDivElement> = (event) => {
    if (stmt.type == 'hole') {
      return;
    }

    event.dataTransfer.dropEffect = 'move';
    setTimeout(() => {
      setIsDrag(true);
      setTimeout(delStmt, 42);
    }, 42);

    event.dataTransfer.setData(
      'application/logo-blocks.stmt',
      JSON.stringify(stmt),
    );

    event.stopPropagation();
    // Don't do this b/c of dropping into inputs, which is very annoying
    // event.dataTransfer.setData('application/json', JSON.stringify(stmt));
    // event.dataTransfer.setData('text/plain', stmtToString(stmt));
  };
  const onDragEnd: DragEventHandler<HTMLDivElement> = (event) => {
    setIsDrag(false);
    event.stopPropagation();
  };

  let value: any;
  switch (stmt.type) {
    case 'hole': {
      value = <></>;
      break;
    }
    case 'block':
      const genKey = (i: number, stmt: Stmt) =>
        String(i) + stmtToString(stmt).replace(/[\d\W]/g, '');
      value = (
        <>
          <Block
            stmt={{ type: 'hole' }}
            setStmt={updateStmt(stmt, (stmt, value) => {
              if (value.type == 'block') {
                stmt.stmts.unshift(...value.stmts);
              } else {
                stmt.stmts.unshift(value);
              }
            })}
            delStmt={() => {}}
            parentHover={hover}
          />
          {stmt.stmts.map((s, i) => [
            <Block
              key={genKey(i, s)}
              stmt={s}
              setStmt={updateStmt(
                stmt,
                (stmt, value) => (stmt.stmts[i] = value),
              )}
              delStmt={updateStmt(stmt, (stmt) => stmt.stmts.splice(i, 1))}
              parentHover={hover}
            />,
            <Block
              key={String(i) + 'hole'}
              stmt={{ type: 'hole' }}
              setStmt={updateStmt(stmt, (stmt, value) => {
                if (value.type == 'block') {
                  stmt.stmts.splice(i + 1, 0, ...value.stmts);
                } else {
                  stmt.stmts.splice(i + 1, 0, value);
                }
              })}
              delStmt={() => {}}
              parentHover={hover}
            />,
          ])}
        </>
      );
      break;
    case 'command0': {
      value = stmt.name;
      break;
    }
    case 'command1': {
      value = (
        <>
          {stmt.name}{' '}
          <ParamInput value={stmt.value} setValue={updateStmt(stmt, 'value')} />
        </>
      );
      break;
    }
    case 'repeat': {
      value = (
        <>
          <div className="repeat-text">
            {'repeat'}{' '}
            <ParamInput
              value={stmt.count}
              setValue={updateStmt(stmt, 'count')}
            />
          </div>
          <Block
            stmt={stmt.stmts}
            setStmt={(newStmt) => {
              if (newStmt.type != 'block') {
                newStmt = { type: 'block', stmts: [newStmt] };
              }
              updateStmt(stmt, 'stmts')(newStmt);
            }}
            delStmt={updateStmt(
              stmt,
              (stmt) => (stmt.stmts = { type: 'block', stmts: [] }),
            )}
            transparentBg={true}
            parentHover={hover}
          />
        </>
      );
      break;
    }
    case 'func':
    case 'call':
      value = 'unknown';
      break;
    case 'def': {
      value = (
        <>
          make{' '}
          <ParamInput value={stmt.name} setValue={updateStmt(stmt, 'name')} />{' '}
          <ParamInput value={stmt.value} setValue={updateStmt(stmt, 'value')} />
        </>
      );
      break;
    }
  }

  let backgroundColor =
    (isDrop && !isDrag && acceptsDrop) || hover ? 'lightGoldenrodYellow' : '';

  const onDrop: DragEventHandler<HTMLDivElement> = (event) => {
    if (!acceptsDrop) return;

    const data = event.dataTransfer.getData('application/logo-blocks.stmt');
    setStmt(JSON.parse(data));
    setIsDrop(false);

    event.stopPropagation();
  };

  return (
    <div
      className={`block block-${stmt.type} ${isDrop ? 'drop' : ''} ${isDrag ? 'drag' : ''} ${transparentBg ? 'transparent-bg' : ''}`}
      draggable={true}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDrop={onDrop}
      onDragEnter={(e) =>
        acceptsDrop && stopPropogation(() => setIsDrop(true))(e)
      }
      onDragExit={(e) =>
        acceptsDrop && stopPropogation(() => setIsDrop(false))(e)
      }
      onDragOver={(e) =>
        acceptsDrop && stopPropogation((e) => !isDrag && e.preventDefault())(e)
      }
      style={{ backgroundColor }}
    >
      {value}
    </div>
  );
};

export default Block;
