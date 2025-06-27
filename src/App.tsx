import Editor from './Editor';
import './App.css';
import { FLOWER, HELLO_WORLD } from './Program';
import run from './run';
import { useState } from 'react';

const App = () => {
  const [program, setProgram] = useState(HELLO_WORLD);

  return (
    <>
      <button
        onClick={() =>
          run(program.stmts, { pd: true, x: 250, y: 250, r: 0 }, 0, true)
        }
      >
        Run
      </button>
      <Editor {...{ program, setProgram }} />
      <canvas id="canvas" width={500} height={500} />
    </>
  );
};

export default App;
