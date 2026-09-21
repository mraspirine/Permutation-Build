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
// ponytail: a screen = a frame taller than 600 whose width is device-sized (300-500); do not descend
// into it. Anything wider is a row wrapper, not a screen. Widen SCREEN_W for tablet/desktop projects.
// A device-sized frame that HOLDS a Case label is the case column (caption + slot), not the screen —
// without this the harvest reported the column (390×2062) as the slot size.
const SCREEN_MIN_H = 600, SCREEN_W = [300, 500];
const holdsCaseLabel = n => !!n.findOne && !!n.findOne(x => x.type === "TEXT" && /^\s*Case\s*#?\s*\d+/.test(x.characters || ""));
const isScreen = n => n.height > SCREEN_MIN_H && n.width >= SCREEN_W[0] && n.width <= SCREEN_W[1] &&
  (n.type === "INSTANCE" || n.type === "FRAME" || n.type === "COMPONENT") && !holdsCaseLabel(n);

async function harvest() {
  let board = null;
  if (/^\d+[:-]\d+$/.test(BOARD_HINT)) {
    board = await figma.getNodeByIdAsync(BOARD_HINT.replace("-", ":"));
  } else {
    (function find(n, d) {
      if (board || d > 4) return;
      if (n.name && n.name.indexOf(BOARD_HINT) !== -1 && /permutation/i.test(n.name)) { board = n; return; }
      if ("children" in n) n.children.forEach(c => find(c, d + 1));
    })({ name: "", children: figma.currentPage.children }, 0);
  }
  if (!board) return { error: "board not found: " + BOARD_HINT };

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
      sizing: sizingOf(n), // FILL headers span their group (CLICX lesson)
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
  const CASE_RE = /^\s*Case\s*#?\s*(\d+)\s*$/;
  const labels = [];
  (function w(n, d) {
    if (d > 6) return;
    if (n.type === "TEXT" && CASE_RE.test(n.characters)) labels.push(n.characters);
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
  const siblings = (parent && parent.children ? parent.children : [])
    .filter(n => n.id !== board.id && /permutation/i.test(n.name || ""))
    .map(n => ({ name: (n.name || "").slice(0, 40), x: Math.round(n.x), right: Math.round(n.x + n.width), y: Math.round(n.y) }))
    .sort((a, b) => a.x - b.x);

  return {
    board: { name: board.name, id: board.id, type: board.type,
             w: Math.round(board.width), h: Math.round(board.height),
             x: Math.round(board.x), y: Math.round(board.y),
             parent: parent ? { name: parent.name, type: parent.type, id: parent.id } : null },
    shell: layers.filter(l => l.depth <= 3).slice(0, 40),
    typography: typo,
    screenSlots: slots,
    labelSamples: labels.slice(0, 6),
    labelHasSpace: labels.length ? /Case\s+#/.test(labels[0]) : null,
    incomingLinks: links,
    otherLinesNearby: otherLines.slice(0, 8), // flow links etc — compare to tell the two kinds apart
    siblingBoards: siblings,
    note: "Copy these into projects/<name>.md \u2192 \u00a7Board anatomy. Store grammar + measured values, never per-screen x/y.",
  };
}
return await harvest();
