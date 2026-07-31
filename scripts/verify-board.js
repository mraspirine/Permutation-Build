// verify-board.js — the Phase 5 gate. Runs EVERY check the pilots used to hand-write, in one call.
// Paste VERBATIM into use_figma / figma_execute after filling CONFIG (values come from
// projects/<name>.md §Verify config). Returns { pass, failures[], stats } — scaffold is DONE only
// when pass === true. Never hand-write an abbreviated version of these checks.
// Node self-check at bottom: `node scripts/verify-board.js`.

const CONFIG = {
  boardId: "<BOARD_ID>",           // the scaffolded board
  labelStyle: "strict",            // "strict" = `Case#N` only · "loose" = `Case #N - Name` (e.g. CLICX)
  expectedCases: 0,                // number confirmed in Phase 3 (0 = skip)
  slotSizes: ["390x844"],          // allowed screen-slot sizes for this project, "WxH"
  baseNodeId: "",                  // the base screen ("" = skip base-intact check)
  expectedBaseNodes: 0,            // node count measured BEFORE scaffolding (0 = skip)
  titlesFullWidth: false,          // true = every group header must span its group's full width
  numbersScopedPerGroup: false,    // true = Case#N restarts inside each group (DGL) → dup check runs per group
  screensAlignPerRow: false,       // true = every screen slot in a row must start at the same y (uniform caption block)
};

const STRICT_RE = /^\s*Case\s*#?\s*(\d+)\s*$/;
const LOOSE_RE = /^\s*Case\s*#?\s*(\d+)\s*(?:[-–—:.]\s*(.+))?\s*$/s;
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
  const m = text.match(LOOSE_RE);
  return !!m && /^\s*Case/i.test(text);
}
function findDup(nums) {
  const seen = new Set(), dup = new Set();
  nums.forEach(n => { if (n != null) { if (seen.has(n)) dup.add(n); seen.add(n); } });
  return [...dup].sort((a, b) => a - b);
}

async function verify() {
  const F = [];                                 // failures
  const board = await figma.getNodeByIdAsync(CONFIG.boardId);
  if (!board) return { pass: false, failures: ["board not found: " + CONFIG.boardId], stats: null };

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
      ? cell.findOne(x => x.type === "TEXT" && /^\s*Case/i.test(x.characters || "") && LOOSE_RE.test(x.characters))
      : null;
    const slot = cell.findOne
      ? cell.findOne(x => (x.type === "FRAME" || x.type === "INSTANCE") && x.height > 600)
      : null;
    return { cell, pd, label, slot };
  });

  // ---- checks ----
  if (CONFIG.expectedCases > 0 && rows.length !== CONFIG.expectedCases)
    F.push("case count " + rows.length + " ≠ expected " + CONFIG.expectedCases);

  rows.forEach((r, i) => {
    const tag = r.pd && r.pd.caseId ? r.pd.caseId : "cell#" + i;
    if (!r.pd) { F.push(tag + ": missing permBuild pluginData"); return; }
    REQUIRED_PD.forEach(k => { if (r.pd[k] === undefined || r.pd[k] === null) F.push(tag + ": pluginData missing field '" + k + "'"); });
    if (!r.label) F.push(tag + ": no Case label text found");
    else if (!labelOk(r.label.characters.split("\n")[0], CONFIG.labelStyle))
      F.push(tag + ": label '" + r.label.characters.split("\n")[0].slice(0, 30) + "' fails style '" + CONFIG.labelStyle + "'");
    if (!r.slot) F.push(tag + ": no screen slot (placeholder or screen) found");
    else {
      const size = Math.round(r.slot.width) + "x" + Math.round(r.slot.height);
      if (CONFIG.slotSizes.length && CONFIG.slotSizes.indexOf(size) === -1)
        F.push(tag + ": slot " + size + " not in " + JSON.stringify(CONFIG.slotSizes));
      if (r.pd.status === "spec" && !isPlaceholder(r.slot) && !("children" in r.slot && r.slot.children.length === 0))
        F.push(tag + ": status 'spec' but slot is not a placeholder");
    }
  });

  // Case numbers must be unique — across the whole board, or within each group when the project
  // restarts numbering per group (DGL). Group = the board child the cell sits under.
  const numOf = r => { const m = r.label && r.label.characters.match(LOOSE_RE); return m ? Number(m[1]) : null; };
  const groupOf = cell => {
    let p = cell, hops = 0;
    while (p && p.parent && p.parent.id !== board.id && hops < 8) { p = p.parent; hops++; }
    return p && p.parent && p.parent.id === board.id ? p.id : "board";
  };
  let dup;
  if (CONFIG.numbersScopedPerGroup) {
    const byGroup = {};
    rows.forEach(r => { const g = groupOf(r.cell); (byGroup[g] = byGroup[g] || []).push(numOf(r)); });
    dup = [...new Set(Object.keys(byGroup).flatMap(g => findDup(byGroup[g])))].sort((a, b) => a - b);
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
console.log("verify-board self-check OK");
