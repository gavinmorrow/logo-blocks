import Editor from './Editor';
import './App.css';
import { FLOWER, HELLO_WORLD, Program, stmtToString } from './Program';
import run from './run';
import { useState } from 'react';

const App = () => {
  const [delay, setDelay] = useState(100);

  const [program, setProgramRaw] = useState(FLOWER);
  const setProgram = (program: Program) => {
    if (program.type != 'block') {
      program = { type: 'block', stmts: [program] };
    }
    setProgramRaw(program);
  };

  return (
    <>
      <button
        onClick={() =>
          run(program, { pd: true, x: 250, y: 250, r: 0 }, delay, true)
        }
      >
        Run
      </button>
      <button
        onClick={() => navigator.clipboard.writeText(JSON.stringify(program))}
      >
        Export
      </button>
      <button
        onClick={async () =>
          setProgram(JSON.parse(await navigator.clipboard.readText()))
        }
      >
        Import
      </button>
      <input
        type="number"
        value={delay}
        onChange={(e) => setDelay(Number(e.target.value))}
      />
      <Editor {...{ program, setProgram }} />
      <canvas id="canvas" width={500} height={500} />
    </>
  );
};

export default App;
