import Block from './Block';
import { Program } from './Program';

type EditorProps = { program: Program; setProgram: (program: Program) => void };
const Editor = ({ program, setProgram }: EditorProps) => {
  return (
    <div>
      <Block stmt={program} setStmt={setProgram} />
    </div>
  );
};

export default Editor;
