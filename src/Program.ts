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
      name: 'fd' | 'bk' | 'lt' | 'rt';
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

const stmtToString = (stmt: Stmt, indentNum: number = 0): string => {
  const indent = '  '.repeat(indentNum);

  switch (stmt.type) {
    case 'command0':
      return indent + stmt.name;
    case 'command1':
      return indent + `${stmt.name} ${stmt.value}`;
    case 'repeat':
      return `${indent}repeat ${stmt.count} [
${stmt.stmts.map((stmt) => stmtToString(stmt, indentNum + 1)).join('\n')}
${indent}]`;
    case 'func':
    case 'call':
      return indent + 'todo: ${stmt}';
  }
};

const HELLO_WORLD: Program = {
  stmts: [
    {
      type: 'repeat',
      count: 4,
      stmts: [
        { type: 'command1', name: 'fd', value: 50 },
        { type: 'command1', name: 'lt', value: 90 },
      ],
    },
  ],
};

// From <https://www.transum.org/Software/Logo/Level2/?Level=3>
const FLOWER: Program = {
  stmts: [
    {
      type: 'repeat',
      count: 8,
      stmts: [
        {
          type: 'command1',
          name: 'rt',
          value: 45,
        },
        {
          type: 'repeat',
          count: 6,
          stmts: [
            {
              type: 'repeat',
              count: 90,
              stmts: [
                { type: 'command1', name: 'fd', value: 2 },
                { type: 'command1', name: 'rt', value: 2 },
              ],
            },
            { type: 'command1', name: 'rt', value: 90 },
          ],
        },
      ],
    },
  ],
};

export { Program, Stmt, stmtToString, HELLO_WORLD, FLOWER };
