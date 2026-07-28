# Project: CLICX (Im / PB) — permutation profile

> Learned 2026-07-27 by harvesting `G.02-01.B` in `[Test Case] UI State & Edge Case Generator`, page `AI Test 02`, section `Home`. Corpus reference: `permutation-reference.md` §4 (Im / CLICX).

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
            ├── FRAME 'Title'     [V · gap 24]
            │   ├── INSTANCE 'title block / permutation'  type=screen title  ← the case label
            │   │     └── TEXT 'Title' ⟨Case #N - <case name>⟩
            │   └── INSTANCE 'title block / permutation'  type=note          ← the Thai description
            │         └── TEXT 'Title' ⟨<Thai explanation>⟩
            └── FRAME 'screen permutation'  [V · gap 16]        ← phase 1 = placeholder · phase 2 = the screen
                  (+ INSTANCE 'point note' overlays for annotations)
```

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

- Board fill `#EAEEF4` · title block fill `#CDD5DF`
- Internal layer names: `permutation` → `container` → `case` → `Title` / `screen permutation`
- **Every `permutation` frame has the SAME width** = board inner width (board width − 2×100), regardless of how many cases its row holds. The section-title instance is set to **`layoutSizingHorizontal = "FILL"`** so the grey header bar spans the full frame. Only the inner `container` row hugs its content.
- **Link from screen to board: CONNECTOR named `Permutation`** · stroke **`#F79009`** · weight **4** · `ELBOWED` · no dash · start = **the main screen INSTANCE inside the `.A` frame** (e.g. `my asset screen`, `home master screen`), magnet **BOTTOM** → end = **the `.B` board frame**, magnet **TOP** · parent = the SECTION
  (`figma.createConnector` is unavailable in design files → draw a VECTOR elbow with the same stroke/weight and tell the user it will not auto-attach)
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
- ⚠️ **This label does NOT satisfy the `renumber-cases` regex** (`/^\s*Case\s*#?\s*(\d+)\s*$/` requires the whole string to be just `Case #N`). CLICX boards are therefore not renumber-cases compatible by design — follow the CLICX convention and tell the user that renumbering must be done by hand here.

## Component → category (Phase 1, L2 detection)
| If instance.name matches | → category |
|---|---|
| `/asset\b/i`, `/acc detail/i`, `/acc type/i` | account card / list item (data states: long name, max amount, zero/negative) |
| `/gen_ic_eye/i` | hide-balance toggle |
| `/ic_circle-information/i` | info tooltip |
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

## Verify config (paste into `scripts/verify-board.js` CONFIG)
```js
labelStyle: "loose",          // "Case #N - <name>" in one node → NOT renumber-cases compatible (manual renumber; say so in the report)
slotSizes: ["375x812"],
titlesFullWidth: true,        // every `permutation` frame = board inner width; section-title instance is FILL
```

## DS hooks (phase 2)
Variable collections `color` / `spacing` / `radius` / `size-generic`. Screens are built from instances such as `my asset screen`, `asset`, `acc detail`, `top bar`, `status bar`. See `figma-design-build/projects/pb.md` + `pb.registry.md` for component keys.
