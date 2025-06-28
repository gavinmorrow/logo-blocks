import { DragEventHandler, useState } from 'react';
import './Block.css';
import { stmtToString, Stmt } from './Program';

const updateProp = (prop, setProp, setValue) => (newValue) => {
  const newProp = structuredClone(prop);
  setValue(newProp, newValue);
  setProp(newProp);
};

const ParamInput = ({ value, setValue }) => {
  const [tmpVal, setTmpVal] = useState(value);
  const commitChange = () => {
    let newValue = Number(setTmpVal);
    if (isNaN(newValue)) newValue = value;

    setTmpVal(newValue);
    setValue(newValue);
  };
  return (
    <input
      type="number"
      value={tmpVal}
      onChange={(e) => setTmpVal(e.target.value)}
      onBlur={commitChange}
    />
  );
};

type BlockProps = {
  stmt: Stmt | { type: 'hole' };
  setStmt: (stmt: Stmt) => void;
  delStmt: () => void;
};

const Block = ({ stmt, setStmt, delStmt }: BlockProps) => {
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
    if (event.dataTransfer.dropEffect == 'move') {
      // The drop wasn't completed.
      delStmt();
    }
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
              setStmt={(newS) => {
                const newStmt = structuredClone(stmt);
                newStmt.stmts[i] = newS;
                setStmt(newStmt);
              }}
              delStmt={() => {
                const newStmt = structuredClone(stmt);
                newStmt.stmts.splice(i, 1);
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
      const [tmpVal, setTmpVal] = useState(String(stmt.value));
      const setVal = (newVal: number) => {
        setTmpVal(String(newVal));
        const newStmt = structuredClone(stmt);
        newStmt.value = newVal;
        setStmt(newStmt);
      };
      value = (
        <>
          {stmt.name}{' '}
          <input
            type="number"
            value={tmpVal}
            onChange={(e) => setTmpVal(e.target.value)}
            onBlur={(event) => setVal(Number(event.target.value))}
            style={{ width: '5ch', border: 'none', fontFamily: 'monospace' }}
          />
        </>
      );
      break;
    }
    case 'repeat': {
      const setCount = (newCount: number) => {
        const newStmt = structuredClone(stmt);
        newStmt.count = newCount;
        setStmt(newStmt);
      };
      value = (
        <>
          {' '}
          {'repeat'}{' '}
          <input
            type="number"
            value={stmt.count}
            onSubmit={(event) => setCount(Number(event.target.value))}
            style={{ width: '5ch', border: 'none', fontFamily: 'monospace' }}
          />
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
            delStmt={() => {
              const newStmt = structuredClone(stmt);
              newStmt.stmts = { type: 'block', stmts: [] };
              setStmt(newStmt);
            }}
          />
        </>
      );
      break;
    }
    case 'func':
    case 'call':
      value = 'unknown';
      break;
  }

  return (
    <div
      className="block"
      draggable="true"
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      {value}
    </div>
  );
};

export default Block;
