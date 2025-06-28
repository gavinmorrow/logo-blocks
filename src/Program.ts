type Program = {
  type: 'block';
  stmts: Stmt[];
};

type Value = number | string;
type Stmt =
  | { type: 'block'; stmts: Stmt[] }
  | {
      type: 'command0';
      name: 'pu' | 'pd';
    }
  | {
      type: 'command1';
      name: 'fd' | 'bk' | 'lt' | 'rt';
      value: Value;
    }
  | {
      type: 'repeat';
      count: Value;
      stmts: Program;
    }
  | {
      type: 'func';
      name: string;
      params: string[];
      stmts: Program;
    }
  | {
      type: 'call';
      target: string;
      params: Value[];
    }
  | {
      type: 'def';
      name: string;
      value: Value;
    };

const stmtToString = (stmt: Stmt, indentNum: number = 0): string => {
  const indent = '  '.repeat(indentNum);

  switch (stmt.type) {
    case 'block':
      return (
        indent +
        stmt.stmts.map((stmt) => stmtToString(stmt, indentNum)).join('\n')
      );
    case 'command0':
      return indent + stmt.name;
    case 'command1':
      return indent + `${stmt.name} ${stmt.value}`;
    case 'repeat':
      return `${indent}repeat ${stmt.count} [
${stmtToString(stmt.stmts, indentNum + 1)}
${indent}]`;
    case 'func':
    case 'call':
      return indent + 'todo: ${stmt}';
    case 'def':
      return indent + `make "${stmt.name} ${stmt.value}`;
  }
};

const ALL_BLOCKS: Stmt[] = [
  {
    type: 'command0',
    name: 'pu',
  },

  {
    type: 'command0',
    name: 'pd',
  },
  {
    type: 'command1',
    name: 'fd',
    value: 10,
  },
  {
    type: 'command1',
    name: 'bk',
    value: 10,
  },
  {
    type: 'command1',
    name: 'lt',
    value: 10,
  },
  {
    type: 'command1',
    name: 'rt',
    value: 10,
  },
  {
    type: 'repeat',
    count: 3,
    stmts: {
      type: 'block',
      stmts: [],
    },
  },
  {
    type: 'def',
    name: 'name',
    value: 0,
  },
];

const HELLO_WORLD: Program = {
  type: 'block',
  stmts: [
    {
      type: 'repeat',
      count: 4,
      stmts: {
        type: 'block',
        stmts: [
          { type: 'command1', name: 'fd', value: 50 },
          { type: 'command1', name: 'lt', value: 90 },
        ],
      },
    },
  ],
};

// From <https://www.transum.org/Software/Logo/Level2/?Level=3>
const FLOWER: Program = {
  type: 'block',
  stmts: [
    {
      type: 'repeat',
      count: 8,
      stmts: {
        type: 'block',
        stmts: [
          {
            type: 'command1',
            name: 'rt',
            value: 45,
          },
          {
            type: 'repeat',
            count: 6,
            stmts: {
              type: 'block',
              stmts: [
                {
                  type: 'repeat',
                  count: 90,
                  stmts: {
                    type: 'block',
                    stmts: [
                      { type: 'command1', name: 'fd', value: 2 },
                      { type: 'command1', name: 'rt', value: 2 },
                    ],
                  },
                },
                { type: 'command1', name: 'rt', value: 90 },
              ],
            },
          },
        ],
      },
    },
  ],
};

export { Program, Stmt, stmtToString, ALL_BLOCKS, HELLO_WORLD, FLOWER };
