import { problems } from '../lib/problems.mjs';
import { findCompiler, buildRunner } from '../lib/compiler.mjs';
import { Judge } from '../lib/judge.mjs';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const compiler = await findCompiler();
if (!compiler.available) throw new Error(compiler.message);
await mkdir(join(root, '.cache'), { recursive: true });
const runner = await buildRunner(root, compiler);
const judge = new Judge({ root, compiler, runner, problems, store: { change: async () => {} } });
let count = 0, failures = 0;
for (const problem of problems) {
  const result = await judge.perform('judge', { code: problem.solution, problemId: problem.id });
  count += result.total;
  console.log(problem.id, problem.title, result.status, `${result.passed}/${result.total}`);
  if (result.status !== 'AC') { failures++; console.error(JSON.stringify(result)); }
}
console.log(`${problems.length} 道题，${count} 组测试，${failures} 道失败。`);
process.exitCode = failures ? 1 : 0;
