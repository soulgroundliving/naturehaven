// Widest-route search for the room-arranging game.
//
// "Can I walk from the front door to the bathroom?" is not the question the
// article asks — its rule is about HOW WIDE the narrowest point of the best
// route is. So this measures exactly that, in two passes:
//   1. every sample point on a 2.5 cm lattice gets its clearance (distance to the
//      nearest wall or piece), and a best-first search finds how wide the
//      narrowest point of the widest route can be — that number is the answer;
//   2. many routes are usually equally wide, and the first search picks one of
//      them arbitrarily (it wanders). To DRAW the route, a second search finds
//      the shortest way that never narrows below that width.
//
// Pure and dependency-free, so it runs on plain Node for the unit tests
// (tools/__tests__/roomFit.test.ts) as well as in the browser.

export interface Rect {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface Route {
  /** Width in cm at the narrowest point of the widest route; 0 when there is no route. */
  width: number;
  /** Start zone to target zone, thinned to roughly 10 cm between points. */
  path: Point[];
}

/**
 * Spacing of the sample points, in cm. They sit ON this lattice (x0, x0 + CELL, ...),
 * not at the centres of cells between it. Every wall and piece edge in the game is
 * a multiple of 5 cm, so the middle of any gap — a multiple of 2.5 — is always a
 * sample point, and a gap is measured exactly: 105 cm reads as 105, not 102.5.
 */
export const CELL = 2.5;

// Every 4th sample of the route (4 x 2.5 = 10 cm) is enough to draw it.
const PATH_STEP = 4;

// Binary heap over (score, item); `pop` returns the item with the HIGHEST score
// (push a negated cost to get a min-heap).
function createHeap() {
  const scores: number[] = [];
  const items: number[] = [];
  const swap = (a: number, b: number) => {
    [scores[a], scores[b]] = [scores[b], scores[a]];
    [items[a], items[b]] = [items[b], items[a]];
  };
  return {
    get size() {
      return items.length;
    },
    push(score: number, item: number) {
      scores.push(score);
      items.push(item);
      let k = items.length - 1;
      while (k > 0) {
        const parent = (k - 1) >> 1;
        if (scores[parent] >= scores[k]) break;
        swap(parent, k);
        k = parent;
      }
    },
    pop(): { score: number; item: number } {
      const top = { score: scores[0], item: items[0] };
      const lastScore = scores.pop() as number;
      const lastItem = items.pop() as number;
      if (items.length > 0) {
        scores[0] = lastScore;
        items[0] = lastItem;
        let k = 0;
        for (;;) {
          const left = 2 * k + 1;
          const right = left + 1;
          let largest = k;
          if (left < items.length && scores[left] > scores[largest]) largest = left;
          if (right < items.length && scores[right] > scores[largest]) largest = right;
          if (largest === k) break;
          swap(largest, k);
          k = largest;
        }
      }
      return top;
    },
  };
}

// dx, dy, and the step length: orthogonal moves cost 1 cell, diagonal ones sqrt(2).
const STEPS = [
  [-1, -1, Math.SQRT2], [0, -1, 1], [1, -1, Math.SQRT2],
  [-1, 0, 1], [1, 0, 1],
  [-1, 1, Math.SQRT2], [0, 1, 1], [1, 1, Math.SQRT2],
] as const;

interface Grid {
  nx: number;
  ny: number;
  xAt: (i: number) => number;
  yAt: (j: number) => number;
  /** Is sample (i, j) inside the rectangle? */
  inside: (i: number, j: number, r: Rect) => boolean;
}

// Samples run from one wall to the opposite one, both included; the ones ON a wall
// have no clearance and are never walked.
function buildGrid(area: Rect): Grid {
  const xAt = (i: number) => area.x0 + i * CELL;
  const yAt = (j: number) => area.y0 + j * CELL;
  return {
    nx: Math.floor((area.x1 - area.x0) / CELL) + 1,
    ny: Math.floor((area.y1 - area.y0) / CELL) + 1,
    xAt,
    yAt,
    inside: (i, j, r) => xAt(i) >= r.x0 && xAt(i) <= r.x1 && yAt(j) >= r.y0 && yAt(j) <= r.y1,
  };
}

// Distance from every sample to the nearest wall or obstacle edge (0 on or inside one).
function clearanceMap(grid: Grid, area: Rect, obstacles: readonly Rect[]): Float64Array {
  const { nx, ny } = grid;
  const clearance = new Float64Array(nx * ny);
  for (let j = 0; j < ny; j += 1) {
    const y = grid.yAt(j);
    for (let i = 0; i < nx; i += 1) {
      const x = grid.xAt(i);
      let d = Math.min(x - area.x0, area.x1 - x, y - area.y0, area.y1 - y);
      for (const o of obstacles) {
        const distance = Math.hypot(Math.max(o.x0 - x, 0, x - o.x1), Math.max(o.y0 - y, 0, y - o.y1));
        if (distance < d) d = distance;
      }
      clearance[j * nx + i] = d;
    }
  }
  return clearance;
}

// Pass 1: best[k] = the widest "narrowest clearance" over every route that reaches sample k.
function widestSearch(grid: Grid, clearance: Float64Array, from: Rect): Float64Array {
  const { nx, ny } = grid;
  const best = new Float64Array(nx * ny).fill(-1);
  const heap = createHeap();
  for (let j = 0; j < ny; j += 1) {
    for (let i = 0; i < nx; i += 1) {
      const c = clearance[j * nx + i];
      if (c > 0 && grid.inside(i, j, from)) {
        best[j * nx + i] = c;
        heap.push(c, j * nx + i);
      }
    }
  }
  while (heap.size > 0) {
    const { score, item } = heap.pop();
    if (score < best[item]) continue; // a better route to this cell was found after this entry was queued
    const i = item % nx;
    const j = (item - i) / nx;
    for (const [di, dj] of STEPS) {
      const ni = i + di;
      const nj = j + dj;
      if (ni < 0 || nj < 0 || ni >= nx || nj >= ny) continue;
      const next = nj * nx + ni;
      const c = clearance[next];
      if (c <= 0) continue;
      const reach = Math.min(score, c);
      if (reach > best[next]) {
        best[next] = reach;
        heap.push(reach, next);
      }
    }
  }
  return best;
}

// Pass 2: the shortest route from the start zone to the target zone that stays on
// samples at least `minClear` from every wall and piece — i.e. never narrower than
// the width pass 1 found. Returns the samples from start to target, or [] if none.
function shortestRoute(grid: Grid, clearance: Float64Array, minClear: number, from: Rect, target: Rect): number[] {
  const { nx, ny } = grid;
  const cost = new Float64Array(nx * ny).fill(Infinity);
  const previous = new Int32Array(nx * ny).fill(-1);
  const heap = createHeap();
  for (let j = 0; j < ny; j += 1) {
    for (let i = 0; i < nx; i += 1) {
      if (clearance[j * nx + i] >= minClear && grid.inside(i, j, from)) {
        cost[j * nx + i] = 0;
        heap.push(0, j * nx + i);
      }
    }
  }
  while (heap.size > 0) {
    const { score, item } = heap.pop();
    if (-score > cost[item]) continue;
    const i = item % nx;
    const j = (item - i) / nx;
    if (grid.inside(i, j, target)) {
      const cells: number[] = [];
      for (let k = item; k !== -1; k = previous[k]) cells.push(k);
      return cells.reverse();
    }
    for (const [di, dj, step] of STEPS) {
      const ni = i + di;
      const nj = j + dj;
      if (ni < 0 || nj < 0 || ni >= nx || nj >= ny) continue;
      const next = nj * nx + ni;
      if (clearance[next] < minClear) continue;
      const total = cost[item] + step;
      if (total < cost[next]) {
        cost[next] = total;
        previous[next] = item;
        heap.push(-total, next);
      }
    }
  }
  return [];
}

/**
 * For each target zone, the route from the start zone whose narrowest point is
 * widest. `area` is the walkable floor (its edges are walls), `obstacles` are
 * the pieces standing on it. A zone is any rectangle: the search starts from
 * every free sample in `from` and reads the best result over every sample in a
 * target, so the width is not held hostage by where inside a doorway you stand.
 */
export function widestRoutes<K extends string>(
  area: Rect,
  obstacles: readonly Rect[],
  from: Rect,
  targets: Readonly<Record<K, Rect>>,
): Record<K, Route> {
  const grid = buildGrid(area);
  const clearance = clearanceMap(grid, area, obstacles);
  const best = widestSearch(grid, clearance, from);

  const routes = {} as Record<K, Route>;
  for (const key of Object.keys(targets) as K[]) {
    const zone = targets[key];
    let widest = 0;
    for (let j = 0; j < grid.ny; j += 1) {
      for (let i = 0; i < grid.nx; i += 1) {
        if (grid.inside(i, j, zone) && best[j * grid.nx + i] > widest) widest = best[j * grid.nx + i];
      }
    }
    if (widest <= 0) {
      routes[key] = { width: 0, path: [] };
      continue;
    }
    const samples = shortestRoute(grid, clearance, widest, from, zone);
    const path: Point[] = [];
    samples.forEach((sample, index) => {
      if (index % PATH_STEP === 0 || index === samples.length - 1) {
        const i = sample % grid.nx;
        path.push({ x: grid.xAt(i), y: grid.yAt((sample - i) / grid.nx) });
      }
    });
    routes[key] = { width: 2 * widest, path };
  }
  return routes;
}
