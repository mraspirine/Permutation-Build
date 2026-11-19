# case-library — the 2-level case base (Tier 1 / Tier 2)

> Read in Phase 1 (§Never a pack) and Phase 2 (Enumerate). Source: the team's **FigJam canonical library** (§Source at the bottom). Tier 3 (project-specific) lives in `projects/<name>.md`.
>
> **How to use:** whichever components Phase 1 found on the base → pull their packs from §L2 (plus chained packs). Whatever archetype it is → pull the screen-level states from §L1 and `archetype-cases.md`. Every case carries: `id` · level · tier · opt-in · caption.
> **Row ids inside a pack are derived, never invented**: `<pack>/<row name in kebab-case>` — `textfield/focus`, `image/asset-load-fail`, `text/maximum-characters`. No abbreviations, no re-wording. Rows whose name is Thai or carries a slash have their id written out in **§Row ids that cannot be derived** below.
> `knownCaseIds` for G5 = every L1 id + every `tmpl/*` id + the row ids this run actually used.
> `opt-in` means the case does not apply to every screen (the FigJam sticky marks it `(specific)` / `(Optional)`) → propose it as 🟠 Medium / 🟡 Low (the user can trim it at Confirm; never its own question box).
>
> **Why captions stay verbatim** (the rule is SKILL.md Phase 2 step 3): one situation worded two ways ("Session timeout" on one board, "Network reconnect" on its sibling) makes the boards impossible to compare.
>
> **A row with no Thai text keeps its name alone** (Text Field `Focus` · `Typing` · Image `Ratio & Sizing`): the Case table shows `Focus`, the Permutation Board caption carries only the name (+ the project's CTA line) — never write a Thai gloss for it yourself (user, 2026-11-19).
>
> **Backticks are file markup, not caption text** — a caption that quotes an id (`` `empty/section` ``) goes onto the canvas WITHOUT the backticks.
> **A parenthetical note addressed to Skill is not caption text** — e.g. `(ONE case showing the three states)` on `button/interaction-states` in next.md: neither on the canvas nor in chat.
> **Thai strings below are verbatim from the team's FigJam and boards** — they are the wording the team actually uses on boards, so they stay in Thai.

## FigJam scope tag → tier
`DX - NEXT (Shared)` or any `<name> UI` tag (the board the case originated on) all mean "originated in that project but the team promoted it to shared" → treat as **Tier 1** (applies to any screen carrying that component). Cases that genuinely cannot be shared are Tier 3, in `projects/<name>.md`.

---

## L1 · Screen-level states

| id | tier | opt-in | caption (EN — TH) |
|---|---|---|---|
| `screen/default` | 1 | | Default — กรณีเข้าจอครั้งแรก ยังไม่เลือก/กรอกอะไร |
| `screen/loading-spinner` | 1 | | Full screen loading — กรณีโหลดทั้งจอ (spinner) |
| `screen/loading-skeleton` | 1 | | Skeleton loading — กรณีโหลดทั้งหน้า (โครงเทา) |
| `screen/loading-lazy` | 1 | ✓ | Lazy loading — กรณีโหลดเพิ่มเติมทีละส่วน |
| `screen/loading-partial` | 1 | ✓ | Partial loading — กรณีโหลดได้บางส่วน |
| `screen/pull-refresh` | 1 | ✓ | Pull to refresh — กรณีดึงลงเพื่อรีเฟรช |
| `screen/retry-loading` | 1 | ✓ | Retry loading — กรณีโหลดใหม่หลังพลาด |
| `screen/block-retry` | 1 | ✓ | Block retry loading — กรณีบล็อกโหลดซ้ำถี่ |
| `screen/empty` | 1 | | Empty — กรณีไม่มีข้อมูล/ไม่มีผลลัพธ์ |
| `screen/error-full` | 1 | | Error (full screen) — กรณีโหลด/ดึงข้อมูลไม่ได้ทั้งจอ |
| `screen/size-small` | 1 | | Small screen — กรณีจอเล็ก |
| `screen/size-large` | 1 | ✓ | Large screen — กรณีจอใหญ่ |
| `screen/scrolled` | 1 | ✓ | Scrolled — กรณีเลื่อน (บน-ล่าง / ซ้าย-ขวา / สุดขอบ) |

> Screen widths per project live in `projects/<name>.md`. The FigJam sticky records "375, 390 / Small 360 / Large 440".
>
> **Where opt-in comes from:** FigJam marks only **pull-refresh · block-retry · size-large** as `(Specific)`. The opt-in flags on **loading-lazy · loading-partial · retry-loading · scrolled** are a **skill convention** (they only make sense on list/paginated/scrollable screens), not a FigJam tag.

---

## L2 · Component-level packs (verified from FigJam — if the component is on the base, pull the whole pack)

### Text Field  `id: textfield/*` · tier 1
Placeholder · Focus · Typing · Filled · Had value (Pre-filled) · Disabled · Mandatory/Optional
**Error (Common):** ไม่กรอก · อักขระพิเศษ+Emoji · **ไม่ใช่ภาษา Eng/TH** · **กรอกได้เฉพาะ Eng/TH**
**Other:** Limit character

### Text Field (Add-on)  `id: textfield-addon/*` · tier 2 (opt-in)
**Error (Optional) → Specific error:** กรอกไม่ตรงตามจำนวนที่กำหนด · Count ตัวอักษร · กรอกไม่ครบ · **เงินไม่พอ** · ตัวเลขเกินขั้นต่ำ (วงเงินขั้นต่ำต่อรายการ/วัน, เกินที่กำหนด)
**Other (Optional) → Keyboard:** Show/Hide · Keyboard type (Text, Numpad etc)
> "เงินไม่พอ" applies when the field is a money input. The actual limit must come from the brief → otherwise mark `⚠️ ยืนยันค่า`.

### Image  `id: image/*` · tier 1
default image/banner · asset load fail (หายไปทั้ง section / placeholder) · Ratio & Sizing

### Date Picker  `id: datepicker/*` · tier 1 · **chains → datecalendar, dateroller**
Placeholder · Filled · Had value (Pre-filled) · Disabled · Mandatory/Optional
**Error (Common):** ไม่เลือกวัน · เลือกวันไม่ตรงตามช่วงเวลาที่กำหนด
> The team drew an arrow from Date Picker to Date Calendar in FigJam — finding a Date Picker should also surface the Calendar and Roller packs.

### Date Calendar  `id: datecalendar/*` · tier 1
Default (วันเดือนปีที่กำหนด) · Selected · Disabled · ขอบเขตช่วงเวลาเลือกได้ · Button enabled/disabled

### Date Roller  `id: dateroller/*` · tier 1
Default (วันเดือนปีที่กำหนด) · Selected · ขอบเขตช่วงเวลาเลือกได้ · Button enabled/disabled

### Toast  `id: toast/*` · tier 1
Success · Fail · Warning (opt) · Close (X) button · Time to display · Maximum display (opt)

### Scrolling (Component+Page)  `id: scrolling/*` · tier 1
Scroll Up-Down · Scroll Left-Right · Scroll to Top (opt) · Scroll to Bottom (opt) · Sticky Area

### Text  `id: text/*` · tier 1
Maximum characters · Maximum lines · Display Language (opt)

### Selection (Radio+Text)  `id: selection-radio/*` · tier 1
Default (unselected) · Selected · Selected Disable · Default Disabled

### Selection (Checkbox+Text)  `id: selection-checkbox/*` · tier 1
Default (unselected) · Selected · UnSelected · Multiple Select · Selected Disable · Default Disable

### Row ids that cannot be derived (Thai or slashed row names)
| pack | row | id |
|---|---|---|
| Text Field | Had value (Pre-filled) | `textfield/had-value` |
| Text Field | Mandatory/Optional | `textfield/mandatory-optional` |
| Text Field | Error — ไม่กรอก | `textfield/error-empty` |
| Text Field | Error — อักขระพิเศษ+Emoji | `textfield/error-special-characters` |
| Text Field | Error — ไม่ใช่ภาษา Eng/TH | `textfield/error-not-eng-th` |
| Text Field | Error — กรอกได้เฉพาะ Eng/TH | `textfield/error-eng-th-only` |
| Text Field (Add-on) | กรอกไม่ตรงตามจำนวนที่กำหนด | `textfield-addon/error-length-mismatch` |
| Text Field (Add-on) | Count ตัวอักษร | `textfield-addon/character-count` |
| Text Field (Add-on) | กรอกไม่ครบ | `textfield-addon/error-incomplete` |
| Text Field (Add-on) | เงินไม่พอ | `textfield-addon/error-insufficient` |
| Text Field (Add-on) | ตัวเลขเกินขั้นต่ำ | `textfield-addon/error-limit` |
| Text Field (Add-on) | Keyboard Show/Hide · Keyboard type | `textfield-addon/keyboard-show-hide` · `textfield-addon/keyboard-type` |
| Date Picker | Had value (Pre-filled) · Mandatory/Optional | `datepicker/had-value` · `datepicker/mandatory-optional` |
| Date Picker | Error — ไม่เลือกวัน | `datepicker/error-no-date` |
| Date Picker | Error — เลือกวันไม่ตรงตามช่วงเวลาที่กำหนด | `datepicker/error-out-of-range` |
| Date Calendar / Roller | Default (วันเดือนปีที่กำหนด) | `datecalendar/default` · `dateroller/default` |
| Date Calendar / Roller | ขอบเขตช่วงเวลาเลือกได้ | `datecalendar/selectable-range` · `dateroller/selectable-range` |
| Date Calendar / Roller | Button enabled/disabled | `datecalendar/button-enabled-disabled` · `dateroller/button-enabled-disabled` |
| Image | default image/banner | `image/default` |
| Image | asset load fail (หายไปทั้ง section / placeholder) | `image/asset-load-fail` |
| Image | Ratio & Sizing | `image/ratio-sizing` |

### Never a pack — in ANY project (checked in the order SKILL.md Phase 1 step 2 gives)
`/status ?bar/i` · `/home ?indicator|iphone indicator/i` · `/^(nav|top) ?bar|^navbar|^header$/i` · `/^ic[_\/]|^icons?[\/_ ]|^icon$/i` · `/^(line|divider)$/i` · `/^background/i`
> OS chrome, icons and decoration produce no cases in any design system, so they are never reported as "unmapped". A project file may still override one of them with an exception row in its component → category table, which SKILL.md Phase 1 step 2 checks before this list (CLICX `gen_ic_eye` = the hide-balance trigger).
> **The screen's own wrapper is not a component**: an INSTANCE that holds the whole Key Screen (its one visible child, at the screen's size — CLICX `edit phone number`, `home master screen`) is the screen itself → map its children. Instances nested inside a mapped component (the icon inside a Text Field) belong to that component's pack — never mapped on their own.
> These layers, and a project row that says `no pack`, pull nothing: they appear in neither the Case table nor ตัดออก (a header row may still say `ปุ่มไม่แตก Case`).

### Additions 2026-08-11
| id | tier | opt-in | caption (EN — TH) |
|---|---|---|---|
| `empty/section` | 1 | | Empty (per section) — กรณี section ว่างขณะที่ทั้งจอยังปกติ (ต่างจาก `screen/empty` ที่ว่างทั้งจอ) |
| `nav/badge` | 1 | ✓ | Notification badge — กรณีมี badge บน nav / icon แจ้งเตือน |
| `hub/card-set` | 3 (CLICX) | ✓ | Hub card set — กรณีจำนวน/ลำดับการ์ดใน hub เปลี่ยนตาม personalize (น้อยสุด / มากสุด) |
| `fav/list-count` | 1 | ✓ | Favorite list count — กรณี favorite 0 / 1 / เต็ม (0 รายการยังต้องแสดงปุ่มเพิ่ม ไม่ใช่ `empty/section`) |

---

## Tier 2 · Platform templates (opt-in, parameterized)

Attach only when the flow actually uses them. Each takes a parameter (in the last column). Real values (limits, counts) must come from the brief; otherwise mark `⚠️ ยืนยันค่า`.

| id | caption (EN — TH) | param |
|---|---|---|
| `tmpl/threshold` | Threshold min/max/exceed — กรณีต่ำกว่าขั้นต่ำ/เกินสูงสุด/เกินลิมิต | amount/count/length |
| `tmpl/retry-lockout` | Retry wrong <N / ≥N — กรณีใส่ผิดไม่เกิน N / เกิน N ครั้ง (ล็อก) | attempt N |
| `tmpl/insufficient` | Insufficient / limit exceeded — กรณียอดไม่พอ / เกินลิมิตต่อวัน | balance vs limit |
| `tmpl/session-timeout` | Session timeout — กรณี session หมดอายุกลางทาง | — |
| `tmpl/server-down` | Server down / cannot connect / repeat — กรณีระบบล่ม/เชื่อมต่อไม่ได้/ทำรายการซ้ำ (idempotency) | — |
| `tmpl/validation-inline` | Validation inline error — กรณี error ใต้ field (ระบุ field) | which field |
| `tmpl/dropdown-dismiss` | Dropdown/action-sheet — กรณีเปิด / ปิดโดยไม่เลือก → inline error | which field |
| `tmpl/entitlement` | Entitlement/status — กรณี enabled/disabled/registered/guest/unregistered | which entitlement |
| `tmpl/ekyc` | eKYC / face-scan module — consent → instruction → liveness error/motion → SDK error | — |
| `tmpl/consent` | Consent module — default / selected / consent-source error | which consent |
| `tmpl/sof-eligibility` | Source-of-Fund eligibility — all eligible / ineligible / none / error | — |

> Some Tier 2 entries (eKYC, consent) are **modules with their own base screen**. If the base being processed is not that screen, do not fan them out as variants of the current one — report instead that "this flow includes module X; run the skill on screen X".
>
> Also check whether the project keeps a **shared handling board** (e.g. one board holding server-down / timeout / repeat / session for the whole flow). If it does, those cases must not be duplicated per screen — see `projects/<name>.md`.

---

## Enumeration guards (read in Phase 2 — lessons from the 2026-10-22 four-model test)
- **"Content fits the screen" is not a reason.** `screen/scrolled` and the other opt-in Screen State rows stay ✗ when the screen's rows can grow (another proposed Case adds rows or fields — Multiple fields, MWA tiers, a long memo). Cut only with a measured reason (frame height ≤ the device viewport in every data state) or a §Screen facts row.
- **The sample on the Key Screen is not a reason.** "This screen shows biller X / coupon Y / account Z" is one data state, never grounds to cut a pack row (3 of 4 models cut the MWA Case because the sample bill was electricity).
- **Minting a Tier-3 Case** (a pack row without a stored id): rows a sibling Permutation Board in THIS flow already built (the MWA tier rows on 1.14.1) are มีแล้ว — never re-minted or copied. What THIS Key Screen shows that the sibling board does not (the confirmation screen's one `MWA overdue + VAT` row) is still minted, as exactly one new Case: one situation = one Case, named from the pack row's own words, never an umbrella name, never one Case per sub-rule. Mint only from a project pack row or an element visible on the Key Screen; an archetype dimension alone is not a Case. Every newly minted Case gets its own Confirm row, even when Skill leans toward cutting it.
- **Space is not a reason.** A Case is never cut or merged so the Permutation Board fits: too little room changes only where it goes (a placement Confirm row; SKILL.md Phase 4 step 3 stops and asks).
- **A separate screen in the flow is not a reason.** A loading / error screen elsewhere in the flow (CLICX `B.03-01.A | loading state`, `C.01-01.A | API error`) does not make this Key Screen's Loading / Error Cases มีแล้ว — only a Permutation Board does (this base's own, or the flow's shared one). The Cases stay (user, 2026-11-19); a project file may say otherwise.
- **Group of a minted detail row**: a minted Case that is a detail row on the Key Screen (MWA overdue + VAT, fee, memo, fields) goes in `Bill Detail` (the project's detail Group) — never a new Group named after the pack or the biller; take a sibling board's Group title only when the Case is the same kind as that Group. Inside a Group, order the Cases as the Key Screen's rows run, top → bottom (fee, memo, then pack-derived rows such as Multiple fields, MWA).

## Priority (defaults when proposing the matrix)
🔴 **High** breaks the flow / user stuck / money at risk · 🟠 **Medium** clearly worse but not blocking · 🟡 **Low** rare (stamps keep `must` / `should` / `edge`)
**Fintech modifier:** cases about the money outcome (amount, fee, payable, balance, double submission) move up one level — not every row of a payment or confirmation screen; idempotency and mid-transaction timeout are always High. The modifier applies to Tier-3 rows too: a Case whose caption names the payable amount, fee or discount outcome (Zero payable · Fee charged · Coupon expired at confirm) is High.
**Defaults by kind:** Image pack rows (asset load fail, Ratio & Sizing) and opt-in Screen State rows (Scrolled, Large screen) are Low · a value-⚠️ detail row that is not a money outcome (No memo, Multiple fields) is Medium.
**Case numbers**: the rule is SKILL.md Phase 2 step 6; a project that numbers differently says so in `projects/<name>.md`. Why: Top-Up 29.1 was numbered by priority and read `Case#1 · #2 · #10` in one row (2026-08-18).

## Chain links (finding A should also surface B)
- Date Picker → Date Calendar + Date Roller
- Text Field on a money input → Text Field Add-on (`เงินไม่พอ`, threshold)
- Selection that is required → Validation inline

## Source
FigJam library `pFnfToBs4ecxvqrTWxqhaM#129:5011` (two groups: Screen, Component · verified 2026-07-24) · Tier 2 templates are distilled from the team's existing boards. **If the FigJam changes, re-sync these tables and update the date.**

## Buckets
The bucket rules (✓ มีแล้ว · ✗ proposed · ⊘ ใช้กับจอนี้ไม่ได้, §Screen facts first) are SKILL.md Phase 2 steps 1 and 4; §Enumeration guards above lists what is not a reason to cut.

