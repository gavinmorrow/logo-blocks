import './Editor.css';

import Block from './Block';
import { ALL_BLOCKS, Program } from './Program';

type EditorProps = { program: Program; setProgram: (program: Program) => void };
const Editor = ({ program, setProgram }: EditorProps) => {
  return (
    <div className="editor">
      <div id="library">
        {ALL_BLOCKS.map((stmt) => (
          <Block stmt={stmt} setStmt={() => {}} />
        ))}
      </div>
      <Block stmt={program} setStmt={setProgram} />
    </div>
  );
};

export default Editor;
