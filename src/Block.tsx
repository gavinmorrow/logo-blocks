import './Block.css';
import { Stmt } from './Program';

type BlockProps = {
  stmt: Stmt;
};
const Block = ({ stmt }: BlockProps) => {
  return (
    <div className="block">
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
