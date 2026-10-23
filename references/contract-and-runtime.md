# contract-and-runtime — the board contract + how to write to Figma (Phase 4–5, AUDIT)

> Read §4–5 before the first Bridge or write call (SKILL.md Phase 0 step 3), this whole file before the first WRITE call of Phase 4 (SKILL.md Phase 4 step 4), and §2 before AUDIT on a stamped board.
> It is shared by every file and mode — do not change it casually. Nothing in this file is printed to the user.

---

## 1 · THE CONTRACT

**Caption**: there must be a **single label node** per case, in the project's label style (§3). The default is `Case#N` / `Case #N` — the whole string, matching the strict-label regex `/^\s*Case\s*#?\s*(\d+)\s*$/`. **How many other nodes (case name, description) and which language they use is per-project** — see `projects/<name>.md` §Board anatomy.

**Standard-case naming**: a case that exists in `case-library.md` keeps its library `id` and caption **verbatim** — never re-worded, never renamed (e.g. "Session timeout" on one board, "Network reconnect" on its sibling). A new recurring situation → propose a library addition. Captions call sections/components by the **team's names from the component → category map**, never the model's own labels.

> **🔴 Hard rule: harvest before scaffold (Gate G1, Phase 4).** Never build from memory, from defaults, or from another project. No board and no project-file defaults → **ask the user**.

**Placeholder frame** (phase 1): sized like the project's real screen slot, with a centered label
`◻︎ Case Spec — awaiting design`. **Never use the words "Pending Design"** — on some boards that is a real status for a case the team hasn't designed yet.

**Board container**: named per the project's convention; found by name (`Permutation:` / `Permutation_` / `… Permutations` / CLICX `X.NN-NN.B`), by its `permBuildBoard` stamp, or by an attached `Permutation` connector. **Everything is written inside it** (rollback = delete that one node + its screen→board link, which has to live on the SECTION).

**Layout schools** (details in `board-grammar.md`): A flow+link · B grid-matrix · C section-per-tab. The school is a field in `projects/<name>.md` and projects can mix them.

## 2 · pluginData stamps — written ONLY through `scaffold-kit.js` (`stampCase` / `stampBoard`)
- cell key `"permBuild"`: `{ caseId, level:"S"|"C", tier:1|2|3, priority:"must"|"should"|"edge" (shown to the user as High / Medium / Low), status:"spec"|"designed", baseNodeId, configVer, date }` — `caseId` = the stable semantic id from `case-library.md` (stable across renumbering, not the Case# number)
- board key `"permBuildBoard"`: `{ project, baseNodeId, configVer, date }` — lets AUDIT find boards even if renamed, and ties a board to its base
- **Store note**: stamps follow the runtime — *plain* pluginData on the Bridge, *shared* pluginData (namespace `"permBuild"`) under use_figma, where plain throws. `scan-cases.js` / `verify-board.js` read both. A **plain-stamped board** (Bridge-built — every board before 2026-09-21) is invisible under use_figma → AUDIT it via the Bridge; a shared-stamped board reads on both
- Keep the Case# ↔ caseId map for the whole run: `stampCase()` and G5 `knownCaseIds` need it (`knownCaseIds` = every L1 id + every `tmpl/*` id + the row ids this run used — `case-library.md` header)

## 3 · Label styles (per project, in `projects/<name>.md` §Verify config)
- `strict` = the label node is exactly `Case#N` → **renumber-compatible**: any renumbering tool or script that matches the strict-label regex can rewrite the numbers safely (NEXT)
- `loose` = `Case #N - <name>` in one node (CLICX, DGL) → NOT renumber-compatible; renumbering there is manual — say so in the report
- `indexed` = `<g>.<n> | <name>` or `#<n>[.<m>] <name>` in one node (PTP — two flow dialects) — no "Case" word at all → NOT renumber-compatible. Use it only when the project file says so; the scripts recognize all three

---

## 4 · Runtime
| Task | Runtime |
|---|---|
| Profile a single base screen + write the scaffold | **official MCP `use_figma` (primary)** · Bridge as fallback — stamps land in the store the runtime allows (§2 Store note) |
| Read / audit a large existing permutation board | **figma-console Bridge required** (official MCP overflows on big boards) |
| Clone + re-point the screen→board CONNECTOR | **try the active runtime; Bridge throws in some files where `use_figma` succeeds** (`board-grammar.md` §Tool limitation) |

## 5 · Write idiom (every WRITE call)
1. **`guard(<EXPECTED>)`** at the top of every write batch (the desktop's active file can drift). Bridge: pass the file **name**. use_figma: pass the **fileKey** — `figma.root.name` is always `"Document"` there, so a name guard throws on every call
2. **use_figma starts every call on the file's FIRST page, with no user selection.** The read scripts load their own page (`scan-cases.js` via `SCOPE_ID`, `harvest-board.js` via `BOARD_HINT`, `verify-board.js` via `boardId`): paste them verbatim, edit only the CONFIG lines. Your own WRITE scripts need `await figma.setCurrentPageAsync(<page>)` first; address nodes by id
3. **Responses die around 20 KB on the official MCP** (`use_figma` AND `get_metadata`; the echoed script counts) → `DETAIL = false` (except AUDIT step 2, `learn-audit.md`), return trimmed JSON, split calls; anything bigger goes through the Bridge, where a cross-page read needs `await page.loadAsync()` first
4. **Only touch what this skill created; never modify the base** — phase 1 does not even clone screens
5. **Never call `figma.commitUndo()` under use_figma** (it throws and the whole atomic batch silently no-ops)
6. On the Bridge, use **`getNodeByIdAsync`** only (`getNodeById` throws under documentAccess: dynamic-page)
7. `loadFontAsync` before setting characters; **text inside an INSTANCE must be set through `figma_set_instance_properties`** (direct assignment fails silently). One exception: library-component captions built with the kit's `setInstanceTexts` (§6), which assigns the text nodes directly — read every string back (item 9); one that did not stick → `figma_set_instance_properties` on the Bridge, or the instance's component TEXT property via `setProperties()` under use_figma (no `figma_set_instance_properties` there)
8. **Auto-layout ordering**: `layoutMode` **first**, append the children, then lock the size — `finalizeFixed()` for a fixed slot, `growWithContent()` after the last append for a container that hugs. Resizing before `layoutMode` silently leaves a frame hugging (an 844-tall placeholder collapses to ~21px) — use the kit's factories
9. **Verify by reading values back** (placeholder and container width/height) — never assume a set stuck

## 6 · Build recipe (SKILL.md Phase 4 step 4 points here; the stops — harvest, sibling guard, placement — stay in SKILL.md)
- **Paste `scripts/scaffold-kit.js` as the prelude** of every build call and build only with its factories — frames: `alFrame` → append → `finalizeFixed` / `growWithContent` · `placeholder` · `stampCase` / `stampBoard` · library-component captions: `freshInstance` + `setInstanceTexts` + `equalizeRow` · GRID groups: `gridPlan` → `gridFrame` + `placeInGrid` · `elbowLink`. They encode the ordering that otherwise silently collapses frames
- **One board container**, `stampBoard`-ed — everything goes inside it
- **Per case**: label node (project's label style, §3) + caption nodes (verbatim; the Phase 3 CTA-target answer folded into the Description) + `placeholder()` + `stampCase()`
- **Link** (if the project uses one): **clone a healthy team CONNECTOR and re-point `connectorStart` / `connectorEnd`** — anchor, route, caps and the per-runtime clone ladder are in `board-grammar.md` §Link rule. Pass its id to G5 as `linkId`: an unattached, capless or mis-anchored line fails the gate
- **Chunks of ~10 cells per call**; every call starts with `guard(<file name>)` on the Bridge · `guard(<fileKey>)` under use_figma
- Read the board's width back after the first group
