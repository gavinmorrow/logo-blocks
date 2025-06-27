import Block from './Block';
import { Program } from './Program';

type EditorProps = { program: Program };
const Editor = ({ program }: EditorProps) => {
  return (
    <div>
      Start
      {program.stmts.map((stmt) => (
        <Block stmt={stmt} />
      ))}
    </div>
  );
};

export default Editor;
