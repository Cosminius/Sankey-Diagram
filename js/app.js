const inputEl = document.getElementById('input');
const errBox = document.getElementById('err');
const emptyEl = document.getElementById('empty');
const svg = d3.select('#diagram');
const savedListEl = document.getElementById('saved-list');
const statusEl = document.getElementById('save-status');
const dimInfoEl = document.getElementById('dim-info');
const statNodesEl = document.getElementById('stat-nodes');
const statLinksEl = document.getElementById('stat-links');
const statTotalEl = document.getElementById('stat-total');

const state = loadStorage();

const DRAFT_DEBOUNCE_MS = 400;
const STATUS_FADE_MS = 1800;

let statusTimer;
function showStatus(msg) {
  statusEl.textContent = msg;
  statusEl.style.opacity = '1';
  clearTimeout(statusTimer);
  statusTimer = setTimeout(() => { statusEl.style.opacity = '0'; }, STATUS_FADE_MS);
}

let draftTimer;
function scheduleDraftSave() {
  clearTimeout(draftTimer);
  draftTimer = setTimeout(() => {
    state.draft = inputEl.value;
    writeStorage(state);
  }, DRAFT_DEBOUNCE_MS);
}

function clearActivePreset() {
  document.querySelectorAll('.preset-pill').forEach(b => b.classList.remove('active'));
}

function update() {
  const { nodes, links, errors } = parse(inputEl.value);

  statNodesEl.textContent = nodes.length;
  statLinksEl.textContent = links.length;
  statTotalEl.textContent = links.reduce((s, l) => s + l.value, 0).toFixed(0);
  errBox.textContent = errors.length ? errors[0] : '';

  svg.selectAll('*').remove();

  if (nodes.length === 0 || links.length === 0) {
    emptyEl.style.display = 'flex';
    return;
  }
  emptyEl.style.display = 'none';

  const { width, height } = svg.node().getBoundingClientRect();
  dimInfoEl.textContent = `${width.toFixed(0)} × ${height.toFixed(0)}`;

  let graph;
  try {
    graph = computeLayout({ nodes, links, width, height });
  } catch (e) {
    errBox.textContent = `Layout error: ${e.message} (cycle in graph?)`;
    return;
  }

  renderDiagram(svg, graph, width);
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

function loadSave(name) {
  inputEl.value = state.saves[name];
  state.draft = state.saves[name];
  writeStorage(state);
  clearActivePreset();
  update();
  showStatus(`loaded "${name}"`);
}

function deleteSave(name) {
  if (!confirm(`Delete "${name}"?`)) return;
  delete state.saves[name];
  writeStorage(state);
  renderSavedList();
  showStatus(`deleted "${name}"`);
}

function renderSavedList() {
  const names = Object.keys(state.saves).sort();
  savedListEl.innerHTML = '';

  if (names.length === 0) {
    const placeholder = document.createElement('div');
    placeholder.className = 'saved-empty';
    placeholder.textContent = 'no saves yet — click "Save as..."';
    savedListEl.appendChild(placeholder);
    return;
  }

  for (const name of names) {
    const row = document.createElement('div');
    row.className = 'saved-item';
    row.innerHTML = `
      <span class="name" title="${escapeHtml(name)}">${escapeHtml(name)}</span>
      <button data-action="load">Load</button>
      <button data-action="del" class="del">×</button>
    `;
    row.querySelector('[data-action="load"]').addEventListener('click', () => loadSave(name));
    row.querySelector('[data-action="del"]').addEventListener('click', () => deleteSave(name));
    savedListEl.appendChild(row);
  }
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function exportSvg() {
  const svgEl = document.getElementById('diagram');
  const clone = svgEl.cloneNode(true);
  const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  bg.setAttribute('width', '100%');
  bg.setAttribute('height', '100%');
  bg.setAttribute('fill', '#f4efe6');
  clone.insertBefore(bg, clone.firstChild);
  const xml = new XMLSerializer().serializeToString(clone);
  downloadBlob(new Blob([xml], { type: 'image/svg+xml' }), 'sankey.svg');
}

function exportSource() {
  downloadBlob(new Blob([inputEl.value], { type: 'text/plain' }), 'sankey-source.txt');
}

function saveAs() {
  const name = prompt('Name this diagram:');
  if (!name || !name.trim()) return;
  const trimmed = name.trim();
  if (state.saves[trimmed] && !confirm(`"${trimmed}" already exists. Overwrite?`)) return;
  state.saves[trimmed] = inputEl.value;
  if (writeStorage(state)) {
    renderSavedList();
    showStatus(`saved "${trimmed}"`);
  }
}

function applyPreset(btn) {
  const name = btn.dataset.preset;
  if (!PRESETS[name]) return;
  inputEl.value = PRESETS[name];
  document.querySelectorAll('.preset-pill').forEach(b => b.classList.toggle('active', b === btn));
  state.draft = PRESETS[name];
  writeStorage(state);
  update();
}

function bindEvents() {
  inputEl.addEventListener('input', () => {
    update();
    scheduleDraftSave();
  });

  window.addEventListener('resize', update);

  document.querySelectorAll('.preset-pill').forEach(btn =>
    btn.addEventListener('click', () => applyPreset(btn))
  );

  document.getElementById('save-named').addEventListener('click', saveAs);
  document.getElementById('download-svg').addEventListener('click', exportSvg);
  document.getElementById('download-txt').addEventListener('click', exportSource);
}

function boot() {
  if (state.draft && state.draft.trim()) {
    inputEl.value = state.draft;
    clearActivePreset();
  } else {
    inputEl.value = PRESETS.budget;
  }

  bindEvents();
  renderSavedList();
  update();
}

boot();
