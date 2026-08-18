# Project: NEXT (Krungthai NEXT) — permutation profile

> Written by hand from the corpus (`permutation-reference.md` §1-2, §7) + `permutation-layout-analysis.md`, then corrected against live boards during the 2026-07-27 pilot. Keep updating as more boards are harvested.

## About / recognition
- Product: Krungthai NEXT — Thai mobile banking (iOS-first)
- Detect: nodes in the base bind to variable collection `❖ NEXT` (key `e03564337abb1e70e48a18da6dd9084714728372`), usually alongside `3. Size` and `4. Typography`; or the file name contains "NEXT"
- **Default screen size:** 390 × 844 (legacy 375 × 812) · Small = 360 wide · Large = 440
- Font in the product: Krungthai Next (Regular / SemiBold only). Legacy screens use `Krungthai Fast`

## Board anatomy — **harvested 2026-07-27** (file `[Test Case] UI State & Edge Case Generator`, boards 8.1 / 14.1 / 11.1)
> Ground truth for **NEXT USP Revamp Payment**. Other projects have their own values — never copy these across projects.
> Re-harvest with `scripts/harvest-board.js` if the team changes style.

```
FRAME 'Permutation_<full screen name>'   [V · gap 64 · padding 64 all round]  fill #E5E7EB   parent = the flow's SECTION
└── FRAME 'case'                         [V · gap 64]                    ← one group per case category
    ├── TEXT '<Category> Permutations'    32px                           ← sub-group title
    │   (a further nested category → 24px)
    └── FRAME 'case'                     [H · gap 64 · WRAP]             ← row (fixed width)
        └── FRAME 'case'                 [V · gap 40]                    ← case column
            ├── FRAME 'Description'      [V · gap 24]                    ← caption block
            │   ├── FRAME 'case'         [V · gap 0]                     ← label group
            │   │   ├── TEXT 'Case#N'                ← no space
            │   │   └── TEXT '<case name, EN>'
            │   └── TEXT '<Thai description "กรณี…">'   width 375
            └── <screen slot 390×844>    (small 360 · legacy 375×812 · tall scroll screens keep the base height)
```

| Role | Font | Size / line-height | Color |
|---|---|---|---|
| Sub-group title | Krungthai Next **SemiBold** | 32 / **48px** | `#020617` |
| `Case#N` + case name (EN) | Krungthai Next **SemiBold** | 24 / **36px** | `#475569` |
| Thai description | Krungthai Next Regular | 16 / **24px** | `#020617` |

> **Re-harvested 2026-08-11** (board `Permutation_JUN26.02.1.14.1_…Input Information Top-Up_Filled`, same file):
> case column gap is **40** (not 24 — 24 is the caption block's inner gap) · Thai description is `#020617` (a single legacy node uses `#000000`) · group gap is **64** · slot heights follow the base screen, so a tall scroll screen gets a tall slot (390×1381 seen there).

- **line-height is always PIXELS** (1.5×), never AUTO
- Fonts seen inside legacy screens (`Krungthai Fast`) belong to **the screens, not the captions** — do not mix
- Internal layer names: the team reuses `case` at every level (or auto names like `Frame 10000xxx`)
- **Link:** CONNECTOR named `Permutation` · `#FAB900` · weight 5 · `ELBOWED` · from the **main INSTANCE inside the screen (magnet BOTTOM)** → **board (magnet TOP)** · parent = SECTION
  (the plugin API cannot create connectors in a design file → draw a VECTOR instead and tell the user — see board-grammar.md)
  **2026-08-11:** `CONNECTOR.clone()` also throws here — *"Cloning CONNECTOR nodes is not supported in the current editor"* — and `figma.createConnector` is not a function. In a **design** file the VECTOR fallback is the only option; it does not attach, so say so in the report. Cloning may still work on a FigJam board.
  **2026-08-18 (verified on healthy team lines 302749/302753 + a hand-drawn exemplar):** caps **`TRIANGLE_FILLED` at the screen end · `ARROW_LINES` into the board**. **Anchor = the main screen INSTANCE inside the frame (magnet BOTTOM) → the board frame (magnet TOP)** — 276:304854 (frame-bound) and 276:304468 (endpoints → SECTION, loose) are broken outliers; never pick them as the exemplar. Route = screen bottom-center → board top-center (straight when aligned, elbow when not — no need to move the board). Plugin here **cannot clone ANY connector** (healthy ones included, 3/3 throw) and `createConnector` is undefined, **but re-pointing an existing connector's `connectorStart`/`connectorEnd` DOES work** → recovery: the user hand-draws or Cmd+D's any `Permutation` connector, then the plugin re-points it precisely. The VECTOR fallback (per-vertex caps via `setVectorNetworkAsync`) is a visual placeholder only — it does not attach, and **an unattached line gets rejected** (29.1 build, user feedback). Full checklist: board-grammar §Link rule.
- **Placement:** flow band at `y≈147–4200` · permutation band at **`y≈6176`** · boards ordered by x following the screen order in the flow (leaving gaps for screens that have no board yet)
- **Board width:** choose a column count that fits the gap between neighbours — `n×390 + (n-1)×64 + 128`

> **Not to be confused with DGL Revamp** — screens named `…_DGL Revamp_NX_…` run in the NEXT app but are a **separate project** with their own board style → `projects/dgl.md`.

## Layout (school and conventions)
- **School A** (flow + permutation band + link)
- Canvas: dark on the corpus boards · captions are **bilingual** (EN name + Thai condition)
- **Device variants are separate cases** (a `Small screen` case with a 360-wide slot), not extra columns
- Granularity: one board per screen; one sub-group per case category (Input / Error Handling / Screen State / Coupon State …)
- **A shared `Common Handling` board** (`Permutation_JUN26.02.1.8.1_…`) holds `Server Down · Unable Connect · Repeat Transaction · Session timeout` for the whole flow → **individual screens must not duplicate these** (check before enumerating)
- Fraud Engine (PIN / Dip Chip / consent / liveness) has its own boards `…34.1–46.1` → separate modules, do not fan them out inside a payment screen

## Naming — **always look at the existing boards in the file first and match them** (NEXT uses two forms in practice)
| Form | Where | Example |
|---|---|---|
| **`Permutation_<full screen name>`** (underscore) | file `[Test Case] UI State & Edge Case Generator` / Universal Payment — **verified 2026-07-27** | `Permutation_JUN26.02.1.13.1_NEXT_USP Revamp Payment_Payment Information` |
| Suffix `<Field> Permutations` | Apply LOC boards (corpus §1) | `Loan Amount Permutations` |
- `scan-cases.js` recognizes `Permutation:` / `Permutation_` / `… Permutations` (and filters by node type so a title text node is not counted as a container)
- Works with `screen-rename`: the `Permutation_` prefix inherits the number of the nearest normal screen above
- Section band (if present): `NEXT_Screen Flow_<REL.EPIC>_<FLOW>_<YYYYMMDD>`
- **Label is `Case#N` (no space)** in the Universal Payment file; the regex accepts both forms, but match the neighbouring boards

## Component → category (Phase 1, L2 detection)
> v1 matches on **name patterns**. Component keys are more precise — harvest them from `figma-design-build/projects/next.registry.md` and add them here. No match = **flag as "unmapped", never guess**.

| If instance.name matches | → category (pack in case-library) |
|---|---|
| `/text ?field/i`, `/input/i`, `/textbox/i` | `textfield/*` (+ `textfield-addon` if it is a money field) |
| `/date ?picker/i` | `datepicker/*` → chains to `datecalendar`, `dateroller` |
| `/calendar/i` | `datecalendar/*` |
| `/toast\|snackbar/i` | `toast/*` |
| `/radio/i` | `selection-radio/*` |
| `/checkbox/i` | `selection-checkbox/*` |
| `/image\|banner\|thumbnail\|logo/i` | `image/*` |
| `/button\|cta/i` | interaction states (Default/Pressed/Disabled) — not a separate pack |
| `/search ?bar\|search/i` | `textfield/*` (search field — no validation pack, no mandatory/optional) · confirmed 2026-08-11 |
| `/switch\|segment\|tab ?bar/i` | navigation — tab change (axis 9), not a component pack · confirmed 2026-08-11 |
| `/quick ?(button\|menu)\|shortcut/i` | `fav/list-count` + `scrolling/*` (horizontal rail) · confirmed 2026-08-11 |
| `/^list$\|list ?item\|row/i` | list rows → `empty/section` · `text/*` (long name) · `image/*` (row logo) · `tmpl/entitlement` (row disabled) · confirmed 2026-08-11 |

## Anchors (READ-ONLY — for harvesting and comparison)
- File `lN13minj5i19c2fEyBSF3q`: **Apply LOC** `0:1` · **Coupon** `16:20211` · Universal Payment section `Revamp Payment` `129:187281`
- Never write into reference/production files — use a scratch file for tests

## Tier-3 packs (NEXT-specific — this table is canonical here; harvest full captions per pack during LEARN)
> Pull these when the base belongs to that flow. Axis 6 (business matrix) is almost entirely Tier 3. **Real numbers must come from the brief, otherwise `⚠️ ยืนยันค่า`.**

| Pack | ~cases | Notable business rules |
|---|---|---|
| Loan Calculator / Loan Amount | 9–12 | round down to the nearest thousand · minimum · salary multipliers · maximum ⚠️ |
| Monthly Income field | 5 | maximum value · minimum threshold ⚠️ |
| Occupation / Business Type chain | 3 / 8 | dropdown → sub-dropdown → "other, please specify" → inline error |
| Referral Code | 4 | typing · validation on length |
| Address edit (legal / current / work) | ×3 contexts | save disabled/enabled · two postal codes · back |
| Consent (Model / NCB) | 3 + 3 | default (confirm disabled until scrolled to the bottom) · selected · consent error popup |
| Verify PIN | 3 | session PIN · wrong < 5 · wrong ≥ 5 (locked) |
| Coupon matrix | ~21 | discount by %/amount/product/gift · expired · ineligible · zero payable · name too long ⚠️ |
| MWA (water biller) tiers | 9 | overdue > 1 month · VAT · suspension fees · installments ⚠️ |
| Source of Fund eligibility | 4–6 | all eligible / ineligible / none / error |
| Bill payment input | 5 | empty stage · multiple fields · biller to favorite · field display |
| Bill payment error handling | 5 | reference number incorrect · incorrect biller code · outstanding payment |
| Face liveness | 12+5+3 | error catalog · motion challenge · environment — **module: run on the eKYC screen itself** |

## Screen facts (persisted ⊘ — pre-bucket these before enumerating; do not re-propose)
| Screen | caseId | reason | date |
|---|---|---|---|
| `*` (whole USP Revamp Top-Up flow) | `tmpl/server-down` · `tmpl/session-timeout` · repeat transaction | covered once by the flow's `Permutation_JUN26.02.1.12.1_…_Common Handling` board (Case#1–5) | 2026-08-11 |
| `1.13.1 Select Top-Up` | `screen/empty` | the biller list is server master data and always has rows — "no rows" only happens as a fetch failure → `screen/error-full` | 2026-08-11 |
| `1.13.1 Select Top-Up` | `screen/loading-spinner` | list screens in this flow load with a skeleton, never a full-screen spinner | 2026-08-11 |
| `1.13.1 Select Top-Up` | `screen/loading-lazy` · `screen/block-retry` | the biller list is fetched once in full, no pagination | 2026-08-11 |
| `1.13.1 Select Top-Up` | `textfield/disabled` · `textfield/mandatory` · `textfield/error-*` | the search bar is a filter, not a form field — no validation, never disabled | 2026-08-11 |
| `1.13.1 Select Top-Up` | `datepicker/*` · `datecalendar/*` · `dateroller/*` · `selection-radio/*` · `selection-checkbox/*` · `toast/*` · `nav/badge` | those components are not on this screen | 2026-08-11 |
| `1.13.1 Select Top-Up` | `tmpl/threshold` · `tmpl/insufficient` · `tmpl/validation-inline` · `tmpl/dropdown-dismiss` · `tmpl/sof-eligibility` | no money input on this screen — they belong to `1.14.1 Input Information Top-Up` | 2026-08-11 |
| `1.13.1 Select Top-Up` | `tmpl/ekyc` · `tmpl/consent` · `tmpl/retry-lockout` | separate modules with their own bases (Fraud Engine 1.34–1.56 · Session PIN 1.8/1.10/1.11) | 2026-08-11 |

## Verify config (paste into `scripts/verify-board.js` CONFIG)
```js
labelStyle: "strict",                     // Case#N exactly → renumber-cases compatible
slotSizes: ["390x844","360x844","440x844","375x812"],  // normal · small · large · legacy
titlesFullWidth: false,                   // NEXT headers are not forced to span the group
```

## DS hooks (phase 2 — when screens get built)
Components the recipes will instantiate (spinner / error state / toast / skeleton / keyboard) → grep keys from `figma-design-build/projects/next.registry.md` (optional, graceful — if it is missing, the recipe becomes a TODO). NEXT binds text via `setTextStyleIdAsync`; radius scale 0/16/24/32/Full; there is no 12px or 18px type.
