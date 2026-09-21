---
name: figma-permutation-build
description: |
  Enumerate permutations / states / edge cases for a screen, then (on request) scaffold a real
  Permutation board in Figma. Reads the base screen → detects archetype and the components on it →
  enumerates cases at 2 levels (screen-wide + per-component) from the team's permutation library →
  proposes a prioritized matrix to trim (stop here for just the case list, nothing is written) →
  scaffolds the board: Case#N labels + empty screen slots, laid out the way that project lays out
  boards (flow+link / grid-matrix / section-per-tab). AUDIT mode reports fill progress.
  This phase does NOT design the screens inside the cases — scaffold only.
  Use when: "แตกเคส", "สร้าง permutation", "วางโครง permutation board", "generate cases",
  "generate state", "คิด state ให้หน่อย", "จอนี้ลืม state อะไรไหม", "state ครบยัง",
  "edge case มีอะไรบ้าง", "ก่อนส่ง dev ขาดอะไร", "เช็ค state ก่อน handoff",
  "list state ที่ต้องทำ", "empty/error/loading มีหมดยัง".
compatibility: "Reading the base and writing the scaffold work through the official Figma MCP (use_figma). Reading/auditing large existing permutation boards — and any board stamped via the Bridge — requires the figma-console Desktop Bridge (official MCP overflows on big boards and cannot read plain pluginData)."
---

# figma-permutation-build

## About
- **Role**: Permutation planner — enumerate a base screen's cases from the team's
  library and scaffold its board on canvas. Coverage auditor, never a screen designer.
- **Version**: 2026-09-21 (history in CHANGELOG.md)
- **Author / Editor**: DX Gang
- **Maintenance**: behavior changes bump this date + add a CHANGELOG entry; doc-only edits don't.

Enumerate a screen's cases and scaffold its Permutation board — **phase 1 = structure + cases only;
filling the screens inside the cases is phase 2 (planned — not built yet)**.
**Reply to the user in Thai**; keep layer / token / technical names in English.
Keep replies concise — use the report shapes defined per phase, no extra prose.

## When to use / not use
- Use: there is one base screen, and you want to know which cases it should have, and/or want the board scaffolded on canvas
- **Required input**: one base screen (selection or node id). Nothing selected or named → ask which screen first; never walk the page to find one
- Not for: design-quality review · raw-value/override QA against the DS · token binding · building new screens
- This skill is about **coverage** (which cases should exist), not **quality** (raw values / overrides)
- **Only variants of the given base.** Separate module screens (an eKYC chain, a full-screen consent) belong to their own base → tell the user to run this skill on that screen instead; never fan out across screens
- **More than one base given → STOP and ask the relationship before enumerating anything** — enumerating each one blindly yields near-identical boards. Three answers, three behaviors:
  - **states of one screen** → ONE board on the user-designated default base; **diff the given screens first** and add only difference-driven cases (what varies between the states is the case list)
  - **related but separate screens** → one run per screen, each enumerated from **that screen's own visible components** — never seeded from a sibling's case list
  - **mockup / template** → ask what the template must parameterize (which slots vary, which are fixed) before enumerating; if the user can't say, deliver the case list for ONE screen and stop

## Pipeline (stoppable) — each phase has a GATE; do not proceed past a failing gate
```
Base → [1]Profile → [2]Enumerate → [3]Confirm ◄ stop here = case list, nothing written
                                       → [4]Scaffold → [5]Verify → board on canvas
LEARN = teach a new project's layout + project-specific cases   AUDIT = re-scan + fill progress
```

| Gate | Must hold before moving on | Enforced by |
|---|---|---|
| **G0** | write probe OK · project resolved (see Project index) | Phase 0 |
| **G1** | board style measured on the **nearest sibling board in the same SECTION** (one call); no sibling → `projects/<name>.md` §Board anatomy, verified in this file | `scripts/harvest-board.js` **run verbatim** |
| **G2** | every row bucketed ✓ / ✗ / ⊘-with-reason | Phase 2 |
| **G3** | user confirmed matrix + placement | AskUserQuestion |
| **G4** | build uses `scripts/scaffold-kit.js` factories · chunked · guarded | Phase 4 |
| **G5** | `scripts/verify-board.js` returns `pass: true` — cells, stamps, labels, slots, overlap, **inside its section, link attached** | Phase 5 |

## Project index (Phase 0 detection — details in each projects/<name>.md)
> Read the signals in this order: **screen / section / board naming → sibling boards → variables**. Naming decided every run; variables misled once (a partner screen inside another project's flow).
| Project | Detect signals | File |
|---|---|---|
| **NEXT** | collections `❖ NEXT` + `3. Size` + `4. Typography` · file name contains "NEXT" | `projects/next.md` |
| **DGL Revamp** | screens named `[MMM][YY].[EPIC].[N].[N]_DGL Revamp_NX_…` · legacy 375-wide · `Krungthai Fast` — **runs in the NEXT app but is NOT NEXT** | `projects/dgl.md` |
| **CLICX** (PB) | collections `color` `spacing` `radius` `size-generic` · screens named `X.NN-NN.A \| name` | `projects/clicx.md` |
| **PTP** (Paotang) | flow screens are INSTANCES named `PTP/<Module>/<Screen>_<MonYYYY>` · product font Kanit · boards named `Permutation: Pg_<Name>` | `projects/ptp.md` |

---

## MODE: BUILD (default)

### Phase 0 — Preflight + detect
1. **Probe write access** (if heading for Scaffold): run `const n=figma.createRectangle();n.remove();` — a throw means view-only, stop and tell the user
2. **Detect the project**: from a sample node in the base → `get_variable_defs` (official MCP) or resolve `boundVariables` → match the collection names against the "About" section of each `projects/<name>.md`. If the user names the project, skip detection. No match → fall back to generic Tier 1/2 and offer LEARN. **The board's project follows the FLOW, not the screen's own DS**: a screen from another design system embedded in the flow (e.g. a partner-app webview inside a NEXT flow — it binds another font and color set, no `❖ NEXT`) still gets the flow's board style. When variable signals disagree with the screen name / section name / sibling boards → go with the flow signals, say so in the profile, and let G1 confirm
3. Load `projects/<name>.md` in full, plus the references needed (see the References table)

### Phase 1 — Profile (read-only)
- Traverse **selection scope only** (never walk the whole page — node cap / slow), and **skip `visible === false` subtrees** — a hidden component must not produce cases. Collect: archetype signals, component instances, lists/images, bound variable modes
- **Map components → categories** using the `component → category` table in `projects/<name>.md` (key or name pattern) — **of the screen's OWN design system**: a partner screen embedded in another project's flow is mapped with its own project's table, while the board still follows the flow (Phase 0). Rows are checked top-down, NOT-a-pack rows first. No match → **flag "unmapped component — add it to projects/<name>.md"; never guess**
- **Find existing cases**: run `scripts/scan-cases.js` (selection / siblings) to locate `Permutation*` containers and `Case#N` labels. If nothing is found with confidence → **ask the user where cases are kept; never assume there are none**
- Take one screenshot of the base as the visual arbiter
- **Report the profile** in this shape (values are an example):
```
Profile — [archetype] form+list · [components] 6 mapped · 1 unmapped ⚠️ "promo widget" → add to projects/next.md
[existing] "Permutation: Home" 12 cases (scan-cases.js) · [base] 12:345 · screenshot ✓
```

### Phase 2 — Enumerate → matrix
- **Load §Screen facts from `projects/<name>.md` first** — any case listed there for this screen is pre-bucketed **⊘ with the stored reason** before enumeration starts. The library's Tier-1 states are generic; only the project file knows what this screen can never be (e.g. CLICX Home is never empty — a savings account already exists)

Combine (details in `references/case-library.md` + `references/archetype-cases.md`):
- **L1 screen-level**: the archetype's states + the FigJam Screen group
- **L2 component-level**: for each component found in Phase 1, pull its pack (+ chained packs, e.g. a Date Picker also suggests Calendar / Roller)
- **Tier 2** templates the flow actually uses (parameterized) + **Tier 3** from `projects/<name>.md`
- **Walk every row and sort into 3 buckets — never skip silently**: ✓ already exists / ✗ missing (+priority) / ⊘ N/A (+the reason, grounded in the real screen)
- Priority: 🔴 Must (breaks the flow / user stuck / money at risk) · 🟡 Should · ⚪ Edge · **fintech modifier: money/confirmation cases move up one level**
- **Multiply** only along the axes declared in `projects/<name>.md` (device / language / branch / partner / stage) — never explode the full cartesian

### Phase 3 — Confirm ◄ stopping point
Show the **matrix inline, in Thai**:
```
N total → minus existing / N-A → M remaining → proposing 🔴x 🟡y ⚪z
| Case# | level | group | description | priority | source (tier) | bucket |
| Case#4 | S | Screen | Error (full screen) — กรณีโหลด/ดึงข้อมูลไม่ได้ทั้งจอ (`screen/error-full`) | 🔴 | T1 archetype | ✗ |
| Case#7 | C | Text Field | Error — ไม่กรอก (`textfield/*`) | 🟡 | T1 pack | ✗ |
| — | S | Screen | Default — กรณีเข้าจอครั้งแรก (`screen/default`) | — | T1 | ✓ มีแล้ว |
| — | S | Screen | Empty (`screen/empty`) — เป็นไปไม่ได้: มีบัญชี savings เสมอ | — | §Screen facts | ⊘ |
```
(rows are examples — real ids and captions always come verbatim from `case-library.md` / §Screen facts)
The table shows **every row of every pack pulled for this screen — ✓ existing and ⊘ N/A (with its reason) included, not just the ✗ proposals**. A row that never appears is where dropped cases hide — a full table makes an omission visible instead of silent. ⊘ rows may be grouped at the bottom.
plus where the board will be placed. **The user trims / adds / reorders, then confirms. Nothing is written before that.**

- **Trims are classified, and "impossible" trims are persisted.** When the user cuts a case, ask which kind it is: **เป็นไปไม่ได้ (business rule)** → append a row to `projects/<name>.md` §Screen facts (screen · caseId · reason · date) so the next run pre-buckets it automatically · **แค่รอบนี้** → drop without persisting.
- **CTA reminder**: if Phase 1 found CTA buttons on the base, add one line to this message — case specs should state where each CTA navigates (CLICX grammar: the 🔗 marker line). Targets come from the brief; unknown → `⚠️ ยืนยัน target`.

Anyone who only wanted the case list stops here.

### Phase 4 — Scaffold
**Gate G1 first: a sibling board in the same SECTION → run `scripts/harvest-board.js` VERBATIM on the nearest one, every time** — one call, and projects run several dialects (per flow, per page), so the neighbour outranks the project file. It differs from `projects/<name>.md` → follow the neighbour and record the variant in the project file. No sibling → use §Board anatomy (harvest any team board in the file if it was never verified here). Never a hand-shortened harvest (it drops items, e.g. the links). Record the base's node count now (for G5). Then build:
0. **Sibling-duplicate guard**: run `scripts/scan-cases.js` over the sibling boards in the same section first; if the confirmed case set is **≥90% identical (by caseId) to a sibling board whose base is a different screen** → stop and confirm with the user before building — an enumeration that ignores its own base produces exactly this signature. Siblings without stamps carry no caseIds → compare by case **names**; if that is not possible either, report `guard skipped — siblings unstamped` instead of passing silently
1. **Paste `scripts/scaffold-kit.js` as the prelude** of the build call, then write project-specific code with its factories (`alFrame` → append → `finalizeFixed` / `growWithContent`; `placeholder`; `stampCase`/`stampBoard`; captions from a library component: `freshInstance` + `setInstanceTexts` + `equalizeRow`; GRID groups: `gridFrame` + `placeInGrid`; `elbowLink`) — the factories encode the auto-layout ordering that otherwise silently collapses frames
2. One board container, `stampBoard`-ed — **everything goes inside it** (rollback = delete that one node + its screen→board link, which has to live on the SECTION)
3. Placement from `siblingBoards`: pick a column count whose width fits the free span. **No free span where the project's ordering puts this board** (or the slot is narrower than the project's minimum board width) → **STOP and ask the user where it goes** — never squeeze the board, resize the team's section, or relocate it silently. Read the board's width back after the first group is appended, before building the rest
4. Per case: label node (project's label style) + caption nodes + `placeholder()` + `stampCase()`
5. Draw the screen→board link if the project uses one: **clone a healthy team CONNECTOR and re-point `connectorStart` / `connectorEnd`** — anchor, route, caps and the clone ladder (the clone gate is per runtime: Bridge throws → `use_figma`; all blocked → the user duplicates one and you re-point it; a VECTOR is a placeholder that never attaches) are in `board-grammar.md` §Link rule. Pass the link's id to G5 as `linkId` — it fails a line that is unattached, capless, or does not start at the screen's bottom edge
6. Chunks of ~10 cells per call; every call starts with `guard(<file name>)` on the Bridge · `guard(<fileKey>)` under use_figma

### Phase 5 — Verify + report (gate G5)
- **Run `scripts/verify-board.js`** with CONFIG from `projects/<name>.md` §Verify config (label style · slot sizes · expected case count · baseNodeId + node count from G1 · `linkId`). **The scaffold is done only when `pass: true`.** Never hand-write a subset of these checks
- Screenshot the board (≤3 rounds) and eyeball against the matrix — the script checks structure, the screenshot checks looks
- Report in Thai, in this shape (values are an example):
```
สรุป: 14 cells → 🔴5 🟡6 ⚪3 · S:8 C:6 · T1:10 T2:3 T3:1
🔗 figma.com/design/…?node-id=… · rollback: ลบ board "Permutation: Home" + เส้น link ของมัน
fill ต่อ: Case#2 #5 #9 (🔴 ก่อน) · renumber อัตโนมัติ: ใช้ได้ (strict) · จอถัดไป: eKYC intro
```

---

## MODE: LEARN (teach a new project / refresh its layout)
1. The user points at an existing permutation board for that project (URL / node id) + its FigJam if any
2. Read the board (**Bridge required** — see Runtime table) → run `harvest-board.js` → capture **school + grammar** (described in words and ratios, never per-screen geometry) and one exemplar's default cell/gap dimensions
3. Harvest **Tier-3 packs** from the captions on the board (grouped by screen / component / module)
4. Draft `projects/<name>.md` from `projects/_template.md` → **user confirms** → save with the date
5. Import-test: open 2–3 anchor nodes and confirm they resolve before saving — report e.g. `import-test 3/3 anchors ✓ (board 12:88 · label 12:91 · connector 12:99) → saved projects/<name>.md`

## MODE: AUDIT (idempotent re-run + fill progress)
`scripts/scan-cases.js` reads `pluginData("permBuild")` inside the board and diffs against the current matrix:
- **Missing** (in the matrix, absent on the board) → offer to add the cell
- **Stale** (base changed after the build; compare baseNodeId + date) → offer to refresh the caption
- **Orphan** (on the board, not in the matrix) → **report only, never delete**
- **Fill progress**: count `status:"spec"` vs `"designed"` per priority (designed = the cell holds real content beyond the placeholder)

Report in this shape (values are an example):
```
AUDIT "Permutation: Home" — matrix 14 · board 13
missing 2 (`screen/error-full`, `textfield/*` error) → เสนอเพิ่ม cell
stale 1 (Case#3 — base แก้หลัง build) → เสนอ refresh caption
orphan 1 (Case#13) → รายงานเฉย ๆ · fill: 🔴 3/5 🟡 1/6 ⚪ 0/3 designed
```

---

## THE CONTRACT (shared by every file and mode — do not change casually)

**Caption**: there must be a **single label node** per case, in the project's label style (below). The default is `Case#N` / `Case #N` — the whole string, matching the strict-label regex `/^\s*Case\s*#?\s*(\d+)\s*$/`. **How many other nodes (case name, description) and which language they use is per-project** — see `projects/<name>.md` §Board anatomy.

**Standard-case naming**: a case that exists in `case-library.md` keeps its library `id` and caption **verbatim** — never re-word a standard situation, and never invent a new name for one (e.g. "Session timeout" on one board and "Network reconnect" on its sibling). New recurring situation → propose it as a library addition. Captions refer to sections/components by the **team's names from the component → category map** in `projects/<name>.md`, never the model's own labels — an unmapped component is already flagged in Phase 1, so by caption time every name has a source.

> **🔴 Hard rule: harvest before scaffold.** Board style **differs per project** (spacing · weight · lineHeight · node count · link style). Before writing, run **Gate G1** (Phase 4): the nearest sibling board is the ground truth.
> Never build from memory, from defaults, or from another project. No existing board at all → use the project file's defaults; none there either → **ask the user**.

**Placeholder frame** (phase 1): sized like the project's real screen slot, with a centered label
`◻︎ Case Spec — awaiting design`. **Never use the words "Pending Design"** — on some boards that is a real status for a case the team hasn't designed yet.

**pluginData** — written ONLY through `scaffold-kit.js` stamps:
- cell key `"permBuild"`: `{ caseId, level:"S"|"C", tier:1|2|3, priority:"must"|"should"|"edge", status:"spec"|"designed", baseNodeId, configVer, date }` — `caseId` = the stable semantic id from `case-library.md` (stable across renumbering, not the Case# number)
- board key `"permBuildBoard"`: `{ project, baseNodeId, configVer, date }` — lets AUDIT find boards even if renamed, and ties a board to its base
- **Store note**: stamps follow the runtime — `scaffold-kit.js` writes *plain* pluginData on the Bridge and falls back to *shared* pluginData (namespace `"permBuild"`) under use_figma, where plain throws (live-verified on both, 2026-09-21). `scan-cases.js` / `verify-board.js` read both. One asymmetry remains: a **plain-stamped board** (built on the Bridge — every board before 2026-09-21) is invisible under use_figma → AUDIT it via the Bridge. A shared-stamped board reads on both

**Label styles** (per project, in `projects/<name>.md` §Verify config):
- `strict` = the label node is exactly `Case#N` → **renumber-compatible**: any renumbering tool or script that matches the strict-label regex can rewrite the numbers safely (NEXT)
- `loose` = `Case #N - <name>` in one node (CLICX) → NOT renumber-compatible; renumbering there is manual — say so in the report
- `indexed` = `<g>.<n> | <name>` or `#<n>[.<m>] <name>` in one node (PTP — two flow dialects) — no "Case" word at all → NOT renumber-compatible. Use it only when the project file says so; the scripts recognize all three

**Board container**: named per the project's convention. `scan-cases.js` recognizes `Permutation:` (NEXT early boards, PTP) / `Permutation_` / `… Permutations` / CLICX `X.NN-NN.B`, plus any `permBuildBoard`-stamped node. **Everything is written inside it, so deleting that one node rolls back the whole build** — the screen→board link is the one exception (it sits on the SECTION); delete it too.

**Layout schools** (details in `references/board-grammar.md`): A flow+link · B grid-matrix · C section-per-tab. The school is a field in `projects/<name>.md` and projects can mix them.

---

## Runtime & write idiom
| Task | Runtime |
|---|---|
| Profile a single base screen + write the scaffold | **official MCP `use_figma` (primary)** · Bridge as fallback — stamps land in the store the runtime allows (§pluginData Store note) |
| Read / audit a large existing permutation board | **figma-console Bridge required** (official MCP overflows on big boards — proven 2026-07-24) |
| Clone + re-point the screen→board CONNECTOR | **try the active runtime; Bridge throws in some files where `use_figma` succeeds (proven 2026-08-18)** |

- **`guard(<EXPECTED>)`** at the top of every write batch (the desktop's active file can drift). Bridge: pass the file **name**. use_figma: pass the **fileKey** — `figma.root.name` is always `"Document"` there (verified 2026-09-21), so a name guard throws on every call
- **use_figma starts every call on the file's FIRST page, with no user selection** (verified 2026-09-21) → put `await figma.setCurrentPageAsync(<page>)` above every script — the *paste verbatim* ones included — address nodes by id, and scope `scan-cases.js` yourself with `figma.currentPage.selection = [<section node>]`; without it the scan walks the whole first page
- **Only touch what this skill created; never modify the base** — phase 1 does not even clone screens
- **Never call `figma.commitUndo()` under use_figma** (it throws and the whole atomic batch silently no-ops)
- On the Bridge, use **`getNodeByIdAsync`** only (`getNodeById` throws under documentAccess: dynamic-page)
- `loadFontAsync` before setting characters; text inside an INSTANCE must go through `figma_set_instance_properties` (direct assignment fails silently)
- **Auto-layout ordering matters**: set `layoutMode` **first**, then `resize()`, then finish with the sizing modes. Resizing before layoutMode silently leaves a frame hugging (an 844-tall placeholder collapses to ~21px). A container that must grow with its content gets `counterAxisSizingMode = "AUTO"` **after** all children are appended
- **Verify by reading values back** (placeholder and container width/height) — never assume a set stuck

## References (read when)
| File | When |
|---|---|
| `references/case-library.md` | Phase 2 — the 2-level case base (Tier 1/2), caption templates, chain links |
| `references/archetype-cases.md` | Phase 1–2 — archetype → signature cases + the 9 permutation axes |
| `references/board-grammar.md` | Phase 4 — cross-project grammar + **the 10-item harvest checklist** (contains no project-specific numbers) |
| `scripts/scan-cases.js` | Phase 1 (existing cases) + AUDIT — inventory, fill status, label-style stats · set `DETAIL = false` under use_figma |
| `scripts/harvest-board.js` | **Gate G1** — captures the team's board style (shell · spacing · fonts · links · neighbours) |
| `scripts/scaffold-kit.js` | **Phase 4 prelude** — build factories (sizing-order-safe frames, placeholder, stamps, instance captions, GRID, elbow link) |
| `scripts/smoke-test.js` | First run on a new machine — proves the runtime can write, stamp and guard (creates and removes one throwaway frame) |
| `scripts/verify-board.js` | **Gate G5** — the full check battery; scaffold is done only on `pass: true` |
| `projects/<name>.md` | Phase 0–5 — board anatomy, school, naming, component map, Tier-3 packs, **§Verify config** |

## Principles
Store **grammar, not per-screen geometry** (measure live, or use the project file's defaults) · **exact match only** — if detection or mapping is uncertain, flag it, never guess · **walk every row**, never skip silently · business values (fees, limits) must come from the brief, otherwise mark them `⚠️ ยืนยันค่า` — never invent numbers.
