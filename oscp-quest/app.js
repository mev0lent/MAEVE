'use strict';

// ── state ─────────────────────────────────────────────────────────────────────
let state = {
  statuses:      {},
  notes:         {},
  writeups:      {},
  rootedDates:   {},
  pomodoro:      null,
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
      if (p.rootedDates)    state.rootedDates    = p.rootedDates;
      if (p.pomodoro)       state.pomodoro       = p.pomodoro;
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
      rootedDates: state.rootedDates,
      pomodoro: state.pomodoro,
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
  const names = ['machines','skills','cheatsheet','adlab','timer','settings'];
  document.querySelectorAll('.tab').forEach((el, i) =>
    el.classList.toggle('active', names[i] === t)
  );
  document.querySelectorAll('.panel').forEach(el => el.classList.remove('active'));
  document.getElementById('panel-' + t).classList.add('active');
  if (t === 'skills')     renderSkills();
  if (t === 'cheatsheet') renderCheatsheet();
  if (t === 'adlab')      renderADLab();
  if (t === 'timer')      renderPomodoro();
  if (t === 'settings')   renderSettings();
}

// ── machines ──────────────────────────────────────────────────────────────────
function cycleStatus(id) {
  const cur  = state.statuses[id] || 'todo';
  const next = cur==='todo'?'progress':cur==='progress'?'rooted':'todo';
  state.statuses[id] = next;
  if (next === 'rooted' && !state.rootedDates[id])
    state.rootedDates[id] = new Date().toISOString().slice(0, 10);
  save(); renderMachines(); renderStats(); renderCalendar();
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
    rootedDates:state.rootedDates,
    pomodoro:state.pomodoro,
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
      if (d.rootedDates)    state.rootedDates    = d.rootedDates;
      if (d.pomodoro)       state.pomodoro       = d.pomodoro;
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
  const quote  = MAEVE_QUOTES[Math.floor(Math.random() * MAEVE_QUOTES.length)];
  const prefix = state.settings.userName ? `welcome back, ${state.settings.userName} — ` : '';
  el.textContent = prefix + quote;
}

// ── pomodoro timer ────────────────────────────────────────────────────────────
let _pomoInterval = null;

function _pomoState() {
  if (!state.pomodoro) {
    state.pomodoro = {
      sessions: [],
      settings: { work: 25, shortBreak: 5, longBreak: 15 },
      timer: {
        phase: 'work', remaining: 25 * 60, running: false,
        startedAt: null, sessionCount: 0,
        currentMachineId: null, currentMachineName: null,
        sessionStartedAt: null,
      },
    };
  }
  return state.pomodoro;
}

function _phaseSecs(phase) {
  const s = _pomoState().settings;
  if (phase === 'shortBreak') return s.shortBreak * 60;
  if (phase === 'longBreak')  return s.longBreak  * 60;
  return s.work * 60;
}

function _fmt(secs) {
  return String(Math.floor(secs / 60)).padStart(2,'0') + ':' + String(secs % 60).padStart(2,'0');
}

function _pomoFlash() {
  const el = document.getElementById('pomo-display');
  if (!el) return;
  el.classList.add('flash');
  setTimeout(() => { el.classList.remove('flash'); renderPomodoro(); }, 900);
}

function _pomoNotify(msg) {
  _pomoFlash();
  if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
    new Notification('MAEVE // timer', { body: msg });
  }
}

function _pomoTick() {
  const p = _pomoState(); const t = p.timer;
  if (!t.running) return;
  t.remaining = Math.max(0, t.remaining - 1);
  if (t.remaining <= 0) {
    if (t.phase === 'work') {
      _pomoRecordSession();
      t.sessionCount = (t.sessionCount + 1) % 4;
      t.phase     = t.sessionCount === 0 ? 'longBreak' : 'shortBreak';
      t.remaining = _phaseSecs(t.phase);
      t.running   = false; t.startedAt = null; t.sessionStartedAt = null;
      save(); renderPomodoro(); renderCalendar();
      _pomoNotify('work done! take a break.');
    } else {
      t.phase = 'work'; t.remaining = _phaseSecs('work');
      t.running = false; t.startedAt = null;
      save(); renderPomodoro();
      _pomoNotify('break over — back to it!');
    }
    clearInterval(_pomoInterval); _pomoInterval = null;
  } else {
    _updateDisplayOnly();
    if (t.remaining % 30 === 0) save();
  }
}

function _updateDisplayOnly() {
  const t = _pomoState().timer;
  const el = document.getElementById('pomo-display');
  if (el && !el.classList.contains('flash')) el.textContent = _fmt(t.remaining);
  const btn = document.getElementById('pomo-btn-start');
  if (btn) btn.textContent = t.running ? '⏸ pause' : '▶ start';
}

function _pomoRecordSession() {
  const p = _pomoState(); const t = p.timer;
  p.sessions.push({
    id:          Date.now(),
    type:        'work',
    machineId:   t.currentMachineId   || null,
    machineName: t.currentMachineName || null,
    startedAt:   t.sessionStartedAt   || new Date().toISOString(),
    endedAt:     new Date().toISOString(),
    duration:    p.settings.work,
    completed:   true,
  });
}

// ── public API ────────────────────────────────────────────────────────────────
function pomodoroInit() {
  const p = _pomoState(); const t = p.timer;
  // restore settings into config inputs (if DOM exists yet)
  const cfgW = document.getElementById('pomo-cfg-work');
  const cfgS = document.getElementById('pomo-cfg-short');
  const cfgL = document.getElementById('pomo-cfg-long');
  if (cfgW) cfgW.value = p.settings.work;
  if (cfgS) cfgS.value = p.settings.shortBreak;
  if (cfgL) cfgL.value = p.settings.longBreak;

  if (t.running && t.startedAt) {
    const elapsed = Math.floor((Date.now() - t.startedAt) / 1000);
    t.remaining = Math.max(0, t.remaining - elapsed);
    t.startedAt = Date.now();
    if (t.remaining <= 0) {
      t.running = false; t.startedAt = null;
      save();
    } else {
      if (_pomoInterval) clearInterval(_pomoInterval);
      _pomoInterval = setInterval(_pomoTick, 1000);
    }
  }
}

function pomodoroStart() {
  const t = _pomoState().timer;
  if (t.running) {
    clearInterval(_pomoInterval); _pomoInterval = null;
    const elapsed = Math.floor((Date.now() - t.startedAt) / 1000);
    t.remaining = Math.max(0, t.remaining - elapsed);
    t.running = false; t.startedAt = null;
    save(); renderPomodoro();
  } else {
    if (t.phase === 'work' && !t.sessionStartedAt)
      t.sessionStartedAt = new Date().toISOString();
    if (typeof Notification !== 'undefined' && Notification.permission === 'default')
      Notification.requestPermission();
    t.running = true; t.startedAt = Date.now();
    if (_pomoInterval) clearInterval(_pomoInterval);
    _pomoInterval = setInterval(_pomoTick, 1000);
    save(); renderPomodoro();
  }
}

function pomodoroReset() {
  const t = _pomoState().timer;
  clearInterval(_pomoInterval); _pomoInterval = null;
  t.remaining = _phaseSecs(t.phase);
  t.running = false; t.startedAt = null; t.sessionStartedAt = null;
  save(); renderPomodoro();
}

function pomodoroSkip() {
  const t = _pomoState().timer;
  clearInterval(_pomoInterval); _pomoInterval = null;
  if (t.phase === 'work') {
    t.sessionCount = (t.sessionCount + 1) % 4;
    t.phase = t.sessionCount === 0 ? 'longBreak' : 'shortBreak';
  } else {
    t.phase = 'work';
  }
  t.remaining = _phaseSecs(t.phase);
  t.running = false; t.startedAt = null; t.sessionStartedAt = null;
  save(); renderPomodoro();
}

function pomodoroSetMachine(id) {
  const t = _pomoState().timer;
  t.currentMachineId = id || null;
  if (id) {
    const m = allMachines().find(m => m.id === id);
    t.currentMachineName = m ? m.name : null;
  } else {
    t.currentMachineName = null;
  }
  save();
}

function pomodoroUpdateSettings() {
  const p = _pomoState();
  const w = parseInt(document.getElementById('pomo-cfg-work')?.value)  || 25;
  const s = parseInt(document.getElementById('pomo-cfg-short')?.value) || 5;
  const l = parseInt(document.getElementById('pomo-cfg-long')?.value)  || 15;
  p.settings = { work: w, shortBreak: s, longBreak: l };
  if (!_pomoState().timer.running) {
    const t = _pomoState().timer;
    t.remaining = _phaseSecs(t.phase);
  }
  save(); renderPomodoro();
}

function renderPomodoro() {
  const p = _pomoState(); const t = p.timer;

  const displayEl = document.getElementById('pomo-display');
  const phaseEl   = document.getElementById('pomo-phase');
  const startBtn  = document.getElementById('pomo-btn-start');
  if (!displayEl) return;

  if (!displayEl.classList.contains('flash')) displayEl.textContent = _fmt(t.remaining);

  const cls = t.running
    ? (t.phase === 'work' ? 'running' : 'on-break')
    : '';
  displayEl.className = 'pomo-display' + (cls ? ' ' + cls : '');

  const phaseNames = { work:'work session', shortBreak:'short break', longBreak:'long break — stretch!' };
  if (phaseEl) phaseEl.textContent = phaseNames[t.phase] || t.phase;
  if (startBtn) startBtn.textContent = t.running ? '⏸ pause' : '▶ start';

  const dotsEl = document.getElementById('pomo-dots');
  if (dotsEl) dotsEl.innerHTML = [0,1,2,3].map(i =>
    `<div class="pomo-dot ${i < t.sessionCount ? 'filled' : ''}"></div>`
  ).join('');

  const sel = document.getElementById('pomo-machine-select');
  if (sel) {
    const candidates = allMachines().filter(m => (state.statuses[m.id]||'todo') !== 'rooted');
    sel.innerHTML = '<option value="">— free session —</option>' +
      candidates.map(m => `<option value="${m.id}"${t.currentMachineId===m.id?' selected':''}>${escHtml(m.name)}</option>`).join('');
  }

  const cfgW = document.getElementById('pomo-cfg-work');
  const cfgS = document.getElementById('pomo-cfg-short');
  const cfgL = document.getElementById('pomo-cfg-long');
  if (cfgW && !cfgW.matches(':focus')) cfgW.value = p.settings.work;
  if (cfgS && !cfgS.matches(':focus')) cfgS.value = p.settings.shortBreak;
  if (cfgL && !cfgL.matches(':focus')) cfgL.value = p.settings.longBreak;

  _renderPomodoroStats();
}

function _renderPomodoroStats() {
  const p       = _pomoState();
  const todayEl = document.getElementById('pomo-today-stats');
  const logEl   = document.getElementById('pomo-session-log');
  if (!todayEl || !logEl) return;

  const today    = new Date().toISOString().slice(0, 10);
  const allWork  = p.sessions.filter(s => s.type === 'work' && s.completed);
  const todayW   = allWork.filter(s => s.startedAt?.slice(0, 10) === today);
  const todayMin = todayW.reduce((n, s) => n + s.duration, 0);
  const todayMac = new Set(todayW.map(s => s.machineId).filter(Boolean)).size;
  const allMin   = allWork.reduce((n, s) => n + s.duration, 0);
  const allHrs   = (allMin / 60).toFixed(1);

  todayEl.innerHTML = `
    <div class="pomo-stat-card"><span class="pomo-stat-num">${todayW.length}</span><span class="pomo-stat-label">today</span></div>
    <div class="pomo-stat-card"><span class="pomo-stat-num">${todayMin}m</span><span class="pomo-stat-label">focused</span></div>
    <div class="pomo-stat-card"><span class="pomo-stat-num">${allHrs}h</span><span class="pomo-stat-label">all time</span></div>
  `;

  const recent = allWork.slice().reverse().slice(0, 30);
  if (!recent.length) {
    logEl.innerHTML = '<div class="empty-state">no sessions yet<br/>start your first pomodoro!</div>';
    return;
  }
  logEl.innerHTML = recent.map(s => {
    const dt = s.startedAt ? s.startedAt.slice(0, 10) + ' ' + s.startedAt.slice(11, 16) : '—';
    return `<div class="pomo-session-row">
      <span class="pomo-s-time">${dt}</span>
      <span class="pomo-s-machine">${s.machineName ? escHtml(s.machineName) : '— free —'}</span>
      <span class="pomo-s-dur">${s.duration}m</span>
    </div>`;
  }).join('');
}

// ── progress calendar ─────────────────────────────────────────────────────────
function renderCalendar() {
  const el = document.getElementById('heatmap');
  if (!el) return;

  const counts = {};
  Object.values(state.rootedDates).forEach(d => { counts[d] = (counts[d] || 0) + 1; });
  if (state.pomodoro) {
    state.pomodoro.sessions.forEach(s => {
      if (s.type === 'work' && s.completed && s.startedAt) {
        const d = s.startedAt.slice(0, 10);
        counts[d] = (counts[d] || 0) + 1;
      }
    });
  }

  const today = new Date(); today.setHours(0, 0, 0, 0);

  // exactly 91 cells = 13 columns × 7 rows, newest cell = today
  const cells = [];
  for (let i = 90; i >= 0; i--) {
    const d = new Date(today); d.setDate(d.getDate() - i);
    const ds = d.toISOString().slice(0, 10);
    cells.push({ ds, count: counts[ds] || 0 });
  }

  const colorFor = count => {
    if (count === 0) return 'var(--px-bg2)';
    if (count === 1) return 'var(--px-purple)';
    if (count === 2) return '#8844d8';
    return '#5c1faa';
  };

  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  el.innerHTML = weeks.map(week =>
    `<div class="heatmap-week">${week.map(c =>
      `<div class="cal-cell" style="background:${colorFor(c.count)}"
            title="${c.ds}${c.count ? ' // ' + c.count + ' rooted' : ''}"></div>`
    ).join('')}</div>`
  ).join('');
}

// ── random machine picker ─────────────────────────────────────────────────────
let _pickedMachine = null;

function openPicker() {
  const eligible = allMachines().filter(m => (state.statuses[m.id] || 'todo') !== 'rooted');
  if (!eligible.length) { alert('all machines rooted! legend.'); return; }
  document.getElementById('picker-overlay').style.display = 'flex';
  spinPicker();
}

function closePicker() {
  document.getElementById('picker-overlay').style.display = 'none';
}

function spinPicker() {
  const eligible = allMachines().filter(m => (state.statuses[m.id] || 'todo') !== 'rooted');
  if (!eligible.length) return;
  _pickedMachine = eligible[Math.floor(Math.random() * eligible.length)];

  const slotEl   = document.getElementById('picker-slot');
  const resultEl = document.getElementById('picker-result');
  const gotoBtn  = document.getElementById('picker-goto');

  resultEl.style.display = 'none';
  gotoBtn.style.display  = 'none';
  slotEl.classList.add('spinning');

  let i = 0;
  const iv = setInterval(() => {
    slotEl.textContent = eligible[i++ % eligible.length].name;
  }, 55);

  setTimeout(() => {
    clearInterval(iv);
    slotEl.classList.remove('spinning');
    slotEl.textContent = _pickedMachine.name;
    document.getElementById('picker-meta').textContent =
      _pickedMachine.platform + ' // ' + _pickedMachine.os + ' // ' + _pickedMachine.diff;
    resultEl.style.display = 'block';
    gotoBtn.style.display  = 'inline-block';
  }, 1400);
}

function gotoPickedMachine() {
  if (!_pickedMachine) return;
  closePicker();
  ['filter-platform','filter-os','filter-diff','filter-status'].forEach(id =>
    document.getElementById(id).value = ''
  );
  document.getElementById('filter-search').value = '';
  switchTab('machines');
  renderMachines();
  setTimeout(() => {
    const row = document.getElementById('row-' + _pickedMachine.id);
    if (row) row.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 80);
}

// ── full-text search ──────────────────────────────────────────────────────────
function toggleSearch() {
  const input = document.getElementById('global-search');
  const btn   = document.getElementById('search-toggle-btn');
  const open  = input.style.display === 'none';
  input.style.display = open ? 'block' : 'none';
  btn.textContent = open ? '✕ close' : '⌕ search';
  if (!open) {
    input.value = '';
    document.getElementById('search-results').style.display = 'none';
  } else {
    input.focus();
  }
}

function getSnippet(text, q) {
  const idx = text.toLowerCase().indexOf(q);
  if (idx === -1) return text.slice(0, 90);
  const s = Math.max(0, idx - 28), e = Math.min(text.length, idx + q.length + 52);
  return (s > 0 ? '…' : '') + text.slice(s, e) + (e < text.length ? '…' : '');
}

function hlMatch(str, q) {
  const re = new RegExp('(' + q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
  return str.replace(re, '<mark class="search-mark">$1</mark>');
}

function runSearch(raw) {
  const resultsEl = document.getElementById('search-results');
  const q = raw.trim().toLowerCase();
  if (!q) { resultsEl.style.display = 'none'; return; }

  const hits = [];

  allMachines().forEach(m => {
    const inName  = m.name.toLowerCase().includes(q);
    const inTags  = m.tags.join(' ').toLowerCase().includes(q);
    const inNote  = (state.notes[m.id] || '').toLowerCase().includes(q);
    if (!inName && !inTags && !inNote) return;
    hits.push({
      type: 'machine', id: m.id, title: m.name,
      sub: m.platform + ' // ' + m.diff,
      snippet: inNote ? getSnippet(state.notes[m.id], q) : (inTags ? m.tags.join(', ') : ''),
    });
  });

  state.cheatEntries.forEach(e => {
    const inTitle   = e.title.toLowerCase().includes(q);
    const inContent = e.content.toLowerCase().includes(q);
    if (!inTitle && !inContent) return;
    hits.push({
      type: 'cheat', id: String(e.id), title: e.title,
      sub: 'cheatsheet // ' + e.tags.join(', '),
      snippet: inContent ? getSnippet(e.content, q) : '',
    });
  });

  allADTech().forEach(a => {
    const inName = a.name.toLowerCase().includes(q);
    const inDesc = a.desc.toLowerCase().includes(q);
    const inCmd  = a.cmd.toLowerCase().includes(q);
    if (!inName && !inDesc && !inCmd) return;
    hits.push({
      type: 'adtech', id: a.id, title: a.name,
      sub: 'AD lab',
      snippet: inDesc ? a.desc : (inCmd ? getSnippet(a.cmd, q) : ''),
    });
  });

  if (!hits.length) {
    resultsEl.innerHTML = `<div class="search-empty">no results for "${escHtml(raw)}"</div>`;
    resultsEl.style.display = 'block';
    return;
  }

  resultsEl.innerHTML = hits.slice(0, 12).map(r =>
    `<div class="search-result-item" onclick="jumpToResult('${r.type}','${escHtml(r.id)}')">
       <div class="search-result-title">${hlMatch(escHtml(r.title), q)}</div>
       <div class="search-result-sub">${escHtml(r.sub)}</div>
       ${r.snippet ? `<div class="search-result-snippet">${hlMatch(escHtml(r.snippet), q)}</div>` : ''}
     </div>`
  ).join('');
  resultsEl.style.display = 'block';
}

function jumpToResult(type, rawId) {
  document.getElementById('search-results').style.display = 'none';
  document.getElementById('global-search').value = '';
  document.getElementById('search-toggle-btn').textContent = '⌕ search';
  document.getElementById('global-search').style.display = 'none';

  if (type === 'machine') {
    ['filter-platform','filter-os','filter-diff','filter-status'].forEach(id =>
      document.getElementById(id).value = ''
    );
    document.getElementById('filter-search').value = '';
    switchTab('machines'); renderMachines();
    setTimeout(() => {
      const row = document.getElementById('row-' + rawId);
      if (row) row.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 80);
  } else if (type === 'cheat') {
    const id = isNaN(rawId) ? rawId : Number(rawId);
    state.expandedCheat = id;
    switchTab('cheatsheet');
    setTimeout(() => {
      const el = document.querySelector(`[data-cheat="${id}"]`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 80);
  } else if (type === 'adtech') {
    state.expandedAD = rawId;
    switchTab('adlab');
  }
}

// ── init ──────────────────────────────────────────────────────────────────────
if (typeof marked !== 'undefined') marked.setOptions({ breaks: true, gfm: true });

applyTheme(state.settings.theme || 'pastel');
updateGreeting();
renderMachines();
renderStats();
renderCalendar();
pomodoroInit();

document.addEventListener('click', e => {
  const tagWrap    = document.getElementById('tag-drop-wrap');
  if (tagWrap && !tagWrap.contains(e.target)) tagWrap.classList.remove('open');

  const searchWrap = document.getElementById('search-wrap');
  const resultsEl  = document.getElementById('search-results');
  if (searchWrap && resultsEl && !searchWrap.contains(e.target) && !resultsEl.contains(e.target))
    resultsEl.style.display = 'none';
});
