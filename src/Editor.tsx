import Block from './Block';
import { HELLO_WORLD } from './Program';

const Editor = () => {
  return (
    <>
      {HELLO_WORLD.stmts.map((stmt) => (
        <Block stmt={stmt} />
      ))}
    </>
  );
};

export default Editor;
