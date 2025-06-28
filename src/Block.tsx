import { DragEventHandler, useState } from 'react';
import './Block.css';
import { stmtToString, Stmt } from './Program';
import { ParamInput } from './ParamInput';

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
    if (stmt.type == 'hole') return;

    event.dataTransfer.dropEffect = 'move';

    event.dataTransfer.setData(
      'application/logo-blocks.stmt',
      JSON.stringify(stmt),
    );
    // Don't do this b/c of dropping into inputs, which is very annoying
    // event.dataTransfer.setData('application/json', JSON.stringify(stmt));
    // event.dataTransfer.setData('text/plain', stmtToString(stmt));

    event.stopPropagation();
  };
  const onDragEnd: DragEventHandler<HTMLDivElement> = (event) => {
    if (event.dataTransfer.dropEffect == 'move') delStmt();
    event.stopPropagation();
  };

  let value: any;
  switch (stmt.type) {
    case 'hole': {
      let [backgroundColor, setBgColor] = useState('');

      const onDrop: DragEventHandler<HTMLDivElement> = (event) => {
        const data = event.dataTransfer.getData('application/logo-blocks.stmt');
        setStmt(JSON.parse(data));
        setBgColor('');
      };

      value = (
        <div
          onDrop={onDrop}
          onDragEnter={() => setBgColor('lightgoldenrodyellow')}
          onDragExit={() => setBgColor('')}
          onDragOver={(e) => e.preventDefault()}
          style={{ backgroundColor }}
        >
          ...
        </div>
      );
      break;
    }
    case 'block':
      value = (
        <>
          {stmt.stmts.map((s, i) => (
            <Block
              stmt={s}
              setStmt={updateStmt(
                stmt,
                (stmt, value) => (stmt.stmts[i] = value),
              )}
              delStmt={updateStmt(stmt, (stmt) => stmt.stmts.splice(i, 1))}
            />
          ))}
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

  return (
    <div
      className="block"
      draggable={stmt.type != 'hole'}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      {value}
    </div>
  );
};

export default Block;
