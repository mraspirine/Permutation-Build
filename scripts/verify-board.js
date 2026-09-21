// verify-board.js — the Phase 5 gate. Runs every Phase 5 check in one call.
// Paste VERBATIM into use_figma / figma_execute after filling CONFIG (values come from
// projects/<name>.md §Verify config). Returns { pass, failures[], stats } — scaffold is DONE only
// when pass === true. Never hand-write an abbreviated version of these checks.
// Node self-check at bottom: `node scripts/verify-board.js`.

const CONFIG = {
  boardId: "<BOARD_ID>",           // the scaffolded board
  labelStyle: "strict",            // "strict" = `Case#N` only · "loose" = `Case #N - Name` (CLICX) · "indexed" = `1.2 | Name` / `#2.1 Name` (PTP)
  expectedCases: 0,                // number confirmed in Phase 3 (0 = skip)
  slotSizes: ["390x844"],          // allowed screen-slot sizes for this project, "WxH"
  baseNodeId: "",                  // the base screen ("" = skip base-intact check)
  linkId: "",                      // the screen→board link ("" = skip). Must be an attached CONNECTOR with both caps
  linkMagnets: ["BOTTOM", "TOP"],  // [start, end] the project's links use · null = do not check magnets
  expectedBaseNodes: 0,            // node count measured BEFORE scaffolding (0 = skip)
  titlesFullWidth: false,          // true = every group header must span its group's full width
  numbersScopedPerGroup: false,    // true = Case#N restarts inside each group (DGL) → dup check runs per group
  screensAlignPerRow: false,       // true = every screen slot in a row must start at the same y (uniform caption block)
  knownCaseIds: [],                // Tier-1/2 caseIds from case-library.md ([] = skip). A tier 1|2 cell whose caseId
                                   // is not in this list fails — it means a standard case was free-texted (re-worded),
                                   // which breaks cross-flow consistency ("Session timeout" vs "Network reconnect").
};

const STRICT_RE = /^\s*Case\s*#?\s*(\d+)\s*$/;
const LOOSE_RE = /^\s*Case\s*#?\s*(\d+)\s*(?:[-–—:.]\s*(.+))?\s*$/s;
const INDEXED_RE = /^\s*(?:#\s*(\d+(?:\.\d+)*)\s+|(\d+\.\d+)\s*\|\s*)(.+?)\s*$/s;   // PTP: "1.2 | Name" or "#2.1 Name" — no "Case" word
const REQUIRED_PD = ["caseId", "level", "tier", "priority", "status"];
const SOLID_TYPES = ["FRAME", "SECTION", "GROUP", "COMPONENT", "INSTANCE"]; // overlap check ignores lines

// use_figma blocks setPluginData/getPluginData → scaffold-kit falls back to shared plugin data.
// Read both so the gate works under either runtime (Bridge writes plain, use_figma writes shared).
function readPD(n, key) {
  try { const v = n.getPluginData && n.getPluginData(key); if (v) return v; } catch (e) {}
  try { const v = n.getSharedPluginData && n.getSharedPluginData("permBuild", key); if (v) return v; } catch (e) {}
  return "";
}
function labelOk(text, style) {
  if (style === "strict") return STRICT_RE.test(text);
  if (style === "indexed") return INDEXED_RE.test(text);
  const m = text.match(LOOSE_RE);
  return !!m && /^\s*Case/i.test(text);
}
// any of the three label grammars — used to FIND the label node; labelOk() then checks the project's style
function isLabelText(text) {
  return typeof text === "string" && ((/^\s*Case/i.test(text) && LOOSE_RE.test(text)) || INDEXED_RE.test(text));
}
function labelKey(text) {
  const i = text.match(INDEXED_RE); if (i) return i[1] || i[2];
  const m = text.match(LOOSE_RE); return m ? Number(m[1]) : null;
}
// How far the board sticks out of its parent SECTION, in px (0 = inside; section children use local coordinates).
function outsideParent(board, parent) {
  if (!parent || parent.type !== "SECTION") return 0;
  return Math.max(0, -board.x, -board.y, board.x + board.width - parent.width, board.y + board.height - parent.height);
}
// The link is the most-rejected part of a build: capless, unattached, or starting below a clipped screen.
// ctx = { inBoard:Set, inBase:Set|null, baseBottom, lineTop, tolerance, magnets:[start,end]|null }
function linkFailures(link, ctx) {
  if (link.type !== "CONNECTOR") return ["link is a " + link.type + ", not a CONNECTOR — it cannot attach (placeholder line: say so to the user)"];
  const F = [], s = link.connectorStart || {}, e = link.connectorEnd || {};
  if (!s.endpointNodeId) F.push("link start is loose (not attached to a node)");
  if (!e.endpointNodeId) F.push("link end is loose (not attached to a node)");
  if (e.endpointNodeId && !ctx.inBoard.has(e.endpointNodeId)) F.push("link does not end on this board");
  if (ctx.inBase && s.endpointNodeId && !ctx.inBase.has(s.endpointNodeId)) F.push("link does not start on the base screen");
  if (link.connectorStartStrokeCap === "NONE" || link.connectorEndStrokeCap === "NONE") F.push("link is missing an end cap");
  const want = ctx.magnets === undefined ? ["BOTTOM", "TOP"] : ctx.magnets;      // null = the project has no fixed magnets
  if (want && (s.magnet !== want[0] || e.magnet !== want[1]))
    F.push("link magnets are " + s.magnet + "→" + e.magnet + ", the project uses " + want[0] + "→" + want[1] + " (an AUTO magnet also hides the anchor check)");
  if (s.magnet === "BOTTOM" && ctx.baseBottom != null && ctx.lineTop != null && Math.abs(ctx.lineTop - ctx.baseBottom) > ctx.tolerance)
    F.push("link starts " + Math.round(ctx.lineTop - ctx.baseBottom) + "px from the screen's bottom edge — anchor the FRAME when the main instance overflows it");
  return F;
}
function findDup(nums) {
  const seen = new Set(), dup = new Set();
  nums.forEach(n => { if (n != null) { if (seen.has(n)) dup.add(n); seen.add(n); } });
  return [...dup].sort((a, b) => String(a).localeCompare(String(b), undefined, { numeric: true }));
}

async function verify() {
  const F = [];                                 // failures
  const board = await figma.getNodeByIdAsync(CONFIG.boardId);
  if (!board) return { pass: false, failures: ["board not found: " + CONFIG.boardId], stats: null };
  let pg = board; while (pg && pg.type !== "PAGE") pg = pg.parent;
  if (pg && pg.loadAsync) await pg.loadAsync();      // use_figma starts on the file's first page

  // ---- collect cells (nodes stamped with permBuild) ----
  const cells = [];
  (function walk(n) {
    if (readPD(n, "permBuild")) cells.push(n);
    if ("children" in n) n.children.forEach(walk);
  })(board);

  const isPlaceholder = f => "children" in f && f.findOne &&
    !!f.findOne(x => x.type === "TEXT" && /awaiting design/i.test(x.characters || ""));

  const rows = cells.map(cell => {
    let pd = null; try { pd = JSON.parse(readPD(cell, "permBuild")); } catch (e) {}
    const label = cell.findOne
      ? cell.findOne(x => x.type === "TEXT" && isLabelText(x.characters || ""))
      : null;
    // the slot = the cell's child that is not its caption; component-level cells hold a crop, not a screen
    const holdsLabel = k => k === label || (k.findOne && !!k.findOne(x => x === label));
    const direct = "children" in cell ? cell.children.filter(k => (k.type === "FRAME" || k.type === "INSTANCE") && !holdsLabel(k)) : [];
    const slot = direct.find(k => k.height > 600) || (pd && pd.level === "C" ? direct[0] : null) ||
      (cell.findOne ? cell.findOne(x => (x.type === "FRAME" || x.type === "INSTANCE") && x.height > 600) : null);
    return { cell, pd, label, slot };
  });

  // ---- checks ----
  if (CONFIG.expectedCases > 0 && rows.length !== CONFIG.expectedCases)
    F.push("case count " + rows.length + " ≠ expected " + CONFIG.expectedCases);

  rows.forEach((r, i) => {
    const tag = r.pd && r.pd.caseId ? r.pd.caseId : "cell#" + i;
    if (!r.pd) { F.push(tag + ": missing permBuild pluginData"); return; }
    REQUIRED_PD.forEach(k => { if (r.pd[k] === undefined || r.pd[k] === null) F.push(tag + ": pluginData missing field '" + k + "'"); });
    if (CONFIG.knownCaseIds.length && (r.pd.tier === 1 || r.pd.tier === 2) && CONFIG.knownCaseIds.indexOf(r.pd.caseId) === -1)
      F.push(tag + ": tier " + r.pd.tier + " caseId not in case-library (free-texted standard case?)");
    if (!r.label) F.push(tag + ": no Case label text found");
    else if (!labelOk(r.label.characters.split("\n")[0], CONFIG.labelStyle))
      F.push(tag + ": label '" + r.label.characters.split("\n")[0].slice(0, 30) + "' fails style '" + CONFIG.labelStyle + "'");
    if (!r.slot) F.push(tag + ": no screen slot (placeholder or screen) found");
    else {
      const size = Math.round(r.slot.width) + "x" + Math.round(r.slot.height);
      const crop = r.pd.level === "C" && !isPlaceholder(r.slot);   // a designed component crop has no fixed size
      if (!crop && CONFIG.slotSizes.length && CONFIG.slotSizes.indexOf(size) === -1)
        F.push(tag + ": slot " + size + " not in " + JSON.stringify(CONFIG.slotSizes));
      if (r.pd.status === "spec" && !isPlaceholder(r.slot) && !("children" in r.slot && r.slot.children.length === 0))
        F.push(tag + ": status 'spec' but slot is not a placeholder");
    }
  });

  // Case numbers must be unique — across the whole board, or within each group when the project
  // restarts numbering per group (DGL). Group = the board child the cell sits under.
  const numOf = r => (r.label ? labelKey(r.label.characters) : null);
  const groupOf = cell => {
    let p = cell, hops = 0;
    while (p && p.parent && p.parent.id !== board.id && hops < 8) { p = p.parent; hops++; }
    return p && p.parent && p.parent.id === board.id ? p.id : "board";
  };
  let dup;
  if (CONFIG.numbersScopedPerGroup) {
    const byGroup = {};
    rows.forEach(r => { const g = groupOf(r.cell); (byGroup[g] = byGroup[g] || []).push(numOf(r)); });
    dup = [...new Set(Object.keys(byGroup).flatMap(g => findDup(byGroup[g])))];
    if (dup.length) F.push("duplicate case numbers within a group: " + dup.join(","));
  } else {
    dup = findDup(rows.map(numOf));
    if (dup.length) F.push("duplicate case numbers: " + dup.join(","));
  }

  // ---- overlap vs siblings (solid nodes only — connectors legitimately cross boards) ----
  const parent = board.parent;
  const overlaps = (parent && parent.children ? parent.children : [])
    .filter(n => n.id !== board.id && SOLID_TYPES.indexOf(n.type) !== -1 &&
      n.x < board.x + board.width && n.x + n.width > board.x &&
      n.y < board.y + board.height && n.y + n.height > board.y)
    .map(n => (n.name || "").slice(0, 40));
  if (overlaps.length) F.push("board overlaps: " + overlaps.join(" · "));
  const out = outsideParent(board, parent);
  if (out > 0) F.push("board leaves its section by " + Math.round(out) + "px");

  // ---- link ----
  if (CONFIG.linkId) {
    const link = await figma.getNodeByIdAsync(CONFIG.linkId);
    if (!link) F.push("link not found: " + CONFIG.linkId);
    else {
      const ids = root => { const s = new Set(); (function c(n) { s.add(n.id); if ("children" in n) n.children.forEach(c); })(root); return s; };
      const base = CONFIG.baseNodeId ? await figma.getNodeByIdAsync(CONFIG.baseNodeId) : null;
      const bb = base && base.absoluteBoundingBox, lb = link.absoluteBoundingBox;
      linkFailures(link, { inBoard: ids(board), inBase: base ? ids(base) : null,
        baseBottom: bb ? bb.y + bb.height : null, lineTop: lb ? lb.y : null, tolerance: 12, magnets: CONFIG.linkMagnets }).forEach(f => F.push(f));
    }
  }

  // ---- base intact ----
  let baseNodes = null;
  if (CONFIG.baseNodeId) {
    const base = await figma.getNodeByIdAsync(CONFIG.baseNodeId);
    if (!base) F.push("base not found: " + CONFIG.baseNodeId);
    else {
      baseNodes = 0;
      (function c(n) { baseNodes++; if ("children" in n) n.children.forEach(c); })(base);
      if (CONFIG.expectedBaseNodes > 0 && baseNodes !== CONFIG.expectedBaseNodes)
        F.push("base node count " + baseNodes + " ≠ expected " + CONFIG.expectedBaseNodes + " (base was touched?)");
    }
  }

  // ---- screens align across a row (uniform caption block — CLICX house style) ----
  // Designers read a row left-to-right; a caption one line longer shunts its screen down and the row
  // reads as sloppy. Lock every caption frame in a row to the row's tallest one.
  if (CONFIG.screensAlignPerRow) {
    const byRow = {};
    rows.forEach(r => {
      if (!r.slot || !r.cell.parent) return;
      const cap = "children" in r.cell ? r.cell.children[0] : null;
      (byRow[r.cell.parent.id] = byRow[r.cell.parent.id] || []).push({
        top: Math.round(r.cell.y + r.slot.y),
        capH: cap ? Math.round(cap.height) : null,
        capHug: cap ? cap.layoutSizingVertical === "HUG" : true,
      });
    });
    Object.keys(byRow).forEach(rowId => {
      const g = byRow[rowId];
      if (g.length < 2) return;
      const tops = [...new Set(g.map(x => x.top))];
      if (tops.length > 1) F.push("row " + rowId + ": screen tops not aligned (" + tops.join(", ") + ")");
      const caps = [...new Set(g.map(x => x.capH))];
      if (caps.length > 1) F.push("row " + rowId + ": caption heights differ (" + caps.join(", ") + ")");
      // heights must come from trailing blank lines in the text, not a locked frame — a FIXED caption
      // looks identical but silently clips the moment anyone edits the copy.
      if (g.some(x => !x.capHug)) F.push("row " + rowId + ": caption frame is FIXED — pad the text with trailing newlines instead");
    });
  }

  // ---- titles span full group width (project-dependent) ----
  if (CONFIG.titlesFullWidth) {
    board.children.forEach(g => {
      if (g.type === "FRAME" && "children" in g && g.children.length >= 2) {
        const head = g.children[0];
        if (Math.abs(g.width - head.width) > 1)
          F.push("group '" + (g.name || "") + "': header " + Math.round(head.width) + " ≠ group " + Math.round(g.width));
      }
    });
  }

  return {
    pass: F.length === 0,
    failures: F,
    stats: {
      cases: rows.length, dupNumbers: dup,
      strictLabels: rows.filter(r => r.label && STRICT_RE.test(r.label.characters.split("\n")[0])).length,
      spec: rows.filter(r => r.pd && r.pd.status === "spec").length,
      designed: rows.filter(r => r.pd && r.pd.status === "designed").length,
      baseNodes, overlaps,
      board: { w: Math.round(board.width), h: Math.round(board.height), x: Math.round(board.x), y: Math.round(board.y) },
    },
  };
}
if (typeof figma !== "undefined") return verify(); // returns a Promise — figma_execute awaits it

// --- node self-check (pure parts) ---
const A = (c, m) => { if (!c) throw new Error("FAIL: " + m); };
A(labelOk("Case#3", "strict") && !labelOk("Case #1 - Name", "strict"), "strict style");
A(labelOk("Case #1 - Account sorting", "loose") && labelOk("Case#3", "loose"), "loose accepts both");
A(!labelOk("Cases", "loose") && !labelOk("Note", "loose"), "loose rejects non-labels");
A(JSON.stringify(findDup([1, 2, 2, 3])) === "[2]", "dup");
A(labelOk("1.1 | Default", "indexed") && labelOk("2.3 | Link 3 Acc + ESaving (max)", "indexed"), "indexed style (PTP)");
A(!labelOk("Case#3", "indexed") && !labelOk("1 | Group header", "indexed") && !labelOk("1.1 | Default", "strict"), "indexed is its own style");
A(isLabelText("Case#3") && isLabelText("Case #1 - Name") && isLabelText("1.1 | Default") && !isLabelText("Permutation:") && !isLabelText("1 | CASA"), "label finder covers all three styles");
A(labelOk("#1 No E-Saving (PMT)", "indexed") && labelOk("#2.1 Savings account limit unreached", "indexed") && !labelOk("# tag", "indexed"), "hash-indexed (PTP dialect B)");
A(labelKey("#2.1 Savings") === "2.1" && labelKey("1.2 | Name") === "1.2" && labelKey("Case#7") === 7, "label keys");
// link checks — the most-rejected part of a build
const okLink = { type: "CONNECTOR", connectorStart: { endpointNodeId: "base", magnet: "BOTTOM" }, connectorEnd: { endpointNodeId: "board", magnet: "TOP" }, connectorStartStrokeCap: "TRIANGLE_FILLED", connectorEndStrokeCap: "ARROW_LINES" };
const ctx = { inBoard: new Set(["board", "head"]), inBase: new Set(["base", "inst"]), baseBottom: 1693, lineTop: 1698, tolerance: 12 };
A(linkFailures(okLink, ctx).length === 0, "healthy link passes");
A(linkFailures({ type: "VECTOR" }, ctx).length === 1, "a VECTOR line cannot attach");
A(linkFailures(Object.assign({}, okLink, { connectorStart: { magnet: "BOTTOM" } }), ctx).some(f => /start is loose/.test(f)), "loose start");
A(linkFailures(Object.assign({}, okLink, { connectorEnd: { endpointNodeId: "other" } }), ctx).some(f => /does not end on this board/.test(f)), "wrong board");
A(linkFailures(Object.assign({}, okLink, { connectorEndStrokeCap: "NONE" }), ctx).some(f => /end cap/.test(f)), "capless line");
A(linkFailures(okLink, Object.assign({}, ctx, { lineTop: 2395 })).some(f => /702px/.test(f)), "line starting below the visible screen (instance overflows the frame)");
A(outsideParent({ x: 152, y: 3810, width: 1650, height: 3580 }, { type: "SECTION", width: 8528, height: 7386 }) === 4, "board leaves its section by 4px");
A(outsideParent({ x: 152, y: 3810, width: 1650, height: 3556 }, { type: "SECTION", width: 8528, height: 7386 }) === 0 && outsideParent({ x: -5, y: 0, width: 10, height: 10 }, { type: "PAGE" }) === 0, "inside / not a section");
A(linkFailures(Object.assign({}, okLink, { connectorStart: { endpointNodeId: "base", magnet: "AUTO" } }), ctx).some(f => /magnet/.test(f)), "an AUTO start magnet is reported, not skipped");
A(linkFailures(Object.assign({}, okLink, { connectorStart: { endpointNodeId: "base", magnet: "AUTO" } }), Object.assign({}, ctx, { magnets: null })).length === 0, "magnets: null switches the magnet rule off");
A(skippedChecks({ linkId: "", baseNodeId: "", expectedBaseNodes: 0, knownCaseIds: [], expectedCases: 0 }).length === 4, "every check that an empty CONFIG switches off is listed");
A(skippedChecks({ linkId: "1:2", baseNodeId: "1:3", expectedBaseNodes: 9, knownCaseIds: ["a"], expectedCases: 3 }).length === 0, "a full CONFIG skips nothing");
A(sizeExempt({ level: "C" }, false, { componentCrops: true }) && !sizeExempt({ level: "C" }, false, { componentCrops: false }) && !sizeExempt({ level: "C" }, true, { componentCrops: true }) && !sizeExempt({ level: "S" }, false, { componentCrops: true }),
  "only a designed level-C cell is size-exempt, and only in a project that says its component cases are crops");
A(linkFailures(okLink, Object.assign({}, ctx, { caps: ["TRIANGLE_FILLED", "ARROW_LINES"] })).length === 0 && linkFailures(okLink, Object.assign({}, ctx, { caps: ["ARROW_LINES", "ARROW_LINES"] })).some(f => /caps/.test(f)), "wrong-but-present caps are caught when the project pins them");
console.log("verify-board self-check OK");
