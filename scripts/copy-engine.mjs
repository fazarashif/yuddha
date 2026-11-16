// Copies the single-threaded lite Stockfish build into public/engine.
// The full npm package ships many variants; the app only needs this one.
import { cpSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = [join(root, 'node_modules/stockfish/bin')].find((dir) => existsSync(dir));
if (!src) {
  console.warn('[engine] stockfish package not installed yet, skipping');
  process.exit(0);
}
const out = join(root, 'public/engine');
mkdirSync(out, { recursive: true });
const files = readdirSync(src).filter((f) => /lite-single.*\.(js|wasm)$/.test(f));
// Names are kept as shipped: the loader derives the .wasm name from its own.
for (const f of files) cpSync(join(src, f), join(out, f));
console.log(`[engine] copied ${files.join(', ') || 'nothing'} to public/engine`);
