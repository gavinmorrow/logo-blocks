import { Stmt } from './Program';

type Turtle = {
  pd: boolean;
  x: number;
  y: number;
  r: number;
};

let vars: { [name: string]: number } = {};
const resolve = (value: keyof typeof vars | number): number =>
  typeof value == 'number' ? value : vars[value];
const run = async (
  stmt: Stmt,
  t: Turtle,
  delay: number,
  clear: boolean = false,
) => {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d');

  if (clear) ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.moveTo(t.x, t.y);

  console.log({ x: t.x, y: t.y, r: t.r });
  switch (stmt.type) {
    case 'block': {
      for (const s of stmt.stmts) {
        await run(s, t, delay);
      }
      break;
    }

    case 'command0': {
      switch (stmt.name) {
        case 'pu':
          t.pd = false;
          break;
        case 'pd':
          t.pd = true;
          break;
      }
      break;
    }

    case 'command1': {
      const sin = Math.sin;
      const pi = Math.PI;
      const d: number = resolve(stmt.value);

      const move = (dx: number, dy: number) => {
        const fn = t.pd ? ctx.lineTo : ctx.moveTo;

        t.x += dx;
        t.y += dy;
        fn.bind(ctx)(t.x, t.y);

        ctx.stroke();
      };
      const rotate = (deg: number) => {
        const rad = (deg / 180) * pi;
        t.r += rad;
      };

      switch (stmt.name) {
        case 'fd':
          move(d * sin(pi / 2 - t.r), d * sin(t.r));
          break;
        case 'bk':
          move(-d * sin(pi / 2 - t.r), -d * sin(t.r));
          break;
        case 'lt':
          rotate(-d);
          break;
        case 'rt':
          rotate(d);
          break;
      }
      break;
    }
    case 'repeat': {
      for (let i = 0; i < resolve(stmt.count); i++) {
        await run(stmt.stmts, t, delay);
      }
    }
    case 'func': {
      break;
    }
    case 'call': {
      break;
    }
    case 'def': {
      vars[stmt.name] = resolve(stmt.value);
    }
  }

  await new Promise((r) => setTimeout(r, delay));
};

export default run;
