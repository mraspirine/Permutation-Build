// scaffold-kit.js — factory prelude for Phase 4 build code.
// PASTE THIS BLOCK FIRST inside the same figma_execute / use_figma call, then write the
// project-specific build code below it using these factories. They encode the auto-layout
// ordering (resize before layoutMode silently collapses frames to hug),
// the identity guard, and the pluginData contract — so build code never re-derives them.
//
// Correct order, enforced by the factories:
//   1. createFrame → set layoutMode + spacing/padding FIRST
//   2. append children
//   3. THEN lock size: finalizeFixed(node, w, h)  (sets sizing modes, then resizes)
//   A container that must grow with content: call growWithContent(board) AFTER all appends.
// Node syntax self-check: `node scripts/scaffold-kit.js`.

// Bridge: pass the file NAME. use_figma: pass the file KEY — root.name is always "Document" there.
function guard(expected) {
  if (figma.root.name !== expected && figma.fileKey !== expected) throw "wrong file: " + figma.root.name;
}

// Auto-layout frame with layout set BEFORE any sizing. Both axes start AUTO (hug).
function alFrame(name, opts) {
  opts = opts || {};
  const f = figma.createFrame();
  f.name = name;
  f.layoutMode = opts.dir || "VERTICAL";            // FIRST — before any resize
  if (opts.wrap) f.layoutWrap = "WRAP";
  f.itemSpacing = opts.gap || 0;
  if (opts.crossGap !== undefined) f.counterAxisSpacing = opts.crossGap;
  const p = opts.pad || [0, 0, 0, 0];               // [top, right, bottom, left]
  f.paddingTop = p[0]; f.paddingRight = p[1]; f.paddingBottom = p[2]; f.paddingLeft = p[3];
  f.fills = opts.fill ? [{ type: "SOLID", color: opts.fill }] : [];
  if (opts.radius !== undefined) f.cornerRadius = opts.radius;
  f.primaryAxisSizingMode = "AUTO"; f.counterAxisSizingMode = "AUTO";
  f.clipsContent = false;
  return f;
}

// Lock a frame to a fixed size — ONLY after it is fully built and appended.
function finalizeFixed(node, w, h) {
  node.primaryAxisSizingMode = "FIXED";
  node.counterAxisSizingMode = "FIXED";
  node.resize(w, h);
}

// A board/container that hugs its content: call AFTER all children are appended.
function growWithContent(node) { node.counterAxisSizingMode = "AUTO"; }

// Fix only the width of a child inside an auto-layout parent (append it first).
function fixWidth(node, w) { node.layoutSizingHorizontal = "FIXED"; node.resize(w, node.height); }

async function textNode(str, font, size, opts) {
  opts = opts || {};
  await figma.loadFontAsync(font);                  // ALWAYS before setCharacters
  const t = figma.createText();
  t.fontName = font; t.characters = str; t.fontSize = size;
  if (opts.lh) t.lineHeight = { value: opts.lh, unit: "PIXELS" }; // PIXELS, not AUTO, when the team does
  if (opts.color) t.fills = [{ type: "SOLID", color: opts.color }];
  return t;
}

// ---- captions built from a library component (CLICX, PTP) ----
// A fresh instance of the same variant as `src`, with its boolean/text props copied. Never `src.clone()`:
// a clone is born inside the team's own board (and, in a GRID, carries that grid's column span).
async function freshInstance(src) {
  const main = await src.getMainComponentAsync();
  const inst = main.createInstance();
  const props = {};
  Object.keys(src.componentProperties || {}).forEach(k => { const p = src.componentProperties[k]; if (p.type !== "VARIANT") props[k] = p.value; });
  if (Object.keys(props).length) inst.setProperties(props);
  return inst;
}
// Override the VISIBLE text nodes of an instance, in layer order. Fonts are loaded per node.
async function setInstanceTexts(inst, strings) {
  const texts = inst.findAll(n => n.type === "TEXT" && n.visible !== false);
  for (let i = 0; i < strings.length && i < texts.length; i++) {
    for (const f of texts[i].getRangeAllFontNames(0, texts[i].characters.length)) await figma.loadFontAsync(f);
    texts[i].characters = strings[i];
  }
  return texts.length;
}
// Same-role text nodes across ONE row (all labels, or all notes): pad with trailing blank lines until they
// match the tallest — the caption frames stay HUG, so later copy edits never clip. Fonts must be loaded.
function equalizeRow(texts, floor) {
  const target = Math.max(floor || 0, ...texts.map(t => t.height));
  texts.forEach(t => { let guardCount = 0; while (t.height < target - 0.5 && guardCount++ < 40) t.characters = t.characters + "\n"; });
  return target;
}
// ---- GRID groups (PTP) ----
function gridFrame(name, cols, rows, opts) {
  opts = opts || {};
  const g = figma.createFrame(); g.name = name; g.fills = []; g.clipsContent = false;
  g.layoutMode = "GRID";                              // FIRST
  g.gridColumnCount = cols; g.gridRowCount = rows;
  g.gridColumnGap = opts.colGap || 0; g.gridRowGap = opts.rowGap || 0;
  g.gridColumnSizes.forEach(t => { t.type = "HUG"; });  // FLEX tracks are invalid inside a HUG frame
  g.gridRowSizes.forEach((t, i) => { const fixed = (opts.fixedRows || {})[i]; if (fixed) { t.type = "FIXED"; t.value = fixed; } else t.type = "HUG"; });
  return g;                                           // append it to its parent, THEN set layoutSizing* = "HUG"
}
// Place at span 1, widen afterwards — a span set before the node sits in THIS grid collides ("position occupied").
function placeInGrid(grid, node, row, col, span) {
  node.gridColumnSpan = 1;
  grid.appendChildAt(node, row, col);
  if (span && span > 1) node.gridColumnSpan = span;
}

// Empty screen slot per the Contract. Appends to parent and locks size — ready to use.
async function placeholder(parent, w, h, font, opts) {
  opts = opts || {};
  const ph = alFrame(opts.name || "placeholder", {
    dir: "VERTICAL",
    fill: opts.fill || { r: 0.95, g: 0.955, b: 0.965 },
    radius: opts.radius !== undefined ? opts.radius : 16,
  });
  ph.primaryAxisAlignItems = "CENTER"; ph.counterAxisAlignItems = "CENTER";
  ph.strokes = [{ type: "SOLID", color: opts.strokeColor || { r: 0.7, g: 0.73, b: 0.78 } }];
  ph.strokeWeight = 1; ph.dashPattern = [8, 6];
  ph.appendChild(await textNode("◻︎ Case Spec — awaiting design", font, opts.textSize || 16,
    { lh: opts.textLh || 24, color: opts.textColor || { r: 0.5, g: 0.55, b: 0.62 } }));
  parent.appendChild(ph);
  finalizeFixed(ph, w, h);
  return ph;
}

// pluginData contract — the ONLY place these keys are written.
// Plain store on the Bridge (unchanged); use_figma throws on plain → shared namespace "permBuild",
// which scan-cases / verify-board already read.
function setStamp(node, key, json) {
  try { node.setPluginData(key, json); }
  catch (e) { node.setSharedPluginData("permBuild", key, json); }
}
function stampCase(node, d) {
  ["caseId", "level", "tier", "priority"].forEach(k => { if (d[k] === undefined) throw "stampCase missing " + k; });
  setStamp(node, "permBuild", JSON.stringify({
    caseId: d.caseId, level: d.level, tier: d.tier, priority: d.priority,
    status: d.status || "spec", baseNodeId: d.baseNodeId || "",
    configVer: d.configVer || "", date: d.date || "",
  }));
}
function stampBoard(node, d) {
  setStamp(node, "permBuildBoard", JSON.stringify({
    project: d.project || "", baseNodeId: d.baseNodeId || "",
    configVer: d.configVer || "", date: d.date || "",
  }));
}

// LAST RESORT ONLY. If the file already contains a CONNECTOR (most flow files do — they carry FigJam
// nodes), CLONE it and re-point the endpoints instead; the clone stays a real connector and attaches:
//   const c = src.clone(); src.parent.appendChild(c);
//   c.connectorStart = { endpointNodeId: startId, magnet: "BOTTOM" };
//   c.connectorEnd   = { endpointNodeId: boardId, magnet: "TOP" };
// Use elbowLink only when there is no connector anywhere to clone (figma.createConnector is blocked
// in design mode). REMIND THE USER: this vector never auto-attaches — it will not follow the nodes.
function elbowLink(section, name, sx, sy, ex, ey, color, weight) {
  const midY = ey - 120, minX = Math.min(sx, ex), minY = Math.min(sy, ey);
  const P = (x, y) => (x - minX) + " " + (y - minY);
  const v = figma.createVector();
  v.name = name; section.appendChild(v);
  v.x = minX; v.y = minY;
  v.vectorPaths = [{ windingRule: "NONE", data: "M " + P(sx, sy) + " L " + P(sx, midY) + " L " + P(ex, midY) + " L " + P(ex, ey) }];
  v.strokes = [{ type: "SOLID", color: color }]; v.strokeWeight = weight; v.fills = []; v.strokeJoin = "MITER";
  return v;
}

// Build in chunks of ~10 cells per figma_execute call on big files; every call starts with guard().

if (typeof figma === "undefined") {
  // syntax self-check only — factories need the plugin runtime
  const A = (c, m) => { if (!c) throw new Error("FAIL: " + m); };
  A(typeof guard === "function" && typeof alFrame === "function" && typeof finalizeFixed === "function", "factories defined");
  A(typeof placeholder === "function" && typeof stampCase === "function" && typeof elbowLink === "function", "all exports");

  const mockNode = plainWorks => {
    const store = { plain: {}, shared: {} };
    return { store,
      setPluginData(k, v) { if (!plainWorks) throw new Error("setPluginData is not supported in this host runtime"); store.plain[k] = v; },
      setSharedPluginData(ns, k, v) { store.shared[ns + "/" + k] = v; } };
  };
  const C = { caseId: "screen/default", level: "S", tier: 1, priority: "must" };
  let m = mockNode(true); stampCase(m, C); stampBoard(m, { project: "NEXT" });
  A(m.store.plain.permBuild && m.store.plain.permBuildBoard && Object.keys(m.store.shared).length === 0, "Bridge: plain store only, shared untouched");
  m = mockNode(false); stampCase(m, C); stampBoard(m, { project: "NEXT" });
  A(JSON.parse(m.store.shared["permBuild/permBuild"] || "{}").caseId === "screen/default", "use_figma: stampCase falls back to shared 'permBuild'");
  A(JSON.parse(m.store.shared["permBuild/permBuildBoard"] || "{}").project === "NEXT", "use_figma: stampBoard falls back to shared 'permBuild'");

  const throws = fn => { try { fn(); return false; } catch (e) { return true; } };
  globalThis.figma = { root: { name: "My file" } };
  A(!throws(() => guard("My file")) && throws(() => guard("Other file")), "Bridge: guard matches the file name");
  globalThis.figma = { root: { name: "Document" }, fileKey: "KEY123" };
  A(!throws(() => guard("KEY123")) && throws(() => guard("OTHERKEY")), "use_figma: root.name is always 'Document' → guard matches the fileKey");
  delete globalThis.figma;
  // caption helpers — two of four projects build captions from library instances
  const mkText = (chars, lh) => { const t = { type: "TEXT", visible: true, _c: chars, lh, getRangeAllFontNames: () => [], get characters() { return this._c; }, set characters(v) { this._c = v; }, get height() { return this._c.split("\n").length * this.lh; } }; return t; };
  const a = mkText("Case #1 - Short\n", 36), b = mkText("Case #2 - A label that wraps\nonto a second line\n", 36);
  equalizeRow([a, b], 72);
  A(a.height === b.height && a.height === 108, "equalizeRow pads with trailing newlines up to the tallest, got " + a.height + "/" + b.height);
  const solo = mkText("Case #1", 36); equalizeRow([solo], 72);
  A(solo.height === 72, "equalizeRow honours the floor");
  const calls = [];
  const gridMock = { appendChildAt(n, r, c) { calls.push("at " + r + "," + c + " span" + n.gridColumnSpan); } };
  const header = { gridColumnSpan: 4 };            // a span carried over from somewhere else must not reach the grid
  placeInGrid(gridMock, header, 0, 0, 3);
  A(calls[0] === "at 0,0 span1" && header.gridColumnSpan === 3, "placeInGrid appends at span 1, then widens");
  A(typeof freshInstance === "function" && typeof setInstanceTexts === "function" && typeof gridFrame === "function", "instance + grid factories");
  console.log("scaffold-kit self-check OK");
}
