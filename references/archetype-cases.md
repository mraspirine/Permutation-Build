# archetype-cases — archetype → signature cases + permutation axes

> Read in Phase 1–2. Sources: **corpus §D** (archetype → signatures, drawn from 6 real projects) and **§B** (the 9 axes). Use it to classify the base, then pull the cases that come with that screen type — on top of the component packs in `case-library.md`.
> **An archetype is a floor, not a ceiling** — real screens usually have more. Reason forward from what is actually on the screen instead of just ticking the list.

## Guessing the archetype from what is on the base (then confirm with the user)
| Archetype | Signals on the screen | Corpus example |
|---|---|---|
| **Form / multi-step** | input fields, labels, submit, validation hints, sliders | Apply LOC |
| **Transaction / payment** | amount, confirm, source/destination, fee, slip | Coupon |
| **Dashboard / summary** | several widgets, totals, graphs, tabs, filters | SUMMARY |
| **Home / hub** | asset cards, module tiles, greeting, skeletons | Im (CLICX) |
| **Account list / tabs** | tab bar, per-tab lists, per-tab empty states | Poon (Connext) |
| **Detail** | one item, hero, entitlement, action at the bottom | Play Card |

Hybrid screens: pick the primary archetype by the screen's core task, then add one secondary set.

## Signature cases per archetype (beyond the L1/L2 basics — corpus §D)
| Archetype | Signature permutations |
|---|---|
| **Form / multi-step** | field default/filled/focus-out/validation · dropdown + action-sheet dismiss · calculator or slider (min/max/round-down) · confirm & edit · consent · eKYC · processing/result |
| **Transaction / payment** | search · history list · **business matrix** (coupon %/฿/gift/expired) · source-of-fund eligibility · schedule (once/monthly) · confirm · slip · face liveness (errors + motion) |
| **Dashboard / summary** | empty **per device** · void vs no-void · scrolling · tab change · graph with N channels · filter · migrated data source |
| **Home / hub** | asset registration (unregistered / no-pocket / has-pockets) · skeletons (box/circle/content/pill) · content layouts (list/paragraph/bullet) · load failure (>N retries) · module cards |
| **Account list / tabs** | per-tab empty/scrolling/error · guest mode · FX cards (many currencies) · success/notification · **TH/EN paired frames** |
| **Detail** | entitlement (enabled/disabled/registered-3D) · transaction-empty variants · menus · buy T&C |

> Most signature cases are **Tier 3 (project-specific)** — their real captions and parameters belong in `projects/<name>.md`. This table only says which dimensions a screen of this type should make you think about; it is not ready-made caption text.

## The 9 permutation axes (corpus §B — walk all of them when enumerating)
1. **Data volume** — Default / Filled / Empty / Long text / Max-Min / Placeholder / Scrolling / End-of-list
2. **Loading** — Skeleton / Loading screen / Pull-to-refresh
3. **Error & network** — Unable to load / Server down / Reload > N / Image placeholder / Partial error / Page not found
4. **Session & auth** — Session timeout / PIN (wrong < 5, ≥ 5) / OTP + resend / Face liveness / SDK error / App switch
5. **Input / field** — Default / Typing / Filled / Focus-out (empty) / Inline validation / Dropdown open / Keyboard / max-length / round-down
6. **Business-logic matrix** — thresholds / product-type matrices / tiered charges / partner / eligibility *(Tier 3)*
7. **Entitlement / status** — Enabled/Disabled/Registered · Guest · unregistered · eligible source of fund
8. **Device / responsive** — Small / Large *(check `projects/<name>.md` for whether the project treats these as separate cases or extra columns)*
9. **Navigation / interaction** — Back · Tab change · Scroll-to-top · Toggle · Toast · Radio/Checkbox

## Enumeration rules
- Axes 1–5 and 9 are mostly Tier 1/2 (they live in `case-library.md`) · axis 6 is Tier 3 · axes 7–8 depend on the project
- **Walk every applicable axis** and sort into ✓ exists / ✗ missing / ⊘ N/A with a reason. An axis that does not apply (a static screen that fetches nothing → axis 2 is N/A) still has to be **mentioned with its reason** — never skipped silently.
