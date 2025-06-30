import { DragEventHandler, DragEvent, useState } from 'react';
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
  stmt: Stmt | { type: 'hole' };
  setStmt: (stmt: Stmt) => void;
  delStmt: () => void;
};

const Block = ({ stmt, setStmt, delStmt }: BlockProps) => {
  const updateStmt = updateProp(setStmt);

  const onDragStart: DragEventHandler<HTMLDivElement> = (event) => {
    if (stmt.type == 'hole') {
      event.preventDefault();
      // Do *not* stop propogation.
      return false;
    }

    event.dataTransfer.dropEffect = 'move';

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
    if (event.dataTransfer.dropEffect == 'move') delStmt();
    event.stopPropagation();
  };

  let value: any;
  switch (stmt.type) {
    case 'hole': {
      value = <>...</>;
      break;
    }
    case 'block':
      value = (
        <>
          <Block
            stmt={{ type: 'hole' }}
            setStmt={updateStmt(stmt, (stmt, value) => {
              if (value.type == 'block') {
                stmt.stmts.push(...value.stmts);
              } else {
                stmt.stmts.push(value);
              }
            })}
            delStmt={() => {}}
          />
          {stmt.stmts.map((s, i) => [
            <Block
              key={String(i) + stmtToString(stmt).replace(/\d/g, '')}
              stmt={s}
              setStmt={updateStmt(
                stmt,
                (stmt, value) => (stmt.stmts[i] = value),
              )}
              delStmt={updateStmt(stmt, (stmt) => stmt.stmts.splice(i, 1))}
            />,
            <Block
              key={String(i) + 'hole'}
              stmt={{ type: 'hole' }}
              setStmt={updateStmt(stmt, (stmt, value) => {
                if (value.type == 'block') {
                  stmt.stmts.push(...value.stmts);
                } else {
                  stmt.stmts.push(value);
                }
              })}
              delStmt={() => {}}
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
          {' '}
          {'repeat'}{' '}
          <ParamInput value={stmt.count} setValue={updateStmt(stmt, 'count')} />
          <Block
            stmt={stmt.stmts}
            setStmt={updateStmt(stmt, 'stmts')}
            delStmt={updateStmt(
              stmt,
              (stmt) => (stmt.stmts = { type: 'block', stmts: [] }),
            )}
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

  let [backgroundColor, setBgColor] = useState('');

  const onDrop: DragEventHandler<HTMLDivElement> = (event) => {
    const data = event.dataTransfer.getData('application/logo-blocks.stmt');
    setStmt(JSON.parse(data));
    setBgColor('');

    event.stopPropagation();
  };

  return (
    <div
      className="block"
      draggable={true}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDrop={onDrop}
      onDragEnter={stopPropogation(() => setBgColor('lightgoldenrodyellow'))}
      onDragExit={stopPropogation(() => setBgColor(''))}
      onDragOver={stopPropogation((e) => e.preventDefault())}
      style={{ backgroundColor }}
    >
      {value}
    </div>
  );
};

export default Block;
