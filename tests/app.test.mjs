import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm, readFile, mkdir, copyFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { createApplication } from '../server.mjs';
import { problems } from '../lib/problems.mjs';
import { normalize } from '../lib/judge.mjs';
import { validateState } from '../lib/store.mjs';
import { buildRunner } from '../lib/compiler.mjs';
import { Judge } from '../lib/judge.mjs';
import { fileURLToPath } from 'node:url';

let app, folder, bootstrap, token;
const headers = () => ({ 'Content-Type': 'application/json', 'X-CSRF-Token': token });
async function request(path, method = 'GET', value) {
  const response = await fetch(app.origin + path, { method, headers: method === 'GET' ? {} : headers(), body: value === undefined ? undefined : JSON.stringify(value) });
  return { status: response.status, value: await response.json() };
}
async function job(kind, payload) {
  const started = await request('/api/' + kind, 'POST', payload);
  assert.equal(started.status, 202, JSON.stringify(started.value));
  for (let i = 0; i < 200; i++) {
    const { value } = await request('/api/jobs/' + started.value.jobId);
    if (value.status === 'done') return value.result;
    await new Promise(r => setTimeout(r, 100));
  }
  throw new Error('job did not finish');
}
before(async () => {
  folder = await mkdtemp(join(tmpdir(), 'cpp-practice-tests-'));
  app = await createApplication({ dataDir: folder, port: 0 });
  bootstrap = (await request('/api/bootstrap')).value;
  token = bootstrap.csrfToken;
});
after(async () => { await app?.close(); await rm(folder, { recursive: true, force: true }); });

test('题库信息完整、题号唯一，bootstrap 不包含测试答案和参考代码', () => {
  assert.ok(problems.length >= 40);
  assert.equal(new Set(problems.map(p => p.id)).size, problems.length);
  assert.equal(bootstrap.problems.length, problems.length);
  for (const p of bootstrap.problems) {
    assert.ok(p.statement && p.inputFormat && p.outputFormat && p.constraints && p.samples.length);
    assert.equal(p.tests, undefined); assert.equal(p.solution, undefined);
  }
  assert.ok(bootstrap.compiler.available, 'integration tests need a real compiler');
});
test('拒绝无令牌、跨站与无效题号的写请求', async () => {
  const noToken = await fetch(app.origin + '/api/state', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: '{}' });
  assert.equal(noToken.status, 403);
  const cross = await fetch(app.origin + '/api/state', { method: 'PUT', headers: { ...headers(), Origin: 'https://example.com' }, body: '{}' });
  assert.equal(cross.status, 403);
  assert.equal((await request('/api/judge', 'POST', { code: 'int main(){}', problemId: '../../' })).status, 400);
  const privateFile = await fetch(app.origin + '/lib/problems.mjs'); assert.equal(privateFile.status, 404);
});
test('草稿、收藏和中文笔记保存到磁盘，重读不丢失', async () => {
  const id = problems[0].id, code = '// 中文草稿\nint main(){}';
  const changed = await request('/api/state', 'PUT', { problemId: id, code, note: '边界要考虑 0。', favorite: true });
  assert.equal(changed.status, 200);
  const saved = JSON.parse(await readFile(join(folder, 'progress.json'), 'utf8'));
  assert.equal(saved.drafts[id].code, code); assert.equal(saved.notes[id], '边界要考虑 0。'); assert.ok(saved.favorites.includes(id));
});
test('正确参考程序真实编译并通过全部测试，记录进度', async () => {
  const p = problems[0];
  const result = await job('judge', { code: p.solution, problemId: p.id });
  assert.equal(result.status, 'AC', JSON.stringify(result));
  assert.equal(result.passed, p.tests.length);
  assert.equal(result.results.length, p.tests.length);
  const state = (await request('/api/export')).value;
  assert.equal(state.submissions[0].status, 'AC'); assert.equal(state.submissions[0].problemId, p.id);
  assert.equal(state.submissions[0].results.length, p.tests.length);
});
test('错误答案返回 WA 和可检查的实际/期望输出', async () => {
  const result = await job('judge', { problemId: problems[0].id, code: '#include <iostream>\nint main(){std::cout<<"WRONG";}' });
  assert.equal(result.status, 'WA'); assert.ok(result.results.some(r => r.actual === 'WRONG' && r.expected !== r.actual));
});
test('编译错误返回 CE 和诊断，不运行旧程序', async () => {
  const result = await job('judge', { problemId: problems[0].id, code: 'int main(){ syntax error }' });
  assert.equal(result.status, 'CE'); assert.ok(result.compileOutput); assert.equal(result.results.length, 0);
});
test('自定义输入支持 UTF-8，输出经过真实程序执行', async () => {
  const result = await job('run', { code: '#include <iostream>\n#include <string>\nint main(){std::string s;std::getline(std::cin,s);std::cout<<s;}', input: '你好 C++ 17\n' });
  assert.equal(result.status, 'OK'); assert.equal(result.stdout, '你好 C++ 17');
});
test('无限循环会返回 TLE', async () => {
  const result = await job('run', { code: 'int main(){for(;;){}}', input: '' });
  assert.equal(result.status, 'TLE'); assert.ok(result.timeMs >= 1800 && result.timeMs < 8000);
});
test('无限输出会返回 OLE 并限制返回内容', async () => {
  const result = await job('run', { code: '#include <cstdio>\nint main(){for(;;)puts("01234567890123456789012345678901234567890123456789");}', input: '' });
  assert.equal(result.status, 'OLE'); assert.ok(Buffer.byteLength(result.stdout) <= 4194304);
});
test('非零退出返回 RE', async () => {
  const result = await job('run', { code: 'int main(){return 7;}', input: '' }); assert.equal(result.status, 'RE');
});
test('非法内存访问返回 RE，执行器继续工作', async () => {
  const result = await job('run', { code: 'int main(){volatile int* p=nullptr;*p=1;}', input: '' }); assert.equal(result.status, 'RE');
});
test('空白归一化保留 token 差异', () => {
  assert.equal(normalize('  1\r\n2  \t3\n'), '1 2 3'); assert.notEqual(normalize('12'), normalize('1 2'));
});
test('提交历史滚动后，较早的活跃日期仍被保留', () => {
  const oldDay = '2020-01-01';
  const state = validateState({ version: 1, drafts: {}, notes: {}, favorites: [], submissions: [], activity: { [oldDay]: 12 } }, new Set(problems.map(p => p.id)));
  assert.equal(state.activity[oldDay], 12);
});
test('备份导出导入成功，非法导入不覆盖原记录', async () => {
  const exported = (await request('/api/export')).value;
  assert.equal((await request('/api/import', 'POST', { ...exported, favorites: ['not-a-problem'] })).status, 400);
  assert.deepEqual((await request('/api/export')).value, exported);
  const imported = await request('/api/import', 'POST', exported);
  assert.equal(imported.status, 200); assert.equal(imported.value.state.submissions.length, exported.submissions.length);
  assert.deepEqual(imported.value.state.drafts, exported.drafts);
  assert.deepEqual(imported.value.state.submissions, exported.submissions);
});
test('移动到含中文和空格的目录后，执行器和提交仍能编译运行', async () => {
  const root = join(folder, '中文目录 with spaces');
  await mkdir(join(root, 'native'), { recursive: true }); await mkdir(join(root, '.cache'));
  await copyFile(fileURLToPath(new URL('../native/runner.cpp', import.meta.url)), join(root, 'native', 'runner.cpp'));
  const runner = await buildRunner(root, app.compiler);
  const judge = new Judge({ root, compiler: app.compiler, runner, store: { change: async () => {} }, problems });
  const result = await judge.perform('judge', { code: problems[0].solution, problemId: problems[0].id });
  assert.equal(result.status, 'AC', JSON.stringify(result));
});
