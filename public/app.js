'use strict';

(() => {
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const editor = $('#code-editor');
  const notesEditor = $('#notes-editor');
  const EMPTY_STATE = () => ({version: 1, drafts: {}, favorites: [], notes: {}, submissions: [], activity: {}});
  const LOCAL_DRAFTS = 'shiti:cpp:drafts:v1';
  const LOCAL_NOTES = 'shiti:cpp:unsaved-notes:v1';
  const LAST_PROBLEM = 'shiti:cpp:last-problem:v1';
  const FONT_SIZE = 'shiti:cpp:font-size:v1';
  const verdicts = {AC: '全部通过', WA: '答案错误', TLE: '运行超时', CE: '编译错误', RE: '运行错误', OLE: '输出超限', ERROR: '评测异常', OK: '运行成功'};
  let problems = [];
  let state = EMPTY_STATE();
  let csrfToken = '';
  let compiler = {available: false};
  let starter = '#include <iostream>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    // 在这里编写你的解答\n\n    return 0;\n}\n';
  let selectedId = null;
  let filter = 'all';
  let activeTab = 'description';
  let draftTimer = null;
  let noteTimer = null;
  let toastTimer = null;
  let saveQueue = Promise.resolve();
  let busy = false;
  let sampleCursor = 0;
  let fontSize = 14;
  let releaseEditorTab = false;
  const solutions = new Map();
  const pendingCodes = new Map();
  const pendingNotes = new Map();
  const safeStorage = {
    get(key) { try { return localStorage.getItem(key); } catch { return null; } },
    set(key, value) { try { localStorage.setItem(key, value); } catch { /* Storage can be disabled by the browser. */ } },
    remove(key) { try { localStorage.removeItem(key); } catch { /* No persistent browser storage. */ } }
  };

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, character => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[character]));
  }

  function inlineMarkup(value) {
    return escapeHtml(value).replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  }

  function prose(value) {
    if (Array.isArray(value)) value = value.join('\n\n');
    const source = String(value ?? '').trim();
    if (!source) return '';
    return source.split(/(```[\s\S]*?```)/g).map(part => {
      if (part.startsWith('```')) return `<pre>${escapeHtml(part.replace(/^```[^\n]*\n?/, '').replace(/```$/, '').trimEnd())}</pre>`;
      return part.split(/\n\s*\n/).map(block => {
        const lines = block.trim().split('\n');
        if (!block.trim()) return '';
        if (lines.every(line => /^\s*[-*]\s+/.test(line))) return `<ul>${lines.map(line => `<li>${inlineMarkup(line.replace(/^\s*[-*]\s+/, ''))}</li>`).join('')}</ul>`;
        if (lines.every(line => /^\s*\d+[.、]\s*/.test(line))) return `<ol>${lines.map(line => `<li>${inlineMarkup(line.replace(/^\s*\d+[.、]\s*/, ''))}</li>`).join('')}</ol>`;
        return `<p>${lines.map(inlineMarkup).join('<br>')}</p>`;
      }).join('');
    }).join('');
  }

  function difficulty(value) {
    const normalized = String(value ?? '').toLowerCase();
    if (['easy', '简单', '入门'].includes(normalized)) return {label: '入门', className: 'easy'};
    if (['hard', '困难', '高级', '进阶'].includes(normalized)) return {label: '进阶', className: 'hard'};
    return {label: '基础', className: 'medium'};
  }

  function normalizeState(value) {
    return {...EMPTY_STATE(), ...value, drafts: value?.drafts || {}, favorites: Array.isArray(value?.favorites) ? value.favorites : [], notes: value?.notes || {}, submissions: Array.isArray(value?.submissions) ? value.submissions : []};
  }

  async function api(path, options = {}) {
    const headers = {...(options.body !== undefined ? {'Content-Type': 'application/json'} : {}), ...(options.method && options.method !== 'GET' ? {'X-CSRF-Token': csrfToken} : {}), ...(options.headers || {})};
    const response = await fetch(path, {...options, headers, body: options.body !== undefined ? JSON.stringify(options.body) : undefined});
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const message = typeof data.error === 'string' ? data.error : data.error?.message || data.message || `请求未成功（${response.status}）`;
      throw new Error(message);
    }
    return data;
  }

  function notify(message, error = false) {
    clearTimeout(toastTimer);
    const toast = $('#toast');
    toast.textContent = message;
    toast.classList.toggle('error', error);
    toast.hidden = false;
    toastTimer = setTimeout(() => { toast.hidden = true; }, error ? 6500 : 3500);
  }

  function currentProblem() { return problems.find(problem => problem.id === selectedId); }
  function solvedIds() { return new Set(state.submissions.filter(item => item.status === 'AC').map(item => item.problemId)); }
  function problemSubmissions(id = selectedId) { return state.submissions.filter(item => item.problemId === id).slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); }
  function localDrafts() { try { return JSON.parse(safeStorage.get(LOCAL_DRAFTS) || '{}'); } catch { return {}; } }
  function preserveNotes() { safeStorage.set(LOCAL_NOTES, JSON.stringify(Object.fromEntries(pendingNotes))); }

  function rememberDraft(id, code, updatedAt = new Date().toISOString()) {
    const draft = {code, updatedAt};
    state.drafts[id] = draft;
    pendingCodes.set(id, code);
    const backup = localDrafts();
    backup[id] = draft;
    safeStorage.set(LOCAL_DRAFTS, JSON.stringify(backup));
  }

  function renderCompiler() {
    const pill = $('#compiler-status');
    pill.classList.toggle('unavailable', !compiler.available);
    pill.innerHTML = `<i></i>${compiler.available ? 'C++17 · 编译器就绪' : '未检测到 C++ 编译器'}`;
    pill.title = (compiler.available ? `${compiler.version || ''}\n${compiler.path || ''}`.trim() : '安装编译器并配置 PATH 后，重新启动练习室。') + '\n代码以当前用户权限在本机执行；请勿运行不可信代码。';
    $('#compiler-banner').hidden = !!compiler.available;
    $('#compiler-banner-text').textContent = '尚未检测到 C++ 编译器。安装 GCC 或 Clang 并加入 PATH 后，重新启动练习室。题库、草稿和笔记仍可使用。';
  }

  function filteredProblems() {
    const query = $('#search-input').value.trim().toLowerCase();
    const level = $('#difficulty-filter').value;
    const topic = $('#topic-filter').value;
    const solved = solvedIds();
    return problems.filter(problem => {
      const haystack = [problem.id, problem.title, problem.topic, ...(problem.tags || [])].join(' ').toLowerCase();
      return (!query || haystack.includes(query)) && (level === 'all' || difficulty(problem.difficulty).label === level) && (topic === 'all' || problem.topic === topic) && (filter !== 'solved' || solved.has(problem.id)) && (filter !== 'unsolved' || !solved.has(problem.id)) && (filter !== 'favorite' || state.favorites.includes(problem.id));
    });
  }

  function renderStats() {
    const solved = solvedIds();
    const total = problems.length;
    const count = problems.filter(problem => solved.has(problem.id)).length;
    $('#progress-count').textContent = `${count} / ${total}`;
    $('#progress-bar').style.width = `${total ? count / total * 100 : 0}%`;
    $('#progress-caption').textContent = count === total && total ? '这一轮练习完成了，回顾笔记再出发。' : count ? `已走过 ${Math.round(count / total * 100)}%，继续保持自己的节奏。` : '从一道小题，积累一点进步。';
    $('#solved-stat').textContent = count;
    $('#attempt-stat').textContent = state.submissions.length;
    $('#problem-count').textContent = total;
    $('#solved-mark').hidden = !solved.has(selectedId);
    $('#history-count').textContent = problemSubmissions().length;
  }

  function renderList() {
    const solved = solvedIds();
    const attempted = new Set(state.submissions.map(item => item.problemId));
    const items = filteredProblems();
    $('#problem-list').innerHTML = items.length ? items.map(problem => {
      const level = difficulty(problem.difficulty);
      const status = solved.has(problem.id) ? 'solved' : attempted.has(problem.id) ? 'attempted' : '';
      const statusLabel = status === 'solved' ? '已通过' : status === 'attempted' ? '已尝试' : '未尝试';
      return `<button class="problem-item${problem.id === selectedId ? ' selected' : ''}" data-problem-id="${escapeHtml(problem.id)}"${problem.id === selectedId ? ' aria-current="true"' : ''} aria-label="${escapeHtml(`${problem.id} ${problem.title}，${level.label}，${statusLabel}`)}"><span class="item-status ${status}">${status === 'solved' ? '✓' : status === 'attempted' ? '·' : ''}</span><span class="item-copy"><span class="item-title">${escapeHtml(problem.title)}</span><span class="item-subtitle"><span class="item-difficulty ${level.className}">${level.label}</span><span>·</span><span>${escapeHtml(problem.topic || problem.id)}</span></span></span>${state.favorites.includes(problem.id) ? '<span class="item-favorite" aria-label="已收藏">☆</span>' : ''}</button>`;
    }).join('') : '<div class="no-problems">没有找到符合条件的题目。<br>试试更换关键词或筛选条件。</div>';
    $('#visible-count').textContent = `共 ${items.length} 道题${items.length !== problems.length ? ' · 已筛选' : ''}`;
    renderStats();
  }

  const copySvg = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="12" height="13" rx="2"/><path d="M15 8V4H4v13h4"/></svg>';

  function renderDescription(problem) {
    const samples = (problem.samples || []).map((sample, index) => `<div class="sample-section"><div class="sample-title"><h3>样例 ${index + 1}</h3><span>Sample ${String(index + 1).padStart(2, '0')}</span></div><div class="sample-block"><div class="sample-label">输入<button class="copy-button" data-copy-sample="${index}" data-sample-field="input" aria-label="复制样例 ${index + 1} 输入">${copySvg}复制</button></div><pre>${escapeHtml(sample.input)}</pre></div><div class="sample-block"><div class="sample-label">输出<button class="copy-button" data-copy-sample="${index}" data-sample-field="output" aria-label="复制样例 ${index + 1} 输出">${copySvg}复制</button></div><pre>${escapeHtml(sample.output)}</pre></div>${sample.explanation ? `<div class="prose">${prose(sample.explanation)}</div>` : ''}</div>`).join('');
    $('#content-description').innerHTML = `<h3>题目描述</h3><div class="prose">${prose(problem.statement)}</div>${problem.inputFormat ? `<h3>输入格式</h3><div class="prose">${prose(problem.inputFormat)}</div>` : ''}${problem.outputFormat ? `<h3>输出格式</h3><div class="prose">${prose(problem.outputFormat)}</div>` : ''}${samples}${problem.constraints ? `<h3>数据范围</h3><div class="constraints-box prose">${prose(problem.constraints)}</div>` : ''}`;
  }

  function renderSolution() {
    const problem = currentProblem();
    if (!problem) return;
    const hints = Array.isArray(problem.hints) ? problem.hints : problem.hints ? [problem.hints] : [];
    const hintsHtml = hints.length ? `<h3>先给自己一点提示</h3><p class="muted">卡住时，按顺序展开提示。你也许只差最后一步。</p>${hints.map((hint, index) => `<details class="hint-card"><summary>提示 ${index + 1}</summary><div class="prose">${prose(hint)}</div></details>`).join('')}` : '<h3>换个角度想一想</h3><p class="muted">先写下输入与输出，手算样例，再把解法分成可以实现的小步骤。</p>';
    const solution = solutions.get(selectedId);
    $('#content-solution').innerHTML = hintsHtml + (solution ? `<h3>解题思路</h3><div class="prose">${prose(solution.explanation || problem.explanation)}</div><div class="solution-code-heading"><h3>参考代码 · C++17</h3><button class="copy-button" data-action="copy-solution">${copySvg}复制代码</button></div><pre class="solution-code">${escapeHtml(solution.solution)}</pre><div class="solution-actions"><button class="button secondary" data-action="apply-solution">放入编辑器</button></div>` : '<div class="solution-gate"><p>已经独立尝试过了？可以对照参考解法复盘。</p><button class="button secondary" data-action="reveal-solution">查看参考解法</button><span>查看解法不会将这道题标记为已通过</span></div>');
  }

  function verdictMarkup(status) {
    return `<span class="verdict ${status === 'AC' || status === 'OK' ? 'success' : 'error'}"><span>${status === 'AC' || status === 'OK' ? '✓' : '○'}</span>${escapeHtml(verdicts[status] || status || '未知状态')}</span>`;
  }

  function formattedDate(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '时间未知';
    return date.toLocaleString('zh-CN', {month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false});
  }

  function renderHistory() {
    const submissions = problemSubmissions();
    $('#content-history').innerHTML = submissions.length ? `<h3>每一次尝试，都是记录</h3>${submissions.map((submission, index) => `<div class="submission-item"><button data-submission-index="${index}" title="在运行面板中查看这次提交详情">${verdictMarkup(submission.status)}<time datetime="${escapeHtml(submission.createdAt)}">${formattedDate(submission.createdAt)}</time></button><div class="submission-detail">${Number(submission.passed) || 0} / ${Number(submission.total) || 0} 测试用例 · ${Number(submission.timeMs) || 0} ms · 查看详情 ↗</div></div>`).join('')}` : '<div class="history-empty"><span class="terminal-symbol">{ }</span><p>还没有提交记录</p><span>写下第一份解答，让进步有迹可循。</span></div>';
    $('#history-count').textContent = submissions.length;
  }

  function activateTab(tab) {
    activeTab = tab;
    $$('[data-tab]').forEach(button => {
      const active = button.dataset.tab === tab;
      button.classList.toggle('active', active);
      button.setAttribute('aria-selected', String(active));
      button.tabIndex = active ? 0 : -1;
      $(`#content-${button.dataset.tab}`).hidden = !active;
    });
    $('#problem-content').scrollTop = 0;
  }

  function activateConsole(tab) {
    $$('[data-console]').forEach(button => {
      const active = button.dataset.console === tab;
      button.classList.toggle('active', active);
      button.setAttribute('aria-selected', String(active));
    });
    $('#console-input').hidden = tab !== 'input';
    $('#console-output').hidden = tab !== 'output';
    $('#load-sample').hidden = tab !== 'input';
  }

  function renderLineNumbers() {
    const lineCount = editor.value.split('\n').length;
    $('#line-numbers').textContent = Array.from({length: lineCount}, (_, index) => index + 1).join('\n');
    $('#line-numbers').scrollTop = editor.scrollTop;
    updateCursor();
  }

  function updateCursor() {
    const before = editor.value.slice(0, editor.selectionStart);
    const lines = before.split('\n');
    $('#cursor-position').textContent = `行 ${lines.length}，列 ${lines[lines.length - 1].length + 1}`;
  }

  function setDraftStatus(text, pending = false) {
    $('#save-status').textContent = text;
    $('#draft-dot').classList.toggle('unsaved', pending);
    $('#draft-dot').title = text;
  }

  function enqueueSave(body, type = 'code') {
    const id = body.problemId;
    const promise = saveQueue.catch(() => {}).then(async () => {
      const result = await api('/api/state', {method: 'PUT', body});
      const local = state;
      if (body.code !== undefined && pendingCodes.get(id) === body.code) pendingCodes.delete(id);
      if (body.note !== undefined && pendingNotes.get(id) === body.note) { pendingNotes.delete(id); preserveNotes(); }
      state = normalizeState(result.state);
      // A server response must not discard a newer edit still waiting in the queue.
      for (const draftId of pendingCodes.keys()) if (local.drafts[draftId]) state.drafts[draftId] = local.drafts[draftId];
      for (const [noteId, note] of pendingNotes) state.notes[noteId] = note;
      if (id === selectedId) {
        if (type === 'code' && editor.value === body.code) setDraftStatus('草稿已保存');
        if (type === 'note' && notesEditor.value === body.note) $('#note-save-status').textContent = '笔记已保存';
      }
      return result;
    });
    saveQueue = promise;
    promise.catch(error => {
      if (id === selectedId) {
        if (type === 'code') setDraftStatus('暂未同步 · 已保留浏览器草稿', true);
        if (type === 'note') $('#note-save-status').textContent = '保存失败，请稍后重试';
      }
      notify(`保存未成功：${error.message}`, true);
    });
    return promise;
  }

  function saveDraftNow() {
    clearTimeout(draftTimer);
    draftTimer = null;
    if (!selectedId) return Promise.resolve();
    const id = selectedId;
    const code = editor.value;
    rememberDraft(id, code);
    setDraftStatus('正在保存…', true);
    return enqueueSave({problemId: id, code});
  }

  function saveNoteNow() {
    clearTimeout(noteTimer);
    noteTimer = null;
    if (!selectedId) return Promise.resolve();
    const id = selectedId;
    const note = notesEditor.value;
    state.notes[id] = note;
    pendingNotes.set(id, note);
    preserveNotes();
    $('#note-save-status').textContent = '正在保存…';
    return enqueueSave({problemId: id, note}, 'note');
  }

  async function flushPending() {
    const pending = [];
    if (draftTimer) pending.push(saveDraftNow());
    if (noteTimer) pending.push(saveNoteNow());
    await Promise.all(pending);
    await saveQueue;
  }

  function selectProblem(id, initial = false) {
    if (!initial && id === selectedId) { closeSidebar(); return; }
    if (busy && !initial) { notify('评测正在进行，请等结果返回后再切换题目。'); return; }
    if (!initial) {
      if (draftTimer) saveDraftNow().catch(() => {});
      if (noteTimer) saveNoteNow().catch(() => {});
    }
    const problem = problems.find(item => item.id === id);
    if (!problem) return;
    selectedId = id;
    safeStorage.set(LAST_PROBLEM, id);
    sampleCursor = 0;
    const level = difficulty(problem.difficulty);
    $('#problem-id').textContent = problem.id;
    $('#problem-difficulty').textContent = level.label;
    $('#problem-difficulty').className = `difficulty ${level.className}`;
    $('#problem-title').textContent = problem.title;
    $('#header-topic').textContent = problem.topic || 'C++ 编程';
    $('#problem-tags').innerHTML = [...new Set([problem.topic, ...(problem.tags || [])].filter(Boolean))].map(tag => `<span>${escapeHtml(tag)}</span>`).join('');
    $('#favorite-button').setAttribute('aria-pressed', String(state.favorites.includes(id)));
    $('#favorite-button').setAttribute('aria-label', state.favorites.includes(id) ? '取消收藏' : '收藏题目');
    $('#favorite-button').title = state.favorites.includes(id) ? '取消收藏' : '收藏题目';
    editor.value = state.drafts[id]?.code ?? problem.starter ?? starter;
    editor.scrollTop = 0;
    editor.scrollLeft = 0;
    notesEditor.value = state.notes[id] || '';
    $('#note-save-status').textContent = '自动保存';
    setDraftStatus(state.drafts[id] ? '草稿已保存' : '草稿自动保存');
    renderLineNumbers();
    $('#stdin-editor').value = problem.samples?.[0]?.input || '';
    $('#load-sample').disabled = !problem.samples?.length;
    $('#console-output').innerHTML = '<div class="empty-result"><span class="terminal-symbol">&gt;_</span><p>写好代码，运行试一试。</p><span>运行使用自定义输入；提交会检查全部测试用例。</span></div>';
    $('#result-indicator').hidden = true;
    renderDescription(problem);
    renderSolution();
    renderHistory();
    activateTab('description');
    activateConsole('input');
    renderList();
    closeSidebar();
    document.title = `${problem.title} · 拾题 C++ 练习室`;
  }

  function editorChanged() {
    if (!selectedId) return;
    renderLineNumbers();
    rememberDraft(selectedId, editor.value);
    setDraftStatus('未保存 · 正在记录…', true);
    clearTimeout(draftTimer);
    draftTimer = setTimeout(() => saveDraftNow().catch(() => {}), 700);
  }

  function indentEditor(event) {
    if (event.key === 'Escape') {
      releaseEditorTab = true;
      notify('下一次按 Tab 可离开代码编辑器。');
      return;
    }
    if (event.key !== 'Tab') return;
    if (releaseEditorTab || event.ctrlKey || event.metaKey || event.altKey) { releaseEditorTab = false; return; }
    event.preventDefault();
    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    const value = editor.value;
    if (start === end && !event.shiftKey) {
      const column = start - value.lastIndexOf('\n', start - 1) - 1;
      const spaces = ' '.repeat(4 - column % 4);
      editor.setRangeText(spaces, start, end, 'end');
    } else {
      const lineStart = value.lastIndexOf('\n', start - 1) + 1;
      const effectiveEnd = end > start && value[end - 1] === '\n' ? end - 1 : end;
      const nextNewline = value.indexOf('\n', effectiveEnd);
      const lineEnd = nextNewline < 0 ? value.length : nextNewline;
      const original = value.slice(lineStart, lineEnd);
      let firstOffset = 0;
      let totalOffset = 0;
      const replacement = original.split('\n').map((line, index) => {
        if (!event.shiftKey) { totalOffset += 4; if (index === 0) firstOffset = 4; return `    ${line}`; }
        const match = line.match(/^( {1,4}|\t)/);
        const removed = match?.[0].length || 0;
        totalOffset -= removed;
        if (index === 0) firstOffset = -Math.min(removed, start - lineStart);
        return line.slice(removed);
      }).join('\n');
      editor.setRangeText(replacement, lineStart, lineEnd, 'preserve');
      editor.selectionStart = Math.max(lineStart, start + firstOffset);
      editor.selectionEnd = Math.max(editor.selectionStart, end + totalOffset);
    }
    editorChanged();
  }

  function setBusy(value, kind = 'judge') {
    busy = value;
    $('#run-button').disabled = value;
    $('#judge-button').disabled = value;
    $('#reset-button').disabled = value;
    $('#random-button').disabled = value;
    $('#next-button').disabled = value;
    $('#import-button').disabled = value;
    $('#judge-button').innerHTML = value && kind === 'judge' ? '<span class="spinner"></span>正在评测…' : '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="m4 10 4 4 8-8"/></svg>提交评测';
    $('#run-button').innerHTML = value && kind === 'run' ? '<span class="spinner"></span>正在运行…' : '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="m7 4 9 6-9 6Z"/></svg>运行代码';
  }

  function outputBlock(label, text, error = false) {
    return `<span class="result-output-label">${escapeHtml(label)}</span><pre class="output-pre${error ? ' error-log' : ''}">${escapeHtml(text || '（无输出）')}</pre>`;
  }

  function renderResult(result, kind) {
    const output = $('#console-output');
    const summary = `<div class="result-summary">${verdictMarkup(result.status)}<span class="verdict-meta">${kind === 'judge' ? `${Number(result.passed) || 0} / ${Number(result.total) || 0} 通过 · ` : ''}${Number(result.timeMs) || 0} ms</span></div>`;
    if (kind === 'run') {
      output.innerHTML = summary + (result.compileOutput ? outputBlock('编译信息', result.compileOutput, result.status === 'CE') : '') + (result.status !== 'CE' ? outputBlock('标准输出 stdout', result.stdout) : '') + (result.stderr ? outputBlock('标准错误 stderr', result.stderr, true) : '') + (result.message ? outputBlock('运行信息', result.message, true) : '');
    } else {
      const cases = Array.isArray(result.results) ? result.results : [];
      output.innerHTML = summary + (result.detailTruncated ? '<p class="running-note">历史保留评测摘要及首个失败用例，长输出已截断。</p>' : '') + (result.compileOutput ? outputBlock('编译信息', result.compileOutput, result.status === 'CE') : '') + (result.message ? outputBlock('评测信息', result.message, true) : '') + (cases.length ? `<div class="result-cases">${cases.map((test, index) => `<details class="case-row"${test.status !== 'AC' && index === cases.findIndex(item => item.status !== 'AC') ? ' open' : ''}><summary><span>测试 ${test.index ?? index + 1}</span>${verdictMarkup(test.status)}<time>${Number(test.timeMs) || 0} ms</time></summary><div class="case-detail">${test.input !== undefined ? outputBlock('输入', test.input) : ''}${test.expected !== undefined ? outputBlock('预期输出', test.expected) : ''}${test.actual !== undefined ? outputBlock('实际输出', test.actual) : ''}${test.stderr ? outputBlock('错误信息', test.stderr, true) : ''}</div></details>`).join('')}</div>` : result.status === 'AC' ? '<p class="running-note">这道题的全部测试用例均已通过。</p>' : '');
    }
    $('#result-indicator').hidden = false;
    activateConsole('output');
  }

  async function execute(kind) {
    if (busy || !selectedId) return;
    if (!compiler.available) { notify('尚未找到 C++ 编译器，请先根据项目说明完成编译环境安装。', true); return; }
    if (!editor.value.trim()) { notify('先写下一点代码，再运行或提交。'); editor.focus(); return; }
    const source = editor.value;
    const problemId = selectedId;
    const input = $('#stdin-editor').value;
    if (new TextEncoder().encode(source).length > 128 * 1024) { notify('代码过长，请控制在 128 KiB 以内。', true); return; }
    if (kind === 'run' && new TextEncoder().encode(input).length > 64 * 1024) { notify('自定义输入过长，请控制在 64 KiB 以内。', true); return; }
    setBusy(true, kind);
    activateConsole('output');
    $('#console-output').innerHTML = `<div class="result-summary"><span class="verdict running"><span class="spinner"></span>${kind === 'judge' ? '正在编译并检查测试用例…' : '正在编译并运行…'}</span></div><p class="running-note">程序在这台电脑上执行，请稍候。</p>`;
    try {
      await flushPending();
      const job = await api(kind === 'judge' ? '/api/judge' : '/api/run', {method: 'POST', body: kind === 'judge' ? {problemId, code: source} : {code: source, input}});
      let completed;
      for (let attempt = 0; attempt < 300; attempt++) {
        const status = await api(`/api/jobs/${encodeURIComponent(job.jobId)}`);
        if (status.status === 'done') { completed = status.result; break; }
        if (status.status === 'error' || status.status === 'failed') throw new Error(status.error || '评测任务未能完成。');
        await new Promise(resolve => setTimeout(resolve, attempt < 6 ? 250 : 600));
      }
      if (!completed) throw new Error('等待评测结果超时，请检查本地服务后重试。');
      renderResult(completed, kind);
      if (kind === 'judge') {
        if (completed.submission) {
          state.submissions = [completed.submission, ...state.submissions.filter(item => item.id !== completed.submission.id)];
        } else {
          const fresh = await api('/api/bootstrap');
          state.submissions = normalizeState(fresh.state).submissions;
        }
        renderHistory();
        renderList();
        if (completed.status === 'AC') notify('全部通过！又掌握了一道题。');
      }
    } catch (error) {
      $('#console-output').innerHTML = `<div class="result-summary">${verdictMarkup('ERROR')}</div>${outputBlock('提示', error.message, true)}`;
      notify(error.message, true);
    } finally {
      setBusy(false);
    }
  }

  async function copyText(value, message = '已复制') {
    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(String(value ?? ''));
      else {
        const helper = document.createElement('textarea');
        helper.value = String(value ?? '');
        helper.style.position = 'fixed';
        helper.style.opacity = '0';
        document.body.append(helper);
        helper.select();
        const copied = document.execCommand('copy');
        helper.remove();
        if (!copied) throw new Error('复制功能不可用');
      }
      notify(message);
    } catch { notify('浏览器未允许自动复制，请手动选择并复制。', true); }
  }

  async function revealSolution() {
    const id = selectedId;
    if (!window.confirm('建议先独立尝试，再对照答案复盘。现在查看这道题的参考解法吗？')) return;
    const button = $('[data-action="reveal-solution"]');
    if (button) { button.disabled = true; button.textContent = '正在加载…'; }
    try {
      const solution = await api(`/api/solution?id=${encodeURIComponent(id)}`);
      solutions.set(id, solution);
      if (selectedId === id) renderSolution();
    } catch (error) { notify(error.message, true); if (button) { button.disabled = false; button.textContent = '查看参考解法'; } }
  }

  function chooseNext(random = false) {
    if (busy || !problems.length) return;
    const solved = solvedIds();
    let pool = problems.filter(problem => !solved.has(problem.id) && problem.id !== selectedId);
    if (!pool.length) {
      if (!solved.has(selectedId)) { notify('只剩当前这道题还没有通过，继续加油。'); return; }
      notify('全部题目都已通过，可以回顾收藏或笔记。');
      return;
    }
    if (random) selectProblem(pool[Math.floor(Math.random() * pool.length)].id);
    else {
      const currentIndex = problems.findIndex(problem => problem.id === selectedId);
      const ordered = [...problems.slice(currentIndex + 1), ...problems.slice(0, currentIndex)];
      const next = ordered.find(problem => !solved.has(problem.id));
      if (next) selectProblem(next.id);
    }
  }

  function closeSidebar() {
    $('#sidebar').classList.remove('open');
    $('#sidebar-backdrop').hidden = true;
    $('#menu-button').setAttribute('aria-expanded', 'false');
  }

  function setupEvents() {
    $('#search-input').addEventListener('input', renderList);
    $('#difficulty-filter').addEventListener('change', renderList);
    $('#topic-filter').addEventListener('change', renderList);
    $$('.status-filters button').forEach(button => button.addEventListener('click', () => {
      filter = button.dataset.filter;
      $$('.status-filters button').forEach(item => item.classList.toggle('active', item === button));
      renderList();
    }));
    $('#problem-list').addEventListener('click', event => {
      const button = event.target.closest('[data-problem-id]');
      if (button) selectProblem(button.dataset.problemId);
    });
    $$('[data-tab]').forEach(button => button.addEventListener('click', () => activateTab(button.dataset.tab)));
    $('.tab-bar').addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      const tabs = $$('[data-tab]');
      const index = tabs.findIndex(item => item === document.activeElement);
      if (index < 0) return;
      event.preventDefault();
      const target = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
      activateTab(tabs[target].dataset.tab);
      tabs[target].focus();
    });
    $$('[data-console]').forEach(button => button.addEventListener('click', () => activateConsole(button.dataset.console)));
    $('#favorite-button').addEventListener('click', async () => {
      if (!selectedId) return;
      const id = selectedId;
      const favorite = !state.favorites.includes(id);
      const button = $('#favorite-button');
      button.disabled = true;
      try {
        await enqueueSave({problemId: id, favorite}, 'favorite');
        if (selectedId === id) {
          button.setAttribute('aria-pressed', String(favorite));
          button.setAttribute('aria-label', favorite ? '取消收藏' : '收藏题目');
          button.title = favorite ? '取消收藏' : '收藏题目';
        }
        renderList();
        notify(favorite ? '已加入收藏' : '已取消收藏');
      } catch { /* The save queue reports errors. */ }
      finally { button.disabled = false; }
    });
    editor.addEventListener('input', editorChanged);
    editor.addEventListener('scroll', () => { $('#line-numbers').scrollTop = editor.scrollTop; });
    ['click', 'keyup', 'select'].forEach(name => editor.addEventListener(name, updateCursor));
    editor.addEventListener('keydown', indentEditor);
    editor.addEventListener('blur', () => { releaseEditorTab = false; });
    notesEditor.addEventListener('input', () => {
      if (!selectedId) return;
      state.notes[selectedId] = notesEditor.value;
      pendingNotes.set(selectedId, notesEditor.value);
      preserveNotes();
      $('#note-save-status').textContent = '正在记录…';
      clearTimeout(noteTimer);
      noteTimer = setTimeout(() => saveNoteNow().catch(() => {}), 700);
    });
    $('#reset-button').addEventListener('click', () => {
      if (!window.confirm('要恢复这道题的初始代码吗？当前草稿将被替换。提交记录与笔记会保留。')) return;
      editor.value = currentProblem()?.starter || starter;
      editorChanged();
      saveDraftNow().catch(() => {});
      editor.focus();
    });
    $('#run-button').addEventListener('click', () => execute('run'));
    $('#judge-button').addEventListener('click', () => execute('judge'));
    $('#next-button').addEventListener('click', () => chooseNext(false));
    $('#random-button').addEventListener('click', () => chooseNext(true));
    $('#load-sample').addEventListener('click', () => {
      const samples = currentProblem()?.samples || [];
      if (!samples.length) return;
      const index = sampleCursor % samples.length;
      $('#stdin-editor').value = samples[index].input || '';
      sampleCursor++;
      notify(`样例 ${index + 1} 的输入已填入`);
    });
    $('#content-description').addEventListener('click', event => {
      const button = event.target.closest('[data-copy-sample]');
      if (button) copyText(currentProblem()?.samples?.[Number(button.dataset.copySample)]?.[button.dataset.sampleField], '样例已复制');
    });
    $('#content-solution').addEventListener('click', event => {
      const button = event.target.closest('[data-action]');
      if (!button) return;
      if (button.dataset.action === 'reveal-solution') revealSolution();
      if (button.dataset.action === 'copy-solution') copyText(solutions.get(selectedId)?.solution, '参考代码已复制');
      if (button.dataset.action === 'apply-solution') {
        if (!window.confirm('用参考解法替换当前编辑器中的代码吗？当前草稿将被覆盖。')) return;
        editor.value = solutions.get(selectedId)?.solution || '';
        editorChanged();
        saveDraftNow().catch(() => {});
        editor.focus();
        notify('参考解法已放入编辑器，可以运行并对照学习。');
      }
    });
    $('#content-history').addEventListener('click', event => {
      const button = event.target.closest('[data-submission-index]');
      if (!button || busy) return;
      const submission = problemSubmissions()[Number(button.dataset.submissionIndex)];
      if (submission) renderResult(submission, 'judge');
    });
    $('#font-smaller').addEventListener('click', () => changeFont(-1));
    $('#font-larger').addEventListener('click', () => changeFont(1));
    document.addEventListener('keydown', event => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') { event.preventDefault(); execute('judge'); }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') { event.preventDefault(); flushPending().then(() => notify('当前草稿与笔记已保存')).catch(() => {}); }
      if (event.key === 'Escape') closeSidebar();
    });
    $('#menu-button').setAttribute('aria-expanded', 'false');
    $('#menu-button').setAttribute('aria-controls', 'sidebar');
    $('#menu-button').addEventListener('click', () => {
      const open = !$('#sidebar').classList.contains('open');
      $('#sidebar').classList.toggle('open', open);
      $('#sidebar-backdrop').hidden = !open;
      $('#menu-button').setAttribute('aria-expanded', String(open));
    });
    $('#sidebar-backdrop').addEventListener('click', closeSidebar);
    $('#refresh-environment').addEventListener('click', async () => {
      try {
        const data = await api('/api/bootstrap');
        compiler = data.compiler || {available: false};
        renderCompiler();
        notify(compiler.available ? '编译器已就绪' : '仍未检测到编译器，请检查 PATH 并重新启动练习室。', !compiler.available);
      } catch (error) { notify(error.message, true); }
    });
    $('#export-button').addEventListener('click', exportProgress);
    $('#import-button').addEventListener('click', () => { $('#import-file').value = ''; $('#import-file').click(); });
    $('#import-file').addEventListener('change', importProgress);
    window.addEventListener('beforeunload', () => {
      if (!selectedId || !csrfToken) return;
      if (draftTimer || noteTimer) {
        const body = {problemId: selectedId, code: editor.value, note: notesEditor.value};
        fetch('/api/state', {method: 'PUT', headers: {'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken}, body: JSON.stringify(body), keepalive: true}).catch(() => {});
      }
    });
  }

  function changeFont(delta) {
    fontSize = Math.max(11, Math.min(21, fontSize + delta));
    document.documentElement.style.setProperty('--editor-font', `${fontSize}px`);
    safeStorage.set(FONT_SIZE, String(fontSize));
    $('#line-numbers').scrollTop = editor.scrollTop;
  }

  async function exportProgress() {
    const button = $('#export-button');
    button.disabled = true;
    try {
      await flushPending();
      const data = await api('/api/export');
      const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'}));
      const anchor = document.createElement('a');
      const date = new Date();
      const stamp = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      anchor.href = url;
      anchor.download = `拾题-练习进度-${stamp}.json`;
      document.body.append(anchor);
      anchor.click();
      anchor.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      notify('进度备份已导出，包含草稿、收藏、笔记与提交记录。');
    } catch (error) { notify(`导出失败：${error.message}`, true); }
    finally { button.disabled = false; }
  }

  async function importProgress(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (busy) { notify('请等待当前评测完成后再导入。'); return; }
    if (file.size > 16 * 1024 * 1024) { notify('备份文件过大，请选择 16 MiB 以内的 JSON 文件。', true); return; }
    let data;
    try { data = JSON.parse(await file.text()); }
    catch { notify('无法读取这个备份，请选择有效的 JSON 文件。', true); return; }
    if (!window.confirm('导入将替换当前练习进度，包括草稿、收藏、笔记和提交记录。建议先备份当前进度。继续导入吗？')) return;
    const button = $('#import-button');
    button.disabled = true;
    try {
      await flushPending();
      const result = await api('/api/import', {method: 'POST', body: data});
      clearTimeout(draftTimer);
      clearTimeout(noteTimer);
      draftTimer = null;
      noteTimer = null;
      state = normalizeState(result.state);
      pendingCodes.clear();
      pendingNotes.clear();
      preserveNotes();
      safeStorage.set(LOCAL_DRAFTS, JSON.stringify(state.drafts));
      selectProblem(selectedId || problems[0]?.id, true);
      notify('练习进度已导入');
    } catch (error) { notify(`导入失败：${error.message}`, true); }
    finally { button.disabled = false; }
  }

  async function initialize() {
    try {
      const data = await api('/api/bootstrap');
      problems = Array.isArray(data.problems) ? data.problems : [];
      if (!problems.length) throw new Error('题库为空，请检查项目文件是否完整。');
      csrfToken = data.csrfToken || document.querySelector('meta[name="csrf-token"]')?.content || '';
      document.querySelector('meta[name="csrf-token"]').content = csrfToken;
      state = normalizeState(data.state);
      starter = data.starter || starter;
      compiler = data.compiler || {available: false};
      const restored = [];
      const restoredNotes = [];
      for (const [id, draft] of Object.entries(localDrafts())) {
        if (problems.some(problem => problem.id === id) && typeof draft.code === 'string' && new Date(draft.updatedAt).getTime() > new Date(state.drafts[id]?.updatedAt || 0).getTime() && state.drafts[id]?.code !== draft.code) {
          state.drafts[id] = draft;
          pendingCodes.set(id, draft.code);
          restored.push({id, code: draft.code});
        }
      }
      try {
        for (const [id, note] of Object.entries(JSON.parse(safeStorage.get(LOCAL_NOTES) || '{}'))) {
          if (problems.some(problem => problem.id === id) && typeof note === 'string' && note !== state.notes[id]) {
            state.notes[id] = note;
            pendingNotes.set(id, note);
            restoredNotes.push({id, note});
          }
        }
      } catch { /* Ignore a damaged browser backup. Server data is still intact. */ }
      $('#topic-filter').innerHTML = '<option value="all">全部知识点</option>' + [...new Set(problems.map(problem => problem.topic).filter(Boolean))].map(topic => `<option value="${escapeHtml(topic)}">${escapeHtml(topic)}</option>`).join('');
      fontSize = Math.max(11, Math.min(21, Number(safeStorage.get(FONT_SIZE)) || 14));
      changeFont(0);
      setupEvents();
      renderCompiler();
      const preferred = safeStorage.get(LAST_PROBLEM);
      selectProblem(problems.some(problem => problem.id === preferred) ? preferred : problems[0].id, true);
      for (const draft of restored) enqueueSave({problemId: draft.id, code: draft.code}).catch(() => {});
      for (const note of restoredNotes) enqueueSave({problemId: note.id, note: note.note}, 'note').catch(() => {});
      if (restored.length || restoredNotes.length) notify('已恢复浏览器中尚未同步的草稿或笔记。');
    } catch (error) {
      $('#fatal-message').textContent = `${error.message} 请确认本地服务仍在运行，再重新连接。`;
      $('#fatal-error').hidden = false;
    }
  }

  $('#reconnect-button').addEventListener('click', () => location.reload());
  initialize();
})();
