type Program = {
  stmts: Stmt[];
};

type Stmt =
  | {
      type: 'command0';
      name: 'pu' | 'pd';
    }
  | {
      type: 'command1';
      name: 'fw' | 'bk' | 'lt' | 'rt';
      value: number;
    }
  | {
      type: 'repeat';
      count: number;
      stmts: Stmt[];
    }
  | {
      type: 'func';
      name: string;
      params: string[];
      stmts: Stmt[];
    }
  | {
      type: 'call';
      target: string;
      params: number[];
    };

const HELLO_WORLD: Program = {
  stmts: [
    {
      type: 'repeat',
      count: 4,
      stmts: [
        { type: 'command1', name: 'fw', value: 10 },
        { type: 'command1', name: 'lt', value: 90 },
      ],
    },
  ],
};

export { Program, Stmt, HELLO_WORLD };
