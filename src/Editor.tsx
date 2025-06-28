import './Editor.css';

import Block from './Block';
import { ALL_BLOCKS, Program } from './Program';

type EditorProps = { program: Program; setProgram: (program: Program) => void };
const Editor = ({ program, setProgram }: EditorProps) => {
  return (
    <div className="editor">
      <div id="library">
        <Block stmt={{ type: 'hole' }} setStmt={() => {}} delStmt={() => {}} />
        {ALL_BLOCKS.map((stmt) => (
          <Block stmt={stmt} setStmt={() => {}} delStmt={() => {}} />
        ))}
      </div>
      <Block
        stmt={program}
        setStmt={setProgram}
        delStmt={() => setProgram({ type: 'block', stmts: [] })}
      />
    </div>
  );
};

export default Editor;
