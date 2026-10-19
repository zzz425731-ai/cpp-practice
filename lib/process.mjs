import { spawn } from 'node:child_process';

export function execute(file, args, { cwd, env = process.env, timeout = 30000, limit = 262144 } = {}) {
  return new Promise((resolve) => {
    let stdout = '', stderr = '', size = 0, timedOut = false, overflow = false, finished = false;
    let child;
    const done = (code, error) => {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      resolve({ code, stdout, stderr, timedOut, overflow, error: error?.message });
    };
    try { child = spawn(file, args, { cwd, env, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] }); }
    catch (error) { resolve({ code: -1, stdout, stderr, error: error.message }); return; }
    const stop = () => {
      if (process.platform === 'win32' && child.pid) {
        const killer = spawn('taskkill', ['/PID', String(child.pid), '/T', '/F'], { windowsHide: true, stdio: 'ignore' });
        killer.on('error', () => child.kill());
      } else child.kill('SIGKILL');
    };
    const timer = setTimeout(() => { timedOut = true; stop(); }, timeout);
    for (const [stream, name] of [[child.stdout, 'stdout'], [child.stderr, 'stderr']]) {
      stream.on('data', (chunk) => {
        const left = Math.max(0, limit - size);
        const part = chunk.subarray(0, left).toString('utf8');
        if (name === 'stdout') stdout += part; else stderr += part;
        size += chunk.length;
        if (size > limit && !overflow) { overflow = true; stop(); }
      });
    }
    child.once('error', (error) => done(-1, error));
    child.once('close', (code) => done(code ?? -1));
  });
}
