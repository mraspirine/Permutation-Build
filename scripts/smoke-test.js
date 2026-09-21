// smoke-test.js — run this once on a new machine (or when a build misbehaves) BEFORE the first real build.
// Paste VERBATIM into use_figma or figma_execute, in any file you may edit. It proves the three things every
// build depends on, then cleans up: it creates ONE throwaway frame far off-canvas and removes it again.
//   1. the runtime can write        2. stamps land in a store the readers can read        3. the file guard works
// Set FILE to the file NAME (figma_execute / Desktop Bridge) or the file KEY (use_figma — root.name is "Document" there).
// Node syntax self-check: `node scripts/smoke-test.js`.

const FILE = "<FILE NAME or FILE KEY>";

function guard(expected) {
  if (figma.root.name !== expected && figma.fileKey !== expected) throw "wrong file: " + figma.root.name;
}
function setStamp(node, key, json) {
  try { node.setPluginData(key, json); }
  catch (e) { node.setSharedPluginData("permBuild", key, json); }
}
function readPD(n, key) {
  try { const v = n.getPluginData && n.getPluginData(key); if (v) return v; } catch (e) {}
  try { const v = n.getSharedPluginData && n.getSharedPluginData("permBuild", key); if (v) return v; } catch (e) {}
  return "";
}

function smokeTest() {
  const out = { runtime: figma.root.name === "Document" ? "use_figma (official MCP)" : "plugin / Desktop Bridge", ready: false, checks: {} };
  try { guard(FILE); out.checks.guard = "ok"; } catch (e) { out.checks.guard = "FAIL — " + e + " · pass the file " + (figma.root.name === "Document" ? "KEY" : "NAME"); }
  let f = null;
  try {
    f = figma.createFrame(); f.name = "__permutation smoke test (safe to delete)"; f.x = -20000; f.y = -20000;
    out.checks.write = "ok";
    setStamp(f, "permBuild", JSON.stringify({ probe: 1 }));
    let store = "none";
    try { if (f.getPluginData("permBuild")) store = "plain"; } catch (e) {}
    if (store === "none") { try { if (f.getSharedPluginData("permBuild", "permBuild")) store = "shared"; } catch (e) {} }
    out.checks.stamp = readPD(f, "permBuild") ? "ok (" + store + " store)" : "FAIL — stamp not readable";
  } catch (e) {
    out.checks.write = "FAIL — " + (e && e.message || e) + " (view-only file?)";
  } finally {
    if (f) f.remove();
  }
  out.ready = Object.keys(out.checks).length === 3 && Object.keys(out.checks).every(k => out.checks[k].indexOf("ok") === 0);
  return out;
}
if (typeof figma !== "undefined") return smokeTest();

// --- node self-check (mocked runtimes) ---
const A = (c, m) => { if (!c) throw new Error("FAIL: " + m); };
const mockFigma = (rootName, fileKey, plainWorks) => ({ root: { name: rootName }, fileKey,
  createFrame() {
    const s = { plain: {}, shared: {} };
    return { remove() { s.removed = true; },
      setPluginData(k, v) { if (!plainWorks) throw new Error("not supported in this host runtime"); s.plain[k] = v; },
      getPluginData(k) { if (!plainWorks) throw new Error("not supported in this host runtime"); return s.plain[k] || ""; },
      setSharedPluginData(ns, k, v) { s.shared[ns + "/" + k] = v; }, getSharedPluginData(ns, k) { return s.shared[ns + "/" + k] || ""; } };
  } });
const runWith = (fig, file) => { globalThis.figma = fig; return eval("(" + smokeTest.toString().replace("guard(FILE)", "guard(" + JSON.stringify(file) + ")") + ")()"); };
let r = runWith(mockFigma("Document", "KEY123", false), "KEY123");
A(r.ready && /shared/.test(r.checks.stamp) && /use_figma/.test(r.runtime), "use_figma: shared store, guarded by file key");
r = runWith(mockFigma("My file", undefined, true), "My file");
A(r.ready && /plain/.test(r.checks.stamp), "Bridge: plain store, guarded by file name");
r = runWith(mockFigma("My file", undefined, true), "Other file");
A(!r.ready && /FAIL/.test(r.checks.guard), "wrong file is reported, not thrown");
let created = 0; const wrong = mockFigma("My file", undefined, true); const mk = wrong.createFrame; wrong.createFrame = function () { created++; return mk.call(this); };
r = runWith(wrong, "Other file");
A(created === 0 && !r.ready, "wrong file: nothing is created");
delete globalThis.figma;
console.log("smoke-test self-check OK");
