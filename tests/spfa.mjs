import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const context = { window: {} };
vm.runInNewContext(readFileSync(new URL("../public/spfa/line.js", import.meta.url), "utf8"), context);
const { buildFrames, examples } = context.window.spfaDemo;
const plain = value => JSON.parse(JSON.stringify(value));

// Bellman–Ford provides an independent oracle for the fixed teaching examples.
for (const [key, example] of Object.entries(examples)) {
  const distances = Array(7).fill(Infinity);
  distances[1] = 0;
  const directedEdges = example.edges.flatMap(([u, v, w]) => [[u, v, w], [v, u, w]]);
  let changed;
  for (let pass = 0; pass < 6; pass++) {
    changed = false;
    for (const [u, v, w] of directedEdges) {
      if (distances[u] + w < distances[v]) {
        distances[v] = distances[u] + w;
        changed = true;
      }
    }
    if (!changed) break;
  }
  const frames = plain(buildFrames(key));
  const last = frames.at(-1).status;
  assert.deepEqual(last.edges, plain(directedEdges), "each undirected edge is stored in both directions");
  assert.equal(last.result, !changed, `${key}: result matches Bellman–Ford`);
  if (last.result) assert.deepEqual(last.dis.slice(1), distances.slice(1).map(d => Number.isFinite(d) ? d : null));
  for (let i = 0; i < frames.length; i++) {
    const state = frames[i].status;
    assert.equal(new Set(state.queue).size, state.queue.length, "no duplicate queue entries");
    for (let v = 1; v <= state.n; v++) {
      assert.equal(state.inQueue[v], state.queue.includes(v), "queue membership matches flags");
      if (state.dis[v] === null) continue;
      assert.equal(state.paths[v].length - 1, state.cnt[v], "cnt counts historical path edges");
      let sum = 0;
      for (let j = 1; j < state.paths[v].length; j++) {
        const edge = state.edges.find(([a, b]) => a === state.paths[v][j - 1] && b === state.paths[v][j]);
        assert.ok(edge, "historical walk uses existing edges");
        sum += edge[2];
      }
      assert.equal(state.dis[v], sum, "distance equals historical walk weight");
    }
    if (state.phase === "pop") assert.equal(state.inQueue[state.u], false);
    if (state.phase === "queued") {
      assert.deepEqual(state.queue, frames[i - 1].status.queue, "already queued vertex stays in place");
    }
  }
  if (key === "shortest") {
    assert.ok(frames.some(({ status: s }) => s.phase === "relax" && s.inQueue[s.v]), "updates a queued vertex");
    assert.ok(frames.filter(({ status: s }) => s.phase === "pop" && s.u === 2).length > 1, "can process vertex again");
  }
  if (key === "negative") assert.ok(last.cnt[last.v] >= last.n);
  assert.deepEqual(plain(buildFrames(key)), frames, "repeated calls start with clean state");
  console.log(`PASS ${key}: ${frames.length} frames, historical paths, queue flags, Bellman–Ford result`);
}
