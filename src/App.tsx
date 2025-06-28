import Editor from './Editor';
import './App.css';
import { FLOWER, HELLO_WORLD, stmtToString } from './Program';
import run from './run';
import { useState } from 'react';

const App = () => {
  const [program, setProgram] = useState(HELLO_WORLD);

  return (
    <>
      <button
        onClick={() =>
          run(program, { pd: true, x: 250, y: 250, r: 0 }, 100, true)
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
      <Editor {...{ program, setProgram }} />
      <canvas id="canvas" width={500} height={500} />
    </>
  );
};

export default App;
