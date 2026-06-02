'use strict';

// ── state ─────────────────────────────────────────────────────────────────────
let state = {
  statuses:      {},
  notes:         {},
  writeups:      {},
  customMachines:[],
  cheatEntries:  JSON.parse(JSON.stringify(DEFAULT_CHEATSHEET)),
  cheatFilter:   null,
  expandedCheat: null,
  cheatNext:     DEFAULT_CHEATSHEET.length + 1,
  adChecks:      {},
  expandedAD:    null,
  customADTech:  [],
  settings: { userName: '', goalDate: '', theme: 'pastel' },
};

(function loadState() {
  for (const key of ['oscp_quest_v2', 'oscp_quest']) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      const p = JSON.parse(raw);
      if (p.statuses)       state.statuses       = p.statuses;
      if (p.notes)          state.notes          = p.notes;
      if (p.writeups)       state.writeups       = p.writeups || {};
      if (p.customMachines) state.customMachines = p.customMachines;
      if (p.adChecks)       state.adChecks       = p.adChecks;
      if (p.customADTech)   state.customADTech   = p.customADTech;
      if (p.expandedAD !== undefined) state.expandedAD = p.expandedAD;
      if (p.cheatEntries && p.cheatEntries.length) {
        state.cheatEntries = p.cheatEntries;
        state.cheatNext    = p.cheatNext || p.cheatEntries.length + 1;
      }
      if (p.settings) Object.assign(state.settings, p.settings);
      break;
    } catch(e) {}
  }
})();

function save() {
  try {
    localStorage.setItem('oscp_quest_v2', JSON.stringify({
      statuses: state.statuses, notes: state.notes, writeups: state.writeups,
      customMachines: state.customMachines, cheatEntries: state.cheatEntries,
      cheatNext: state.cheatNext, adChecks: state.adChecks,
      customADTech: state.customADTech, expandedAD: state.expandedAD,
      settings: state.settings,
    }));
  } catch(e) {}
}

// ── helpers ───────────────────────────────────────────────────────────────────
function allMachines() { return [...MACHINES, ...state.customMachines]; }
function allADTech()   { return [...AD_LAB,   ...state.customADTech];  }

function escHtml(s) {
  return String(s)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function download(content, filename, type) {
  const blob = new Blob([content], { type });
  const a = Object.assign(document.createElement('a'), {
    href: URL.createObjectURL(blob), download: filename,
  });
  a.click(); URL.revokeObjectURL(a.href);
}

function renderMd(text) {
  if (typeof marked !== 'undefined') return marked.parse(text || '*no notes yet*');
  return escHtml(text).replace(/\n/g, '<br>');
}

// ── UI state (not persisted) ──────────────────────────────────────────────────
const openNotes    = new Set();
const previewNotes = new Set();
const previewCheat = new Set();

// ── XP / levels ───────────────────────────────────────────────────────────────
function calcXP() {
  const machXP = allMachines().reduce((xp, m) => {
    if (state.statuses[m.id] !== 'rooted') return xp;
    return xp + (XP_TABLE[m.diff] || 0) + (m.isAD ? AD_BONUS : 0);
  }, 0);
  const adXP = allADTech().filter(a => state.adChecks[a.id]).length * AD_TECH_XP;
  return machXP + adXP;
}

function getLevelInfo(xp) {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].min) return { lv: LEVELS[i], idx: i };
  }
  return { lv: LEVELS[0], idx: 0 };
}

// ── theme ─────────────────────────────────────────────────────────────────────
function applyTheme(name) {
  const theme = THEMES[name] || THEMES.pastel;
  Object.entries(theme.vars).forEach(([k, v]) => document.documentElement.style.setProperty(k, v));
}

// ── tabs ──────────────────────────────────────────────────────────────────────
function switchTab(t) {
  const names = ['machines','skills','cheatsheet','adlab','settings'];
  document.querySelectorAll('.tab').forEach((el, i) =>
    el.classList.toggle('active', names[i] === t)
  );
  document.querySelectorAll('.panel').forEach(el => el.classList.remove('active'));
  document.getElementById('panel-' + t).classList.add('active');
  if (t === 'skills')     renderSkills();
  if (t === 'cheatsheet') renderCheatsheet();
  if (t === 'adlab')      renderADLab();
  if (t === 'settings')   renderSettings();
}

// ── machines ──────────────────────────────────────────────────────────────────
function cycleStatus(id) {
  const cur = state.statuses[id] || 'todo';
  state.statuses[id] = cur==='todo'?'progress':cur==='progress'?'rooted':'todo';
  save(); renderMachines(); renderStats();
}

function getFiltered() {
  const plat = document.getElementById('filter-platform').value;
  const os   = document.getElementById('filter-os').value;
  const diff = document.getElementById('filter-diff').value;
  const stat = document.getElementById('filter-status').value;
  const srch = document.getElementById('filter-search').value.toLowerCase();
  return allMachines().filter(m => {
    if (plat && m.platform !== plat) return false;
    if (os   && m.os !== os)         return false;
    if (diff && m.diff !== diff)     return false;
    if (stat && (state.statuses[m.id]||'todo') !== stat) return false;
    if (srch && !m.name.toLowerCase().includes(srch) && !m.tags.join(' ').includes(srch)) return false;
    return true;
  });
}

function renderMachines() {
  const list     = document.getElementById('machine-list');
  const filtered = getFiltered();

  if (!filtered.length) {
    list.innerHTML = '<div class="empty-state">no machines found<br/>adjust filters</div>';
    return;
  }

  list.innerHTML = filtered.map(m => {
    const st       = state.statuses[m.id] || 'todo';
    const dotClass = st==='rooted'?'dot-rooted':st==='progress'?'dot-progress':'dot-todo';
    const rowClass = st==='rooted'?'rooted':st==='progress'?'in-progress':'';
    const stText   = st==='rooted'?'ROOTED':st==='progress'?'IN PROG':'TODO';
    const platCls  = 'badge-'+m.platform.toLowerCase();
    const osCls    = m.isAD?'badge-ad':'badge-'+(m.os==='Linux'?'linux':'windows');
    const diffCls  = 'badge-'+m.diff.toLowerCase();
    const writeup  = (state.writeups[m.id]||'').replace(/"/g,'&quot;');
    const isCustom = !!m.custom;

    const tagsHtml = st==='rooted'
      ? m.tags.slice(0,3).map(t=>`<span class="tag" style="cursor:default">${t}</span>`).join('')
      : '<span class="tag-spoiler">[ hidden ]</span>';

    const editBtn = isCustom ? `<button class="px-btn small" onclick="openEditMachine('${m.id}')">edit</button>` : '';

    return `<div class="machine-row ${rowClass}" id="row-${m.id}">
      <div class="status-col">
        <div class="status-dot ${dotClass}" onclick="cycleStatus('${m.id}')" title="click to advance"></div>
        <span class="status-text st-${st}">${stText}</span>
      </div>
      <div>
        <div class="machine-name">${escHtml(m.name)}${isCustom?'<span class="custom-badge">[custom]</span>':''}</div>
        <a href="${m.url}" class="machine-link" target="_blank" rel="noopener">↗ open</a>
      </div>
      <span class="px-badge ${platCls}">${m.platform}</span>
      <span class="px-badge ${osCls}">${m.isAD?'AD':m.os}</span>
      <span class="px-badge ${diffCls}">${m.diff}</span>
      <div class="tags-col">${tagsHtml}</div>
      <div style="display:flex;gap:4px;flex-wrap:wrap">
        <button class="px-btn small" onclick="toggleNote('${m.id}')">notes ▼</button>
        ${editBtn}
      </div>
    </div>
    <div class="note-panel" id="note-${m.id}">
      <label class="note-field-label">writeup</label>
      <div style="display:flex;gap:6px;margin-bottom:10px;align-items:center">
        <input class="px-input" style="flex:1" placeholder="https://..."
               value="${writeup}" onchange="saveWriteup('${m.id}',this.value)"/>
        <label class="px-btn small info" style="cursor:pointer;white-space:nowrap" title="upload a .md writeup into notes">
          ↑ .md
          <input type="file" accept=".md,.txt" style="display:none"
                 onchange="uploadWriteup('${m.id}',this)"/>
        </label>
      </div>

      <div class="note-mode-bar">
        <label class="note-field-label" style="margin:0">notes &amp; findings</label>
        <div style="display:flex;gap:4px">
          <button class="px-btn small" id="btn-edit-${m.id}" onclick="setNoteMode('${m.id}','edit')">✏ edit</button>
          <button class="px-btn small info" id="btn-prev-${m.id}" onclick="setNoteMode('${m.id}','preview')">◉ preview</button>
        </div>
      </div>
      <textarea class="note-area" id="ta-${m.id}"
                placeholder="# findings\n\n- technique used\n- credentials found\n- next steps..."
                onchange="saveNote('${m.id}',this.value)">${escHtml(state.notes[m.id]||'')}</textarea>
      <div class="md-preview" id="md-${m.id}" style="display:none"></div>
    </div>`;
  }).join('');

  // restore open panels + preview modes
  openNotes.forEach(id => {
    const el = document.getElementById('note-' + id);
    if (el) el.style.display = 'block';
    if (previewNotes.has(id)) setNoteMode(id, 'preview');
  });
}

function toggleNote(id) {
  const el = document.getElementById('note-' + id);
  if (!el) return;
  const opening = el.style.display !== 'block';
  el.style.display = opening ? 'block' : 'none';
  opening ? openNotes.add(id) : openNotes.delete(id);
  if (!opening) previewNotes.delete(id);
}

function setNoteMode(id, mode) {
  const ta   = document.getElementById('ta-' + id);
  const prev = document.getElementById('md-' + id);
  if (!ta || !prev) return;

  if (mode === 'preview') {
    saveNote(id, ta.value);
    prev.innerHTML     = renderMd(ta.value || '');
    ta.style.display   = 'none';
    prev.style.display = 'block';
    previewNotes.add(id);
  } else {
    ta.style.display   = 'block';
    prev.style.display = 'none';
    previewNotes.delete(id);
  }
}

function saveNote(id, val)    { state.notes[id]   = val; save(); }
function saveWriteup(id, val) { state.writeups[id] = val; save(); }

function uploadWriteup(id, input) {
  const file = input.files[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    const content = ev.target.result;
    saveNote(id, content);
    const ta = document.getElementById('ta-' + id);
    if (ta) ta.value = content;
    if (previewNotes.has(id)) setNoteMode(id, 'preview');
  };
  reader.readAsText(file);
  input.value = '';
}

// ── add / edit / delete custom machines ───────────────────────────────────────
function openAddMachine() { openMachineModal(null); }

function openEditMachine(id) {
  const m = state.customMachines.find(m => m.id === id);
  if (m) openMachineModal(m);
}

function openMachineModal(m) {
  const editing = !!m;
  document.getElementById('modal-overlay').style.display = 'flex';
  document.getElementById('modal-title').textContent = editing ? 'edit machine' : 'add machine';
  document.getElementById('modal-m-id').value       = m ? m.id : '';
  document.getElementById('modal-m-name').value     = m ? m.name : '';
  document.getElementById('modal-m-platform').value = m ? m.platform : 'HTB';
  document.getElementById('modal-m-os').value       = m ? m.os : 'Linux';
  document.getElementById('modal-m-diff').value     = m ? m.diff : 'Easy';
  document.getElementById('modal-m-isad').checked   = m ? !!m.isAD : false;
  document.getElementById('modal-m-url').value      = m ? m.url : '';
  document.getElementById('modal-m-tags').value     = m ? m.tags.join(', ') : '';
  document.getElementById('modal-delete-btn').style.display = editing ? 'block' : 'none';
}

function closeMachineModal() {
  document.getElementById('modal-overlay').style.display = 'none';
}

function saveMachineModal() {
  const id       = document.getElementById('modal-m-id').value;
  const name     = document.getElementById('modal-m-name').value.trim();
  const platform = document.getElementById('modal-m-platform').value;
  const os       = document.getElementById('modal-m-os').value;
  const diff     = document.getElementById('modal-m-diff').value;
  const isAD     = document.getElementById('modal-m-isad').checked;
  const url      = document.getElementById('modal-m-url').value.trim() || '#';
  const tags     = document.getElementById('modal-m-tags').value.split(',').map(t=>t.trim()).filter(Boolean);

  if (!name) { alert('name is required'); return; }

  if (id) {
    const m = state.customMachines.find(m => m.id === id);
    if (m) Object.assign(m, { name, platform, os, diff, isAD, url, tags });
  } else {
    state.customMachines.push({ id:'c-'+Date.now(), name, platform, os, diff, isAD, url, tags, custom:true });
  }

  save(); closeMachineModal(); renderMachines(); renderStats();
}

function deleteMachineModal() {
  const id = document.getElementById('modal-m-id').value;
  if (!id || !confirm('delete this machine?')) return;
  state.customMachines = state.customMachines.filter(m => m.id !== id);
  delete state.statuses[id]; delete state.notes[id]; delete state.writeups[id];
  save(); closeMachineModal(); renderMachines(); renderStats();
}

// ── stats ─────────────────────────────────────────────────────────────────────
function renderStats() {
  const machines = allMachines();
  const total    = machines.length;
  const rooted   = machines.filter(m => state.statuses[m.id]==='rooted').length;
  const inprog   = machines.filter(m => state.statuses[m.id]==='progress').length;
  const adRooted = machines.filter(m => m.isAD && state.statuses[m.id]==='rooted').length;
  const adTotal  = machines.filter(m => m.isAD).length;
  const xp       = calcXP();
  const { lv, idx } = getLevelInfo(xp);
  const nextLv   = LEVELS[Math.min(idx+1, LEVELS.length-1)];
  const lvPct    = lv.name==='OSCP READY'
    ? 100
    : Math.min(100, Math.round(((xp-lv.min)/(nextLv.min-lv.min))*100));

  document.getElementById('stats-bar').innerHTML = `
    <div class="stat-card"><span class="stat-num">${rooted}</span><span class="stat-label">rooted</span></div>
    <div class="stat-card"><span class="stat-num">${inprog}</span><span class="stat-label">in progress</span></div>
    <div class="stat-card"><span class="stat-num">${total-rooted-inprog}</span><span class="stat-label">todo</span></div>
    <div class="stat-card"><span class="stat-num">${adRooted}/${adTotal}</span><span class="stat-label">AD boxes</span></div>
    <div class="stat-card"><span class="stat-num">${xp}</span><span class="stat-label">total XP</span></div>
  `;

  const pct = total > 0 ? Math.round((rooted/total)*100) : 0;
  document.getElementById('progress-bar').style.width  = pct+'%';
  document.getElementById('progress-text').textContent = pct+'%';
  document.getElementById('xp-bar').style.width        = lvPct+'%';
  document.getElementById('xp-bar-text').textContent   = lvPct+'%';
  document.getElementById('xp-bar-label').textContent  =
    lv.name==='OSCP READY' ? 'xp — MAX LEVEL' : `xp — ${lv.name} → ${nextLv.name}`;
  document.getElementById('level-name').textContent = lv.name;
  document.getElementById('level-xp').textContent   = xp+' XP';

  const gs = state.settings;
  if (gs.goalDate) {
    const days = Math.ceil((new Date(gs.goalDate)-new Date())/86400000);
    const el   = document.getElementById('goal-countdown');
    if (el) el.textContent = days>0?`${days}d to exam`:days===0?'exam day!':'past goal';
  }
}

// ── skills (hierarchical) ─────────────────────────────────────────────────────
function renderSkills() {
  const tagCounts = {};
  allMachines().forEach(m => {
    const rooted = state.statuses[m.id]==='rooted';
    m.tags.forEach(t => {
      if (!tagCounts[t]) tagCounts[t] = { total:0, rooted:0 };
      tagCounts[t].total++;
      if (rooted) tagCounts[t].rooted++;
    });
  });

  document.getElementById('skill-map').innerHTML = SKILL_CATEGORIES.map(cat => {
    const boxes = cat.skills.map(s => {
      const c   = tagCounts[s] || { total:0, rooted:0 };
      const pct = c.total>0 ? Math.round((c.rooted/c.total)*100) : 0;
      return `<div class="skill-box">
        <span class="skill-name">${s}</span>
        <div class="skill-bar-mini">
          <div class="skill-bar-mini-fill" style="width:${pct}%;background:${cat.accent}"></div>
        </div>
        <div style="font-size:7px;color:var(--px-text2);margin-top:4px">${c.rooted}/${c.total}</div>
      </div>`;
    }).join('');

    const catRooted = cat.skills.reduce((n,s)=>n+(tagCounts[s]?.rooted||0), 0);
    const catTotal  = cat.skills.reduce((n,s)=>n+(tagCounts[s]?.total||0),  0);
    const catPct    = catTotal>0 ? Math.round((catRooted/catTotal)*100) : 0;

    return `<div class="skill-category">
      <div class="skill-cat-header" style="border-left-color:${cat.accent}">
        <span class="skill-cat-name">${cat.name}</span>
        <span class="skill-cat-stat">${catRooted}/${catTotal} &nbsp;(${catPct}%)</span>
      </div>
      <div class="skill-cat-grid">${boxes}</div>
    </div>`;
  }).join('');
}

// ── cheatsheet ────────────────────────────────────────────────────────────────
function renderCheatsheet() {
  const allTags = [...new Set(state.cheatEntries.flatMap(e=>e.tags))].sort();

  document.getElementById('cheat-tag-filter').innerHTML = `
    <div class="tag-dropdown-wrap" id="tag-drop-wrap">
      <button class="tag-dropdown-btn" onclick="toggleTagDropdown()">
        ${state.cheatFilter ? '▸ '+state.cheatFilter : 'filter by tag ▾'}
      </button>
      <div class="tag-dropdown-menu" id="tag-drop-menu">
        <div class="tag-dropdown-item" onclick="setCheatFilter(null)">
          <input type="checkbox" ${!state.cheatFilter?'checked':''}> all entries
        </div>
        ${allTags.map(t=>`
          <div class="tag-dropdown-item" onclick="setCheatFilter('${t}')">
            <input type="checkbox" ${state.cheatFilter===t?'checked':''}> ${t}
          </div>`).join('')}
      </div>
    </div>`;

  const entries = state.cheatFilter
    ? state.cheatEntries.filter(e=>e.tags.includes(state.cheatFilter))
    : state.cheatEntries;

  document.getElementById('cheat-grid').innerHTML = entries.map(e => `
    <div class="cheat-card" data-cheat="${e.id}">
      <div class="cheat-header" onclick="toggleCheat(${e.id})">
        <span class="cheat-title">${escHtml(e.title)}</span>
        <div style="display:flex;align-items:center;gap:5px">
          ${e.tags.map(t=>`<span class="px-badge badge-htb">${t}</span>`).join('')}
          <span style="font-size:10px;color:var(--px-text2)">${state.expandedCheat===e.id?'▲':'▼'}</span>
        </div>
      </div>
      <div class="cheat-body ${state.expandedCheat===e.id?'open':''}">
        <div class="cheat-edit-row">
          <input class="px-input" style="width:100%" value="${escHtml(e.title)}"
                 placeholder="title" onchange="saveCheatTitle(${e.id},this.value)"
                 onclick="event.stopPropagation()"/>
          <input class="px-input" style="width:100%;color:var(--px-text2)" value="${escHtml(e.tags.join(', '))}"
                 placeholder="tags (comma separated)" onchange="saveCheatTags(${e.id},this.value)"
                 onclick="event.stopPropagation()"/>
        </div>
        <div class="note-mode-bar">
          <span style="font-size:7px;color:var(--px-text2)">content</span>
          <div style="display:flex;gap:4px">
            <button class="px-btn small" onclick="setCheatMode(${e.id},'edit')">✏ edit</button>
            <button class="px-btn small info" onclick="setCheatMode(${e.id},'preview')">◉ preview</button>
          </div>
        </div>
        <textarea class="note-area cheat-content-area" id="cta-${e.id}" spellcheck="false"
                  onchange="saveCheat(${e.id},this.value)">${escHtml(e.content)}</textarea>
        <div class="md-preview" id="cmd-${e.id}" style="display:none"></div>
        <div style="display:flex;justify-content:flex-end;margin-top:10px">
          <button class="px-btn small danger" onclick="deleteCheat(${e.id})">delete</button>
        </div>
      </div>
    </div>`).join('');
}

function toggleTagDropdown() { document.getElementById('tag-drop-wrap').classList.toggle('open'); }

function setCheatFilter(t) {
  state.cheatFilter = t;
  document.getElementById('tag-drop-wrap').classList.remove('open');
  renderCheatsheet();
}

function toggleCheat(id) {
  state.expandedCheat = state.expandedCheat===id ? null : id;
  renderCheatsheet();
  // restore preview mode if this card was already in preview
  if (state.expandedCheat !== null && previewCheat.has(state.expandedCheat)) {
    setCheatMode(state.expandedCheat, 'preview');
  }
}

function setCheatMode(id, mode) {
  const ta   = document.getElementById('cta-' + id);
  const prev = document.getElementById('cmd-' + id);
  if (!ta || !prev) return;
  if (mode === 'preview') {
    saveCheat(id, ta.value);
    prev.innerHTML     = renderMd(ta.value || '');
    ta.style.display   = 'none';
    prev.style.display = 'block';
    previewCheat.add(id);
  } else {
    ta.style.display   = 'block';
    prev.style.display = 'none';
    previewCheat.delete(id);
  }
}

function saveCheat(id, content) {
  const e = state.cheatEntries.find(e=>e.id===id);
  if (e) { e.content = content; save(); }
}

function saveCheatTitle(id, val) {
  const e = state.cheatEntries.find(e=>e.id===id);
  if (!e) return;
  e.title = val; save();
  const el = document.querySelector(`[data-cheat="${id}"] .cheat-title`);
  if (el) el.textContent = val;
}

function saveCheatTags(id, val) {
  const e = state.cheatEntries.find(e=>e.id===id);
  if (e) { e.tags = val.split(',').map(t=>t.trim()).filter(Boolean); save(); }
}

function deleteCheat(id) {
  state.cheatEntries = state.cheatEntries.filter(e=>e.id!==id);
  if (state.cheatFilter && !state.cheatEntries.some(e=>e.tags.includes(state.cheatFilter)))
    state.cheatFilter = null;
  save(); renderCheatsheet();
}

function addCheatEntry() {
  const id = state.cheatNext++;
  state.cheatEntries.push({ id, title:'new entry', tags:['custom'], content:'# your notes here' });
  state.expandedCheat = id;
  save(); renderCheatsheet();
}

function exportMarkdown() {
  const body = state.cheatEntries.map(e =>
    `## ${e.title}\n_Tags: ${e.tags.join(', ')}_\n\n\`\`\`\n${e.content}\n\`\`\``
  ).join('\n\n---\n\n');
  const hdr = `# OSCP Cheatsheet${state.settings.userName?' — '+state.settings.userName:''}\n\n> Generated by MAEVE — your OSCP companion\n\n---\n\n`;
  download(hdr + body + '\n', 'oscp_cheatsheet.md', 'text/markdown');
}

// ── JSON export / import ──────────────────────────────────────────────────────
function exportJSON() {
  download(JSON.stringify({
    version:3, exportedAt:new Date().toISOString(),
    statuses:state.statuses, notes:state.notes, writeups:state.writeups,
    customMachines:state.customMachines, cheatEntries:state.cheatEntries,
    cheatNext:state.cheatNext, adChecks:state.adChecks,
    customADTech:state.customADTech, settings:state.settings,
  }, null, 2), 'oscp_quest_backup.json', 'application/json');
}

function importJSON(input) {
  const file = input.files[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    try {
      const d = JSON.parse(ev.target.result);
      if (d.statuses)       state.statuses       = d.statuses;
      if (d.notes)          state.notes          = d.notes;
      if (d.writeups)       state.writeups       = d.writeups;
      if (d.customMachines) state.customMachines = d.customMachines;
      if (d.adChecks)       state.adChecks       = d.adChecks;
      if (d.customADTech)   state.customADTech   = d.customADTech;
      if (d.cheatEntries && d.cheatEntries.length) {
        state.cheatEntries = d.cheatEntries;
        state.cheatNext    = d.cheatNext || d.cheatEntries.length + 1;
      }
      if (d.settings) Object.assign(state.settings, d.settings);
      applyTheme(state.settings.theme||'pastel');
      save(); renderMachines(); renderStats();
      alert('Import successful!');
    } catch(err) { alert('Error: invalid JSON file'); }
  };
  reader.readAsText(file); input.value = '';
}

// ── AD lab ────────────────────────────────────────────────────────────────────
function renderADLab() {
  const all  = allADTech();
  const done = all.filter(a => state.adChecks[a.id]).length;

  document.getElementById('ad-progress').innerHTML =
    `${done} / ${all.length} techniques practiced &nbsp;<span style="color:var(--px-text2);font-size:7px">(+${done*AD_TECH_XP} XP)</span>`;

  document.getElementById('ad-lab-grid').innerHTML = all.map(a => {
    const checked  = !!state.adChecks[a.id];
    const expanded = state.expandedAD === a.id;
    const isCustom = !!a.custom;

    return `<div class="ad-card ${isCustom?'ad-card-custom':''}">
      <div class="ad-header">
        <div class="ad-check ${checked?'checked':''}"
             onclick="toggleADCheck('${a.id}');event.stopPropagation()">${checked?'✓':''}</div>
        <div style="flex:1" onclick="toggleAD('${a.id}')">
          <div class="ad-title">${escHtml(a.name)}${isCustom?'<span class="custom-badge">[custom]</span>':''}</div>
          <div class="ad-desc">${escHtml(a.desc)}</div>
        </div>
        <div style="display:flex;align-items:center;gap:6px;flex-shrink:0">
          ${isCustom?`<button class="px-btn small" onclick="openEditADTech('${a.id}');event.stopPropagation()">edit</button>`:''}
          <span style="font-size:10px;color:var(--px-text2)" onclick="toggleAD('${a.id}')">${expanded?'▲':'▼'}</span>
        </div>
      </div>
      <div class="ad-body ${expanded?'open':''}">
        <div class="cheat-snippet">${escHtml(a.cmd)}</div>
      </div>
    </div>`;
  }).join('');
}

function toggleADCheck(id) {
  state.adChecks[id] = !state.adChecks[id];
  save(); renderADLab(); renderStats();
}

function toggleAD(id) {
  state.expandedAD = state.expandedAD===id ? null : id;
  renderADLab();
}

// ── add / edit / delete custom AD techniques ──────────────────────────────────
function openAddADTech()     { openADTechModal(null); }
function openEditADTech(id)  {
  const a = state.customADTech.find(a=>a.id===id);
  if (a) openADTechModal(a);
}

function openADTechModal(a) {
  document.getElementById('adtech-overlay').style.display = 'flex';
  document.getElementById('adtech-modal-title').textContent = a ? 'edit technique' : 'add technique';
  document.getElementById('adtech-id').value   = a ? a.id   : '';
  document.getElementById('adtech-name').value = a ? a.name : '';
  document.getElementById('adtech-desc').value = a ? a.desc : '';
  document.getElementById('adtech-cmd').value  = a ? a.cmd  : '';
  document.getElementById('adtech-delete-btn').style.display = a ? 'block' : 'none';
}

function closeADTechModal() {
  document.getElementById('adtech-overlay').style.display = 'none';
}

function saveADTechModal() {
  const id   = document.getElementById('adtech-id').value;
  const name = document.getElementById('adtech-name').value.trim();
  const desc = document.getElementById('adtech-desc').value.trim();
  const cmd  = document.getElementById('adtech-cmd').value;

  if (!name) { alert('name is required'); return; }

  if (id) {
    const a = state.customADTech.find(a=>a.id===id);
    if (a) Object.assign(a, { name, desc, cmd });
  } else {
    state.customADTech.push({ id:'at-'+Date.now(), name, desc, cmd, custom:true });
  }

  save(); closeADTechModal(); renderADLab();
}

function deleteADTechModal() {
  const id = document.getElementById('adtech-id').value;
  if (!id || !confirm('delete this technique?')) return;
  state.customADTech = state.customADTech.filter(a=>a.id!==id);
  delete state.adChecks[id];
  save(); closeADTechModal(); renderADLab(); renderStats();
}

// ── settings ──────────────────────────────────────────────────────────────────
function renderSettings() {
  document.getElementById('settings-username').value = state.settings.userName || '';
  document.getElementById('settings-goaldate').value = state.settings.goalDate || '';
  document.getElementById('theme-swatches').innerHTML = Object.entries(THEMES).map(([key, th]) =>
    `<div class="theme-swatch ${state.settings.theme===key?'active':''}"
          style="background:${th.swatch}" title="${th.label}"
          onclick="selectTheme('${key}')"></div>`
  ).join('');
}

function saveSettings() {
  state.settings.userName = document.getElementById('settings-username').value.trim();
  state.settings.goalDate = document.getElementById('settings-goaldate').value;
  save(); renderStats(); updateGreeting();
}

function selectTheme(name) {
  state.settings.theme = name;
  applyTheme(name); save(); renderSettings();
}

const MAEVE_QUOTES = [
  'these violent delights have violent ends.',
  'I know what I want. do you?',
  'I\'m not afraid of the maze.',
  'time to learn the rules — then break them.',
  'every system has a weakness. find it.',
];

function updateGreeting() {
  const el = document.getElementById('header-sub');
  if (!el) return;
  if (state.settings.userName) {
    el.textContent = `welcome back, ${state.settings.userName} — ${MAEVE_QUOTES[Math.floor(Math.random()*MAEVE_QUOTES.length)]}`;
  } else {
    el.textContent = 'your oscp companion // track · root · level up';
  }
}

// ── init ──────────────────────────────────────────────────────────────────────
if (typeof marked !== 'undefined') marked.setOptions({ breaks: true, gfm: true });

applyTheme(state.settings.theme || 'pastel');
updateGreeting();
renderMachines();
renderStats();

document.addEventListener('click', e => {
  const wrap = document.getElementById('tag-drop-wrap');
  if (wrap && !wrap.contains(e.target)) wrap.classList.remove('open');
});
