# case-library — the 2-level case base (Tier 1 / Tier 2)

> Read in Phase 2 (Enumerate). Sources: the team's **FigJam canonical library** (`pFnfToBs4ecxvqrTWxqhaM` node `129:5011`, verified at full resolution 2026-07-24) and **corpus §8** (`permutation-reference.md`: 16 universal + 11 templates). Tier 3 (project-specific) lives in `projects/<name>.md`.
>
> **How to use:** whichever components Phase 1 found on the base → pull their packs from §L2 (plus chained packs). Whatever archetype it is → pull the screen-level states from §L1 and `archetype-cases.md`. Every case carries: `id` · level · tier · opt-in · caption.
> `opt-in` means the case does not apply to every screen (the FigJam sticky marks it `(specific)` / `(Optional)`) → offer it as 🟡/⚪ for the user to decide.
>
> **Captions are verbatim.** A case that comes from this library keeps its `id` AND its caption exactly as written here — never re-word a standard situation (the 2026-08-06 Haiku run named the same situation "Session timeout" on one board and "Network reconnect" on its sibling, and the boards stopped being comparable). A genuinely new recurring situation → propose adding it to this library; do not free-text it onto one board.
>
> **Thai strings below are verbatim from the team's FigJam and corpus** — they are the wording the team actually uses on boards, so they stay in Thai.

## FigJam scope tag → tier
`DX - NEXT (Shared)` / `Im UI` / `poon. UI` all mean "originated in that project but the team promoted it to shared" → treat as **Tier 1** (applies to any screen carrying that component). Cases that genuinely cannot be shared are Tier 3, in `projects/<name>.md`.

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

### Additions 2026-08-11 (from the AI Test 05 run — **not yet in the team FigJam**; sync there and move into the sections above)
| id | tier | opt-in | caption (EN — TH) |
|---|---|---|---|
| `empty/section` | 1 | | Empty (per section) — กรณี section ว่างขณะที่ทั้งจอยังปกติ (ต่างจาก `screen/empty` ที่ว่างทั้งจอ) |
| `nav/badge` | 1 | ✓ | Notification badge — กรณีมี badge บน nav / icon แจ้งเตือน |
| `hub/card-set` | 3 (CLICX) | ✓ | Hub card set — กรณีจำนวน/ลำดับการ์ดใน hub เปลี่ยนตาม personalize (น้อยสุด / มากสุด) |
| `fav/list-count` | 1 | ✓ | Favorite list count — กรณี favorite 0 / 1 / เต็ม (0 รายการยังต้องแสดงปุ่มเพิ่ม ไม่ใช่ `empty/section`) |
> ที่มา: board `A.01-01.B` มีเคสจริงที่ไม่มี id รองรับ (Savings account/hub/widgets - empty · Bottom nav - notification badge) ทำให้ถูก free-text ต่างกันทุก board — บรรจุ id เพื่อให้ผ่านด่าน `knownCaseIds`

---

## Tier 2 · Platform templates (opt-in, parameterized — corpus §8)

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

## Priority (defaults when proposing the matrix)
🔴 **Must** breaks the flow / user stuck / money at risk · 🟡 **Should** clearly worse but not blocking · ⚪ **Edge** rare
**Fintech modifier:** money and confirmation cases move up one level; idempotency and mid-transaction timeout are always Must.

## Chain links (finding A should also surface B)
- Date Picker → Date Calendar + Date Roller
- Text Field on a money input → Text Field Add-on (`เงินไม่พอ`, threshold)
- Selection that is required → Validation inline

## Source
FigJam library `pFnfToBs4ecxvqrTWxqhaM#129:5011` (two groups: Screen, Component · verified 2026-07-24) · corpus `permutation-reference.md` §8. **If the FigJam changes, re-sync these tables and update the date.**
