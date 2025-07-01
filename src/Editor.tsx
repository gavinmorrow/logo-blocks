import './Editor.css';

import Block from './Block';
import { ALL_BLOCKS, Program, stmtToString } from './Program';

type EditorProps = { program: Program; setProgram: (program: Program) => void };
const Editor = ({ program, setProgram }: EditorProps) => {
  return (
    <div className="editor">
      <div id="library">
        {ALL_BLOCKS.map((stmt, i) => (
          <Block
            key={String(i) + stmtToString(stmt)}
            stmt={stmt}
            setStmt={() => {}}
            delStmt={() => {}}
          />
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
