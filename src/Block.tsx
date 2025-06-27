import { DragEventHandler } from 'react';
import './Block.css';
import { stmtToString, Stmt } from './Program';

type BlockProps = {
  stmt: Stmt;
  setStmt: (stmt: Stmt) => void;
};

const Block = ({ stmt, setStmt }: BlockProps) => {
  const onDragStart: DragEventHandler<HTMLDivElement> = (event) => {
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
                let newStmt = structuredClone(stmt);
                newStmt.stmts[i] = newS;
                setStmt(newStmt);
              }}
            />
          ))}
        </>
      );
      break;
    case 'hole':
      value = (
        <div
          onDrop={onDrop}
          onDragEnter={(e) =>
            (e.target.style.backgroundColor = 'lightgoldenrodyellow')
          }
          onDragExit={(e) => (e.target.style.backgroundColor = 'transparent')}
          onDragOver={(e) => e.preventDefault()}
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
          {stmt.stmts.map((s, i) => (
            <Block
              stmt={s}
              setStmt={(newS) => {
                let newStmt = structuredClone(stmt);
                newStmt.stmts[i] = newS;
                setStmt(newStmt);
              }}
            />
          ))}
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
