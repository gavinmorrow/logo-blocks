import { DragEventHandler, useState } from 'react';
import './Block.css';
import { stmtToString, Stmt } from './Program';

type BlockProps = {
  stmt: Stmt | { type: 'hole' };
  setStmt: (stmt: Stmt) => void;
};

const Block = ({ stmt, setStmt }: BlockProps) => {
  const onDragStart: DragEventHandler<HTMLDivElement> = (event) => {
    if (stmt.type == 'hole') return;

    event.dataTransfer.dropEffect = 'move';

    event.dataTransfer.setData(
      'application/logo-blocks.stmt',
      JSON.stringify(stmt),
    );
    event.dataTransfer.setData('application/json', JSON.stringify(stmt));
    event.dataTransfer.setData('text/plain', stmtToString(stmt));

    event.stopPropagation();
  };
  const onDrop: DragEventHandler<HTMLDivElement> = (event) => {
    const data = event.dataTransfer.getData('application/logo-blocks.stmt');
    setStmt(JSON.parse(data));
  };

  let value: any;
  switch (stmt.type) {
    case 'block':
      value = (
        <>
          {stmt.stmts.map((s, i) => (
            <Block
              stmt={s}
              setStmt={(newS) => {
                const newStmt = structuredClone(stmt);
                newStmt.stmts[i] = newS;
                setStmt(newStmt);
              }}
            />
          ))}
          <Block
            stmt={{ type: 'hole' }}
            setStmt={(newS) => {
              const newStmt = structuredClone(stmt);
              newStmt.stmts.push(newS);
              setStmt(newStmt);
            }}
          />
        </>
      );
      break;
    case 'hole':
      let [backgroundColor, setBgColor] = useState('');
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
    case 'command0':
      value = stmt.name;
      break;
    case 'command1':
      value = `${stmt.name} ${stmt.value}`;
      break;
    case 'repeat':
      value = (
        <>
          {' '}
          {'repeat'} {stmt.count}{' '}
          <Block
            stmt={stmt.stmts}
            setStmt={(newS) => {
              const newStmt = structuredClone(stmt);

              if (newS.type != 'block') {
                throw new Error(`Invalid stmt type: ${newS}`);
              }
              newStmt.stmts = newS;

              setStmt(newStmt);
            }}
          />
        </>
      );
      break;
    case 'func':
    case 'call':
      value = 'unknown';
      break;
  }

  return (
    <div className="block" draggable="true" onDragStart={onDragStart}>
      {value}
    </div>
  );
};

export default Block;
