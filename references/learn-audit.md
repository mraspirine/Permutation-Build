# learn-audit — MODE: LEARN and MODE: AUDIT

> Read this file in full when LEARN or AUDIT starts (SKILL.md points here). SKILL.md §How to talk still applies: Thai, `Skill` as the subject, the deck's words, never node ids · case ids · script names.

## LEARN — teach Skill a new project / refresh its layout
1. The user points at an existing permutation board for that project (URL / node id) + its FigJam if any.
2. Read the board (a large one → Bridge, `contract-and-runtime.md` §4) → run `scripts/harvest-board.js` verbatim → capture **school + grammar**, described in words and ratios — store grammar, never per-screen geometry (geometry is measured live, or taken from the project file's defaults) — plus one exemplar's default cell/gap dimensions. What a harvest must capture: `board-grammar.md` §What the harvest must capture.
3. Harvest **Tier-3 packs** from the captions on the board (grouped by screen / component / module), verbatim.
4. Draft `projects/<name>.md` from `projects/_template.md` → show the user in plain Thai what Skill learned (layout, รูปแบบเลข Case (เช่น "Case#1 ไม่มีเว้นวรรค") — never the style name, Groups, Case packs) → **the user confirms**.
   Sample of that summary (Thai, 3–4 lines, no node ids):
   `Skill เรียนรู้โปรเจค "<ชื่อ>" จาก Permutation Board "<ชื่อ board>" แล้ว`
   `Layout: flow + Connector Line · Case label "Case#N" ไม่มีเว้นวรรค · Group: Error Handling · Screen State · Component`
   `Case เฉพาะโปรเจค 8 ชุด (เช่น Coupon matrix · Verify PIN) · ช่องจอ 390×844`
   `บันทึกลง projects/<ชื่อ>.md ไหม`
5. Import-test: open 2–3 anchor nodes and confirm they resolve **before saving**, then save with the date. Report in one line, no node ids: `Import-test ผ่าน 3/3 → บันทึก projects/<name>.md แล้ว`.

## AUDIT — idempotent re-run + fill progress (read-only until the user says yes)
1. Resolve the board's base (board stamp `baseNodeId`, else `linkedFrom`) and run SKILL.md Phase 0–2 on it (skip the Phase 1 step 5 box — AUDIT is already chosen) → the current matrix.
2. Run `scripts/scan-cases.js` on the board with `DETAIL = true` via the Bridge (AUDIT needs the cells; a plain-stamped board → Bridge only, `contract-and-runtime.md` §2 Store note); under use_figma scope `SCOPE_ID` to the one board and fall back to the Bridge if the response is cut → each cell's `caseId` · `status` · `designed`.
3. Diff matrix vs board by `caseId` (unstamped board → by Case name, and say so in one line):
   - **Missing** — in the matrix, absent on the board → offer to add the cell
   - **Stale** — the base changed after the build (compare `baseNodeId` + date) → offer to refresh the caption
   - **Orphan** — on the board, not in the matrix → **report only, never delete**
   - **Fill progress** — count `status:"spec"` vs `"designed"` per priority (designed = the cell holds real content beyond the Placeholder)
4. Report in Thai, in exactly this shape; Cases by their library name, never by id. Example = the SKILL.md Phase 3 run, built with 14 Cases after the user cut MWA overdue + VAT (a cut is not persisted, so it returns as Missing), plus one Case the team added by hand:
```
AUDIT Permutation Board "Permutation_…" — Case ที่ควรมี 15 · บน Permutation Board 15
Missing 1 — มีในตาราง แต่ไม่มีบน Permutation Board: MWA overdue + VAT → เพิ่มให้ไหม
Stale 1 — Key Screen ถูกแก้หลังสร้าง: Case#5 Fee charged → อัปเดต Description ให้ไหม
Orphan 1 — มีบน Permutation Board แต่ไม่อยู่ในตาราง: Case#15 Biometric expired → แจ้งไว้เฉย ๆ ไม่ลบ
Designed: Must 3/4 · Should 1/7 · Edge 0/3
```
5. Each "→ …ไหม" is its own AskUserQuestion box, in that order: `ใช่ (แนะนำ)` · `ไม่ต้อง`. A count of 0 keeps its line (`Missing 0`) but gets no box.
6. A yes → write through SKILL.md Phase 0 step 4 write probe, then Phase 4 (harvest, guard, kit), then Phase 5 Verify.
