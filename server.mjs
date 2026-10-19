import http from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, join, extname } from 'node:path';
import { randomBytes, timingSafeEqual } from 'node:crypto';
import { spawn } from 'node:child_process';
import { problems } from './lib/problems.mjs';
import { Store } from './lib/store.mjs';
import { findCompiler, buildRunner } from './lib/compiler.mjs';
import { Judge, limits } from './lib/judge.mjs';

const projectRoot = fileURLToPath(new URL('.', import.meta.url));
export const starter = '#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    // 在这里开始解题\n\n    return 0;\n}\n';
const message = (status, text) => Object.assign(new Error(text), { status });
const publicProblems = problems.map(({ tests, solution, ...rest }) => rest);

async function body(req, max = 16777216) {
  let length = 0; const parts = [];
  for await (const part of req) {
    length += part.length;
    if (length > max) throw message(413, '请求内容过大');
    parts.push(part);
  }
  try { return JSON.parse(Buffer.concat(parts).toString('utf8')); }
  catch { throw message(400, '需要有效的 JSON 数据'); }
}

export async function createApplication({ root = projectRoot, dataDir = join(root, 'data'), port = 3210 } = {}) {
  const ids = new Set(problems.map(p => p.id));
  await mkdir(join(root, '.cache'), { recursive: true });
  const store = new Store(dataDir, ids); await store.load();
  const compiler = await findCompiler();
  let runner = '';
  if (compiler.available) runner = await buildRunner(root, compiler);
  const judge = new Judge({ root, compiler, runner, store, problems });
  const token = randomBytes(32).toString('hex');
  let origin;
  const server = http.createServer(async (req, res) => {
    const send = (status, value) => {
      res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' }); res.end(JSON.stringify(value));
    };
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'");
    try {
      if (req.headers.host !== new URL(origin).host) throw message(403, '只接受本机地址访问');
      if (req.headers.origin && req.headers.origin !== origin) throw message(403, '不允许跨站请求');
      if (req.headers['sec-fetch-site'] === 'cross-site') throw message(403, '不允许跨站请求');
      const url = new URL(req.url, origin), path = url.pathname;
      if (!['GET', 'HEAD'].includes(req.method)) {
        const supplied = String(req.headers['x-csrf-token'] || '');
        if (supplied.length !== token.length || !timingSafeEqual(Buffer.from(supplied), Buffer.from(token))) throw message(403, '页面验证已过期，请刷新后重试');
        if (!(req.headers['content-type'] || '').startsWith('application/json')) throw message(415, '需要 application/json');
      }
      if (req.method === 'GET' && path === '/api/bootstrap') {
        return send(200, { problems: publicProblems, state: store.state, compiler, starter, csrfToken: token, limits });
      }
      if (req.method === 'GET' && path === '/api/solution') {
        const problem = problems.find(p => p.id === url.searchParams.get('id'));
        if (!problem) throw message(404, '题目不存在');
        return send(200, { solution: problem.solution, explanation: problem.explanation });
      }
      if (req.method === 'GET' && path === '/api/export') {
        res.setHeader('Content-Disposition', 'attachment; filename="cpp-practice-progress.json"');
        return send(200, store.state);
      }
      if (req.method === 'PUT' && path === '/api/state') {
        const value = await body(req, 262144);
        if (!value || !ids.has(value.problemId)) throw message(400, '题号无效');
        if (value.code !== undefined && (typeof value.code !== 'string' || Buffer.byteLength(value.code) > 131072)) throw message(400, '代码最多 128 KiB');
        if (value.note !== undefined && (typeof value.note !== 'string' || value.note.length > 20000)) throw message(400, '笔记最多 20000 字符');
        if (value.favorite !== undefined && typeof value.favorite !== 'boolean') throw message(400, '收藏状态无效');
        const state = await store.change(state => {
          if (value.code !== undefined) state.drafts[value.problemId] = { code: value.code, updatedAt: new Date().toISOString() };
          if (value.note !== undefined) state.notes[value.problemId] = value.note;
          if (value.favorite !== undefined) state.favorites = value.favorite ? [...new Set([...state.favorites, value.problemId])] : state.favorites.filter(id => id !== value.problemId);
        });
        return send(200, { state });
      }
      if (req.method === 'POST' && path === '/api/import') {
        if (judge.pending) throw message(409, '判题期间无法导入，请稍后再试');
        const value = await body(req);
        if (judge.pending) throw message(409, '判题期间无法导入，请稍后再试');
        await store.backup();
        try { return send(200, { state: await store.restore(value) }); }
        catch (error) { throw message(400, error.message); }
      }
      if (req.method === 'POST' && ['/api/judge', '/api/run'].includes(path)) {
        const value = await body(req, 262144);
        if (!value || typeof value.code !== 'string' || !value.code.trim() || Buffer.byteLength(value.code) > 131072) throw message(400, '请输入代码，最多 128 KiB');
        if (path === '/api/judge' && !ids.has(value.problemId)) throw message(400, '题目不存在');
        if (path === '/api/run' && (typeof value.input !== 'string' || Buffer.byteLength(value.input) > 65536)) throw message(400, '自定义输入最多 64 KiB');
        return send(202, { jobId: judge.enqueue(path === '/api/judge' ? 'judge' : 'run', value) });
      }
      if (req.method === 'GET' && path.startsWith('/api/jobs/')) {
        const job = judge.jobs.get(path.slice('/api/jobs/'.length));
        if (!job) throw message(404, '提交任务不存在或已过期');
        return send(200, job);
      }
      if (path.startsWith('/api/')) throw message(404, '接口不存在');
      if (!['GET', 'HEAD'].includes(req.method)) throw message(405, '不支持此请求');
      // Explicit allow-list: private source, data, and native binaries are never served.
      const files = { '/': 'index.html', '/index.html': 'index.html', '/app.js': 'app.js', '/style.css': 'styles.css', '/styles.css': 'styles.css' };
      if (!files[path]) throw message(404, '文件不存在');
      const content = await readFile(join(projectRoot, 'public', files[path]));
      const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml' };
      res.writeHead(200, { 'Content-Type': types[extname(files[path])] + '; charset=utf-8' });
      res.end(req.method === 'HEAD' ? undefined : content);
    } catch (error) {
      if (!res.headersSent) send(error.status || 500, { error: error.status ? error.message : '操作失败：' + error.message });
      else res.end();
    }
  });
  server.requestTimeout = 30000; server.headersTimeout = 10000;
  server.maxHeadersCount = 50;
  await new Promise((resolve, reject) => { server.once('error', reject); server.listen(port, '127.0.0.1', resolve); });
  origin = 'http://127.0.0.1:' + server.address().port;
  return { server, origin, compiler, store, judge, close: async () => { await judge.tail; await store.queue; server.closeAllConnections(); await new Promise(r => server.close(r)); } };
}

async function main() {
  let application;
  const requestedPort = Number(process.env.PORT || 3210);
  for (let offset = 0; offset < 10; offset++) {
    try { application = await createApplication({ port: requestedPort === 0 ? 0 : requestedPort + offset }); break; }
    catch (error) { if (error.code !== 'EADDRINUSE') throw error; }
  }
  if (!application) throw new Error('3210 附近端口均被占用，请通过 PORT 指定其他端口');
  console.log('\n拾题 · C++ 刷题器\n' + application.origin + '\n' + (application.compiler.available ? application.compiler.version : application.compiler.message) + '\n关闭此窗口或按 Ctrl+C 停止服务。\n');
  if (process.argv.includes('--open')) {
    const args = process.platform === 'win32' ? ['rundll32.exe', ['url.dll,FileProtocolHandler', application.origin]] : process.platform === 'darwin' ? ['open', [application.origin]] : ['xdg-open', [application.origin]];
    const opener = spawn(args[0], args[1], { windowsHide: true, detached: true, stdio: 'ignore' }); opener.on('error', () => {}); opener.unref();
  }
  let closing = false;
  const stop = async () => { if (closing) return; closing = true; await application.close(); process.exit(0); };
  process.on('SIGINT', stop); process.on('SIGTERM', stop);
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main().catch(error => { console.error(error.message); process.exitCode = 1; });
