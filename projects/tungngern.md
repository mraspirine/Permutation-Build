# Project: TungNgern (ถุงเงิน) — permutation profile

> Learned 2026-11-19 (LEARN) from file `TN - Core App` (`dZNbHEtRFY6vcsMlaxYcs7`), page `🚀  Summary - Thaipost`,
> section `🚧 Summary`: exemplar board `Permutation Sheet` (`12892:17114`) + six neighbour boards in the same section.
> A **free-positioned** board (no auto-layout) built from two library components — nothing like NEXT / DGL / CLICX / PTP; never carry values across.

## About / recognition
- Product: ถุงเงิน (TungNgern) — Krungthai merchant app (Android + iOS)
- Detect: file name `TN - Core App` · flow screens are **FRAMES** (not instances) placed directly in the SECTION, named `NTN - <Module> - <Screen>[ - <State>]` (`NTN - Summarize - Date - Empty State`) or `<Feature> - <Screen> - <Period>` (`Sale Report - Summary - Day`) · **360 wide** · product font **Kanit** · the flow screens bind **no variables** (checked 2026-11-19) → detect by naming + width + font, not by variables
- ⚠️ PTP also uses Kanit — PTP flow screens are INSTANCES named `PTP/…` 390 wide; TungNgern screens are FRAMES `NTN - …` 360 wide
- Pages carry a status prefix: `✅` On Production · `🚀` Ready For Dev · `🚧` WIP · `🛑` On hold · Back up / Playground pages are not flows
- **Default screen size: 360 × 640** · scroll screens are drawn at full content height (1522–2201 seen) · device variants are separate frames `… - iPhone` / `… - Android`
- Font: **Kanit** (Regular / Medium / SemiBold / Bold) — in the screens AND in the board captions (same family on both)

## Board anatomy — **harvested 2026-11-19** (from board `Permutation Sheet`)
```
FRAME '<free name containing "Permutation">'   layoutMode NONE (free positioning) · fill #D1DDE2 (raw, not bound) · radius 0 · clips   parent = the flow's SECTION
├── INSTANCE 'Section'                 ← Group header, one per Group · library set `Section` · variant Type=Default, Simple=No, Dark Mode=No
│     [V · gap 16 · padding 24] fill #597284 · radius 12 · h 108 · width = the board's full width
│     TEXT 'Title' ⟨Permutation - <Group>  Permutations⟩      (two spaces before "Permutations", as the team types it)
├── FRAME 'Section Name - Large'       ← the Case label · [V · gap 0] · width = the slot width (a label spanning several variants = their full span)
│     ├── TEXT ⟨Case N: <case name>⟩
│     └── RECTANGLE 'line'            2px · #212121 · FILL
├── INSTANCE 'Permutation Sub Title'   ← OPTIONAL remark card above a slot · white · radius 8 · [V · gap 8 · padding 8/16/16/16]
│     TEXT 'Description' ⟨<condition, Thai>⟩  +  TEXT 'Description' ⟨<detail lines>⟩
└── the screen FRAME (360 × the base's height)   — or a component crop for component-level Cases (`Show/Hide Graph` 328 wide, `Payment Channel` instances)
```

**Geometry (free layout — measured defaults, positions are set by hand):**
- Group header at the top of its Group; first label row = header bottom + **48**
- Label (38 tall) → slot: **≈ 25–30** · with a remark card: label → card ≈ 48, card → slot ≈ 90
- Screen columns: 360 wide, pitch ≈ 504 (**gap ≈ 144**), left inset ≈ 63 · component-crop columns: 328 wide, pitch 408 (**gap 80**), left inset ≈ 82
- Next Group: its header starts ≈ 190 below the previous Group's tallest slot
- **One Case, several variants:** ONE label `Case N: <name>` spans all its variants (its line runs across them); each variant gets its own remark card (`กรณีมีเงินเข้าแค่ QR เป๋าตุง`) — variants are not numbered as Cases. Sub-numbers `Case 2.1:` / `Case 2.2:` also occur on one board (`Transaction Complete Permutation`)
- Interaction Cases: a gesture instance `Hand-OneFinger-Scroll-Vertical` / `Hand-OneFinger-DoubleTap` overlays the screen, and a free TEXT note (Kanit Medium 20) sits under it — the slot for these Cases is the 360×640 viewport, not the full height
- Device variants (Empty State boards): iPhone + Android frames side by side inside one Case, with `Padding Pixel` / `Line` callouts

| Role | Font (family + **weight**) | Size / line-height | Color |
|---|---|---|---|
| Group header `Permutation - <Group>  Permutations` | Kanit **SemiBold** | 40 / **AUTO** | `#FFFFFF` on `#597284` |
| Case label `Case N: <name>` | Kanit **SemiBold** | 24 / **AUTO** | `#000000` (line `#212121`) |
| Remark card — condition | Kanit **Bold** | 20 / AUTO | `#212121` |
| Remark card — detail | Kanit Regular | 16 / AUTO | `#212121` |
| Note under a screen | Kanit Medium | 20 / AUTO | `#131416` |

- **line-height is AUTO everywhere** on these boards (unlike NEXT / DGL, which use PIXELS) → match AUTO: `textNode()` without `lh`
- Caption: **one** text node `Case N: <name>` — **space** between `Case` and `N`, **colon**, no `#`; the name mixes Thai + English (`Case 1: Default / ไม่มี Void Payment`); a second line is allowed inside the same node. No description node by default — a condition / detail goes into a `Permutation Sub Title` remark card
- **Numbering restarts in every Group** (Summary Case 1–5, Graph Case 1–4)
- **Label style = `loose`** → NOT renumber-compatible; renumbering is manual
- Screen slot sizes: `360×640` (viewport / interaction Cases) · `360×<base height>` (full scroll screen) · component crops keep their own size
- Internal layer names: `Section` (header) · `Section Name - Large` (label) · `line` · `Permutation Sub Title` (remark) — everything else sits directly on the board
- **Link:** CONNECTOR named **`Connector line`** (NOT `Permutation`) · **`#F08700`** · weight **5** · **dashed 10,10** · `ELBOWED` · caps **`CIRCLE_FILLED` at the screen → `ARROW_EQUILATERAL` into the board** · start = the **bottom-most instance of the Key Screen** — the bottom nav `4 Menus` (magnet **BOTTOM**; its bottom edge = the screen's bottom edge) — or, for a component board, that component's instance (`Transaction` → its board) · end = the board's **Group header `Section` instance** (magnet **TOP**) · parent = the SECTION · healthy exemplar `12892:17569` (one line in the section ends on magnet AUTO — an outlier, never the exemplar)
  - Flow links are a different thing: `#22385B` solid (`Connector line`, `Logic to Logic`) and `#68879A` dashed — never use them as the exemplar
  - Pointer: SKILL.md Phase 4 step 5 + `board-grammar.md` §Link rule win — clone + re-point, else ask for Cmd+D (no connector in the file → the user draws one with Shift+C); never finish with an unattached VECTOR
- **Placement:** a SECTION can hold several flows stacked vertically (Date flow at the top, Month flow below it, each opened by a wide `Section` flow-header instance); each flow's boards sit in a band **below that flow** (≈ 690 below its lowest screen), left → right, and further boards stack **under** a board in the same column · **gap between boards = 160**, horizontally and vertically
- **Board width:** `63 + n×360 + (n−1)×144 + 63` → 1 col = 486 · 2 cols = 990 · 3 cols = 1494 · 4 cols = 1998 (the exemplar is 2071 because one label runs wider than its slot) · component-crop boards: `82 + n×328 + (n−1)×80 + 82` · **minimum = 1 column = 486**

### Building it with the kit (the team board has no cell frame — G5 needs one)
- Team boards are flat: label, remark and screen are siblings on the board. `stampCase` / `verify-board.js` need one node per Case holding its label + slot, and the per-Group number check needs a Group parent. So Skill builds:
  board (free, `stampBoard`) → one **Group frame** per Group (free layout, no fill, named after the Group) → header + one **Case frame** per Case (`Case N - <name>`, auto-layout [V · gap 25], no fill, `stampCase`) holding `Section Name - Large` (+ remark card) + slot. On canvas it looks the same as the team's; the two wrapper layers are the only difference
- Header: `freshInstance(<a Section instance on the neighbour board>)` → `setInstanceTexts(["Permutation - <Group>  Permutations"])` → resize to the board width. Never `clone()` it
- Label: `alFrame("Section Name - Large", {gap:0})` + `textNode("Case N: <name>", {family:"Kanit",style:"SemiBold"}, 24, {color:{r:0,g:0,b:0}})` + a 2px `line` rectangle (`#212121`, FILL) → `fixWidth` to the slot width
- Remark card (only when a Case needs a condition or the Phase 3 CTA answer): `freshInstance(<a Permutation Sub Title on the neighbour board>)` → `setInstanceTexts` → read every string back (the card's first row also holds a `System/Tools/Name` tag instance)
- Placeholder: `placeholder(caseFrame, 360, <base height>, {family:"Kanit",style:"Regular"})`
- Avoid sub-numbers (`Case 2.1:`) on Skill-built boards: the label check reads `Case 2.1` and `Case 2.2` as two `Case 2` → duplicate. Several variants of one situation = one Case + remark cards (the team's `Case 5: ร้านเป๋าตุง Migrate` pattern)

## Layout (school and conventions)
- **School A** (flow + permutation band + dashed orange link) with Groups split by `Section` header bars
- Canvas: light (`#D1DDE2` board on the section) · captions: Thai + English in one label node, Thai detail in remark cards
- Device variants: iPhone / Android as extra frames inside one Case (Empty State boards) — not separate Cases
- Granularity: one board per screen state or per feature area; component-level boards exist (`Payment Channel Permutations` holds only `Payment Channel` instances)
- Groups seen: `Summary` · `Graph` (one board) — Groups are feature areas / components on the screen, not Error / Screen State categories
- **Shared Common Case page: `🚀 Common Case`** (section `Common Case`) — holds Internet lost · Session expired · Merchant Blocked · Merchant Deleted/inactive · Location permission · ระบบกำลังปรับปรุง · API Error from BE (http status ≠ 200) · Force update · Root/Jailbreak · หมดเวลาทำรายการ → individual screens must not duplicate these (see §Screen facts)

## Naming
- Board names are free, but every one seen contains **"Permutation"**: `Permutation Sheet` (used twice in one section — Day and Month) · `Permutation - Summary Empty State` · `Permutation - View All Transaction` · `Payment Channel Permutations` · `Transaction Complete Permutation` · `Empty State - Transaction Permutation`
- New boards: **`Permutation - <Key Screen state / feature>`** (the most common form)
- ⚠️ `scan-cases.js` and harvest `siblingBoards` find boards by `Permutation:` / `Permutation_` / `… Permutations` names, or by a connector NAMED "Permutation" — TungNgern names its link `Connector line`, so **most TungNgern boards are invisible to the scripts** (only `Payment Channel Permutations` matches). Until the scripts learn this project: in Phase 1 also list the SECTION's direct FRAME children whose name contains `/permutation/i`, plus the end nodes of `#F08700` dashed connectors, and run `scan-cases.js` with `SCOPE_ID` = each such board. The same list feeds `siblingBoards` when placing a board

## Component → category (Phase 1, L2 detection)
> Starter map from the 2026-11-19 harvest — only names seen on the Summary flow. Confirm each pack row at the first real run; no match = "unmapped", never guess.

| If instance.name matches | → category |
|---|---|
| `/^4 menus$/i`, `/^top navigation$/i`, `/^main background$/i`, `/^status ?bar$/i` | **OS / navigation chrome / background — NOT a pack. Check these rows FIRST** |
| `/^hand-/i`, `/^highlight point$/i`, `/^status-tag$/i`, `/^note in flow$/i`, `/^go to$/i`, `/^logic\//i`, `/^section$/i`, `/^permutation sub title$/i`, `/^padding pixel$/i` | **annotation / board furniture — NOT a pack** |
| `/^tab$/i` | navigation — tab change (axis 9), not a component pack |
| `/^toggle$/i` | interaction — Toggle (axis 9); the `Show/Hide Graph` toggle drives the Graph Group |
| `/payment channel/i`, `/^transaction$/i` | list rows → `empty/section` · `text/*` (long name / amount) · `image/*` (channel logo) |
| `/total summary/i` | `text/*` (amount, counts) |
| `/calendar picker/i` | ⚠️ unmapped — date / month selector; candidate `datepicker/*` (+ calendar / roller chain) — ask at box ① |

## Anchors (READ-ONLY)
- File `dZNbHEtRFY6vcsMlaxYcs7` (`TN - Core App`), page `🚀  Summary - Thaipost`, section `🚧 Summary` `12892:16712`
- Exemplar board `Permutation Sheet` `12892:17114` · healthy link `12892:17569` · component board `Payment Channel Permutations` `12892:16869`
- Header source instance (`Section`) and remark source (`Permutation Sub Title`) = the ones on `12892:17114` · Common Case page `🚀 Common Case`

## Tier-3 packs (TungNgern-specific — read off the captions on the team's boards)
| Pack | ~cases | Notable cases (⚠️ confirm values with the brief) |
|---|---|---|
| Sale Report — Summary (Day / Month) | 5 | Default / ไม่มี Void Payment · มี Void Payment · Scrolling (รายวัน/รายเดือน) · Tab Changing (รายวัน/รายเดือน) · ร้านเป๋าตุง Migrate |
| ร้านเป๋าตุง Migrate (variants of one Case) | 3 | มีเงินเข้าทั้ง QR ถุงเงิน และ QR เป๋าตุง · มีเงินเข้าแค่ QR เป๋าตุง · มีเงินเข้าแค่ QR ถุงเงิน (ร้านเปลี่ยนบัญชี / รูปแบบการโอน) |
| Graph & Legend | 4 | Default / ทุกช่องทาง · ช่องทางเดียว · 2 ช่องทาง · 3 ช่องทาง — rules: sorted largest first from 12 o'clock · only channels with an amount · 2 decimals ⚠️ |
| Empty State (Summary / Transaction) | 1–3 | iPhone / Android variants with padding callouts |
| View All Transaction | 2+ | ร้านเป๋าตุง Migrate (รับเงินจาก QR เป๋าตุง) · โครงการ Digital Wallet · filter เฉพาะรายการที่คุณเป็นคนรับเงิน |
| Transaction Complete | 3 | Default / Actual Screen · Digital Wallet · ไม่มี / มีชื่อย่อร้านค้า |

## Screen facts (business rules per screen — grown only when the user says จดไว้)
> Phase 2 reads this FIRST: a case listed here for the current screen is pre-bucketed **⊘ with the stored reason**.
> Pointer: SKILL.md Phase 3 "A cut is just a cut" wins — append a row only when the user says so themselves ("จดไว้" · "จอนี้ไม่มีทางมี…"); never ask about a cut. Pointer: such a row's reason starts `user said:`.
> Pointer: SKILL.md Phase 2 step 1 wins — a `*` row covered by the shared Common Case page counts as มีแล้ว, not ⊘.

| Screen (name pattern) | Case (`caseId`) | Rule (why it can/can't happen) | Learned |
|---|---|---|---|
| `*` (any TungNgern flow, while page `🚀 Common Case` exists) | `tmpl/server-down` · `tmpl/session-timeout` | covered once on the Common Case page (Internet lost · ระบบกำลังปรับปรุง · Session expired · หมดเวลาทำรายการ) — check the page still exists before applying | 2026-11-19 |
| `*` (same scope) | `screen/error-full` | ⚠️ the Common Case page holds `API Error from BE` as a modal — confirm with the team whether that covers a screen's full-screen load error before treating it as มีแล้ว | pending |

## Verify config (paste into `scripts/verify-board.js` CONFIG)
> Per run, add: `boardId` · `expectedCases` · `baseNodeId` + `expectedBaseNodes` · `linkId` (+ `linkCaps` below) · `knownCaseIds`. G5 lists whatever is left empty in `stats.skipped`.
```js
labelStyle: "loose",                  // `Case N: <name>` in one node → NOT renumber-compatible
slotSizes: ["360x640"],               // ADD the base's own height for a full scroll screen, e.g. "360x2084"
componentCrops: true,                 // component-level Cases hold a crop (`Show/Hide Graph` 328 wide)
titlesFullWidth: false,               // headers are sized to the board by hand, not FILL
numbersScopedPerGroup: true,          // Case N restarts in every Group → needs the Group frames above
linkMagnets: ["BOTTOM", "TOP"],
linkCaps: ["CIRCLE_FILLED", "ARROW_EQUILATERAL"],
```
