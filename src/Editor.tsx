import Block from './Block';
import { Program } from './Program';

type EditorProps = { program: Program };
const Editor = ({ program }: EditorProps) => {
  return (
    <>
      {program.stmts.map((stmt) => (
        <Block stmt={stmt} />
      ))}
    </>
  );
};

export default Editor;
