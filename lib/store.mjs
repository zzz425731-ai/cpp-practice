import { mkdir, readFile, rename, writeFile, copyFile } from 'node:fs/promises';
import { join } from 'node:path';

export const emptyState = () => ({ version: 1, drafts: {}, notes: {}, favorites: [], submissions: [], activity: {} });

export function validateState(value, ids) {
  if (!value || value.version !== 1 || typeof value !== 'object' || Array.isArray(value)) throw new Error('备份版本或格式不正确');
  const state = emptyState();
  const object = x => x && typeof x === 'object' && !Array.isArray(x);
  if (!object(value.drafts) || !object(value.notes) || !Array.isArray(value.favorites) || !Array.isArray(value.submissions)) throw new Error('备份缺少必要字段');
  for (const [id, draft] of Object.entries(value.drafts)) {
    if (!ids.has(id) || !object(draft) || typeof draft.code !== 'string' || Buffer.byteLength(draft.code) > 131072) throw new Error('备份中的代码草稿无效');
    state.drafts[id] = { code: draft.code, updatedAt: typeof draft.updatedAt === 'string' ? draft.updatedAt : new Date().toISOString() };
  }
  for (const [id, note] of Object.entries(value.notes)) {
    if (!ids.has(id) || typeof note !== 'string' || note.length > 20000) throw new Error('备份中的笔记无效');
    state.notes[id] = note;
  }
  if (value.favorites.some(id => !ids.has(id))) throw new Error('备份包含未知题号');
  state.favorites = [...new Set(value.favorites)];
  const verdicts = new Set(['AC', 'WA', 'TLE', 'CE', 'RE', 'OLE', 'ERROR']);
  if (value.submissions.length > 1000) throw new Error('备份最多包含 1000 条提交记录');
  for (const sub of value.submissions) {
    if (!object(sub) || !ids.has(sub.problemId) || !verdicts.has(sub.status) || typeof sub.id !== 'string' || sub.id.length > 100 || typeof sub.createdAt !== 'string' || !Number.isFinite(Date.parse(sub.createdAt)) || !Number.isInteger(sub.passed) || !Number.isInteger(sub.total) || sub.passed < 0 || sub.total < sub.passed || sub.total > 100 || !Number.isFinite(sub.timeMs) || sub.timeMs < 0) throw new Error('备份中的提交记录无效');
    const clean = { id: sub.id, problemId: sub.problemId, status: sub.status, passed: sub.passed, total: sub.total, timeMs: sub.timeMs, createdAt: sub.createdAt };
    if (sub.results !== undefined) {
      if (!Array.isArray(sub.results) || sub.results.length > 20) throw new Error('备份中的用例摘要无效');
      clean.results = sub.results.map(item => {
        if (!object(item) || !verdicts.has(item.status) || !Number.isInteger(item.index) || item.index < 1 || item.index > 100 || !Number.isFinite(item.timeMs) || item.timeMs < 0) throw new Error('备份中的用例摘要无效');
        const result = { index: item.index, status: item.status, timeMs: item.timeMs };
        for (const key of ['input', 'expected', 'actual', 'stderr']) if (item[key] !== undefined) {
          if (typeof item[key] !== 'string') throw new Error('备份中的用例文本无效');
          result[key] = item[key].slice(0, 1024);
        }
        return result;
      });
      clean.detailTruncated = true;
    }
    if (typeof sub.compileOutput === 'string') clean.compileOutput = sub.compileOutput.slice(0, 2048);
    state.submissions.push(clean);
  }
  // Retain older activity after the bounded submission history rolls over.
  if (value.activity !== undefined) {
    if (!object(value.activity)) throw new Error('备份中的活跃记录无效');
    for (const [day, count] of Object.entries(value.activity)) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(day) || !Number.isFinite(Date.parse(day)) || !Number.isSafeInteger(count) || count < 0 || count > 1000000000) throw new Error('备份中的活跃记录无效');
      state.activity[day] = count;
    }
  }
  const recentActivity = {};
  for (const sub of state.submissions) {
    const day = new Date(sub.createdAt).toLocaleDateString('sv-SE');
    recentActivity[day] = (recentActivity[day] || 0) + 1;
  }
  for (const [day, count] of Object.entries(recentActivity)) state.activity[day] = Math.max(state.activity[day] || 0, count);
  return state;
}

export class Store {
  constructor(folder, ids) { this.folder = folder; this.ids = ids; this.state = emptyState(); this.queue = Promise.resolve(); }
  async load() {
    await mkdir(this.folder, { recursive: true });
    try { this.state = validateState(JSON.parse(await readFile(join(this.folder, 'progress.json'), 'utf8')), this.ids); }
    catch (error) {
      if (error.code !== 'ENOENT') throw new Error('学习记录无法读取。请先保留 data/progress.json，再从备份恢复。原因：' + error.message);
    }
  }
  async change(fn) {
    const op = this.queue.then(async () => {
      const next = structuredClone(this.state);
      fn(next);
      const temp = join(this.folder, 'progress.tmp');
      await writeFile(temp, JSON.stringify(next, null, 2), 'utf8');
      await rename(temp, join(this.folder, 'progress.json'));
      this.state = next;
      return structuredClone(next);
    });
    this.queue = op.catch(() => {});
    return op;
  }
  async restore(value) {
    const clean = validateState(value, this.ids);
    return this.change(next => { Object.assign(next, clean); });
  }
  async backup() {
    try { await copyFile(join(this.folder, 'progress.json'), join(this.folder, 'before-import-' + Date.now() + '.json')); }
    catch (error) { if (error.code !== 'ENOENT') throw error; }
  }
}
