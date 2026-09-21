// scan-cases.js v2 — inventory Permutation boards + case cells + fill status.
// Paste VERBATIM into use_figma / figma_execute (wrapped in a function → top-level return OK).
// Scope = current selection, else whole page. Returns inventory JSON.
// Node self-check at bottom: `node scripts/scan-cases.js` (runs when figma is undefined).
//
// v2:
// - CLICX board names (`G.03-01.B`) and loose labels (`Case #1 - Account sorting`) are now detected.
// - STRICT / LOOSE / INDEXED labels are reported separately — only strict labels are renumber-compatible.
//   INDEXED = `<g>.<n> | <name>` or `#<n>[.<m>] <name>` (PTP): those boards carry no "Case" word at all.
// - The label TEXT may live inside an INSTANCE (CLICX title block): climb ancestors to find the
//   cell that carries the permBuild pluginData.
// - isDesigned() only counts SCREEN-SIZED children (h > 600): caption frames were false positives.

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

function scanCases() {
  const roots = figma.currentPage.selection.length
    ? figma.currentPage.selection
    : figma.currentPage.children;

  const containers = [];
  (function collect(n) {
    if (isContainer(n) || (CONTAINER_TYPES.indexOf(n.type) !== -1 && hasBoardStamp(n))) containers.push(n);
    else if ('children' in n) n.children.forEach(collect);
  })({ type: 'PAGE', name: '', children: roots });

  const isPlaceholder = frame =>
    'children' in frame && frame.findOne &&
    !!frame.findOne(x => x.type === 'TEXT' && /awaiting design/i.test(x.characters || ''));

  // designed = the cell holds a SCREEN-SIZED child (h > 600) that is not the placeholder.
  // Height gate matters: caption blocks are frames too and made short cells read as designed.
  function isDesigned(cell) {
    if (!('children' in cell)) return false;
    return cell.children.some(f =>
      (f.type === 'FRAME' || f.type === 'INSTANCE') && f.height > 600 &&
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
    const designed = pd && pd.status === 'designed' ? true : isDesigned(cell);
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
    return { id: c.id, name: c.name, stamp: boardStamp, count: cases.length, dupNumbers: findDupNumbers(cases.map(x => x.n)), cases };
  });

  // Case#N restarts on every board — duplicates only mean something INSIDE one board.
  const all = out.flatMap(c => c.cases);
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

if (typeof figma !== 'undefined') return scanCases();

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
console.log('scan-cases v2 self-check OK');
