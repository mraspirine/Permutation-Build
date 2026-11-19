# Project: CLICX (PB) — permutation profile

> Learned 2026-07-27 by harvesting `G.02-01.B` in `[Test Case] UI State & Edge Case Generator`, page `AI Test 02`, section `Home`.

## About / recognition
- Product: CLICX — KTB / Infinitas digital bank app
- Detect: screens named `<FLOW>.<SS>-<SS>.<STATE> | <name>` — enough on their own. Variables only back it up: collections **`color` · `spacing` · `radius`** (`size-generic` on some screens; no `❖ NEXT`), and a file may hold none locally (`AI Test case`, 2026-11-19)
- **Screen size: 375 × 812** (not NEXT's 390 × 844)
- Font: **Graphik TH** (Regular / Medium)

## Board anatomy — **harvested 2026-07-27** (from `G.02-01.B`)
> Ground truth for CLICX. Very different from NEXT — never carry values across.

```
FRAME '<FLOW>.<SS>-<SS>.B'        [V · gap 100 · padding 100]  fill #EAEEF4   parent = SECTION (e.g. 'Home')
└── FRAME 'permutation'           [V · gap 40]                  ← one per case category
    ├── INSTANCE 'title block / permutation'  type=section title · fill #CDD5DF · h 120 · [H gap24 pad24/40]
    │     └── TEXT 'Title' ⟨Permutation:⟩ + TEXT 'Title' ⟨<category>⟩   ← two separate nodes
    │         TEXT 'Description' (hidden unless Show Description = true)
    └── FRAME 'container'         [H · gap 64 (sometimes 80)]   ← row, does NOT wrap
        └── FRAME 'case'          [V · gap 40]
            ├── FRAME 'title'     [V · gap 24]                  ← lowercase; also seen as 'case description'
            │   ├── INSTANCE 'title block / permutation'  type=screen title  ← the case label
            │   │     └── TEXT 'Title' ⟨Case #N - <case name>⟩
            │   └── INSTANCE 'title block / permutation'  type=note          ← the Thai description
            │         └── TEXT 'Title' ⟨<Thai explanation>⟩
            └── the screen itself   ← phase 1 = placeholder · phase 2 = the real screen INSTANCE/FRAME
                  (+ INSTANCE 'point note' overlays · VECTOR/RECTANGLE 'touch area' for touch cases)
```

> ⚠️ **Corrected 2026-07-31** (re-harvest of `G.03-01.B`, page `AI Test 04`): there is **no `screen permutation` wrapper frame** — 0 occurrences across 31 `case` frames. The screen sits directly inside `case`. The caption frame is lowercase `title` (or `case description`); the leanest cases skip the frame entirely and put the `title block / permutation` instance directly in `case`.

**The title block is a component, not plain text** — set `id: title block / permutation`
(component-set key `5318f202158e1b476ed4da8a32388fe9638366b6`), variants:
| variant | used for | text size |
|---|---|---|
| `type=section title` | category header ("Permutation: X") | 40px Medium · lh 72 |
| `type=screen title` | the case label | 22px Medium · lh 36 |
| `type=note` | Thai description | 16px Regular · lh 24 |
| `type=note -bold` | emphasized note | 14–16px Medium |
Boolean prop `Show Description#1:3` toggles the secondary line.
> The set did not resolve through `importComponentSetByKeyAsync` (it behaves as local) → **make a fresh instance from one already in the file: `freshInstance(<that instance>)` (scaffold-kit) — never `clone()` it**.

| Role | Font | Size / line-height | Color |
|---|---|---|---|
| Section title | Graphik TH **Medium** | 40 / 72 | `#384250` |
| Section description | Graphik TH Regular | 28 / 48 | `#384250` |
| Case label | Graphik TH **Medium** | 22 / 36 | `#384250` |
| Case description / note | Graphik TH Regular | 16 / 24 | `#384250` |
| Small annotation | Graphik TH Regular | 14 / 20 | `#384250` |

- Board fill `#EAEEF4` — **must be BOUND to the library variable `color/bg_permu`**
  (`VariableID:9c2d0eaa6e60f55a86a78c7723c51f5391ccb2b9/2479:405`), never set as a raw color.
  Every existing board (`C.01-01.B` … `G.03-01.B`) is bound; resolve it off an exemplar's
  `fills[0].boundVariables.color.id` → `getVariableByIdAsync` → `setBoundVariableForPaint`.
  A matching hex without the binding is still wrong.
- Title block fill `#CDD5DF` — comes free with `freshInstance` of an existing instance
- Internal layer names: `permutation` → `container` → `case` → `title` (or `case description`) + the screen directly inside `case` — no `screen permutation` wrapper (corrected 2026-07-31, above); page `AI Test case`: `Type` → `container` → `Case` → `Title` + `screen`
- **Every `permutation` frame has the SAME width** = board inner width (board width − 2×100), regardless of how many cases its row holds. The section-title instance is set to **`layoutSizingHorizontal = "FILL"`** so the grey header bar spans the full frame. Only the inner `container` row hugs its content.
- **Link from screen to board: CONNECTOR named `Permutation`** · stroke **`#F79009`** · weight **4** · `ELBOWED` · no dash · start = **the main screen INSTANCE inside the `.A` frame** (e.g. `my asset screen`, `home master screen`), magnet **BOTTOM** — **except when that instance is taller than the clipping 812px frame** (`home master screen` is 1509 tall): anchor the `.A` FRAME itself, or the line starts ~700px below the visible screen → end = **the `.B` board frame**, magnet **TOP** · parent = the SECTION
  > **Draw it by CLONING an existing `Permutation` connector, then re-pointing both endpoints** — verified 2026-07-31:
  > ```js
  > const c = src.clone(); src.parent.appendChild(c);
  > c.connectorStart = { endpointNodeId: "<screen instance in .A>", magnet: "BOTTOM" };
  > c.connectorEnd   = { endpointNodeId: "<the .B board>",          magnet: "TOP" };
  > ```
  > The clone stays a real CONNECTOR and **auto-attaches** — it follows the nodes when they move.
  > `figma.createConnector` is still blocked here, but that never mattered: this file already holds
  > FigJam nodes (CONNECTOR / SHAPE_WITH_TEXT) to clone from. **Do not fall back to `elbowLink`'s
  > VECTOR** unless the file has no connector at all — a vector looks right and silently never attaches.
  > Pointer: SKILL.md Phase 4 step 5 + `board-grammar.md` §Link rule win — clone + re-point, else ask for Cmd+D (no connector in the file → the user draws one with Shift+C); never finish with an unattached VECTOR.
- Flow connectors are a different thing: `Primary Line` · `#384250` · weight 4 · **dashed 8,8** — those link screens to logic boxes, not to boards
- **Placement:** screens sit at `y≈1000–2800`; every permutation board sits at **`y = 3562`** and they are ordered left→right by flow letter (`C.01` … `H.02`). Gap between neighbouring boards ≈ **240**
- **Board width** grows with its widest row (no wrapping) — check `siblingBoards` and keep it inside the free span. Each Group is one row, so Phase 3's `กว้าง N จอ` = the Case count of the Group with the most Cases
- **Minimum board width is 1200**: the `type=section title` block has `minWidth 1000` (+ 2×100 padding), so a one-column board is still 1200 wide — never plan a slot narrower than that (measured 2026-09-21)
- **Page variant — the team's original CLICX page** (section `Product highlight - Entry point from Home`, harvested 2026-09-21 from `B.01-01.B`): the group frame is named `permutation container` [V · gap 80], its inner `container` is [V · gap 80] and each row `container` is [H · gap 100]; boards sit at `y = 3270`; the screen→board connector is named `Diamond to Screen - Yes`, weight 5 (same `#F79009`, caps and BOTTOM→TOP anchors). Match the neighbours on the page you build on
- **Page variant — page `AI Test case`** (harvested 2026-11-19 from `B.03-01.B`): group frame `Type` [V · gap 40] → row `container` [H · gap 64] → `Case` [V · gap 40] → caption frame `Title` [V · gap 24] + slot `screen` 375×812; board fill there is raw `#EAEEF4` (unbound — still bind `color/bg_permu` on new boards); screen→board connector is named `Primary Line` (`#F79009`, w4, ELBOWED, caps `TRIANGLE_FILLED`→`ARROW_LINES`, BOTTOM→TOP) — not the dashed `#384250` flow `Primary Line` (colour and dash are the only difference). `scan-cases.js` only follows connectors named `Permutation`, so `linkedFrom` is empty here: before saying a Key Screen has no board, follow its `#F79009` line by hand. Bridge refused `clone()` on CONNECTOR here; `use_figma` cloned it fine
- **Section height**: a 5-group board (~6,500 tall) does not fit the flow section's default height — the user OK'd extending the section downward (2026-11-19); ask, never extend silently

## Layout (school and conventions)
- **School A/C hybrid**: a permutation band below the flow, each board split into `permutation` sections by category
- Canvas: light · captions **bilingual** (English case name + Thai explanation)
- Categories seen in the wild: `General cases` · `Touch area` · `Loading` · `Data display` · `Error handling`
- Device variants: not used as separate cases on the boards inspected (single 375 width)
- Annotations: `point note` instances overlaid on the screen, plus purple/blue spacing callouts (`Right padding = 16 px`)

## Naming
- Screens: `<FLOW>.<SS>-<SS>.A | <name>` — **`.A` = the real screen**
- Boards: **`<FLOW>.<SS>-<SS>.B`** (a second board for the same screen becomes `.C`)
- Case label: **`Case #N - <case name>`** (space after Case, hyphen, English name). N restarts in every Group, so the Phase 3 Case table restarts `Case#N` per Group too (the label form is for the canvas)
- **Note body = plain Thai** (user, 2026-11-19: CLICX boards do not use these icons; example board `B.03-01.B`, node `732:10457`). The one marker allowed is ⚠️ opening a warning bullet (SKILL.md §How to talk); description and CTA-target bullets never carry one. So SKILL.md's `⚠️ ยืนยันค่า` and business-rule notes are written as the `⚠️ ต้องยืนยันกับ BA ว่า…` bullet, and an unknown CTA target (box ③) puts `⚠️ ยืนยัน target` in place of the CTA bullet. This rule outranks a neighbouring board whose notes still carry 🔍 🔗 🚫 lines — those are Skill's own earlier builds, not team style.
  One line → plain text. Two or more → a Figma **bullet list** (`setRangeListOptions(0, body.length, {type: "UNORDERED"})`, indentation 1; `body` = the note text before padding; set it BEFORE `equalizeRow` so the row is measured with the bullet indent), no blank line between, in this order: description · `⚠️ ต้องยืนยันกับ BA ว่า…` (values never invented) · `เมื่อกดปุ่ม “<ปุ่ม>” จะพาไปยังหน้า <จอ>`.
  After `equalizeRow` pads a bulleted note, set list type NONE on the padding only: `setRangeListOptions(body.length + 1, characters.length, {type: "NONE"})`, skipped when `characters.length <= body.length + 1` (starting at `body.length` strips the last bullet). Read back `getRangeListOptions` on the last body line (UNORDERED) and on the padding (NONE), then re-check the row heights. Thai has no word spaces — put real spaces at natural break points, or a long run overflows the 375px note.
- ⚠️ **This label does NOT satisfy the strict-label regex** (`/^\s*Case\s*#?\s*(\d+)\s*$/` requires the whole string to be just `Case #N`). CLICX boards are therefore not renumber-compatible by design — follow the CLICX convention and tell the user that renumbering must be done by hand here.

## Component → category (Phase 1, L2 detection)
| If instance.name matches | → category |
|---|---|
| `/gen_ic_eye/i` | **exception row** (checked first) — hide-balance toggle, an exception to the icon row below: this icon IS the Balance-display trigger. ⚠️ the eye can sit NESTED inside `total balance` and not appear as its own top-level instance (confirmed on `A.01-01.A` 2026-08-11) — if a balance amount is visible, check for the eye inside it before bucketing hide-balance ⊘ |
| `/^(gen\|cus)_ic_/i` | **icon asset — NOT a pack**; checked before the account-card row below (otherwise `gen_ic_my-asset` false-matches it) |
| `/asset\b/i`, `/acc detail/i`, `/acc type/i`, `/savings account/i` | account card / list item (data states: long name, max amount, zero/negative) — pulls Tier-3 **Account list** + **Balance display** packs |
| `/tooltip/i`, `/ic_circle-information/i` | info tooltip |
| `/text group \d+:\d+/i` | label/value pair (max characters, max lines) |
| `/top bar/i`, `/status bar/i` | OS chrome — not a case pack |
| `/ screen$/i` (`home master screen`, `my asset screen`), `/^edit phone number$/i` | the screen itself — NOT a pack; map its children instead |
| `/point note/i` | annotation, not a component under test |
| `/^phone number$/i` | **Text Field + Text Field (Add-on)** — user answered 2026-11-19 (`B.01-01.A \| current phone number`) |
| `/^img-/i` | **Image** — illustration asset; user answered 2026-11-19 |
| `/sticky button/i`, `/^button( #\d+)?$/i` | no pack **in Section `Edit phone number` only** (page `AI Test case`; every screen in it, `B.01-01.A`, `B.02-01.A` …) — its Disabled / Enabled live on separate `.A` screens there (user, 2026-11-19); any other Section → unmapped, ask |
> No match = flag as "unmapped", never guess.
> Separate state screens in a flow (`B.03-01.A | loading state`, `C.01-01.A | API error` in `Edit phone number`) are other steps of the flow: the Key Screen's Loading / Error Cases stay on its Permutation Board (user, 2026-11-19 — B.01-01.B keeps them).

## Anchors (READ-ONLY)
- File `lN13minj5i19c2fEyBSF3q`, page `AI Test 02`, section `Home` (`129:187281` is the NEXT section; CLICX screens live under the `Home` section on this page)
- Reference boards: `G.02-01.B` (my asset / unregistered) · `C.01-01.B` · `H.02-01.B`
- Title-block source instances used for cloning: section title `129:292536` · screen title `129:292540` · note `129:292541`

## Tier-3 packs (CLICX-specific)
| Pack | Notable cases |
|---|---|
| My Asset states | unregistered · no pocket · has pockets — **each has its own `.A` screen**, so do not fan them out as cases of one another |
| Account list | account sorting · single account per type · missing product type · many accounts |
| Balance display | hide balance (eye toggle) · zero / negative balance · max amount · info tooltip |
| Loading | account section loading (skeleton box/circle/content/pill) · partial loading · pull to refresh |
| Error | unable to load data · reload more than 3 times · partial error |
| Home / hub | homepage animation background · image background · pocket widget · loan widget image |
| Copy | strings are bound to **Frontitude keys** (e.g. `system.error.notification.loading`) |

## Screen facts (business rules per screen — grown only when the user says จดไว้)
> Phase 2 reads this FIRST and pre-buckets each row per SKILL.md Phase 2 step 1 (that step wins). Rows below come from the team's notes on the boards.
> Pointer: SKILL.md Phase 3 "A cut is just a cut" wins — append a row only when the user says so themselves ("จดไว้" · "จอนี้ไม่มีทางมี…"); never ask about a cut.
| Screen (name pattern) | Case (`caseId`) | Rule | Learned |
|---|---|---|---|
| `home` / `home / intelligent hub` | `screen/empty` | เข้าหน้า Home ได้แปลว่ามีบัญชี savings แล้ว → empty ทั้งจอเกิดไม่ได้ (empty รายส่วน เช่น widget ว่าง ยังมีได้) | 2026-08-11 |
| `home` / `home / intelligent hub` | `tmpl/session-timeout` | timeout บนจอนี้**ไม่** navigate ไปหน้า login — ⚠️ ยืนยันพฤติกรรมจริง (reload? modal?) กับทีม | 2026-08-11 |
| `home / intelligent hub` | (หลายเคสใน component-states group) | note 6 Aug 2026 บน `A.01-01.B` แปะ "จะไม่มีเคสนี้ในหน้า home" ไว้หลายจุด — รอบ AUDIT หน้าให้ไล่จับคู่ note → case แล้วเติมเป็นรายแถวในตารางนี้ | pending |

## Verify config (paste into `scripts/verify-board.js` CONFIG)
> Per run, add: `boardId` · `expectedCases` · `baseNodeId` + `expectedBaseNodes` · `linkId` (+ `linkCaps` from the harvest) · `knownCaseIds`. G5 lists whatever is left empty in `stats.skipped`.
```js
labelStyle: "loose",          // "Case #N - <name>" in one node → NOT renumber-compatible (manual renumber; say so in the report)
componentCrops: true,        // component-level cases hold a crop (118–424 tall), not a screen
slotSizes: ["375x812"],
titlesFullWidth: true,        // every `permutation` frame = board inner width; section-title instance is FILL
numbersScopedPerGroup: true,  // Case#N RESTARTS in every `permutation` group (General #1-9, Touch area #1-4, Loading #1-6)
screensAlignPerRow: true,     // screens in a row must start at the same y
```

**Uniform caption block per row** — inside one `container` every caption is the same height, so the
screens line up. Measured on `G.03-01.B`: row1 all `title` 408 · row2 all `case description` 480 ·
row3 all 144 · row4 all `Title` 336 — **per row, not per board**.

> 🔴 **How the team actually does it: TRAILING BLANK LINES in the text, not a fixed frame height.**
> Every caption frame stays `HUG`; the designers append `\n` to the label and to the note until the
> heights match. Evidence on `G.03-01.B`: labels carry a trailing `\n` (`"Case #4 - Hide all balances\n"`)
> so a one-line label still occupies **2 lines = 72px** (lh 36), and notes end in runs of blank lines
> (`…จะแสดงผลตามหน้าจอด้านล่าง\n\n\n\n\n\n\n\n\n\n\n`) landing on a common height — 312 in row1, 240 in row4
> (both multiples of the 24px note line-height). `title` gap is 24, so 72 + 24 + 312 = 408 ✓.
>
> Recipe: strip existing trailing `\n` first (else a second pass inflates the max) → measure the row's
> tallest label and tallest note → append `\n` to the rest until each reaches its target. Label floor
> is **72 (2 lines)**. **Never** set `layoutSizingVertical = "FIXED"` on the caption frame — it looks
> identical on canvas but breaks the moment someone edits the copy.

> ⚠️ **pluginData under `use_figma`**: `setPluginData`/`getPluginData` are blocked by the official MCP →
> `scaffold-kit.js` falls back to `setSharedPluginData("permBuild", <key>, …)`. `verify-board.js` and
> `scan-cases.js` must read **both**. Only the figma-console Bridge can write plain pluginData; under use_figma `scaffold-kit.js` writes the shared store instead.
