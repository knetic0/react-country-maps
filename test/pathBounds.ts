export interface Bounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

export interface Ring {
  points: [number, number][];
  bounds: Bounds;
}

const ARG_COUNT: Record<string, number> = {
  M: 2, L: 2, H: 1, V: 1, C: 6, S: 4, Q: 4, T: 2, A: 7, Z: 0,
};

const emptyBounds = (): Bounds => ({
  minX: Infinity,
  minY: Infinity,
  maxX: -Infinity,
  maxY: -Infinity,
});

const extend = (b: Bounds, x: number, y: number) => {
  b.minX = Math.min(b.minX, x);
  b.minY = Math.min(b.minY, y);
  b.maxX = Math.max(b.maxX, x);
  b.maxY = Math.max(b.maxY, y);
};

/**
 * Splits SVG path data into rings (one per subpath) and returns the bounds of
 * every point, including curve control points. Control points can lie a little
 * outside the curve, so the bounds are conservative.
 */
export function parsePath(d: string): Ring[] {
  const tokens = d.match(/[a-zA-Z]|[-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?/g) ?? [];
  const rings: Ring[] = [];
  let ring: Ring | null = null;
  let x = 0;
  let y = 0;
  let startX = 0;
  let startY = 0;
  let command = "";
  let i = 0;

  const add = (px: number, py: number) => {
    if (!ring) {
      ring = { points: [], bounds: emptyBounds() };
      rings.push(ring);
    }
    ring.points.push([px, py]);
    extend(ring.bounds, px, py);
  };

  while (i < tokens.length) {
    if (/[a-zA-Z]/.test(tokens[i])) command = tokens[i++];
    const upper = command.toUpperCase();
    const relative = command !== upper;
    if (!(upper in ARG_COUNT)) throw new Error(`Unsupported path command "${command}"`);

    if (upper === "Z") {
      x = startX;
      y = startY;
      ring = null;
      continue;
    }

    const args = tokens.slice(i, i + ARG_COUNT[upper]).map(Number);
    if (args.length < ARG_COUNT[upper] || args.some(Number.isNaN)) {
      throw new Error(`Malformed path near token ${i}`);
    }
    i += ARG_COUNT[upper];
    const ox = relative ? x : 0;
    const oy = relative ? y : 0;

    switch (upper) {
      case "M":
        ring = null;
        x = ox + args[0];
        y = oy + args[1];
        startX = x;
        startY = y;
        add(x, y);
        // Extra coordinate pairs after M are implicit L commands
        command = relative ? "l" : "L";
        break;
      case "H":
        x = ox + args[0];
        add(x, y);
        break;
      case "V":
        y = oy + args[0];
        add(x, y);
        break;
      case "A":
        x = ox + args[5];
        y = oy + args[6];
        add(x, y);
        break;
      default:
        for (let k = 0; k < args.length; k += 2) add(ox + args[k], oy + args[k + 1]);
        x = ox + args[args.length - 2];
        y = oy + args[args.length - 1];
    }
  }
  return rings;
}

export function mergeBounds(list: Bounds[]): Bounds {
  const b = emptyBounds();
  for (const item of list) {
    extend(b, item.minX, item.minY);
    extend(b, item.maxX, item.maxY);
  }
  return b;
}
