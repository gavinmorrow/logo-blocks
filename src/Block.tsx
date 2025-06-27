import { DragEventHandler } from 'react';
import './Block.css';
import { stmtToString, Stmt } from './Program';

type BlockProps = {
  stmt: Stmt;
};

const onDragStart: (stmt: Stmt) => DragEventHandler<HTMLDivElement> =
  (stmt: Stmt) => (event) => {
    event.dataTransfer.setData(
      'application/logo-blocks.stmt',
      JSON.stringify(stmt),
    );
    event.dataTransfer.setData('application/json', JSON.stringify(stmt));
    event.dataTransfer.setData('text/plain', stmtToString(stmt));
  };

const Block = ({ stmt }: BlockProps) => {
  return (
    <div className="block" draggable="true" onDragStart={onDragStart(stmt)}>
      {stmt.type == 'command0' ? (
        stmt.name
      ) : stmt.type == 'command1' ? (
        `${stmt.name} ${stmt.value}`
      ) : stmt.type == 'repeat' ? (
        <>
          {' '}
          {'repeat'} {stmt.count}{' '}
          {stmt.stmts.map((stmt) => (
            <Block stmt={stmt} />
          ))}
        </>
      ) : (
        'unknown'
      )}
    </div>
  );
};

export default Block;
