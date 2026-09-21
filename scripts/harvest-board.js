// harvest-board.js — read the layout style of a permutation board the team already made and return
// the values that belong in projects/<name>.md (used by LEARN, and before the first Scaffold in any
// new file or project).
//
// Usage: replace BOARD_HINT with part of an example board's name (or a node id), then paste into
// figma_execute / use_figma. Returns JSON — copy the values into projects/<name>.md.
//
// Captures grammar + measured values (spacing, fonts, colors, structure) — never per-screen x/y.

const BOARD_HINT = "<BOARD_HINT>"; // e.g. "Common Handling" or "129:187706"

function hex(c) {
  return "#" + [c.r, c.g, c.b].map(v => Math.round(v * 255).toString(16).padStart(2, "0")).join("");
}
function solid(node, key) {
  const arr = node[key];
  return arr && Array.isArray(arr) && arr[0] && arr[0].type === "SOLID" ? hex(arr[0].color) : null;
}
// CONNECTOR / VECTOR nodes throw on layoutSizingHorizontal — they can live inside a board.
function sizingOf(n) { try { return n.layoutSizingHorizontal || null; } catch (e) { return null; } }
// VECTOR/LINE throw on connector* props; CONNECTOR throws on layout* props. Read defensively.
function prop(n, k) { try { return n[k]; } catch (e) { return null; } }
function lh(t) {
  return t.lineHeight && t.lineHeight.unit === "PIXELS" ? Math.round(t.lineHeight.value) : t.lineHeight ? t.lineHeight.unit : null;
}
// A screen = a frame taller than 600 whose width is device-sized (300-500); do not descend
// into it. Anything wider is a row wrapper, not a screen. Widen SCREEN_W for tablet/desktop projects.
// A device-sized frame that HOLDS a Case label is the case column (caption + slot), not the screen —
// otherwise the column size gets reported as the slot size.
const SCREEN_MIN_H = 600, SCREEN_W = [300, 500];
let CAPTION_RE = /^\s*(Case\s*#?\s*\d+|\d+\.\d+\s*\||#\s*\d+(\.\d+)*\s)/;   // narrowed to the Case grammar once the board is known to use it
const holdsCaseLabel = n => !!n.findOne && !!n.findOne(x => x.type === "TEXT" && CAPTION_RE.test(x.characters || ""));
const isScreen = n => n.height > SCREEN_MIN_H && n.width >= SCREEN_W[0] && n.width <= SCREEN_W[1] &&
  (n.type === "INSTANCE" || n.type === "FRAME" || n.type === "COMPONENT") && !holdsCaseLabel(n);

// Board names seen on real boards: `Permutation: X` / `Permutation_X` / `X Permutations`, and the CLICX
// state suffix `G.03-01.B` (.A = screen, .B/.C = boards). A connector can be NAMED "Permutation",
// so the node type is part of the test.
const BOARD_TYPES = ["FRAME", "SECTION", "GROUP", "COMPONENT", "INSTANCE"];
const isBoardName = s => /^Permutations?[:_]/i.test(s || "") || /\bPermutations\s*$/i.test(s || "") || /^[A-Z]{1,4}\.\d{1,3}-\d{1,3}\.[B-Z]$/.test(s || "");
const isBoard = n => !!n && BOARD_TYPES.indexOf(n.type) !== -1 && isBoardName(n.name);
// strict `Case#N` · loose `Case #N - Name` (CLICX, DGL) · indexed `1.2 | Name` / `#2.1 Name` (PTP — no "Case" word)
const CASE_RE = /^\s*(?:Case\s*#?\s*\d+\s*(?:[-–—:.]\s*.+)?|\d+\.\d+\s*\|\s*.+?|#\s*\d+(?:\.\d+)*\s+.+?)\s*$/s;
const STRICT_CASE_RE = /^\s*Case\s*#?\s*(\d+)\s*$/;
const INDEXED_CASE_RE = /^\s*(?:\d+\.\d+\s*\||#\s*\d+(?:\.\d+)*\s)/;
const styleOf = labels => !labels.length ? null : labels.every(l => STRICT_CASE_RE.test(l)) ? "strict" : labels.every(l => INDEXED_CASE_RE.test(l)) ? "indexed" : "loose";

async function harvest() {
  let board = null;
  if (/^\d+[:-]\d+$/.test(BOARD_HINT)) {
    board = await figma.getNodeByIdAsync(BOARD_HINT.replace("-", ":"));
  } else {
    (function find(n, d) {
      if (board || d > 4) return;
      if (n.name && n.name.indexOf(BOARD_HINT) !== -1 && isBoard(n)) { board = n; return; }
      if ("children" in n) n.children.forEach(c => find(c, d + 1));
    })({ name: "", children: figma.currentPage.children }, 0);
  }
  if (!board) return { error: "board not found: " + BOARD_HINT };
  let pg = board; while (pg && pg.type !== "PAGE") pg = pg.parent;
  if (pg && pg.loadAsync) await pg.loadAsync();      // use_figma starts on the file's first page
  if (board.findOne(x => x.type === "TEXT" && /^\s*Case\s*#?\s*\d+/.test(x.characters || ""))) CAPTION_RE = /^\s*Case\s*#?\s*\d+/;

  // --- shell: structure + spacing per level ---
  const layers = [];
  (function walk(n, d) {
    if (d > 5) return;
    const screen = d > 0 && isScreen(n);
    layers.push({
      depth: d, type: n.type, name: (n.name || "").slice(0, 28),
      w: Math.round(n.width || 0), h: Math.round(n.height || 0),
      layout: n.layoutMode && n.layoutMode !== "NONE"
        ? { mode: n.layoutMode, gap: n.itemSpacing, crossGap: n.counterAxisSpacing,
            wrap: n.layoutWrap === "WRAP",
            pad: [n.paddingTop, n.paddingRight, n.paddingBottom, n.paddingLeft].join("/") }
        : null,
      sizing: sizingOf(n), // FILL headers span their group (CLICX)
      fill: solid(n, "fills"), radius: typeof n.cornerRadius === "number" ? n.cornerRadius : null,
      isScreenSlot: screen || undefined,
    });
    if (!screen && "children" in n) n.children.forEach(c => walk(c, d + 1));
  })(board, 0);

  // --- typography: grouped by size (reads real weight + lineHeight) ---
  const typo = {};
  (function w(n, d) {
    if (d > 6) return;
    if (n.type === "TEXT" && n.characters && !isScreen(n.parent || {})) {
      const f = n.fontName;
      const k = Math.round(n.fontSize || 0) + "px";
      if (!typo[k]) typo[k] = {};
      const v = (f && f.family ? f.family + " / " + f.style : "MIXED") + " · lh " + lh(n) + " · " + solid(n, "fills");
      if (!typo[k][v]) typo[k][v] = { count: 0, samples: [] };
      typo[k][v].count++;
      if (typo[k][v].samples.length < 2) typo[k][v].samples.push(n.characters.slice(0, 26).replace(/\n/g, "⏎"));
    }
    if ("children" in n) n.children.forEach(c => w(c, d + 1));
  })(board, 0);

  // --- screen-slot sizes actually used ---
  const slots = {};
  (function w(n) {
    if (isScreen(n) && n !== board) { const k = Math.round(n.width) + "×" + Math.round(n.height); slots[k] = (slots[k] || 0) + 1; return; }
    if ("children" in n) n.children.forEach(w);
  })(board);

  // --- label pattern ---
  const labels = [];
  (function w(n, d) {
    if (d > 6) return;
    if (n.type === "TEXT" && CASE_RE.test(n.characters)) labels.push(n.characters.split("\n")[0]);
    if ("children" in n) n.children.forEach(c => w(c, d + 1));
  })(board, 0);

  // --- links pointing at this board (connector / vector) ---
  // Links live on the SECTION/PAGE, never inside the board, and an endpoint may be the board itself
  // OR a node inside it. Projects also mix a flow link and a permutation link, told apart by name
  // and dash pattern — so collect every line-ish node and let the caller read the difference.
  const inBoard = new Set();
  (function collect(n) { inBoard.add(n.id); if ("children" in n) n.children.forEach(collect); })(board);
  const links = [], otherLines = [];
  (function w(n, d) {
    if (d > 4) return;
    const lineish = n.type === "CONNECTOR" || n.type === "LINE" ||
      (n.type === "VECTOR" && (n.width > 100 || n.height > 100));
    if (lineish) {
      const cs = prop(n, "connectorStart"), ce = prop(n, "connectorEnd");
      const rec = { kind: n.type, name: n.name, stroke: solid(n, "strokes"),
        weight: n.strokeWeight, dash: (n.dashPattern || []).join(","),
        lineType: prop(n, "connectorLineType"),
        startMagnet: cs && cs.magnet,
        endMagnet: ce && ce.magnet };
      const s = cs && cs.endpointNodeId;
      const e = ce && ce.endpointNodeId;
      if (e && inBoard.has(e)) { rec.startNodeId = s; links.push(rec); }
      else otherLines.push(rec);
    }
    if ("children" in n) n.children.forEach(c => w(c, d + 1));
  })(board.parent || figma.currentPage, 0);

  // --- neighbours: used to compute free space when placing a new board ---
  const parent = board.parent;
  // a sibling is a board by NAME, or because an attached `Permutation` connector ends on it (teams name boards freely)
  const linkedIds = new Set();
  for (const c of (parent && parent.children ? parent.children : []).filter(n => n.type === "CONNECTOR" && /permutation/i.test(n.name || ""))) {
    const e = prop(c, "connectorEnd"); if (!e || !e.endpointNodeId) continue;
    let t = await figma.getNodeByIdAsync(e.endpointNodeId);
    while (t && t.parent && t.parent.id !== parent.id) t = t.parent;
    if (t && BOARD_TYPES.indexOf(t.type) !== -1 && t.findOne && t.findOne(x => x.type === "TEXT" && CASE_RE.test(x.characters || ""))) linkedIds.add(t.id);
  }
  const siblings = (parent && parent.children ? parent.children : [])
    .filter(n => n.id !== board.id && (isBoard(n) || linkedIds.has(n.id)))
    .map(n => ({ name: (n.name || "").slice(0, 40), x: Math.round(n.x), right: Math.round(n.x + n.width), y: Math.round(n.y) }))
    .sort((a, b) => a.x - b.x);

  return {
    board: { name: board.name, id: board.id, type: board.type,
             w: Math.round(board.width), h: Math.round(board.height),
             x: Math.round(board.x), y: Math.round(board.y),
             parent: parent ? { name: parent.name, type: parent.type, id: parent.id, w: Math.round(parent.width || 0), h: Math.round(parent.height || 0) } : null },
    shell: layers.filter(l => l.depth <= 3).slice(0, 40),
    typography: typo,
    screenSlots: slots,
    labelSamples: labels.slice(0, 6),
    labelHasSpace: labels.length ? /Case\s+#/.test(labels[0]) : null,
    labelStyle: styleOf(labels),
    incomingLinks: links,
    otherLinesNearby: otherLines.slice(0, 8), // flow links etc — compare to tell the two kinds apart
    siblingBoards: siblings,
    note: "Copy these into projects/<name>.md \u2192 \u00a7Board anatomy. Store grammar + measured values, never per-screen x/y.",
  };
}
if (typeof figma !== "undefined") return harvest(); // returns a Promise — the runtime awaits it

// --- node self-check (pure parts) ---
const A = (c, m) => { if (!c) throw new Error("FAIL: " + m); };
A(isBoardName("Permutation_JUN26.02 Select Top-Up") && isBoardName("Loan Amount Permutations") && isBoardName("Permutation: Home"), "Permutation name forms");
A(isBoardName("G.03-01.B") && isBoardName("B.01-01.C") && !isBoardName("G.03-01.A | my asset"), "CLICX .B/.C boards, not .A screens");
A(isBoard({ type: "FRAME", name: "B.01-01.C" }) && !isBoard({ type: "CONNECTOR", name: "Permutation" }), "a connector named Permutation is not a sibling board");
A(CASE_RE.test("Case#3") && CASE_RE.test("Case #1 - Account sorting\n") && !CASE_RE.test("Cases") && !CASE_RE.test("Case study"), "strict + loose labels");
A(STRICT_CASE_RE.test("Case#3") && !STRICT_CASE_RE.test("Case #1 - Account sorting"), "strict only");
A(CASE_RE.test("1.1 | Default") && !CASE_RE.test("1 | CASA") && styleOf(["1.1 | Default", "2.3 | Empty State"]) === "indexed", "indexed labels (PTP)");
A(styleOf(["Case#1", "Case#2"]) === "strict" && styleOf(["Case #1 - Name"]) === "loose" && styleOf([]) === null, "label style summary");
A(CASE_RE.test("#2.1 Savings account limit unreached") && styleOf(["#1 A", "#2.1 B"]) === "indexed" && !CASE_RE.test("# tag"), "hash-indexed labels (PTP dialect B)");
console.log("harvest-board self-check OK");
