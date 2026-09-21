# Project: CLICX (PB) — permutation profile

> Learned 2026-07-27 by harvesting `G.02-01.B` in `[Test Case] UI State & Edge Case Generator`, page `AI Test 02`, section `Home`. Corpus reference: `permutation-reference.md` §4 (CLICX).

## About / recognition
- Product: CLICX — KTB / Infinitas digital bank app
- Detect: nodes bind to variable collections **`color` · `spacing` · `radius` · `size-generic`** (no `❖ NEXT`); screens are named `<FLOW>.<SS>-<SS>.<STATE> | <name>`
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
> The set did not resolve through `importComponentSetByKeyAsync` (it behaves as local) → **clone an existing instance in the file instead** (that is what the pilot did).

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
  *(Missed on the 2026-07-31 build — the hex matched but the binding was absent, and the designer caught it.)*
- Title block fill `#CDD5DF` — comes free when you clone an existing instance
- Internal layer names: `permutation` → `container` → `case` → `Title` / `screen permutation`
- **Every `permutation` frame has the SAME width** = board inner width (board width − 2×100), regardless of how many cases its row holds. The section-title instance is set to **`layoutSizingHorizontal = "FILL"`** so the grey header bar spans the full frame. Only the inner `container` row hugs its content.
- **Link from screen to board: CONNECTOR named `Permutation`** · stroke **`#F79009`** · weight **4** · `ELBOWED` · no dash · start = **the main screen INSTANCE inside the `.A` frame** (e.g. `my asset screen`, `home master screen`), magnet **BOTTOM** → end = **the `.B` board frame**, magnet **TOP** · parent = the SECTION
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
- Flow connectors are a different thing: `Primary Line` · `#384250` · weight 4 · **dashed 8,8** — those link screens to logic boxes, not to boards
- **Placement:** screens sit at `y≈1000–2800`; every permutation board sits at **`y = 3562`** and they are ordered left→right by flow letter (`C.01` … `H.02`). Gap between neighbouring boards ≈ **240**
- **Board width** grows with its widest row (no wrapping) — check `siblingBoards` and keep it inside the free span

## Layout (school and conventions)
- **School A/C hybrid**: a permutation band below the flow, each board split into `permutation` sections by category
- Canvas: light · captions **bilingual** (English case name + Thai explanation)
- Categories seen in the wild: `General cases` · `Touch area` · `Loading` · `Data display` · `Error handling`
- Device variants: not used as separate cases on the boards inspected (single 375 width)
- Annotations: `point note` instances overlaid on the screen, plus purple/blue spacing callouts (`Right padding = 16 px`)

## Naming
- Screens: `<FLOW>.<SS>-<SS>.A | <name>` — **`.A` = the real screen**
- Boards: **`<FLOW>.<SS>-<SS>.B`** (a second board for the same screen becomes `.C`)
- Case label: **`Case #N - <case name>`** (space after Case, hyphen, English name)
- **Note body = description, BLANK LINE, then emoji-marked instruction lines** (designer request 2026-07-31).
  Anything that is not the case description itself gets an emoji marker on its own line instead of
  being buried in prose, and the marker block is separated from the description by an **empty line**
  (`\n\n`, not `\n`) — it makes the "what do I actually have to check" lines scannable:
  | marker | means |
  |---|---|
  | 🔍 | สิ่งที่ต้องตรวจ / inspect |
  | ⚠️ | ต้องยืนยันค่ากับ BA (business value not in the brief) |
  | 🔗 | ปลายทาง / navigation target |
  | 🚫 | สิ่งที่ไม่นับรวม (excluded from the case) |
  Thai has no word spaces — put real spaces at natural break points, otherwise one long run pushes
  past the 375px note width and **orphans the emoji alone on its line**.
- ⚠️ **This label does NOT satisfy the `renumber-cases` regex** (`/^\s*Case\s*#?\s*(\d+)\s*$/` requires the whole string to be just `Case #N`). CLICX boards are therefore not renumber-cases compatible by design — follow the CLICX convention and tell the user that renumbering must be done by hand here.

## Component → category (Phase 1, L2 detection)
| If instance.name matches | → category |
|---|---|
| `/^(gen\|cus)_ic_/i` | **icon asset — NOT a pack. Check this row FIRST** (2026-08-11: `gen_ic_my-asset` false-matched the account-card row below) |
| `/asset\b/i`, `/acc detail/i`, `/acc type/i`, `/savings account/i` | account card / list item (data states: long name, max amount, zero/negative) — pulls Tier-3 **Account list** + **Balance display** packs |
| `/gen_ic_eye/i` | hide-balance toggle — exception to the icon row: this icon IS the Balance-display trigger. ⚠️ the eye can sit NESTED inside `total balance` and not appear as its own top-level instance (confirmed on `A.01-01.A` 2026-08-11) — if a balance amount is visible, check for the eye inside it before bucketing hide-balance ⊘ |
| `/tooltip/i`, `/ic_circle-information/i` | info tooltip |
| `/text group \d+:\d+/i` | label/value pair (max characters, max lines) |
| `/top bar/i`, `/status bar/i` | OS chrome — not a case pack |
| `/point note/i` | annotation, not a component under test |
> No match = flag as "unmapped", never guess.

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

## Screen facts (business rules per screen — grown by Phase 3 trims)
> Phase 2 reads this FIRST: a case listed here for the current screen is pre-bucketed **⊘ with the stored reason**. Rows below come from the designer notes on page `AI Test 05` (6 Aug 2026 test run).
| Screen (name pattern) | Case (`caseId`) | Rule | Learned |
|---|---|---|---|
| `home` / `home / intelligent hub` | `screen/empty` | เข้าหน้า Home ได้แปลว่ามีบัญชี savings แล้ว → empty ทั้งจอเกิดไม่ได้ (empty รายส่วน เช่น widget ว่าง ยังมีได้) | 2026-08-11 |
| `home` / `home / intelligent hub` | `tmpl/session-timeout` | timeout บนจอนี้**ไม่** navigate ไปหน้า login — ⚠️ ยืนยันพฤติกรรมจริง (reload? modal?) กับทีม | 2026-08-11 |
| `home / intelligent hub` | (หลายเคสใน component-states group) | note 6 Aug 2026 บน `A.01-01.B` แปะ "จะไม่มีเคสนี้ในหน้า home" ไว้หลายจุด — รอบ AUDIT หน้าให้ไล่จับคู่ note → case แล้วเติมเป็นรายแถวในตารางนี้ | pending |

## Verify config (paste into `scripts/verify-board.js` CONFIG)
```js
labelStyle: "loose",          // "Case #N - <name>" in one node → NOT renumber-cases compatible (manual renumber; say so in the report)
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
> *(Built it the FIXED-height way on 2026-07-31; the designer asked for the team's way instead.)*

> ⚠️ **pluginData under `use_figma`**: `setPluginData`/`getPluginData` are blocked by the official MCP →
> `scaffold-kit.js` falls back to `setSharedPluginData("permBuild", <key>, …)`. `verify-board.js` and
> `scan-cases.js` must read **both**. Only the figma-console Bridge can write plain pluginData; under use_figma `scaffold-kit.js` writes the shared store instead.

## DS hooks (phase 2)
Variable collections `color` / `spacing` / `radius` / `size-generic`. Screens are built from instances such as `my asset screen`, `asset`, `acc detail`, `top bar`, `status bar`. See `figma-design-build/projects/pb.md` + `pb.registry.md` for component keys.
