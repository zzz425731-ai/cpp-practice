import { access, mkdir, readdir, stat } from 'node:fs/promises';
import { join, dirname, resolve, delimiter } from 'node:path';
import { execute } from './process.mjs';

export async function findCompiler() {
  const candidates = [process.env.CXX, 'g++', 'clang++'];
  if (process.platform === 'win32') {
    const local = process.env.LOCALAPPDATA || '';
    candidates.push(join(local, 'Programs', 'MinGW', 'mingw64', 'bin', 'g++.exe'), 'C:\\msys64\\ucrt64\\bin\\g++.exe', 'C:\\msys64\\mingw64\\bin\\g++.exe');
    const roots = [join(local, 'Programs'), 'C:\\Program Files\\JetBrains'];
    for (const root of roots) {
      try {
        for (const entry of await readdir(root)) if (/^CLion/i.test(entry)) candidates.push(join(root, entry, 'bin', 'mingw', 'bin', 'g++.exe'));
      } catch { /* optional compiler locations */ }
    }
  }
  for (const path of candidates.filter(Boolean)) {
    const result = await execute(path, ['--version'], { timeout: 5000 });
    if (result.code === 0) {
      let actualPath = path;
      if (!path.includes('/') && !path.includes('\\')) {
        for (const entry of (process.env.PATH || process.env.Path || '').split(delimiter)) {
          const candidate = join(entry, path + (process.platform === 'win32' ? '.exe' : ''));
          try { await access(candidate); actualPath = candidate; break; } catch { /* next directory */ }
        }
      }
      return { available: true, path: actualPath, version: result.stdout.split(/\r?\n/)[0] };
    }
  }
  return { available: false, path: '', version: '', message: '未找到 C++ 编译器。安装 MinGW-w64，或将 CXX 设为 g++ / clang++ 的完整路径，然后重启。' };
}

export function compilerEnvironment(compiler) {
  const env = { ...process.env };
  const key = Object.keys(env).find(k => k.toLowerCase() === 'path') || 'PATH';
  env[key] = dirname(compiler.path) + delimiter + (env[key] || '');
  return env;
}

export async function buildRunner(root, compiler) {
  const folder = resolve(root, '.cache');
  await mkdir(folder, { recursive: true });
  const target = join(folder, process.platform === 'win32' ? 'runner.exe' : 'runner');
  const source = join(root, 'native', 'runner.cpp');
  try { if ((await stat(target)).mtimeMs >= (await stat(source)).mtimeMs) return target; } catch { /* build below */ }
  // Relative ASCII arguments also work when the project directory is Chinese.
  const result = await execute(compiler.path, ['-std=c++17', '-O2', 'native/runner.cpp', '-o', '.cache/' + (process.platform === 'win32' ? 'runner.exe' : 'runner')], { cwd: root, timeout: 60000, env: compilerEnvironment(compiler) });
  if (result.code !== 0) throw new Error('判题执行器编译失败：' + (result.stderr || result.error || '编译超时'));
  return target;
}
