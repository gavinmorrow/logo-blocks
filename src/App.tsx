import Editor from './Editor';
import './App.css';
import { FLOWER, HELLO_WORLD } from './Program';
import run from './run';

const App = () => {
  let program = FLOWER;

  return (
    <>
      <button
        onClick={() =>
          run(program.stmts, { pd: true, x: 250, y: 250, r: 0 }, true)
        }
      >
        Run
      </button>
      <Editor program={program} />
      <canvas id="canvas" width={500} height={500} />
    </>
  );
};

export default App;
