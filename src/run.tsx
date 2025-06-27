import { Stmt } from './Program';

type Turtle = {
  pd: boolean;
  x: number;
  y: number;
  r: number;
};

const run = async (stmts: Stmt[], t: Turtle, clear: boolean = false) => {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d');

  if (clear) ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.moveTo(t.x, t.y);

  for (const stmt of stmts) {
    console.log({ x: t.x, y: t.y, r: t.r });
    switch (stmt.type) {
      case 'command0': {
        switch (stmt.name) {
          case 'pu':
            t.pd = false;
          case 'pd':
            t.pd = true;
        }
        break;
      }

      case 'command1': {
        const sin = Math.sin;
        const pi = Math.PI;
        const d = stmt.value;

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
            rotate(stmt.value);
            break;
          case 'rt':
            rotate(-stmt.value);
            break;
        }
        break;
      }
      case 'repeat': {
        for (let i = 0; i < stmt.count; i++) {
          await run(stmt.stmts, t);
        }
      }
      case 'func': {
        break;
      }
      case 'call': {
        break;
      }
    }

    // await new Promise((r) => setTimeout(r, 1000));
  }
};

export default run;
