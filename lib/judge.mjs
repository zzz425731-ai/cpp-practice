import { mkdtemp, writeFile, open, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { execute } from './process.mjs';
import { compilerEnvironment } from './compiler.mjs';

export const normalize = value => value.replace(/^\uFEFF/, '').trim().split(/\s+/u).filter(Boolean).join(' ');
export const limits = Object.freeze({ timeMs: 2000, outputBytes: 4194304, compileMs: 30000 });

async function readBounded(path, max = limits.outputBytes) {
  let file;
  try {
    file = await open(path, 'r');
    const buffer = Buffer.alloc(max);
    const { bytesRead } = await file.read(buffer, 0, max, 0);
    return buffer.subarray(0, bytesRead).toString('utf8');
  } catch (error) { if (error.code === 'ENOENT') return ''; throw error; }
  finally { await file?.close(); }
}

export class Judge {
  constructor({ root, compiler, runner, store, problems }) {
    Object.assign(this, { root, compiler, runner, store, problems });
    this.jobs = new Map(); this.tail = Promise.resolve(); this.pending = 0;
  }
  enqueue(kind, request) {
    if (!this.compiler.available) throw Object.assign(new Error(this.compiler.message), { status: 503 });
    if (this.pending >= 3) throw Object.assign(new Error('正在处理其他提交，请稍后再试'), { status: 429 });
    const id = randomUUID();
    const job = { id, kind, status: 'queued' };
    this.jobs.set(id, job); this.pending++;
    this.tail = this.tail.then(async () => {
      job.status = 'running';
      try { job.result = await this.perform(kind, request); }
      catch (error) { job.result = { status: 'ERROR', passed: 0, total: 0, timeMs: 0, stdout: '', stderr: error.message }; }
      job.status = 'done'; this.pending--;
      // Bound transient job history; durable submissions remain in the store.
      if (this.jobs.size > 100) for (const [key, value] of this.jobs) {
        if (value.status === 'done' && key !== id) { this.jobs.delete(key); break; }
      }
    });
    return id;
  }
  async perform(kind, { code, input, problemId }) {
    const folder = await mkdtemp(join(this.root, '.cache', 'job-'));
    const env = compilerEnvironment(this.compiler);
    const problem = this.problems.find(p => p.id === problemId);
    const result = { status: kind === 'judge' ? 'AC' : 'OK', passed: 0, total: kind === 'judge' ? problem.tests.length : 0, timeMs: 0, results: [], stdout: '', stderr: '' };
    try {
      const source = join(folder, 'main.cpp');
      const target = join(folder, process.platform === 'win32' ? 'main.exe' : 'main');
      await writeFile(source, code, 'utf8');
      const compiled = await execute(this.compiler.path, ['-std=c++17', '-O2', '-Wall', '-Wextra', '-fdiagnostics-color=never', 'main.cpp', '-o', process.platform === 'win32' ? 'main.exe' : 'main'], { cwd: folder, env, timeout: limits.compileMs });
      result.compileOutput = (compiled.stderr + compiled.stdout).split(folder).join('<临时目录>');
      if (compiled.code !== 0 || compiled.timedOut || compiled.overflow || compiled.error) {
        result.status = 'CE';
        result.compileOutput ||= compiled.timedOut ? '编译超过 30 秒，已停止。' : compiled.error || '编译失败';
      } else {
        const cases = kind === 'judge' ? problem.tests : [{ input }];
        for (let index = 0; index < cases.length; index++) {
          const test = cases[index];
          const stdinPath = join(folder, 'input.txt'), stdoutPath = join(folder, 'output.txt'), stderrPath = join(folder, 'stderr.txt');
          await writeFile(stdinPath, test.input, 'utf8');
          const ran = await execute(this.runner, [target, stdinPath, stdoutPath, stderrPath, String(limits.timeMs), String(limits.outputBytes)], { cwd: folder, env, timeout: limits.timeMs + 10000, limit: 16384 });
          let execution;
          try { execution = JSON.parse(ran.stdout); }
          catch { throw new Error('判题执行器异常：' + (ran.stderr || ran.error || ran.stdout || '未返回结果')); }
          if (!['OK', 'RE', 'TLE', 'OLE', 'ERROR'].includes(execution.status)) throw new Error('判题执行器返回无效状态');
          const actual = await readBounded(stdoutPath);
          const stderr = await readBounded(stderrPath, 32768);
          if (execution.status === 'ERROR') throw new Error('程序启动失败：' + (stderr || '执行器错误 ' + execution.exitCode));
          const status = execution.status === 'OK' && kind === 'judge' ? (normalize(actual) === normalize(test.output) ? 'AC' : 'WA') : execution.status;
          result.timeMs += execution.timeMs;
          if (kind === 'run') Object.assign(result, { status, stdout: actual, stderr });
          else {
            if (status === 'AC') result.passed++;
            if (result.status === 'AC' && status !== 'AC') result.status = status;
            result.results.push({ index: index + 1, status, timeMs: execution.timeMs, input: test.input.slice(0, 8192), expected: test.output.slice(0, 8192), actual: actual.slice(0, 8192), stderr });
          }
          // Stop runaway submissions at first execution failure (WA can continue).
          if (['TLE', 'OLE', 'RE'].includes(status)) break;
        }
      }
      if (kind === 'judge') {
        const submission = { id: randomUUID(), problemId, status: result.status, passed: result.passed, total: result.total, timeMs: result.timeMs, createdAt: new Date().toISOString() };
        const failed = result.results.findIndex(item => item.status !== 'AC');
        submission.results = result.results.map((item, index) => {
          const summary = { index: item.index, status: item.status, timeMs: item.timeMs };
          if (index === failed) for (const key of ['input', 'expected', 'actual', 'stderr']) summary[key] = (item[key] || '').slice(0, 1024);
          return summary;
        });
        if (result.compileOutput) submission.compileOutput = result.compileOutput.slice(0, 2048);
        submission.detailTruncated = true;
        await this.store.change(state => {
          state.submissions.unshift(submission);
          state.submissions = state.submissions.slice(0, 1000);
          const day = new Date().toLocaleDateString('sv-SE');
          state.activity[day] = (state.activity[day] || 0) + 1;
        });
        result.submission = submission;
      }
      return result;
    } finally { await rm(folder, { recursive: true, force: true, maxRetries: 3, retryDelay: 100 }); }
  }
}
