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
  "list state ที่ต้องทำ", "empty/error/loading มีหมดยัง". (replaces ui-state-edge-generator)
compatibility: "Reading the base and writing the scaffold work through the official Figma MCP (use_figma). Reading/auditing large existing permutation boards requires the figma-console Desktop Bridge (official MCP overflows on big boards)."
---

# figma-permutation-build

Enumerate a screen's cases and scaffold its Permutation board — **phase 1 = structure + cases only;
the screens inside the cases are phase 2 (not built yet)**.
**Reply to the user in Thai**; keep layer / token / technical names in English.

## When to use / not use
- Use: there is one base screen, and you want to know which cases it should have, and/or want the board scaffolded on canvas
- Not for: design-quality review (→ `ux-audit`) · raw-value/override QA against the DS (→ `figma-design-qa`) · token binding (→ `figma-design-fix`) · building new screens (→ `figma-design-build`)
- This skill is about **coverage** (which cases should exist), unlike figma-design-qa which is about **quality** (raw values / overrides)
- **Only variants of the given base.** Separate module screens (an eKYC chain, a full-screen consent) belong to their own base → tell the user to run this skill on that screen instead; never fan out across screens

## Pipeline (stoppable) — each phase has a GATE; do not proceed past a failing gate
```
Base → [1]Profile → [2]Enumerate → [3]Confirm ◄ stop here = case list, nothing written
                                       → [4]Scaffold → [5]Verify → board on canvas
LEARN = teach a new project's layout + project-specific cases   AUDIT = re-scan + fill progress
```

| Gate | Must hold before moving on | Enforced by |
|---|---|---|
| **G0** | write probe OK · project resolved (see Project index) | Phase 0 |
| **G1** | `projects/<name>.md` §Board anatomy verified against a live board in THIS file | `scripts/harvest-board.js` **run verbatim** |
| **G2** | every row bucketed ✓ / ✗ / ⊘-with-reason | Phase 2 |
| **G3** | user confirmed matrix + placement | AskUserQuestion |
| **G4** | build uses `scripts/scaffold-kit.js` factories · chunked · guarded | Phase 4 |
| **G5** | `scripts/verify-board.js` returns `pass: true` | Phase 5 |

## Project index (Phase 0 detection — details in each projects/<name>.md)
| Project | Detect signals | File |
|---|---|---|
| **NEXT** | collections `❖ NEXT` + `3. Size` + `4. Typography` · file name contains "NEXT" | `projects/next.md` |
| **DGL Revamp** | screens named `[MMM][YY].[EPIC].[N].[N]_DGL Revamp_NX_…` · legacy 375-wide · `Krungthai Fast` — **runs in the NEXT app but is NOT NEXT** | `projects/dgl.md` |
| **CLICX** (PB / Im) | collections `color` `spacing` `radius` `size-generic` · screens named `X.NN-NN.A \| name` | `projects/clicx.md` |

---

## MODE: BUILD (default)

### Phase 0 — Preflight + detect
1. **Probe write access** (if heading for Scaffold): run `const n=figma.createRectangle();n.remove();` — a throw means view-only, stop and tell the user
2. **Detect the project**: from a sample node in the base → `get_variable_defs` (official MCP) or resolve `boundVariables` → match the collection names against the "About" section of each `projects/<name>.md`. If the user names the project, skip detection. No match → fall back to generic Tier 1/2 and offer LEARN
3. Load `projects/<name>.md` in full, plus the references needed (see the References table)

### Phase 1 — Profile (read-only)
- Traverse **selection scope only** (never walk the whole page — node cap / slow). Collect: archetype signals, component instances, lists/images, bound variable modes
- **Map components → categories** using the `component → category` table in `projects/<name>.md` (key or name pattern). No match → **flag "unmapped component — add it to projects/<name>.md"; never guess**
- **Find existing cases**: run `scripts/scan-cases.js` (selection / siblings) to locate `Permutation*` containers and `Case#N` labels. If nothing is found with confidence → **ask the user where cases are kept; never assume there are none**
- Take one screenshot of the base as the visual arbiter
- **Report the profile**: archetype, components found (+ unmapped), existing cases

### Phase 2 — Enumerate → matrix
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
| Case# | level | group | description | priority | source (tier) |
```
plus where the board will be placed. **The user trims / adds / reorders, then confirms. Nothing is written before that.**
Anyone who only wanted the case list stops here.

### Phase 4 — Scaffold
**Gate G1 first (mandatory): run `scripts/harvest-board.js` VERBATIM** against a board the team already made in that file — never a hand-shortened version (a shortened harvest missed a connector in the pilot). It returns all 10 items (shell · spacing per level · font + weight + lineHeight · colors · caption shape · slot sizes · sub-groups · links incl. `otherLinesNearby` · placement + `siblingBoards` · naming). Compare with `projects/<name>.md`; if it differs or is missing, **update the project file first**. Record the base's node count now (for G5). Then build:
1. **Paste `scripts/scaffold-kit.js` as the prelude** of the build call, then write project-specific code with its factories (`alFrame` → append → `finalizeFixed` / `growWithContent`; `placeholder`; `stampCase`/`stampBoard`; `elbowLink`) — the factories encode the auto-layout ordering that silently collapsed frames in both pilots
2. One board container, `stampBoard`-ed — **everything goes inside it** (rollback = delete that one node)
3. Placement from `siblingBoards`: pick a column count whose width fits the free span
4. Per case: label node (project's label style) + caption nodes + `placeholder()` + `stampCase()`
5. Draw the screen→board link if the project uses one (design files: `elbowLink` + tell the user it doesn't auto-attach)
6. Chunks of ~10 cells per call; every call starts with `guard(<file name>)`

### Phase 5 — Verify + report (gate G5)
- **Run `scripts/verify-board.js`** with CONFIG from `projects/<name>.md` §Verify config (label style · slot sizes · expected case count · baseNodeId + node count from G1). **The scaffold is done only when `pass: true`.** Never hand-write a subset of these checks
- Screenshot the board (≤3 rounds) and eyeball against the matrix — the script checks structure, the screenshot checks looks
- Report in Thai: counts by tier / level / priority · deep link · rollback recipe · **suggested fill order (Must first)** · renumber-compat note (from scan stats) · other module screens in the flow worth running next

---

## MODE: LEARN (teach a new project / refresh its layout)
1. The user points at an existing permutation board for that project (URL / node id) + its FigJam if any
2. Read the board (**Bridge required** — large boards overflow the official MCP) → run `harvest-board.js` → capture **school + grammar** (described in words and ratios, never per-screen geometry) and one exemplar's default cell/gap dimensions
3. Harvest **Tier-3 packs** from the captions on the board (grouped by screen / component / module)
4. Draft `projects/<name>.md` from `projects/_template.md` → **user confirms** → save with the date
5. Import-test: open 2–3 anchor nodes and confirm they resolve before saving

## MODE: AUDIT (idempotent re-run + fill progress)
`scripts/scan-cases.js` reads `pluginData("permBuild")` inside the board and diffs against the current matrix:
- **Missing** (in the matrix, absent on the board) → offer to add the cell
- **Stale** (base changed after the build; compare baseNodeId + date) → offer to refresh the caption
- **Orphan** (on the board, not in the matrix) → **report only, never delete**
- **Fill progress**: count `status:"spec"` vs `"designed"` per priority (designed = the cell holds real content beyond the placeholder)

---

## THE CONTRACT (shared by every file and mode — do not change casually)

**Caption**: there must be a **single label node** whose entire string is `Case#N` / `Case #N` (must satisfy the `renumber-cases` regex `/^\s*Case\s*#?\s*(\d+)\s*$/`). **How many other nodes (case name, description) and which language they use is per-project** — see `projects/<name>.md` §Board anatomy.

> **🔴 Hard rule: harvest before scaffold.** Board style **differs per project** (spacing · weight · lineHeight · node count · link style). Before writing into a file you have not built in before, run **`scripts/harvest-board.js`** on a board the team made, then reconcile `projects/<name>.md`.
> Never build from memory, from defaults, or from another project. No existing board at all → use the project file's defaults; none there either → **ask the user**.
> *(Pilot 2026-07-27 got this wrong twice by guessing: caption shape first, then weight/lineHeight — one harvest would have caught both.)*

**Placeholder frame** (phase 1): sized like the project's real screen slot, with a centered label
`◻︎ Case Spec — awaiting design`. **Never use the words "Pending Design"** — on some boards that is a real status for a case the team hasn't designed yet.

**pluginData** — written ONLY through `scaffold-kit.js` stamps:
- cell key `"permBuild"`: `{ caseId, level:"S"|"C", tier:1|2|3, priority:"must"|"should"|"edge", status:"spec"|"designed", baseNodeId, configVer, date }` — `caseId` = the stable semantic id from `case-library.md` (stable across renumbering, not the Case# number)
- board key `"permBuildBoard"`: `{ project, baseNodeId, configVer, date }` — lets AUDIT find boards even if renamed, and ties a board to its base

**Label styles** (per project, in `projects/<name>.md` §Verify config):
- `strict` = the label node is exactly `Case#N` → **renumber-cases compatible** (NEXT)
- `loose` = `Case #N - <name>` in one node (CLICX) → NOT renumber-compatible; renumbering there is manual — say so in the report

**Board container**: named per the project's convention. `scan-cases.js` recognizes `Permutation:` / `Permutation_` / `… Permutations` / CLICX `X.NN-NN.B`, plus any `permBuildBoard`-stamped node. **Everything is written inside it, so deleting that one node rolls back the whole build.**

**Layout schools** (details in `references/board-grammar.md`): A flow+link · B grid-matrix · C section-per-tab. The school is a field in `projects/<name>.md` and projects can mix them.

---

## Runtime & write idiom
| Task | Runtime |
|---|---|
| Profile a single base screen + write the scaffold | **official MCP `use_figma` (primary)** · Bridge as fallback |
| Read / audit a large existing permutation board | **figma-console Bridge required** (official MCP overflows on big boards — proven 2026-07-24) |

- **`if (figma.root.name !== "<EXPECTED>") throw "wrong file";`** at the top of every write batch (the desktop's active file can drift)
- **Only touch what this skill created; never modify the base** — phase 1 does not even clone screens
- **Never call `figma.commitUndo()` under use_figma** (it throws and the whole atomic batch silently no-ops)
- On the Bridge, use **`getNodeByIdAsync`** only (`getNodeById` throws under documentAccess: dynamic-page)
- `loadFontAsync` before setting characters; text inside an INSTANCE must go through `figma_set_instance_properties` (direct assignment fails silently)
- **Auto-layout ordering matters**: set `layoutMode` **first**, then `resize()`, then finish with the sizing modes. Resizing before layoutMode silently leaves a frame hugging (a placeholder meant to be 844 tall collapsed to 21px in the pilot). A container that must grow with its content gets `counterAxisSizingMode = "AUTO"` **after** all children are appended
- **Verify by reading values back** (placeholder and container width/height) — never assume a set stuck

## References (read when)
| File | When |
|---|---|
| `references/case-library.md` | Phase 2 — the 2-level case base (Tier 1/2), caption templates, chain links |
| `references/archetype-cases.md` | Phase 1–2 — archetype → signature cases + the 9 permutation axes |
| `references/board-grammar.md` | Phase 4 — cross-project grammar + **the 10-item harvest checklist** (contains no project-specific numbers) |
| `scripts/scan-cases.js` | Phase 1 (existing cases) + AUDIT — inventory, fill status, strict/loose label stats |
| `scripts/harvest-board.js` | **Gate G1** — captures the team's board style (shell · spacing · fonts · links · neighbours) |
| `scripts/scaffold-kit.js` | **Phase 4 prelude** — build factories (sizing-order-safe frames, placeholder, stamps, elbow link) |
| `scripts/verify-board.js` | **Gate G5** — the full check battery; scaffold is done only on `pass: true` |
| `projects/<name>.md` | Phase 0–5 — board anatomy, school, naming, component map, Tier-3 packs, **§Verify config** |

## Principles
Store **grammar, not per-screen geometry** (measure live, or use the project file's defaults) · **exact match only** — if detection or mapping is uncertain, flag it, never guess · **walk every row**, never skip silently · business values (fees, limits) must come from the brief, otherwise mark them `⚠️ ยืนยันค่า` — never invent numbers.
