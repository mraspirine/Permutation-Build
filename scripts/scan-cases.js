// scan-cases.js v2 — inventory Permutation boards + case cells + fill status.
// Paste VERBATIM into use_figma / figma_execute (wrapped in a function → top-level return OK).
// Scope: set SCOPE_ID to the SECTION (or board) to scan — the script loads that node's page itself, so it
// works under use_figma, which starts every call on the file's first page with nothing selected.
// SCOPE_ID empty → current selection, else the whole current page. Returns inventory JSON.
// Node self-check at bottom: `node scripts/scan-cases.js` (runs when figma is undefined).
//
// v2:
// - CLICX board names (`G.03-01.B`) and loose labels (`Case #1 - Account sorting`) are now detected.
// - STRICT / LOOSE / INDEXED labels are reported separately — only strict labels are renumber-compatible.
//   INDEXED = `<g>.<n> | <name>` or `#<n>[.<m>] <name>` (PTP): those boards carry no "Case" word at all.
// - The label TEXT may live inside an INSTANCE (CLICX title block): climb ancestors to find the
//   cell that carries the permBuild pluginData.
// - designed = the cell holds something beside its caption and no longer holds the placeholder.
// - A board is found by its NAME, by its stamp, or by an attached `Permutation` connector that ends on it
//   (teams name boards freely: PTP `Guideline: Select Account`). `linkedFrom` tells which screen owns it.

const SCOPE_ID = "";  // e.g. "438:213330" — the section that holds the base and its sibling boards
const DETAIL = true; // false = per-board counts only. Use false under use_figma: its responses die around 20 KB.

const STRICT_RE = /^\s*Case\s*#?\s*(\d+)\s*$/;                     // renumber-compatible
const LOOSE_RE = /^\s*Case\s*#?\s*(\d+)\s*(?:[-–—:.]\s*(.+))?\s*$/s; // also "Case #1 - Name"
const INDEXED_RE = /^\s*(?:#\s*(\d+(?:\.\d+)*)\s+|(\d+\.\d+)\s*\|\s*)(.+?)\s*$/s; // PTP: "1.2 | Name" or "#2.1 Name" — no "Case" word
const byLabel = (a, b) => String(a).localeCompare(String(b), undefined, { numeric: true });

// Board-name forms seen on real team boards: colon `Permutation: X`, underscore `Permutation_X`,
// suffix `X Permutations` (NEXT), and CLICX state suffix `G.03-01.B` (.A = screen, .B/.C = boards).
// Type filter is load-bearing: a TITLE TEXT named "Permutation: X" must not count as a container.
const CONTAINER_TYPES = ['FRAME', 'SECTION', 'GROUP', 'COMPONENT', 'COMPONENT_SET', 'INSTANCE'];
function isContainerName(name) {
  return typeof name === 'string' &&
    (/^Permutation[:_]/i.test(name) || /\bPermutations?\s*$/i.test(name) ||
     /^[A-Z]{1,4}\.\d{1,3}-\d{1,3}\.[B-Z]$/.test(name));
}
function isContainer(node) {
  return !!node && CONTAINER_TYPES.indexOf(node.type) !== -1 && isContainerName(node.name);
}
// use_figma blocks plain pluginData → scaffold-kit writes sharedPluginData there. Read both.
function readPD(n, key) {
  try { const v = n.getPluginData && n.getPluginData(key); if (v) return v; } catch (e) {}
  try { const v = n.getSharedPluginData && n.getSharedPluginData('permBuild', key); if (v) return v; } catch (e) {}
  return '';
}
function hasBoardStamp(node) { return !!readPD(node, 'permBuildBoard'); }

function parseLabel(text) {
  if (typeof text !== 'string') return null;
  const i = text.match(INDEXED_RE);
  if (i) return { n: i[1] || i[2], name: i[3].trim(), strict: false, style: 'indexed' };
  const m = /^\s*Case/i.test(text) ? text.match(LOOSE_RE) : null;
  if (!m) return null;
  const strict = STRICT_RE.test(text);
  return { n: Number(m[1]), name: m[2] ? m[2].trim() : null, strict, style: strict ? 'strict' : 'loose' };
}
const isLabelText = text => parseLabel(text) !== null;

function findDupNumbers(nums) {
  const seen = new Set(), dup = new Set();
  nums.forEach(n => { if (n != null) { if (seen.has(n)) dup.add(n); seen.add(n); } });
  return [...dup].sort(byLabel);
}

// `linked`: Map(boardNode → [{id,name}] screens whose Permutation connector ends on it) — built by run()
function scanCases(roots, linked) {
  roots = roots || (figma.currentPage.selection.length ? figma.currentPage.selection : figma.currentPage.children);
  linked = linked || new Map();

  const containers = [];
  (function collect(n) {
    if (isContainer(n) || linked.has(n) || (CONTAINER_TYPES.indexOf(n.type) !== -1 && hasBoardStamp(n))) containers.push(n);
    else if ('children' in n) n.children.forEach(collect);
  })({ type: 'PAGE', name: '', children: roots });

  const isPlaceholder = frame =>
    'children' in frame && frame.findOne &&
    !!frame.findOne(x => x.type === 'TEXT' && /awaiting design/i.test(x.characters || ''));

  // designed = the cell holds something besides its caption that is not the placeholder. The caption is
  // the child that holds this cell's label; no height gate, because a component-level case holds a crop
  // (PTP `SOFCard_CASA` 390x108), not a screen.
  function isDesigned(cell, labelNode) {
    if (!('children' in cell)) return false;
    if (cell.children.some(isPlaceholder)) return false;       // still holds its empty slot → spec, whatever sits beside it
    const holdsLabel = k => k === labelNode || (k.findOne && !!k.findOne(x => x === labelNode));
    return cell.children.some(f =>
      (f.type === 'FRAME' || f.type === 'INSTANCE') && !holdsLabel(f) &&
      !isPlaceholder(f) && 'children' in f && f.children.length > 0);
  }

  function labelCount(n, cap) {
    let c = 0;
    (function w(x) {
      if (c >= cap) return;
      if (x.type === 'TEXT') { if (isLabelText(x.characters)) c++; }
      else if ('children' in x) x.children.forEach(w);
    })(n);
    return c;
  }

  // The label TEXT can be nested inside an INSTANCE (CLICX title block) — climb up to the node
  // that actually carries the permBuild stamp. Unstamped (team-made) board: the cell is the LARGEST
  // ancestor that still holds only this one label, i.e. the case column — the label's own wrapper
  // holds no screen, so stopping there reads every team board as 0 designed.
  function findCell(labelNode) {
    let p = labelNode.parent, hops = 0;
    while (p && hops < 6) {
      if (readPD(p, 'permBuild')) return p;
      p = p.parent; hops++;
    }
    let cell = labelNode.parent;
    while (cell && cell.parent && !isContainer(cell.parent) && labelCount(cell.parent, 2) === 1) cell = cell.parent;
    return cell;
  }

  function readCell(labelNode) {
    const cell = findCell(labelNode);
    let pd = null;
    try { pd = JSON.parse(readPD(cell, 'permBuild') || 'null'); } catch (e) {}
    const lab = parseLabel(labelNode.characters);
    const designed = pd && pd.status === 'designed' ? true : isDesigned(cell, labelNode);
    return {
      n: lab ? lab.n : null,
      label: labelNode.characters.split('\n')[0],
      nameFromLabel: lab ? lab.name : null,
      strict: lab ? lab.strict : false,
      style: lab ? lab.style : null,
      caseId: pd ? pd.caseId : null,
      tier: pd ? pd.tier : null,
      priority: pd ? pd.priority : null,
      status: designed ? 'designed' : (pd ? pd.status : 'unknown'),
      designed,
      baseNodeId: pd ? pd.baseNodeId : null,
    };
  }

  const out = containers.map(c => {
    let boardStamp = null;
    try { boardStamp = JSON.parse(readPD(c, 'permBuildBoard') || 'null'); } catch (e) {}
    const cases = [];
    (function walk(n) {
      // A group header can share the label grammar (PTP `#1 E-Saving Account`): its "cell" resolves to the
      // title instance itself — nothing sits beside the label — so it is not a case.
      if (n.type === 'TEXT' && isLabelText(n.characters)) { const c = findCell(n); if (c && c.type !== 'INSTANCE' && c.type !== 'TEXT') cases.push(readCell(n)); }
      if ('children' in n) n.children.forEach(walk);
    })(c);
    cases.sort((a, b) => byLabel(a.n, b.n));
    const row = { id: c.id, name: c.name, stamp: boardStamp, linkedFrom: linked.get(c) || [], count: cases.length, designed: cases.filter(x => x.designed).length, dupNumbers: findDupNumbers(cases.map(x => x.n)) };
    if (DETAIL) row.cases = cases;
    row._all = cases;
    return row;
  });

  // Case#N restarts on every board — duplicates only mean something INSIDE one board.
  // a node that is only a link target (no name, no stamp) and holds no case is not a board (`Other Logic` boxes)
  for (let i = out.length - 1; i >= 0; i--) if (!out[i].count && !out[i].stamp && !isContainerName(out[i].name)) out.splice(i, 1);
  const all = out.flatMap(c => c._all);
  out.forEach(c => { delete c._all; });
  const dup = [...new Set(out.flatMap(c => c.dupNumbers))].sort(byLabel);
  return {
    containers: out,
    counts: {
      containers: out.length,
      cases: all.length,
      designed: all.filter(x => x.designed).length,
      spec: all.filter(x => !x.designed).length,
      strictLabels: all.filter(x => x.strict).length,
      looseLabels: all.filter(x => x.style === 'loose').length,
      indexedLabels: all.filter(x => x.style === 'indexed').length,
      dupNumbers: dup,
      renumberCompatible: dup.length === 0 && all.length > 0 && all.every(x => x.strict),
    },
  };
}

// Resolve the scope and the Permutation links (async), then scan (sync).
async function run() {
  let roots = null;
  if (SCOPE_ID) {
    const scope = await figma.getNodeByIdAsync(SCOPE_ID);
    if (!scope) return { error: 'SCOPE_ID not found: ' + SCOPE_ID };
    let pg = scope; while (pg && pg.type !== 'PAGE') pg = pg.parent;
    if (pg && pg.loadAsync) await pg.loadAsync();
    roots = [scope];
  }
  const start = roots || (figma.currentPage.selection.length ? figma.currentPage.selection : figma.currentPage.children);
  const lines = [];
  (function find(n, d) { if (d > 3) return; if (n.type === 'CONNECTOR' && /permutation/i.test(n.name || '')) lines.push(n); else if ('children' in n) n.children.forEach(c => find(c, d + 1)); })({ children: start }, 0);
  const linked = new Map();
  for (const c of lines) {
    const e = c.connectorEnd && c.connectorEnd.endpointNodeId, s = c.connectorStart && c.connectorStart.endpointNodeId;
    if (!e) continue;
    let board = await figma.getNodeByIdAsync(e);
    while (board && board.parent && board.parent.type !== 'SECTION' && board.parent.type !== 'PAGE') board = board.parent;
    if (!board) continue;
    const from = s ? await figma.getNodeByIdAsync(s) : null;
    if (!linked.has(board)) linked.set(board, []);
    linked.get(board).push(from ? { id: from.id, name: from.name } : { id: null, name: 'loose' });
  }
  return scanCases(roots, linked);
}
if (typeof figma !== 'undefined') return run();

// --- node self-check ---
const A = (c, m) => { if (!c) throw new Error('FAIL: ' + m); };
// strict / loose labels
A(STRICT_RE.test('Case#1') && STRICT_RE.test('Case #12') && STRICT_RE.test('Case 3'), 'strict forms');
A(!STRICT_RE.test('Case #1 - MFOA') && !STRICT_RE.test('Cases'), 'strict rejects');
let p = parseLabel('Case #1 - Account sorting');
A(p && p.n === 1 && p.name === 'Account sorting' && p.strict === false, 'loose CLICX label');
p = parseLabel('Case#7');
A(p && p.n === 7 && p.name === null && p.strict === true, 'strict parse');
A(parseLabel('Cases') === null && parseLabel('Case study') === null, 'loose rejects');
// container names — all real forms, near-misses rejected
A(isContainerName('Permutation: Loan Amount'), 'colon');
A(isContainerName('Permutation_1.2.3 Select Top-Up'), 'underscore');
A(isContainerName('Loan Amount Permutations'), 'suffix');
A(isContainerName('G.03-01.B') && isContainerName('C.01-01.C'), 'CLICX .B/.C board');
A(!isContainerName('G.03-01.A | my asset / no pocket'), 'reject CLICX .A screen');
A(!isContainerName('G.03-01') && !isContainerName('Permutations Guide'), 'reject near-misses');
A(!isContainer({ type: 'TEXT', name: 'Permutation: X' }), 'reject TEXT title node');
A(isContainer({ type: 'FRAME', name: 'G.03-01.B' }), 'FRAME CLICX board');
// dup detection
A(JSON.stringify(findDupNumbers([1, 2, 2, 3, 3, 3])) === '[2,3]', 'dup detection');
// scanCases() end to end on a mocked page: two UNSTAMPED team-style boards (NEXT anatomy),
// each numbered from Case#1, one designed screen + one empty slot per board
const N = (type, name, children, extra) => {
  const n = Object.assign({ type, name, children: children || [], height: 0 }, extra || {});
  n.children.forEach(c => { c.parent = n; });
  n.findOne = pred => {
    let hit = null;
    (function w(x) { (x.children || []).forEach(c => { if (hit) return; if (pred(c)) hit = c; else w(c); }); })(n);
    return hit;
  };
  return n;
};
const T = s => ({ type: 'TEXT', name: s, characters: s });
const col = (num, slot) => N('FRAME', 'case', [N('FRAME', 'Description', [N('FRAME', 'case', [T('Case#' + num), T('Name')])]), slot]);
const designedScreen = () => N('INSTANCE', 'screen', [T('content')], { height: 844 });
const emptySlot = () => N('FRAME', 'placeholder', [T('◻︎ Case Spec — awaiting design')], { height: 844 });
const teamBoard = name => N('FRAME', name, [N('FRAME', 'case', [T('Group Permutations'),
  N('FRAME', 'case', [col(1, designedScreen()), col(2, emptySlot())])])]);
globalThis.figma = { currentPage: { selection: [], children: [teamBoard('Permutation_A'), teamBoard('Permutation_B')] } };
const scan = scanCases();
delete globalThis.figma;
A(scan.counts.cases === 4 && scan.counts.designed === 2, 'unstamped team board: designed screens counted, got ' + scan.counts.designed + '/4');
A(scan.counts.dupNumbers.length === 0 && scan.counts.renumberCompatible === true, 'numbering restarts per board: no cross-board dup alarm, got ' + JSON.stringify(scan.counts.dupNumbers));
// indexed labels (PTP): `<g>.<n> | <name>` — no "Case" word at all
p = parseLabel('1.2 | Account type exceed limited space ');
A(p && p.n === '1.2' && p.name === 'Account type exceed limited space' && p.style === 'indexed' && p.strict === false, 'indexed PTP label');
A(parseLabel('1 | Set Default name') === null && parseLabel('v1.2 | x') === null, 'group header / near-miss are not case labels');
const icol = (lab, slot) => N('FRAME', 'Case', [N('INSTANCE', 'Title Block', [T(lab)]), slot]);
globalThis.figma = { currentPage: { selection: [], children: [N('FRAME', 'Permutation: Pg_Setting', [N('FRAME', 'Contrainer', [N('FRAME', 'Case',
  [icol('1.1 | Default', designedScreen()), icol('1.2 | Long Name', emptySlot()), icol('2.1 | Link 1 Acc', designedScreen())])])])] } };
const iscan = scanCases();
delete globalThis.figma;
A(iscan.counts.cases === 3 && iscan.counts.designed === 2 && iscan.counts.indexedLabels === 3, 'indexed board: 3 cases, 2 designed, got ' + JSON.stringify(iscan.counts));
A(iscan.counts.renumberCompatible === false && iscan.counts.dupNumbers.length === 0, 'indexed labels are not renumber-compatible, no dups');
// PTP dialect B: `#1 Name` / `#2.1 Name`; the group header `#1 Group` uses the SAME grammar and must not count as a case
p = parseLabel('#2.1 Savings account limit unreached');
A(p && p.n === '2.1' && p.name === 'Savings account limit unreached' && p.style === 'indexed', 'hash-indexed PTP label');
A(parseLabel('#1  Unable to link account').n === '1' && parseLabel('# hashtag') === null && parseLabel('1 Name') === null, 'hash-indexed edge cases');
const hcell = (lab, slot) => N('FRAME', 'Frame 1000004022', [N('INSTANCE', 'Title Block', [N('FRAME', 'Content', [T(lab)])]), slot]);
globalThis.figma = { currentPage: { selection: [], children: [N('FRAME', 'Permutation:', [N('FRAME', 'Frame 1000004026', [
  N('INSTANCE', 'Title Block', [N('FRAME', 'Content', [T('#1 E-Saving Account')])]),
  N('FRAME', 'Frame 1000004025', [hcell('#1 No E-Saving (PMT)', designedScreen()), hcell('#2 Have E-Saving (PMT)', designedScreen())])])])] } };
const hscan = scanCases();
delete globalThis.figma;
A(hscan.counts.cases === 2 && hscan.counts.designed === 2, 'group header sharing the label grammar is not a case, got ' + JSON.stringify(hscan.counts));
// a component-level case holds a CROP (PTP `SOFCard_CASA` 390x108), not a screen — it is still designed
const crop = () => N('INSTANCE', 'SOFCard_CASA', [T('KTB')], { height: 108 });
globalThis.figma = { currentPage: { selection: [], children: [N('FRAME', 'Permutation: Pg_Setting', [N('FRAME', 'Case',
  [icol('1.1 | Default', crop()), icol('1.2 | Long Name', crop()), icol('2.1 | Link 1 Acc', emptySlot())])])] } };
const cscan = scanCases();
A(cscan.counts.designed === 2 && cscan.counts.spec === 1, 'component crops count as designed, placeholders do not, got ' + JSON.stringify(cscan.counts));
A(Array.isArray(cscan.containers[0].cases) && cscan.containers[0].designed === 2, 'DETAIL on: per-case rows + per-board designed count');
delete globalThis.figma;
// a real team board can be named anything (PTP `Guideline: Select Account`): the attached `Permutation` connector finds it
const guideline = N('FRAME', 'Guideline: Select Account', [N('FRAME', 'row', [hcell('#1.1 Account that can link', designedScreen()), hcell('#1.2 Account already Linked', designedScreen())])]);
const otherLogic = N('INSTANCE', 'Other Logic', [T('logic')]);
const linked = new Map([[guideline, [{ id: '9:1', name: 'Select account' }]], [otherLogic, [{ id: '9:2', name: 'Set CASA account' }]]]);
const lscan = scanCases([N('SECTION', 'flow', [guideline, otherLogic])], linked);
A(lscan.counts.containers === 1 && lscan.counts.cases === 2, 'a board found through its Permutation connector; a linked non-board (no cases) is dropped, got ' + JSON.stringify(lscan.counts));
A(lscan.containers[0].linkedFrom[0].name === 'Select account', 'each board reports which screen its link starts from');
// a note instance beside an EMPTY slot must not read as designed
const noted = N('FRAME', 'Case', [N('INSTANCE', 'Title Block', [T('1.1 | Default')]), N('INSTANCE', 'Note', [T('todo')]), emptySlot()]);
const nscan = scanCases([N('FRAME', 'Permutation: X', [N('FRAME', 'Case', [noted])])]);
A(nscan.counts.designed === 0, 'a cell that still holds its placeholder is spec, whatever sits beside it');
console.log('scan-cases v2 self-check OK');
