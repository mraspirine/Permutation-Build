# learn-audit — MODE: LEARN and MODE: AUDIT

> Read this file in full when LEARN or AUDIT starts (SKILL.md points here). SKILL.md §How to talk still applies: Thai, `Skill` as the subject, the deck's words, never node ids · case ids · script names.

## LEARN — teach Skill a new project / refresh its layout
1. The user points at an existing permutation board for that project (URL / node id) + its FigJam if any. None given → ask `Skill ต้องใช้ Permutation Board ของโปรเจคนี้ 1 อัน — ส่งลิงก์มาได้เลย`; never walk the file to find one. The board turns out to belong to a project Skill already knows → say so and offer to refresh that project file instead.
2. Read the board (a large one → Bridge, `contract-and-runtime.md` §4) → run `scripts/harvest-board.js` verbatim with `BOARD_HINT` = that board (+ `SCREEN_W` for a non-phone project) → capture **school + grammar**, described in words and ratios — store grammar, never per-screen geometry (geometry is measured live, or taken from the project file's defaults) — plus one exemplar's default cell/gap dimensions. What a harvest must capture: `board-grammar.md` §What the harvest must capture.
3. Harvest **Tier-3 packs** from the captions on the board (grouped by screen / component / module), verbatim.
4. Draft `projects/<name>.md` from `projects/_template.md` → show the user in plain Thai what Skill learned (layout, รูปแบบเลข Case (เช่น "Case#1 ไม่มีเว้นวรรค") — never the style name, Groups, Case packs) → **the user confirms**.
   Sample of that summary (Thai, 3–4 lines, no node ids):
   `Skill เรียนรู้โปรเจค "<ชื่อ>" จาก Permutation Board "<ชื่อ board>" แล้ว`
   `Layout: flow + Connector Line · Case label "Case#N" ไม่มีเว้นวรรค · Group: Error Handling · Screen State · Component`
   `Case เฉพาะโปรเจค เช่น Coupon matrix · Verify PIN · ช่องจอ 390×844`
   `บันทึกลง projects/<ชื่อ>.md ไหม`
5. Import-test: open 2–3 anchor nodes and confirm they resolve **before saving**, then save with the date. Report in one line, no node ids: `Import-test ผ่าน → บันทึก projects/<name>.md แล้ว`.

## AUDIT — idempotent re-run + fill progress (read-only until the user says yes)
1. No board given → ask `Skill ต้องใช้ Permutation Board 1 อัน — ส่งลิงก์มาได้เลย`. Resolve the board's base (board stamp `baseNodeId`, else `linkedFrom`, else follow the project's own link by hand — SKILL.md Phase 1 step 3); still none → ask `Permutation Board นี้เป็นของ Key Screen ไหน — ส่งลิงก์จอมาได้เลย`, never guess by name. Then run SKILL.md Phase 0–2 on it (skip the Phase 1 step 5 box — AUDIT is already chosen) → the current matrix.
2. Run `scripts/scan-cases.js` with `SCOPE_ID` = the board and `DETAIL = true` via the Bridge (AUDIT needs the cells; a plain-stamped board → Bridge only, `contract-and-runtime.md` §2 Store note); under use_figma fall back to the Bridge if the response is cut → each cell's `caseId` · `status` · `designed`.
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
Designed: High 3/4 · Medium 1/6 · Low 0/4
```
5. Each "→ …ไหม" is its own AskUserQuestion box, in that order: `ใช่ (แนะนำ)` · `ไม่ต้อง`. A count of 0 keeps its line (`Missing 0`) but gets no box.
6. A yes → write through SKILL.md Phase 0 step 4 write probe, then Phase 4 (harvest, guard, kit), then Phase 5 Verify. That yes is the one exception to "never touch the team's boards" (user, 2026-11-20): on a board the team made (no stamp) Skill only adds the new cells the user said yes to — never edits, moves or deletes what is there.
