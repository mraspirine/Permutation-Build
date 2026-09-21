# Project: PTP (Paotang) — permutation profile

> Learned 2026-09-21 (confirmed) from six team boards in `[Test Case] UI State & Edge Case Generator`, page `PTP`: two in section `Setting/CASA_Account/Edit-NickName` (**dialect A**) and four in section `KTB Account Linkage (New)` (**dialect B**).
> **PTP boards come in two dialects, one per flow. Harvest the neighbours in the section you build in and follow THEIR dialect — never mix the two.**

## About / recognition
- Product: Paotang (PTP) — Thai wallet / super-app (iOS-first)
- Detect: flow screens are **INSTANCES placed directly in the SECTION** (not frames), named **`PTP/<Module>/<Screen>_<MonYYYY>`** (e.g. `PTP/Setting/PTPPlus-Home_May2025`), main component is a remote library component · product font **Kanit** · variables named `Color/Fill/Greyscale/*`, `Primary/Blue Normal ⭐️` · boards named `Permutation: Pg_<Name>`
- **Default screen size:** 390 × 844 (scroll screens run taller — 894 seen)
- Font in the product: Kanit. Board captions use **IBM Plex Sans Thai** (titles) / **IBM Plex Sans** (descriptions) — those belong to the board, not the screens

## Board anatomy · dialect A (GRID) — **harvested 2026-09-21** (from boards `438:196424` and `438:196511`)
> Ground truth for the `Setting/…` flow. A **grid** board built from the team's `Title Block` library component — nothing like NEXT or CLICX; never carry values across.

```
FRAME 'Permutation: Pg_<Name>'      [V · gap 0 · padding 0]  fill #C4C8D4 · radius 24 · clips   parent = the flow's SECTION
├── INSTANCE 'Title Block'          Flow=Permutation, Type=Section Title · FILL · fill #E1E3E9 · padding 40 · h 124
│     TEXT ⟨Permutation:⟩ + TEXT ⟨Pg | <page name>⟩
└── FRAME 'Contrainer' (sic)        [V · gap 120 · padding 80/120/80/120]
    └── FRAME 'Case'                layoutMode GRID · columns HUG (4 and 3 seen) · colGap 120 · rowGap 40   ← HUG × HUG
        ├── INSTANCE 'Title Block'  Flow=Permutation, Type=Sub Section Title · gridColumnSpan = all columns · FILL
        │     TEXT ⟨<g> | <Group name>⟩
        ├── FRAME 'Case'            390 FIXED × HUG [V · gap 40]      ← one per grid cell, colSpan 1
        │   ├── INSTANCE 'Title Block'  Flow=Main Flow, Type=Screen Title · `Show Description#1:3` toggles line 2 · ends with LINE 'Divider'
        │   │     TEXT 'Title' ⟨<g>.<n> | <Case name>⟩ · TEXT 'Description' ⟨<condition>⟩
        │   └── the screen INSTANCE (390×844 / 894) — or a component crop for component-level cases (e.g. `SOFCard_CASA` 390×108)
        └── (a FIXED 80-high empty grid row separates one sub-group from the next)
```

**`Title Block` is a remote library component** — component-set key `a9dd4f21347ee433af151110339c4eced0fa4b38`:
| variant | used for | key |
|---|---|---|
| `Flow=Permutation, Type=Section Title` | board header | `8977d1418ca6873c0a4b3758036e3b329e4a3d47` |
| `Flow=Permutation, Type=Sub Section Title` | group header (spans the grid) | `cdd3280e1c605393f51b728f52b61d684d22c334` |
| `Flow=Main Flow, Type=Screen Title` | the case caption | `634ede0ad4c234c5d7d2e0f692f786d3de93c769` |
> **Create the instance from the main component** (`(await src.getMainComponentAsync()).createInstance()`, then copy the source's boolean props) and override its texts — never rebuild it as plain text. **Do not `clone()` a Title Block out of a team board**: the copy is born inside the team's own grid and carries that grid's column span, which then collides in yours.
> GRID build order: cells first via `appendChildAt(node, row, col)`, spanning headers last — place the header at span 1, then set `gridColumnSpan`. Tracks `HUG`; the spacer row between sub-groups `FIXED 80`.
> Keep every case description to ONE line (≈ 48 characters at 390 wide): a wrapped description drops that cell's slot below its row neighbours.

| Role | Font | Size / line-height | Color |
|---|---|---|---|
| Board header | IBM Plex Sans Thai **SemiBold** | 40 / 44 | `#2B2F3B` |
| Group header `<g> \| <name>` | IBM Plex Sans Thai **SemiBold** | 40 / 44 | `#4457E3` |
| Case label `<g>.<n> \| <name>` | IBM Plex Sans Thai **SemiBold** | 24 / 40 | `#2B2F3B` |
| Case description | IBM Plex Sans Regular | 16 / 24 | `#565E76` |

- **Label grammar (dialect A): `<g>.<n> | <Case name>` — PTP boards carry NO `Case#N`.** Group = `<g> | <Group name>`. The team's own numbering is loose (repeats such as several `1.1` occur)
- Caption language: English label + English condition line (codes such as `AML=3 / Restriction=ZOAB`)
- Screen slot sizes: `390×844` · scroll screens keep their own height (`390×894` seen) · component-level cases hold a crop, not a screen
- Internal layer names: `Contrainer` (the team's spelling) → `Case` (group, GRID) → `Case` (cell) → `Title Block`
- **Link:** CONNECTOR named `Permutation` · `#F98600` · weight 4 · `ELBOWED` · caps `TRIANGLE_FILLED` → `ARROW_LINES` · from **the screen INSTANCE (magnet BOTTOM)** → **the board frame (magnet TOP)** · parent = the SECTION. One line in this flow ends on the board's `Title Block` instead of the board frame — dialect B does that everywhere, so either endpoint is acceptable; match the neighbours
- **Placement:** boards sit in a band below the flow (`y ≈ 3810` in this section), ordered left → right · gap between neighbouring boards ≈ 210
- **Board width:** `cols × 390 + (cols − 1) × 120 + 240` → 4 cols = 2160 · 3 cols = 1650

## Board anatomy · dialect B (rows) — **harvested 2026-09-21** (from boards `438:213486` · `438:213510` · `438:213786` · `438:213874`)
> The "PTP revamp" flow: 375-wide screens, plain auto-layout rows instead of a grid, and hash-indexed labels.

```
FRAME 'Permutation:' / 'Permutation: <Name>'   [V · gap 0 · padding 0]  no fill · radius 24      parent = the flow's SECTION
├── INSTANCE 'Title Block'   Flow=Permutation, Type=Section Title · padding 24/56 · TEXT ⟨Permutation:⟩ (⟨Error:⟩ on an error board)
└── FRAME (auto-named)       [V · gap 31]                               ← one per sub-group; omitted when the board has a single group
    ├── INSTANCE 'Title Block'  Flow=Permutation, Type=Sub Section Title · TEXT ⟨#<g> <Group name>⟩
    └── FRAME (auto-named)   [H · gap 80]                               ← the row of cases
        └── FRAME (auto-named) [V · gap 64]                             ← the case cell
            ├── INSTANCE 'Title Block'  Flow=Permutation, Type=Screen Title · TEXT ⟨#<n> <Case name>⟩ / ⟨#<g>.<n> <Case name>⟩
            └── the screen INSTANCE or FRAME (375×812 · taller for scroll screens: 926 / 951 seen)
```
- **Label grammar: `#<n> <Case name>` and `#<g>.<n> <Case name>`** — the group header uses the same form (`#1 E-Saving Account`); `scan-cases.js` tells them apart by structure (a header has nothing beside it)
- Flow screens are INSTANCES named `<MonYYYY>/PTP revamp/<Module>/<Screen>` (plus loose FRAMES for popups and error screens)
- **Link:** same CONNECTOR (`Permutation` · `#F98600` · `ELBOWED` · `TRIANGLE_FILLED` → `ARROW_LINES`) but **weight 5**, and it ends on the board's **`Title Block` instance (magnet TOP)** — in this flow that is the norm, not an outlier
- Boards sit under or beside the screen they belong to, not in one shared band

## Layout (school and conventions)
- **School B (grid-matrix)** with a School-A link from the screen
- Canvas: light · one board per page/screen (`Pg_<Name>`); a second board for the same page is allowed and keeps the same name
- Device variants: none seen
- Sub-groups: numbered `1 | …`, `2 | …`; component-level groups first (card states), screen-level groups after

## Naming
- Board name: **`Permutation: Pg_<Name>`** (colon + space) · header text `Pg | <Name>`

## Component → category (Phase 1, L2 detection)
| If instance.name matches | → category |
|---|---|
| `/Navbar/i`, `/Home Indicator/i`, `/Status Bar/i` | **OS / navigation chrome — NOT a pack. Check the NOT-a-pack rows FIRST** (seen on 7/7 screens, 2026-09-21) |
| `/^ic_/i`, `/^icons?\//i` | **icon asset — NOT a pack** (`ic_chevron-left`, `icon/chevron_right`, `Icons/Check_Fill`, `icon/edit_square`) |
| `/^(line\|divider\|section divider)$/i`, `/^background \//i` | decoration — NOT a pack |
| `/^logo\//i` | logo asset — NOT a pack |
| `/SOFCard/i` | source-of-fund account card — pulls Tier-3 **SOF card** + **Account restriction** packs |
> Starter map only — fill it in as screens are profiled. No match = flag as "unmapped", never guess.
> This map also applies to a PTP screen embedded in another project's flow (a PTP coupon screen inside a NEXT Top-Up flow): components follow the screen's own design system, the board follows the flow.

## Anchors (READ-ONLY)
- File `lN13minj5i19c2fEyBSF3q`, page `PTP`: dialect A boards `438:196424` · `438:196511` · healthy link `438:196535` — dialect B boards `438:213486` · `438:213510` · `438:213786` · `438:213874`

## Tier-3 packs (PTP-specific — read off the captions on the two boards)
| Pack | ~cases | Notable cases |
|---|---|---|
| SOF card — nickname | 4 | Default · Set Nickname · Long Name · Disable |
| Account restriction | 4 | Blocked / Closed Acc (`AML=3 / Restriction=ZOAB`) · MA account (Black, Grey) · ZACL Setting ⚠️ codes come from the brief |
| Linked-account count | 4 | Link 1 Acc · Link 1 Acc + E-Saving · Link 2 Acc + E-Saving · Link 3 Acc + E-Saving (max) ⚠️ confirm the max |
| Text overflow | 2 | Account type exceeds the space · Nickname length exceeds the space |
| Empty / API error | 1 | Empty State shown through an `API_Error` frame |
| E-Saving / PTP Plus entitlement | 2–4 | No E-Saving (PMT) · Have E-Saving (PMT) or PTP Plus · Savings-account limit unreached · Reached maximum savings accounts ⚠️ confirm the limit |
| Link-account errors | 3 | Unable to link account · Incorrect OTP exceeds 3 times · Request OTP exceeds 3 times ⚠️ counts come from the brief |
| Success CTA variants | 2 | Button `เสร็จสิ้น` · Button `ถัดไป` |

## Screen facts (business rules per screen — grown by Phase 3 trims)
> Phase 2 reads this FIRST: a case listed here for the current screen is pre-bucketed **⊘ with the stored reason**.
| Screen (name pattern) | Case (`caseId`) | Rule (why it can/can't happen) | Learned |
|---|---|---|---|

## Verify config (paste into `scripts/verify-board.js` CONFIG)
```js
labelStyle: "indexed",          // dialect A `<g>.<n> | <name>` · dialect B `#<n>[.<m>] <name>` — never `Case#N`
slotSizes: ["390x844"],         // dialect B flows: ["375x812"] · slot height follows the base: replace it with the base height when it differs
titlesFullWidth: false,         // headers span the GRID (gridColumnSpan), not a sibling frame — the generic check does not apply
```
