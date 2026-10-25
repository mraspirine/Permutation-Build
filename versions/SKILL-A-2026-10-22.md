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
- **Role**: Permutation planner — enumerate a base screen's cases from the team's library and scaffold its board on canvas. Coverage auditor, never a screen designer.
- **Version**: 2026-10-22 (history in CHANGELOG.md)
- **Author / Editor**: DX Gang
- **Maintenance**: behavior changes bump this date + add a CHANGELOG entry; doc-only edits don't.

**Scope (skill phase 1)**: board structure + Cases only; filling the screens inside the Cases is skill phase 2 (planned, not built).
**Reply to the user in Thai**; keep layer / token / technical names in English. **Be concise**: the message shapes below are the whole reply — no narration, preamble or recap.

## How to talk to the user (every phase, every mode)
The user is a designer, not this skill's maintainer. Every message shows only **what Skill saw · what Skill proposes · what the user must decide**, in the words of the team's user-guide deck (Figma Slides `DcZuIPb5M4BuCrJPyfdpSU`) — never invent synonyms.
- **Voice**: `Skill` is the subject, never "ผม" ("Skill อ่าน Key Screen แล้ว" · "Skill ยังไม่รู้จัก" · "Skill ไม่เดาเอง"); the user is `ผู้ใช้ Skill` / `Designer`. Short sentences; English term first, Thai gloss after it the first time a reader may not know it
- **Words**: `Key Screen` (the base) · `Permutation Board` (always in full) · `Connector Line` (the link) · `Case` / `Cases` · `Group` (`Error Handling` · `Coupon State` · `Screen State` · `Component` …) · `Archetype (ประเภทจอ)` · `Case Library` · `Common Case` · `Placeholder` · `Confirm` · `Verify` · `Report` · `Rollback` · `BA` · AUDIT: `Missing` / `Stale` / `Orphan` + Thai gloss
- **Priority**: icon + English word in table cells — `🔴 High` · `🟠 Medium` · `🟡 Low` (never ⚪ — renders as a hollow glyph); no Thai gloss needed. Stamps keep `must` / `should` / `edge` (= High / Medium / Low)
- **⚠ in chat** = the bare glyph ⚠ as a short tag in front of the Case (`⚠ ยืนยันค่า` · `⚠ Business Rule` · `⚠ แถวส่วนลด` · `⚠ ข้อ N` = waits on Confirm question N), defined once per message: `⚠ = ต้องยืนยันกับ BA ก่อน`. Board captions keep their verbatim text (the library writes `⚠️`)
- **Never printed**: node ids · gate names (G0–G5) · tier / level (`T1`, `S/C`) · case ids (`coupon/none`) · label style (`strict`) · script names · bucket marks (✓ ✗ ⊘) · counts of any of these or of what Skill scanned. They live in stamps, `projects/<name>.md` and script JSON, shown only when asked ("ขอดูผล Verify"). **Layer names ARE printed**, with a Thai gloss: `Transaction (การ์ด จาก→ไปยัง)`
- **Questions**: one decision per AskUserQuestion box, recommended option first marked `(แนะนำ)`, in the Phase 3 order. GUARD: never 2–3 questions in one box. An answer that changes the table → show the new table briefly before the next box

## When to use / not use
- Use: one Key Screen — the user wants to know which Cases it should have, and/or wants its Permutation Board scaffolded
- Not for: design-quality review · raw-value/override QA against the DS · token binding · building new screens. This skill is **coverage** (which Cases should exist), not **quality** (raw values / overrides)
- **Only variants of the given base.** A separate module screen (eKYC chain, full-screen consent) has its own base → tell the user to run this skill on that screen; never fan out across screens

## Pipeline — each phase has a GATE; never pass a failing gate
```
Base → [0]Detect → [1]Profile → [2]Enumerate → [3]Confirm ◄ stop here = case list, nothing written
                                                   → [4]Scaffold → [5]Verify → board on canvas
LEARN = teach a new project's layout + project-specific cases   AUDIT = re-scan + fill progress
```
| Gate | Must hold before moving on |
|---|---|
| **G0** | project resolved · write probe OK — **only when heading for Scaffold** (Phases 1–3 and AUDIT are read-only) |
| **G1** | board style harvested (Phase 4 step 1: nearest team board → project file's §Board anatomy → ask) — never from memory or another project |
| **G2** | every row bucketed ✓ / ✗ / ⊘-with-reason before Phase 3 |
| **G3** | user confirmed matrix + placement (Phase 3 boxes) |
| **G4** | build per Phase 4 step 4 (kit factories · chunked · guarded) |
| **G5** | Phase 5 step 1 passes (cells, stamps, labels, slots, overlap, inside its section, link attached) |

## Project index (Phase 0)
Read the signals in this order: **screen / section / board naming → sibling boards → variables**.
| Project | Detect signals | File |
|---|---|---|
| **NEXT** | variables `Typography/font family` = Krungthai Next · `Primary/KTBlue` (Bridge: collection `❖ NEXT`) · file name contains "NEXT" | `projects/next.md` |
| **DGL Revamp** | screens named `[MMM][YY].[EPIC].[N].[N]_DGL Revamp_NX_…` · legacy 375-wide · `Krungthai Fast` — **runs in the NEXT app but is NOT NEXT** | `projects/dgl.md` |
| **CLICX** (PB) | collections `color` `spacing` `radius` `size-generic` · screens named `X.NN-NN.A \| name` | `projects/clicx.md` |
| **PTP** (Paotang) | flow screens are INSTANCES named `PTP/<Module>/<Screen>_<MonYYYY>` or `<MonYYYY>/PTP revamp/…` · product font Kanit · boards `Permutation: Pg_<Name>` or free names found by their connector | `projects/ptp.md` |

---

## MODE: BUILD (default)

### Phase 0 — Preflight + detect
1. **Required input: ONE Key Screen** (selection or node id). None → ask `Skill ต้องใช้ Key Screen 1 จอ — เลือกจอใน Figma แล้วส่งลิงก์มาได้เลย`; never walk the page to find one.
2. **More than one Key Screen → STOP and ask before enumerating** `Skill ได้ Key Screen มา N จอ — จอพวกนี้เกี่ยวกันแบบไหน` (blind runs yield near-identical boards):

   | Answer | Do |
   |---|---|
   | states of one screen | ONE board on the user-designated default base — **diff the screens first**; add only difference-driven Cases |
   | related but separate screens | one run per screen, each from **its own visible components** — never seeded from a sibling's case list |
   | mockup / template | ask which slots vary and which stay fixed; no answer → the case list for ONE screen, stop |
3. **Every Figma call**: paste scripts **verbatim**, edit only CONFIG (the read scripts load their own page) · responses die around **20 KB** → `DETAIL = false` (except AUDIT step 2), trimmed JSON, split calls · big boards → Bridge · before the first Bridge or write call read `references/contract-and-runtime.md` §4–5.
4. **Heading for Scaffold** (the user already asked for a board) — probe write access first: `const n=figma.createRectangle();n.remove();`. A throw = view-only → stop: `ไฟล์นี้ Skill แก้ไม่ได้ (สิทธิ์ดูอย่างเดียว) — ขอสิทธิ์แก้ไข หรือเอาแค่ Case List`.
5. **Detect the project** in Project-index order (variables via `get_variable_defs` / `boundVariables`) against each `projects/<name>.md` §About; the user names it → skip. **Exact match only** — unsure → say so in header ①, never guess; no match → generic Tier 1/2 + offer LEARN (header ①). **The board follows the FLOW, not the screen's own DS**: a partner screen (other font / colors, no `❖ NEXT`) gets the flow's board style; variables disagree with the naming → go with the flow, say so in the Phase 3 header, G1 confirms.
6. Read `projects/<name>.md` **in full**; other files when the References table says.

### Phase 1 — Profile (read-only, nothing sent yet)
1. Traverse the **Key Screen's own subtree only** (by its node id; use_figma has no selection) — never the whole page (node cap / slow) — **skipping every `visible === false` subtree** (GUARD: hidden layers grew phantom Cases). Collect archetype signals (`references/archetype-cases.md`), component instances, lists / images, bound variable modes.
2. **Components → categories**, in this order: the exception rows of the `component → category` table of **the screen's OWN design system** → `references/case-library.md` §Never a pack (chrome, icons, dividers: no Cases, never "unmapped") → the rest of that table, top-down (a partner screen uses its own project's table; the board still follows the flow). **No match → unmapped; never guess** → header ③ + box ①.
3. **Existing cases**: run `scripts/scan-cases.js` with `SCOPE_ID` = the base's direct parent SECTION (nested: the INNER one), `DETAIL = false` — finds boards by name, stamp or attached `Permutation` connector; reports `linkedFrom`.
   - GUARD: **a board belongs to THIS base only if its stamp `baseNodeId` or its `linkedFrom` is the base — never by name**; never count another screen's Cases as this screen's.
   - Check sibling copies of the same screen (one may own a board → *states of one screen*) and the flow's shared boards outside the section (a `Common Handling` board decides several "มีแล้ว"): the inner SECTION has no board → run scan-cases again with `SCOPE_ID` = the outer flow SECTION before concluding "none at all".
   - Boards exist, none for this base → header ② says so and names the flow's shared Permutation Board. **None at all → ask `Skill ไม่เจอ Permutation Board ใน flow นี้เลย — ทีมเก็บ Case ไว้ที่ไหน`; never assume none.**
4. Take one screenshot of the base — the visual arbiter.
5. **No profile message** — it becomes the Phase 3 header. Exceptions: none in the flow at all → the step 3 question · a Permutation Board for THIS base exists → stop with one box: `Key Screen นี้มี Permutation Board อยู่แล้ว — ทำอะไรต่อ` · `AUDIT Permutation Board ที่มีอยู่ (แนะนำ)` · `สร้างใหม่ (states ของจอเดียวกัน)`.

### Phase 2 — Enumerate (internal, nothing printed)
1. **First, read `projects/<name>.md` §Screen facts** and pre-bucket its rows for this screen (and `*` rows whose condition holds in THIS flow): a `*` row whose reason is "covered by the flow's shared board" → ✓ มีแล้ว, once Phase 1 found that board in THIS flow · a row whose component is not on screen → skip (step 2 leaves it out) · every other row → **⊘ with the stored reason**.
2. Pull from `case-library.md` + `archetype-cases.md`: **L1** archetype states + FigJam Screen group + the 9 axes · **L2** the **whole pack** of each component found + chained packs (Date Picker → Calendar / Roller) · **Tier 2** templates the flow uses (parameterized) · **Tier 3** from the project file. **Multiply** only along axes the project file declares (device / language / branch / partner / stage), never the full cartesian. A pack whose component is not on screen is neither pulled nor listed; each pulled row → Case table or ตัดออก.
3. GUARD: **captions verbatim** — a library or Tier-3 Case keeps its `id` and caption character for character; never re-word, translate, shorten or merge. Components by the team's names (component → category map), never your own. Row ids derived per the library, never invented. New situation → mint a Tier-3 id per `case-library.md` §Enumeration guards → pre-build question; recurring → propose a library addition.
4. **Walk every row into exactly one bucket** (GUARD: an unbucketed row is a dropped Case — never skip silently): ✓ exists (this base's board, the flow's shared board, or `screen/default` when the base is that state) · ✗ missing + priority · ⊘ N/A + a reason you can point at (visible on screen — no list, no money input — or a §Screen facts row; `case-library.md` §Enumeration guards). A **business-assumption** Case ("this list is never empty") is ✗ + a pre-build question (`⚠ ข้อ N`), never ⊘. **Business values** (fees, limits) come from the brief, else `⚠️ ยืนยันค่า` on the caption — never invent numbers.
5. **Priority** (`case-library.md` §Priority): 🔴 High = breaks the flow / user stuck / money at risk · 🟠 Medium · 🟡 Low; fintech modifier for money-outcome cases only.
6. **Number ✗ rows in board reading order** — group by group, top→bottom, then left→right; GUARD: never by priority. Keep the Case# ↔ caseId map for the run (stamps + G5).

### Phase 3 — Confirm ◄ stopping point
**ONE message in exactly this shape.** The example is a real run (Payment Confirmation, NEXT), its Case table cut to 5 of 15 rows here. **Never copy its Cases**: every row comes from your Phase 2 lists, Case names + Thai descriptions verbatim as they will land on the Permutation Board (only a ⚠ note shrinks to a tag; a parenthetical note meant for Skill is dropped).
```
Skill อ่าน Key Screen "Payment Confirmation" แล้ว — Archetype (ประเภทจอ): Transaction / payment · Component ที่พบ: Logo (โลโก้) · Main Button (ปุ่มหลัก) — ถ้าไม่ตรง บอกได้
Key Screen นี้ยังไม่มี Permutation Board · Common Case (Error, Retry, Server down, Session timeout) อยู่ใน Permutation Board กลาง "Common Handling" ของ flow แล้ว Skill จึงไม่ใส่ซ้ำ
Component ที่ Skill ยังไม่รู้จัก: Transaction (การ์ด จาก→ไปยัง), Text Information (แถวรายละเอียด) — Skill ไม่เดาเอง จะถามในข้อ 1

เสนอ 15 Cases — High 4 · Medium 7 · Low 4 · ⚠ = ต้องยืนยันกับ BA ก่อน
| Case# | Group | Case | Priority |
|---|---|---|---|
| Case#1 | Coupon State | ⚠ แถวส่วนลด · No coupon — กรณีไม่ใช้คูปอง | 🔴 High |
| Case#5 | Bill Detail | ⚠ ยืนยันค่า · Fee charged — กรณีมีค่าธรรมเนียม > 0 บาท | 🔴 High |
| Case#8 | Bill Detail | ⚠ ข้อ 2 · MWA overdue + VAT — กรณีค้างชำระเกิน 1 เดือน มี VAT | 🟠 Medium |
| Case#9 | Screen State | Full screen loading — กรณีโหลดทั้งจอ (spinner) | 🟠 Medium |
| Case#15 | Button | Button interaction states — กรณีปุ่ม Default / Pressed / Disabled | 🟠 Medium |

ตัดออก: มีแล้ว / ใช้กับจอนี้ไม่ได้
| Case | เหตุผล |
|---|---|
| Error (full screen) · Retry loading · Block retry loading · Server down · Session timeout | มีแล้ว — อยู่ใน Permutation Board กลาง "Common Handling" ของ flow |
| Default · default image/banner | มีแล้ว — คือ Key Screen เอง |
| Skeleton loading | ใช้กับจอนี้ไม่ได้ — จอนี้ไม่โหลดข้อมูลตอนเข้า |
| Empty · Lazy loading · Partial loading · Pull to refresh | ใช้กับจอนี้ไม่ได้ — Key Screen ไม่มี list |
| eKYC / face-scan module · Consent module · Retry wrong <N / ≥N | ใช้กับจอนี้ไม่ได้ — เป็น Module แยก มี Permutation Board ของตัวเอง |

Confirm ก่อนสร้าง Permutation Board — 4 ข้อ (Skill ถามทีละข้อ)
| ข้อ | คำถาม | ผลต่อ Case |
|---|---|---|
| 1 | Transaction, Text Information นับเป็น Component ประเภท Text ทั้งคู่ไหม | ถ้าใช่ → เพิ่ม Case ของ Text |
| 2 | Case#8 MWA overdue + VAT เป็น Case ใหม่ ยังไม่มีใน Case Library — ใส่ไหม | ใส่ / ตัด |
| 3 | ปุ่ม "ยืนยันจ่ายบิล" กดแล้วไปจอไหน | เขียนต่อท้าย Description ทุก Case |
| 4 | วางใน Section "Revamp Payment" (ว่าง) หรือแถบรวมของ flow (เรียงตามทีม แต่อยู่อีก Section) | ตำแหน่ง Permutation Board |

Permutation Board จะวางใต้ Key Screen ใน Section "Revamp Payment" กว้าง 4 จอ (หรือแถบรวมของ flow — ข้อ 4)
```
- **Header** = 3 sentences, each a conclusion + what it means for the reader, never the evidence (only when asked): ① Archetype + Components by the team's names + "ถ้าไม่ตรง บอกได้" (project taken from the flow → say so; none matched → add `Skill ใช้ Case Library กลาง — สอน Skill รู้จักโปรเจคนี้ได้ (LEARN)`) · ② Permutation Board status + the Common Cases the flow's shared board holds (their rows go in ตัดออก, not the Case table) · ③ unmapped layer names (Thai gloss) → the question that resolves them; none → omit ③.
- **Section titles** are sentences, never bare labels — the example's, with your numbers (N in the summary = rows in the Case table).
- **Case table** = every ✗ row, numbered per Phase 2 step 6; `Group` = the sub-group titles + order of the nearest sibling Permutation Board in THIS flow (else the project file's categories), never a board on another page; ⚠ tags as in §How to talk. GUARD: print every ✗ row — never "…" or "and N more".
- **ตัดออก** = every ✓ and ⊘ row, one table row per reason, each reason starting `มีแล้ว` or `ใช้กับจอนี้ไม่ได้` — the deck's funnel (All Cases › ตัด Case ที่มีแล้ว › ตัด Case ที่ใช้กับจอนี้ไม่ได้ › เสนอ N Cases). Library EN names, never ids. GUARD: **a pulled pack never disappears** — this is the coverage check; the user can still object. A §Screen facts row whose reason starts `user said:` reads `ใช้กับจอนี้ไม่ได้ — ผู้ใช้ Skill บอกไว้ <วันที่> ว่า…`; any other ⊘ row `ใช้กับจอนี้ไม่ได้ — <reason in Thai>`.
- **Confirm table** = only ⚠ that change *whether a Case exists or where it goes*: unmapped Component category · business-assumption Case · newly minted Tier-3 id · CTA target if Phase 1 found CTA buttons (answer → each Case's Description in the project's grammar: CLICX 🔗 marker line · one-line captions folded in · unknown → `⚠️ ยืนยัน target` on the caption) · placement with a real choice. **Value ⚠ (fee amount, field count, hide-or-not) are never asked** — they stay on the caption (Phase 2 step 4); confirming with BA is the Designer's job. A caption's own ⚠️ note is a tag only (§How to talk). None → `Confirm ก่อนสร้าง Permutation Board — ไม่มีข้อค้าง`, only boxes ① and ⑤.
- **Placement** = one sentence: Section by name, position vs the Key Screen, columns — never coordinates or ids (`กว้าง N จอ` = columns from `projects/<name>.md` Board width — the Section's free span only decides whether it fits; Phase 4 step 3 re-checks). A shared band elsewhere in the project's ordering, or no free span → a Confirm row with the trade-off in plain words.

**Then the boxes, in this order** (① and ⑤ always; skip ②–④ when they do not apply; ①–④ reuse the Confirm-table wording):
| Box | Asks | Options — recommended first |
|---|---|---|
| ① | the unmapped Components' category (Confirm ข้อ 1) — one box for all only when Skill proposes the same category for each, else one box + Confirm row per Component; none unmapped → `Skill อ่าน Key Screen ถูกไหม` | the likely category `(แนะนำ)` · other categories · `ไม่ต้องแตก Case` / `ถูก (แนะนำ)` · `ไม่ตรง` |
| ② | each pending Case, one box each | `ใส่ (แนะนำ)` · `ตัดออก` |
| ③ | CTA target | the likely next screen `(แนะนำ)` · other screens in the flow · `ยังไม่รู้ — ติด ⚠ ยืนยัน target ไว้` |
| ④ | placement — only with a real choice | each place + its trade-off, Skill's pick `(แนะนำ)` |
| ⑤ | `พร้อมสร้าง Permutation Board ไหม` | `สร้าง Permutation Board เลย (แนะนำ)` · `เอาแค่ Case List` · `ขอปรับเอง` |

**The user trims / adds / reorders, then confirms — nothing is written before that.** Renumber in board reading order after any change. `เอาแค่ Case List` → stop (Phase 5 step 5 still applies to box-① answers).
- **A cut is just a cut**: drop it for this run. Never offer to record it, never ask which kind of cut. Only when the user says so ("จดไว้" · "จอนี้ไม่มีทางมี…" · "เป็นกฎของจอ") append screen · caseId · `user said: <reason>` · date to `projects/<name>.md` §Screen facts, then confirm in one line: `จดไว้แล้ว — รอบหน้า Skill จะไม่เสนอ <Case> บนจอนี้`.
- **Non-interactive run** (no way to ask): print the message, Confirm table included, and **STOP** — never scaffold on assumptions.

### Phase 4 — Scaffold
1. **G0 first**: no write probe in Phase 0 → run Phase 0 step 4 now. **Then harvest (G1), every build** (GUARD: guessed styles got pilots rejected twice): run `scripts/harvest-board.js` (CONFIG: `BOARD_HINT`, + `SCREEN_W` for a non-phone project), one call, on the sibling board nearest the new board's slot in the base's SECTION → else in the same FLOW → else `projects/<name>.md` §Board anatomy (harvest any team board in the file if never verified here) → else **ask**. Never a hand-shortened harvest. It differs from the project file → follow it, record the variant per `references/board-grammar.md` steps 1–3 (must-yield list there). Record the base's node count (G5 `expectedBaseNodes`).
2. **Sibling-duplicate guard**: confirmed set ≥90% identical (by caseId; unstamped siblings → by Case name) to a sibling board whose base is a different screen → **stop and ask** `Case ชุดนี้เกือบเหมือน Permutation Board ของจอ "…" — ยังสร้างต่อไหม`. Cannot compare → never pass silently (Report line, Phase 5 step 4).
3. **Placement** where box ④ chose, else in the base's **direct parent SECTION** (its Connector Line too), a column count whose width fits the free span (harvest `siblingBoards` + section size). GUARD: **no free span where the project's ordering puts the board, or a slot narrower than the project's minimum board width → STOP and ask** `ใน Section "…" ที่ว่างไม่พอสำหรับ Permutation Board กว้าง N จอ — วางที่ไหนดี` — never squeeze, resize the team's section, or relocate silently.
4. **Read `references/contract-and-runtime.md` in full, then build per its §6** (`scripts/scaffold-kit.js` prelude, ~10 cells per call, each opening with `guard(...)`). Never touch the base or the team's boards.
5. **Connector Line** (if the project links): clone a healthy team CONNECTOR, re-point it — `references/board-grammar.md` §Link rule. Both runtimes refuse, or no connector in the file → ask the user with the exact Thai line in §Link rule step 5. Its id → G5 `linkId` (unattached, capless or mis-anchored fails).

### Phase 5 — Verify + Report
1. Run `scripts/verify-board.js` with CONFIG = `projects/<name>.md` §Verify config + per-run values the project file cannot hold — `boardId` · `expectedCases` · `baseNodeId` + `expectedBaseNodes` (from G1) · `linkId` (Phase 4 step 5) + `linkCaps` (from the harvest) · `knownCaseIds` (rule: `case-library.md` header). **Done only when `pass: true` AND `stats.skipped` is empty** (a project without links: it may hold only the link check, plus the step 4 line); GUARD: never hand-write a subset of the checks.
2. Screenshot the board (≤3 rounds) against the confirmed Cases — script = structure, screenshot = looks.
3. Report — 4 lines (the Phase 3 example after the user cut Case#8):
```
สร้าง Permutation Board แล้ว 14 Cases (High 4 · Medium 6 · Low 4) · Verify ผ่านครบทุกข้อ
🔗 figma.com/design/…?node-id=…
เริ่มออกแบบจาก Case#1 #3 #4 #5 ก่อน (High)
Rollback: ลบ Permutation Board "Permutation_…" กับ Connector Line ของมัน — Key Screen ไม่ถูกแตะ
```
4. Add a line only when it applies: loose / indexed label style → `เพิ่ม/ลบ Case บน Permutation Board นี้แล้วต้องไล่เลข Case# เอง` · sibling-duplicate guard could not compare → `Skill เทียบกับ Permutation Board ข้างเคียงไม่ได้ — ไม่มี stamp ให้เทียบ` · no links → `โปรเจคนี้ไม่ใช้ Connector Line — Verify ข้ามข้อนี้` and the Rollback line drops `กับ Connector Line ของมัน`. Verify fails → `Verify ไม่ผ่าน:` + plain words ("Connector Line ไม่ติดกับ Key Screen" · "Placeholder ของ Case#3 ขนาดไม่ตรงกับ Key Screen"), never JSON; fix and re-verify.
5. After the run: add newly minted Tier-3 ids and newly answered component categories to `projects/<name>.md`.

---

## MODE: LEARN · MODE: AUDIT — read `references/learn-audit.md` in full first
- **LEARN** — teach Skill a new project or refresh its layout (offered in Phase 0); nothing is saved before the user confirms. Last line, no node ids: `Import-test ผ่าน 3/3 → บันทึก projects/<name>.md แล้ว`.
- **AUDIT** — re-scan one Permutation Board against today's Cases + fill progress (Phase 1 step 5, or on request). Read-only until the user says yes; Orphans are reported, never deleted; each "→ …ไหม" in its 5-line Report is its own box.

## References (open at the moment named)
| File | When |
|---|---|
| `projects/<name>.md` | Phase 0 in full · §Screen facts Phase 2 · §Verify config Phase 5 |
| `references/archetype-cases.md` | Phase 1–2 — archetypes, signature cases, 9 axes |
| `references/case-library.md` | Phase 1–2 — §Never a pack, Tier 1/2 captions, row ids, chains, §Enumeration guards, §Priority, `knownCaseIds` |
| `references/board-grammar.md` | Phase 4 + LEARN — harvest checklist, cross-project rules, §Link rule |
| `references/contract-and-runtime.md` | §4–5 before the first Bridge / write call · in full at Phase 4 step 4 · §2 in AUDIT |
| `references/learn-audit.md` | LEARN or AUDIT starts — steps, AUDIT Report shape and boxes |
| `scripts/*.js` | at the steps above · `smoke-test` first run on a new machine (proves write, stamp, guard; one throwaway frame) |
