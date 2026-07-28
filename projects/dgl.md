# Project: DGL Revamp (LOC / Apply) — permutation profile

> Harvested 2026-07-27 from file `[Test Case] UI State & Edge Case Generator`, section
> `Screen Flow_MAY25.01_DGL Revamp_NX_LOC_Apply`, boards `19.1 Edit Adress` (`131:491270`),
> `21.2`, `20.1`, `22.1`, `16.1`. Runs inside the NEXT app but is **its own project** —
> different board style, different fonts, different label rules. Never mix with `projects/next.md`.

## About / recognition
- Detect: screen names `[MMM][YY].[EPIC].[N].[N]_DGL Revamp_NX_<PRODUCT>_<FLOW>_<NAME>`
  (e.g. `MAY25.01.21.1_DGL Revamp_NX_LOC_Apply_Edit Address`) · section `Screen Flow_MAY25.01_DGL Revamp_NX_…`
- **Screen size: legacy 375 wide** (812 tall baseline, taller when the form scrolls) · Small = 360
- Font: **Krungthai Fast** (Bold / Regular) — both in the screens and in the board captions

## Board anatomy
```
FRAME 'Permutation_<full screen name>'  [V · gap 64 · padding 64]  fill #EAF0F5   parent = the flow's SECTION
└── FRAME 'Case'                        [V · gap 24]                    ← one group per case category
    ├── TEXT 'Permutation Title'         32px (width 646, FIXED)         ← '<Category> Permutations'
    └── FRAME 'Permutations'            [H · gap 64 · crossGap 64 · WRAP]
        └── FRAME 'Case'                [V · gap 32]                    ← case column (375 wide)
            ├── FRAME 'Case'            [V · gap 24 · height 238 FIXED] ← caption block (aligns the slots)
            │   ├── TEXT 'Case#N - <case name, EN>'   ← ONE node, LOOSE label
            │   └── TEXT '<Thai description "กรณี…">'
            └── <screen slot 375 × content height>
```

| Role | Font | Size / line-height | Color |
|---|---|---|---|
| Group title | Krungthai Fast **Bold** | 32 / **47px** | `#00A6E6` |
| `Case#N - Name` | Krungthai Fast **Bold** | 24 / **35px** | `#8A9FAB` |
| Thai description | Krungthai Fast Regular | 16 / **24px** | `#000000` |

- **Case numbering restarts inside each group** (group 1 = Case#1–3, group 2 = Case#1–3 again) →
  duplicate numbers across one board are intentional here
- **Label style = `loose`** (`Case#N - Name` in one node) → **NOT `renumber-cases` compatible**; renumbering is manual
- Internal layer names: `Case` at every level; the row frame is `Permutations`; the title node is `Permutation Title`
- **Link:** CONNECTOR `Permutation` · `#FAB900` · weight 5 · `ELBOWED` · magnet TOP on the board ·
  parent = SECTION. Flow links are `#4858E4` (`Diamond to Screen`, `Logic to Logic`) — do not confuse the two.
  The plugin API cannot create connectors in a design file → draw a VECTOR and tell the user
- **Placement:** flow band `y≈977` · permutation band **`y≈12074`** (Accept Offer sub-flow sits at `y≈5073`) ·
  boards ordered by x following the screen order in the flow, ~178px apart
- **Board width:** `n×375 + (n-1)×64 + 128` → 3 cols = 1381 · 4 cols = 1820. Pick the count that fits the free span

## Layout (school and conventions)
- **School A** (flow + permutation band + link)
- Captions bilingual: EN case name + Thai `กรณี…` condition, and the Thai description spells out button behaviour
  (`กดปุ่ม 'ย้อนกลับ' : กลับไปหน้า …`)
- **Device variants are separate cases** (`Small screen` with a 360-wide slot), not extra columns
- Group per case category — the two the flow always uses: `Edit Address Permutations` · `Input Field Error Permutations`;
  other screens use `Screen State` / `Dropdown` style groups
- ⚠️ **No shared `Common Handling` board in this flow** (verified 2026-07-27) — server-down / session-timeout are
  not centralized; confirm with the team before adding them per screen

## Naming
- `Permutation_<full screen name>` (underscore). One board in the flow uses a **space** (`Permutation MAY25.01.21.2_…`)
  → `scan-cases.js` misses it; check by geometry too, not only by name
- Row/group frames are named `Case` / `Permutations` — the plain name `Permutations` also matches the scanner's
  container regex, so the scanner reports rows as containers. Filter to nodes whose name starts with `Permutation_`

## Component → category (Phase 1, L2 detection)
| If instance.name matches | → category |
|---|---|
| `/single form\|plain/i` (with a `Logo` child) | `textfield/*` |
| `/single form/i` + `System/Line/Chevron-down` child | dropdown → `tmpl/dropdown-dismiss` (+ action sheet) |
| `/with padding/i` (footer) + `Single` | primary CTA — interaction states, not a separate pack |
| `/NX/i` (header) with `Arrow-narrow-left` / `X-close` | navigation → `Back button` case (check the screenshot: X may be hidden) |
| `/home indicator/i` | ⊘ ignore |

## Tier-3 packs (DGL LOC Apply — harvested from the flow's own boards)
| Pack | Cases seen on the team's boards |
|---|---|
| **Address edit** (legal `19.1` / current `21.2` / work `21.1`) | Address have not been edited (save Disable) · Filled & edited (save Enable) · Select other address · Back button (popup ทิ้งข้อมูล) |
| **Address field errors** | Address error state (focus-out → inline error) · Have two postal code → dropdown · Postal code dropdown |
| Loan Calculator `6.1` | min 1,000 · max with salary · maximum amount · round down (ปัดลงทุกกรณี) · focus-out · small screen |
| Product Highlight `4.2` | salary 30K branches · slider min/max · 999,999,999 max · checkbox deselect · loading screen |
| Information `16.1` | dropdown chains (education / business / position) · **close action sheet without selecting** · other-please-specify · with/without children · skeleton · unable to load image |
| Confirmation `18.2` | no name/office address · salary <30K · edit information · edit email · missing date/month permutations |
| Consent `30.2` / `31.2` | default · radio selected · Model + NCB consent error |
| Face Scan `33.3–36.1` | unable to load SDK · application switch · unable to load data — **separate module screens** |
- Edit screens across this flow consistently carry `Small screen` · `Back button` · `Unable to load data`

## Verify config (paste into `scripts/verify-board.js` CONFIG)
```js
labelStyle: "loose",                      // Case#N - Name → NOT renumber-cases compatible
slotSizes: ["375x812","360x812"],         // legacy · small — ADD the base screen's own height when it scrolls
titlesFullWidth: false,                   // group titles are FIXED width 646
numbersScopedPerGroup: true,              // Case#N restarts per group → dup check runs per group
```
- Slot height follows the base screen, not a fixed 812 (form screens run 951–1268 tall) → put the base's
  `WxH` (and the 360-wide small variant at the same height) into `slotSizes` for that run

## Anchors (READ-ONLY)
- Section `131:488626` · exemplar board `131:491270` (19.1) · `131:492261` (21.2, name uses a space)
- Built by this skill: `131:539080` = `Permutation_MAY25.01.21.1_…_Edit Address` (17 cases, 2026-07-27)
