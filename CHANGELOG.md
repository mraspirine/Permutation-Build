# Changelog — figma-permutation-build

บันทึกทุกการเปลี่ยนแปลงที่มีผลต่อพฤติกรรมของ skill เรียงใหม่ → เก่า
(การแก้ README/เอกสารอย่างเดียวไม่ลงในนี้)

---

## 2026-10-26 — กลับมาใช้ฉบับ A เป็น SKILL.md ตัวจริง · ฉบับ B เก็บไว้ใน versions/

ที่มา: ผลเทสต์สองฉบับแทบไม่ต่างกัน (Sonnet 20 / 19.5 · Opus 17 / 19 · quiz เท่ากัน · Figma call เท่ากัน · token ต่างราว 5%) เพราะกฎ 244 ข้อ
และข้อความที่ผู้ใช้เห็นเหมือนกัน ผู้ดูแลจึงเลือกใช้ A ต่อ
- `SKILL.md` = ฉบับ A (Version 2026-10-22 คงไว้เป็นชื่อฉบับ) · `versions/SKILL-B-2026-10-25.md` = ฉบับ B ครบทุกตัวอักษร · `versions/README.md` อัปเดตวิธีสลับ
- กฎที่แก้เมื่อ 25 ต.ค. (case-library §Enumeration guards · §Priority · Placement "กว้าง N จอ") ใช้กับ A ด้วย เพราะอยู่ใน references และ A ได้ Placement เดียวกันตั้งแต่ตอนติดตั้ง B

## 2026-10-25 — ฉบับภาษาคน (B) เป็น SKILL.md ตัวจริง · ฉบับ A เก็บไว้ใน versions/

ที่มา: ทดลองเขียน SKILL.md ใหม่ทั้งไฟล์แบบที่คนเขียน skill เก่งๆ ทำ — checklist 6 Phase ทุก Phase มี "Done when" · กฎเขียนเป็นสิ่งที่ต้องทำ + เหตุผล
(never 49 → 5 · GUARD 11 → 0) · "Ten things that went wrong before" · 16,6xx ตัวอักษร / 172 บรรทัด (A = 24,913 / 193) · กฎ 244 ข้อยังครบ —
21 ข้อย้ายไปท้าย references (archetype-cases §Several Key Screens · case-library §Buckets · board-grammar §Scaffold stops) · ptp.md §About ได้บรรทัดสัญญาณชื่อไฟล์
ข้อความที่ส่งผู้ใช้ (หัว 3 ประโยค · ตาราง Case · ตัดออก · Confirm · Report 4 บรรทัด) เหมือน A ทุกตัวอักษร

- ผลเทสต์ (จอ Payment 29.1 แบบ read-only): dry run Sonnet 19.5/20 · Opus 19/20 (A: 20 / 17) · Figma call Sonnet 15 · Opus 11 (A: 14 / 11) ·
  quiz 15/15/15/14 · blind judge เลือก B 4/4 — เกณฑ์หลักคือ Sonnet (Haiku ดูเป็นข้อมูลประกอบ)
- designer อ่านข้อความ Phase 3 แล้วตอบคำถาม 7 ข้อ ได้ 4/7 (ทั้งข้อความของ Sonnet และ Opus) — ตกข้อ: นับ Group (MWA ถูกตั้งเป็น Group เอง) ·
  ไม่รู้ว่าทำไมถึง High · ความกว้าง board 5 vs 4 จอ · ไม่เห็นทางเลือก "เอาแค่ Case List" (อยู่ในกล่อง ⑤ ซึ่งไม่อยู่ในข้อความ) · ⚠ ยืนยันอะไร เมื่อไหร่
  → แก้กฎใน case-library (ข้อถัดไป) · ผู้ใช้เลือก (25 ต.ค.) คงรูปแบบข้อความเดิม ไม่เพิ่มบรรทัดอธิบาย — ทีมรู้ความหมาย High/Medium/Low และ ⚠ จาก deck อยู่แล้ว
- `references/case-library.md` §Enumeration guards: กฎ mint เขียนใหม่ไม่ให้สองประโยคอ่านขัดกัน (แถว MWA tier ของ board 14.1 = มีแล้ว ·
  แถว MWA overdue + VAT ของจอ confirm = mint 1 Case) · Case ที่ mint จากแถวรายละเอียดบนจอ (MWA, fee, memo, fields) อยู่ Group Bill Detail
  ไม่ตั้ง Group ใหม่ตามชื่อ pack · ลำดับใน Group ตามแถวบนจอ บน→ล่าง · §Priority: แถว Image และ Screen State แบบ opt-in (Scrolled, Large screen) = Low ·
  แถวรายละเอียดที่มี ⚠ ค่า แต่ไม่ใช่เรื่องเงิน (No memo, Multiple fields) = Medium
- `SKILL.md` §Messages Placement: "กว้าง N จอ" = จำนวนคอลัมน์ของ board จาก Board width ของโปรเจค ไม่ใช่ที่ว่างของ Section (ที่ว่างแค่บอกว่าพอไหม) —
  แก้ใน versions/SKILL-A ด้วย การแสดงผลของ A กับ B ต้องเหมือนกันเสมอ
- `versions/`: SKILL-A-2026-10-22.md (ฉบับก่อน ครบทุกตัวอักษร) · A-vs-B.md (เทียบทีละไฟล์) · README.md วิธีสลับ (`cp versions/SKILL-A-2026-10-22.md SKILL.md`)
  Claude อ่านเฉพาะ SKILL.md ที่ root · README.md เพิ่มบรรทัด versions/ · Version ใน §About → 2026-10-25

## 2026-10-22 — พูดกับคนรันด้วยภาษาคน: โชว์แค่ "เห็นอะไร · เสนออะไร · ต้องตัดสินใจอะไร"

ที่มา: รัน Payment 29.1 Confirmation (2026-10-20) แล้วคนรันอ่านไม่ออก — node id · `pending G1` · T1/T3 · S/C · ✓✗⊘ · case id
ปนอยู่ทุกบรรทัด และถาม 3 เรื่องในกล่องเดียว · เป้าหมาย: designer คนอื่นในทีมรันเองได้โดยไม่ต้องรู้จักข้างใน skill

- `SKILL.md` §How to talk to the user (ใหม่): ไม่พิมพ์ node id · ชื่อด่าน · tier · level · case id · label style · ชื่อ script ·
  เครื่องหมาย bucket ออกมาเลย (ยังอยู่ใน stamp / project file / JSON ของ script — ขอดูได้) · ความสำคัญเป็นไอคอน+คำเสมอ
  (`🔴 ต้องมี · 🟡 ควรมี · 🔵 เผื่อไว้`) · ถามกล่องละ 1 เรื่อง ตัวเลือกแนะนำอยู่บน
  · ไอคอน "เผื่อไว้" ใช้ 🔵 ไม่ใช่ ⚪ — ⚪ บนเครื่องผู้ใช้โชว์เป็นวงกลมโปร่งเหมือน radio button ไม่ใช่ไอคอน (เห็นตอนรันทดสอบ 22 ต.ค.)
  เปลี่ยนใน `SKILL.md` + `case-library.md` §Priority ด้วย
- Phase 1: ไม่ส่ง Profile แยกข้อความแล้ว → เป็นหัว 4 บรรทัดของข้อความ Phase 3 (จอนี้คือ / เจอบนจอ / ยังไม่รู้จัก / board เดิม) ·
  ยกเว้นเจอ board ของจอนี้อยู่แล้ว → หยุดถาม AUDIT ก่อน
- Phase 3 รูปใหม่: ตาราง 4 คอลัมน์เฉพาะเคสที่เสนอ · "ไม่เสนอเพราะ" ยุบ ✓/⊘ เป็นบรรทัดละเหตุผล (pack ไม่หาย — กฎ G2 ไม่เปลี่ยน) ·
  "ต้องตอบก่อนสร้าง" เฉพาะ ⚠️ ที่เปลี่ยนว่าเคสมีไหม/อยู่ไหน — ⚠️ ที่เป็นค่าจาก brief ไม่ถาม ปล่อยติด caption · ที่วาง board เป็น
  ประโยคเดียว ไม่มีพิกัด · ลำดับถาม: อ่านจอถูกไหม → เคสค้าง → ปุ่มไปไหน → วางที่ไหน (เฉพาะมีทางแยก) → สร้าง/เอาแค่ list/ปรับเอง
- Phase 5 / AUDIT: สรุป 4 บรรทัด (สร้างแล้ว N + ตรวจผ่าน / ลิงก์ / เริ่มจาก Case# ไหน / ถ้าไม่เอาลบอะไร) · ตรวจไม่ผ่านบอกเป็นภาษาคน ·
  AUDIT ใช้คำว่า ยังไม่มีบน board / จอต้นฉบับเปลี่ยน / มีบน board แต่ไม่อยู่ในรายการ (ไม่ลบ)
- **รอบสอง (หลังรันทดสอบกับจอเดิม):** หัว 4 บรรทัดแบบ `label: ค่า` ยังอ่านไม่ออก เพราะมันเป็นรายการหลักฐาน (ชื่อ layer · จำนวน ·
  ชื่อ board หน้าอื่น) ไม่ใช่ข้อสรุป → เปลี่ยนเป็น 3 ประโยค บรรทัดละ 1 ข้อสรุป + ผลต่อคนอ่าน (มองว่าจอนี้คือ… ถ้าไม่ใช่บอกได้ /
  ยังไม่มี board · เคสกลางอยู่ board รวมแล้ว / ส่วนที่ยังแตกเคสให้ไม่ได้ → ถามข้อ 1) · หัวข้อย่อยเป็นประโยค (เคสที่ควรมี… · ที่ไม่ใส่ เพราะ… ·
  ขอถาม N ข้อก่อนสร้าง board · board จะไปอยู่: …) · ตัดรายการ component ทั้งแถบ ชื่อ layer เลข 14 และชื่อหน้าอื่นออก (ขอดูได้)
- รอบสาม: "ที่ไม่ใส่" กับ "ขอถาม" เป็นตาราง (`ไม่ใส่ | เพราะ` · `ข้อ | ถามว่า | ตอบแล้วเปลี่ยนอะไร`) — ทุกแถวมีช่องเหมือนกัน กวาดตาง่ายกว่า
  bullet ที่มีลูกศรจมกลางบรรทัด · หัว 3 ประโยคกับตารางเคส 4 ช่องคงเดิม (user เลือก 22 ต.ค.)
- รอบสี่: ใช้ภาษาจาก user-guide deck ของทีม (Figma Slides `DcZuIPb5M4BuCrJPyfdpSU`) ทุก report shape — `Skill` เป็นประธาน ไม่ใช้ "ผม" ·
  Key Screen / Permutation Board / Connector Line / Case / Group / Archetype (ประเภทจอ) / Confirm / Verify / Report / Rollback /
  Missing / Stale / Orphan · Priority ในตาราง = `🔴 Must · 🟡 Should · 🔵 Edge` คำไทยอธิบายครั้งเดียวในบรรทัดสรุป (ต้องมี / ควรมี /
  เกิดได้ยาก — ไม่ใช้ "เผื่อไว้" เพราะ deck ไม่มีคำนี้) · ⚠ เป็น tag สั้นหน้าชื่อ Case (`⚠ ยืนยันค่า` · `⚠ Business Rule`) + นิยาม
  "⚠ = ต้องยืนยันกับ BA ก่อน" · "ตัดออก: มีแล้ว / ใช้กับจอนี้ไม่ได้" ตาม funnel ใน deck · ชื่อ layer ใช้ได้เมื่อมีวงเล็บไทย (deck ก็ใช้)
- การตัดเคส: ตัดคือตัด ไม่ถามว่า "จดเป็นกฎไหม" อีก — จดลง §Screen facts เฉพาะเมื่อ user บอกเอง ("จดไว้" / "จอนี้ไม่มีทางมี…") ·
  แถวที่จดแล้วโผล่รอบหน้าใน "ที่ไม่ใส่" ว่า `คุณบอกไว้ <วันที่> ว่า…` (user ขอ 22 ต.ค. — ไม่อยากถูกเสนอให้จด) (รอบสี่: ย้ายไปตาราง ตัดออก เป็น `ใช้กับจอนี้ไม่ได้ — ผู้ใช้ Skill บอกไว้ <วันที่> ว่า…`)
- กฎแข็งทั้งหมดไม่เปลี่ยน (G1 วัดก่อนสร้าง · caption verbatim · ไล่ทุกแถว · ไม่เขียนก่อนยืนยัน) — เปลี่ยนแค่วิธีพูด
- **รอบห้า — จัดโครง SKILL.md ใหม่ให้เบาและทนต่อโมเดลเล็ก** (32,071 → ไม่เกิน 25,000 ตัวอักษร · 256 → 190 บรรทัด —
  ขนาดปัจจุบันดูรอบล่าสุดด้านล่าง · นับตัวอักษรด้วย `LC_ALL=en_US.UTF-8 wc -m` เพราะ `wc -m` เฉยๆ ในเครื่องนี้นับเป็น byte)
  - ย้ายไป `references/contract-and-runtime.md` (ไฟล์ใหม่): §THE CONTRACT (label node · Placeholder · stamp pluginData + Store note ·
    Board container · Layout schools) · Label styles · §Runtime & write idiom · สูตร build ของ Phase 4 (factory ของ scaffold-kit ·
    chunk · guard) — SKILL.md ชี้ให้อ่าน §4–5 ก่อน call แรกที่ใช้ Bridge หรือเขียนไฟล์ · ทั้งไฟล์ที่ Phase 4 ขั้น 4 · §2 ตอน AUDIT
  - ย้ายไป `references/learn-audit.md` (ไฟล์ใหม่): ขั้นตอน MODE: LEARN + MODE: AUDIT ทั้งหมดและรูป Report ของ AUDIT — SKILL.md
    เหลือหัวข้อสั้นที่สั่งให้อ่านไฟล์นี้ก่อน + บรรทัด import-test
  - ตัวอย่างและกติกาข้อความ Phase 3 อยู่ใน SKILL.md (ไม่แยกไฟล์ เพราะ Phase 3 รันทุกครั้ง แยกแล้วต้องเปิดไฟล์เพิ่มทุกรอบ) ·
    ตัวอย่างเป็นงาน Payment Confirmation ที่ตรงกับผลจริง: เสนอ 15 Cases (Must 4 · Should 7 · Edge 4) · Skeleton loading อยู่ใน
    "ตัดออก" จาก §Screen facts · Confirm 4 ข้อ (หมวด component · MWA เป็น Case ใหม่ · ปุ่มไปจอไหน · ที่วาง) · ตาราง Case ย่อเหลือ
    5 แถวพร้อมบอกว่าข้อความจริงต้องพิมพ์ครบทุกแถว · Report Phase 5 (14 Cases หลังตัด MWA) และ AUDIT ต่อจากตัวอย่างเดียวกัน
  - §Principles กับตาราง References เดิมรวมเข้าไปในขั้นที่ใช้ · ตาราง References ใหม่ชี้ทุกไฟล์พร้อมจังหวะที่ต้องเปิด · คำตอบเรื่อง
    หลาย Key Screen เป็นตาราง 3 แถว · กฎ "ห้ามสร้างจากความจำ / ค่า default / โปรเจคอื่น" อยู่ในแถว G1
  - เพิ่ม: ประโยคไทยตายตัวทุกจุดที่ Skill ต้องคุยกับผู้ใช้ (ไม่มี Key Screen · ได้หลาย Key Screen · ไฟล์ดูอย่างเดียว · ไม่เจอ
    Permutation Board · มี Permutation Board อยู่แล้ว · ไม่ตรงโปรเจคไหน → LEARN · Case ซ้ำกับ board ข้างเคียง · ที่ว่างไม่พอ ·
    ต่อ Connector Line เองไม่ได้ → ขอ Cmd+D · โปรเจคไม่ใช้ Connector Line · จดไว้แล้ว) · ตารางกล่องคำถาม ①–⑤ พร้อมตัวเลือก
    ที่แนะนำขึ้นก่อน `(แนะนำ)` · ไม่มีข้อค้าง → `Confirm ก่อนสร้าง Permutation Board — ไม่มีข้อค้าง` แล้วไปกล่อง ⑤ · AUDIT ที่นับได้ 0
    คงบรรทัดไว้แต่ไม่ถาม · ตัด/เพิ่ม Case แล้วไล่เลขใหม่ · ตาราง Case พิมพ์ครบทุกแถว ไม่มี "…" · ประโยค `GUARD:` ตรงขั้นที่เคยพัง
    (ถามหลายเรื่องในกล่องเดียว · layer ที่ซ่อนงอกเป็น Case · นับ Case ของจออื่น · แต่ง caption เอง · แถวหาย · เรียงเลขตาม Priority ·
    ข้าม harvest) · หลังรันจด Tier-3 id ใหม่ + หมวด component ที่ผู้ใช้ตอบ ลง `projects/<name>.md` · ข้อความ "เทียบไม่ได้" ของ
    sibling guard ไปอยู่ใน Report
  - แก้ defect จาก audit 22 ต.ค.: "say so in the profile" → หัวข้อความ Phase 3 · Case ที่อิง business assumption เป็นคำถามก่อนสร้าง
    (`⚠ ข้อ N` + แถวในตาราง Confirm) ไม่ใช่ ✗ ให้ผู้ใช้ตัดเอง · `guard skipped — siblings unstamped` → บรรทัดไทย
    `Skill เทียบกับ Permutation Board ข้างเคียงไม่ได้ — ไม่มี stamp ให้เทียบ` · import-test ไม่พิมพ์ node id
    (`Import-test ผ่าน 3/3 → บันทึก projects/<name>.md แล้ว`) · ประโยคซ้ำ 2 คู่ (แสดงตารางใหม่ก่อนกล่องถัดไป · ไม่พิมพ์จำนวน)
    เหลือที่เดียว · ⚠ ในแชต / ⚠️ บน caption ใช้ตรงกันทั้งไฟล์ · หมายเหตุ "(Tuned 2026-10-22 after a live run …)" ย้ายออกจาก
    SKILL.md มาไว้ที่นี่: ร่างแรกเขียนหลักฐานใต้ `label:` อ่านแล้วเป็น noise จึงเปลี่ยนเป็น 3 ประโยค แล้วปรับคำตาม deck (ดูรอบสองและรอบสี่)
  - ไม่แตะ `scripts/` · `projects/` เพิ่มแค่บรรทัด Pointer (ชี้กลับไปกฎ "ตัดคือตัด" และกฎ Connector Line) · Phase 4 ขั้น 3 ยังเป็นเรื่องที่วาง board (`next.md` / `dgl.md` ที่ชี้ "Phase 4 step 3" ยังถูก) ·
    `board-grammar.md` ชี้ Label styles ไปที่ `contract-and-runtime.md` §3 · กฎทั้ง 244 ข้อของ SKILL.md เดิมยังอยู่ครบ (ใน SKILL.md
    หรือในไฟล์ที่ SKILL.md ชี้ไปตอนต้องใช้ — 2 ข้อที่หลุดระหว่างรอบหก–เจ็ดถูกกู้คืนในรอบแปด)
- **รอบหก — ซ่อมหลังตรวจรอบห้า:** แถว `*` ใน §Screen facts ที่เหตุผลคือ "มี board รวมของ flow แล้ว" → นับเป็น มีแล้ว (เมื่อ Phase 1
  เจอ board นั้นใน flow นี้จริง) ไม่ใช่ ใช้กับจอนี้ไม่ได้ · แถวที่ทีมจดเองพิมพ์ `ใช้กับจอนี้ไม่ได้ — <เหตุผล>` ไม่อ้างว่าผู้ใช้บอก ·
  แถวของ component ที่ไม่อยู่บนจอ ข้ามไป · Phase 1 สแกน Section นอก (flow) ซ้ำเมื่อ Section ในไม่มี board ก่อนสรุปว่า "ไม่มีเลย" ·
  traverse ด้วย node id ของ Key Screen (use_figma ไม่มี selection) · Phase 4 รัน write probe ถ้า Phase 0 ยังไม่ได้รัน (กล่อง ⑤ / AUDIT) ·
  harvest board ที่ใกล้ "ช่องที่จะวาง board" ที่สุด และบันทึกเป็น grammar ไม่ใช่ geometry · G1 ถามผู้ใช้เมื่อไม่มีทั้ง board และ
  §Board anatomy · กล่อง ① ถามเรื่องเดียว (หมวด component ที่ไม่รู้จัก — ไม่มีค่อยถาม "อ่านถูกไหม") · ไม่มี Connector Line ในไฟล์ →
  ขอให้ลากด้วย Shift+C แล้ว Skill จัดปลาย ไม่จบด้วย VECTOR (`board-grammar.md` · README · pointer ใน `next.md` / `dgl.md`) ·
  AUDIT ข้ามกล่อง Phase 1 ขั้น 5 · AUDIT สแกนด้วย Bridge (use_figma → scope เฉพาะ board) · opt-in Case เสนอเป็น 🟡/🔵 ไม่แยกกล่องถาม ·
  ข้อความใน INSTANCE ใช้ `setInstanceTexts` ของ kit · pointer "A cut is just a cut" ใน `_template.md` / `clicx.md` / `ptp.md`
- **รอบเจ็ด — ซ่อมหลังตรวจรอบหก** (SKILL.md 24,879 ตัวอักษร · 190 บรรทัด วัดด้วย `LC_ALL=en_US.UTF-8 wc -m`):
  กฎข้อความใน INSTANCE กลับมาตามเดิม — ต้องตั้งผ่าน `figma_set_instance_properties` เพราะกำหนดตรง ๆ แล้วพังเงียบ; ข้อยกเว้นเดียวคือ caption
  จาก library component ที่สร้างด้วย `setInstanceTexts` ของ kit ซึ่งต้องอ่านค่ากลับทุกข้อความ (`contract-and-runtime.md` §5 ข้อ 7 —
  รอบหกเขียนกลับด้านไว้) · ลำดับจับคู่ component: แถวข้อยกเว้นของโปรเจค → §Never a pack → ที่เหลือของตารางโปรเจค (SKILL.md Phase 1 ·
  `case-library.md`) · Phase 1 ขั้น 5 บอกข้อยกเว้นครบ 2 ข้อ (ไม่เจอ Permutation Board ใน flow เลย · มีของจอนี้อยู่แล้ว) · กล่อง ① ถามหมวด
  เดียวรวมกันได้เฉพาะเมื่อ Skill เสนอหมวดเดียวกันทุกตัว ไม่งั้นกล่องละ Component · แถว §Screen facts ที่ผู้ใช้สั่งจดขึ้นต้นเหตุผลด้วย
  `user said:` และ ตัดออก เลือกคำจาก marker นี้ (pointer ใน `_template.md`) · ⚠️ ใน caption (`ยืนยัน business rule` ฯลฯ) เป็นแค่ tag —
  คำถามก่อนสร้างเฉพาะ Case ที่มีอยู่หรือไม่ขึ้นกับ assumption · Verify: `linkId` มาจาก Phase 4 ขั้น 5 · โปรเจคไม่มี link ให้
  `stats.skipped` มีได้แค่ข้อ link · harvest แก้ `SCREEN_W` ได้สำหรับโปรเจค tablet/desktop · ตัวอย่าง Archetype ใช้ชื่อในตาราง
  (`Transaction / payment`) · ลบกฎ "verbatim" ที่ซ้ำ 3 จุดและ "ไม่มีอะไรให้ harvest → ถาม" ที่ซ้ำในแถว G1 · ประโยคขอ Cmd+D / Shift+C
  ย้ายไป `board-grammar.md` §Link rule ข้อ 5

- **รอบแปด — ปิดงานหลัง critic + เทสต์ 4 โมเดล** (Opus 15/15 · Sonnet 15/15 · Haiku 14/15 · Fable 14.5/15 ในควิซกฎ 15 ข้อ · dry run จริงบนจอ
  Payment Confirmation: Sonnet 20/20 · Fable 19.5 · Haiku 18 · Opus 17 จาก 20): กู้ 2 กฎที่อยู่ครึ่งเดียว (ชื่อ deck `DcZuIPb5M4BuCrJPyfdpSU`
  กลับเข้าประโยค vocabulary · ที่มาของ "กว้าง N จอ" = ที่ว่างของ Section + §Board width ของ project file) · แถว G1 พูดตรงกับ Phase 4 ขั้น 1
  (board ข้างเคียง → §Board anatomy → ถาม) · `DETAIL = false` ยกเว้น AUDIT ขั้น 2 · โปรเจคไม่มี Connector Line → บรรทัด Rollback ตัด
  "กับ Connector Line ของมัน" · หัว ② บอกว่า Common Case ไปอยู่ใน ตัดออก · ตัวอย่างใส่วงเล็บไทยให้ Logo / Main Button และเส้นคั่นตาราง ·
  กล่อง ① และ ⑤ ถามเสมอ · Phase 4 ขั้น 3 เริ่มจากที่กล่อง ④ เลือก · `Group` = ชื่อ+ลำดับจาก board ข้างเคียงใน flow นี้ ไม่ใช่ board หน้าอื่น ·
  `case-library.md` §Enumeration guards (ใหม่): "เนื้อหาพอดีจอ" ไม่ใช่เหตุผลตัด Scrolled · ตัวอย่างบนจอ (biller/คูปอง) ไม่ใช่เหตุผลตัด ·
  mint Tier-3 ทีละ 1 Case ต่อ 1 กฎ ไม่รวมเป็นเคสร่ม ไม่แต่งจาก archetype เฉย ๆ · ลำดับ Group เมื่อยังไม่มี board — 3 ใน 4 โมเดลพลาด
  2 เรื่องนี้ · fintech modifier ใช้กับ Tier-3 ด้วย (Zero payable · Fee charged · Coupon expired at confirm = Must) ·
  `archetype-cases.md` แกนที่ไม่เข้าข่าย: แกนระดับจอได้แถว ตัดออก แกนของ component ตาม Phase 2 ขั้น 2 · README: pipeline มี Detect ·
  Rollback ลบ board กับ Connector Line · ตัดข้อความที่ซ้ำกับ references (เหตุผล verbatim · กฎ harvest ที่อยู่ใน board-grammar ·
  commitUndo ที่อยู่ใน contract-and-runtime · แถว scripts) เพื่อให้พอที่ · ตรวจรอบสุดท้าย (Opus): กฎ 244/244 อยู่ครบ · audit 11/12 · แก้ 5 จุดท้าย (กล่อง ① และ ⑤ เมื่อไม่มีข้อค้าง ·
  pointer Connector Line ใน clicx.md · rollback ใน board-grammar รวม Connector Line · DETAIL ยกเว้น AUDIT ใน contract-and-runtime ·
  note ในวงเล็บไม่ใช่ caption ใน case-library · pointer มีแล้ว ใน next.md · ตัวอย่าง draft ของ LEARN) —
  ขนาดสุดท้าย SKILL.md 24,989 ตัวอักษร · 193 บรรทัด (`LC_ALL=en_US.UTF-8 wc -m`)
- **ไอคอน Priority ไล่ระดับใหม่ (2026-10-23):** `🔴 Must · 🟠 Should · 🟡 Edge` — สเกลความร้อนแดง→ส้ม→เหลือง (user ขอ: 🔴🟡🔵 เดิมไม่ไล่ระดับกัน
  น้ำเงินหลุดจากสเกล) · เปลี่ยนใน `SKILL.md` §How to talk + ตัวอย่าง Phase 3 และ `case-library.md` §Priority · stamp `priority` ใน pluginData ไม่เปลี่ยน (เป็นคำ must/should/edge)
- **คำ Priority เป็น High / Medium / Low (2026-10-23):** ทุกข้อความถึงผู้ใช้ใช้ `🔴 High · 🟠 Medium · 🟡 Low` ไม่ต้องมีคำไทยกำกับ (user เลือก — เข้าใจทันทีแบบ Jira) ·
  stamp ยังเป็น must/should/edge (= High/Medium/Low) เพื่อให้ board เก่าและ AUDIT ทำงานต่อได้ · แก้ `SKILL.md` · `case-library.md` §Priority · `learn-audit.md` ตัวอย่าง AUDIT ·
  `contract-and-runtime.md` §2 จดการแปลงไว้
- แก้เลขในตัวอย่าง (2026-10-25): Case#8 MWA overdue + VAT เป็น 🟠 Medium ตาม matrix ที่ user อนุมัติ (บรรทัดสรุป High 4 · Medium 7 · Low 4 นับ MWA เป็น Medium อยู่แล้ว) ·
  Report หลังตัด Case#8 จึงเป็น High 4 · Medium 6 · Low 4 และตัวอย่าง AUDIT ใน learn-audit เป็น Medium 1/6 · Low 0/4 — เจอจากการเทสต์ A/B
- `case-library.md` §Enumeration guards (2026-10-25): กฎ mint ชัดขึ้น — pack ที่มี board ข้างเคียงใน flow ทำไว้แล้ว (เช่น MWA tiers บน 1.14.1) = มีแล้ว ห้าม mint ซ้ำ/ก๊อป ·
  mint แค่ 1 Case ต่อสถานการณ์ที่ Key Screen นี้แสดงต่างจาก board นั้น ไม่ใช่ 1 Case ต่อ sub-rule (Opus/Fable เคยแตก MWA เป็น 4–9 เคส)

---

## 2026-10-06 — NEXT: บันทึกจากงานจริง 2 รอบ (27 และ 29 ก.ย.)

- `next.md` §Board anatomy: มาตรฐานชื่อ layer ของทีมเมื่อสร้าง board ใหม่หรือแปลง board เก่า (group = ชื่อหมวด · row = `Row` ·
  คอลัมน์เคส = `Case#N - <name>` · กล่องคำอธิบาย = `Description` · คำอธิบายไทย = `Note`) รูปทรงเดิม เปลี่ยนแค่ชื่อ
- `next.md` §Naming: board 1.14.1 Payment ใช้ label แบบ `Case #N` (มีเว้นวรรค ยังเป็น strict) และ board Payment 29.1 ทำตาม
- `next.md` Tier-3 ids: เพิ่ม `fee/charged` · `memo/empty` · `bill-payment-input/multiple-fields` (ตั้งตอนสร้าง board Payment 29.1
  Confirmation) · จด component ที่ยัง map ไม่ได้: `Transaction` · `Text Information`
- แก้ตัวอย่างที่ล้าสมัย: Payment 29.1 มี board แล้วตั้งแต่ 2026-09-29

---

## 2026-10-05 — เลข Case เรียงตามตำแหน่งบน board (ค่าเริ่มต้น)

ที่มา: board Top-Up 29.1 (สร้าง 2026-08-18) ให้เลขตาม Priority แล้วจัดลงกลุ่ม แถวแรกจึงอ่านเป็น `Case#1 · #2 · #10`
ทีมต้องรัน renumber เองทีหลัง

- `case-library.md` §Priority เพิ่มกฎ: ให้เลขหลังจัดกลุ่มแล้ว ไล่ทีละกลุ่ม บนลงล่าง แล้วซ้ายไปขวา ไม่ให้ตาม Priority
  (Priority อยู่ใน stamp และรายงาน) · โปรเจคที่นับเลขใหม่ทุกกลุ่มใช้กฎเดียวกันภายในกลุ่ม
- เป็นค่าเริ่มต้นของทุกโปรเจค โปรเจคที่ใช้แบบอื่นให้ระบุใน `projects/<name>.md` · script ไม่เปลี่ยน

---

## 2026-09-22 — แก้ตามผลเทส 3 โมเดล (Sonnet · Opus · Haiku ใช้ skill ตามตัวอักษร แบบ read-only)

ผลเทส: กฎใหม่ของ 09-21 ทำงานครบบน Sonnet (detect ตาม flow · ข้าม hidden · Screen facts · T3 verbatim · หยุดถามเมื่อไม่มีที่วาง) ·
ควิซกฎ 10 ข้อ: Opus 10 · Sonnet 9.5 · Haiku 8 · Haiku ยังทำ Phase 2 ไม่ได้ (นับเคสของ board คนละจอมาเป็นของจอนี้)

**Script**
- **หา board จากเส้น `Permutation` ด้วย ไม่ใช่แค่ชื่อ** — board จริงของทีม PTP ชื่อ `Guideline: Select Account` เคยมองไม่เห็น
  ทั้งใน scan-cases (เสนอเคสซ้ำ) และ harvest-board `siblingBoards` (เสี่ยงวาง board ทับ) · scan-cases คืน `linkedFrom` ราย board
- **script อ่านโหลดหน้าเอง** — scan-cases รับ `SCOPE_ID`, harvest/verify โหลดหน้าจาก board id → วาง verbatim ใต้ use_figma ได้จริง
  (เดิมต้องเติม prelude เอง · โมเดลเล็กวางตามหัวไฟล์แล้วได้ผลว่างเพราะ use_figma เริ่มที่หน้าแรก)
- **cell ที่ยังมี placeholder = spec เสมอ** แม้มี note/tag วางข้าง ๆ
- **caption หลายอันใช้ cell เดียวกันได้** (callout 2 จุดบนจอเดียวใน group หลวม ๆ เช่น `#1.1` / `#1.2` บน board
  `Guideline: Select Account`) — นับเป็นเคส ส่วนหัวกลุ่มเหนือมันยังไม่นับ · board นั้นอ่านได้ 4/4 (เดิม 2/4)
- **verify-board: magnet ของเส้น** (`linkMagnets` ค่าเริ่ม BOTTOM→TOP) — magnet `AUTO` เคยทำให้ข้ามการเช็คจุดเริ่มเส้นไปเงียบ ๆ
- **scaffold-kit: `gridPlan()`** คำนวณจำนวนแถว + ตำแหน่งทุก cell ก่อนสร้าง grid · `freshInstance()` รับ component key ได้ ·
  `equalizeRow()` ไม่เติมบรรทัดว่างลง text ที่สูงคงที่
- **smoke-test: guard ไม่ผ่าน = ไม่เขียนอะไรเลย** (เดิมรายงานแล้วยังสร้าง frame ต่อ)

**รอบสอง (วันเดียวกัน) — เทส 3 โมเดลบนข้อมูลที่จับไว้ (จอ Payment 29.1, ไม่ให้ agent แตะ Figma) + Opus รีวิว diff ของ script**
- **scan-cases `isDesigned`**: slot เปล่าของทีม (frame ว่าง / "Pending Design") = ยังไม่ออกแบบ แม้มี note วางข้าง ๆ · layer ชื่อ note/tag/annotation
  ไม่นับเป็นเนื้อหา · self-check เดิมผ่านผิดเหตุ — เขียนใหม่ให้โดน path จริง
- **grammar ตาม board**: board ที่ใช้คำว่า `Case` ไม่รับ label แบบ indexed (ข้อความ `#2 …` ในจอไม่กลายเป็นเคสหลอน) — ทั้ง scan-cases และ harvest-board
- **cell ไม่ไต่เกิน board** และหยุดที่ wrapper ลูกเดียว (board ที่มีเคสเดียวเคยอ่าน 0 designed)
- **ชื่อ board**: รับ `Permutations_…` (พหูพจน์) · ชื่อที่แค่ลงท้ายด้วย "permutation" ไม่ใช่ board — caption ของ CLICX ชื่อ
  `title block / permutation` เคยทำให้ **ทุก board ของ CLICX อ่านได้ 0 designed** · ผลจริงหลังแก้: 38/38 · 21/15 · 17/17 · 3/1 · 1/1 · 6/6 · 17/17 · 18/18 · 21/21
- **verify-board**: `componentCrops` เป็น opt-in (CLICX, PTP) — NEXT ยังเช็คขนาด slot ของเคสระดับ component · `stats.skipped` แสดงด่านที่
  ถูกปิดเพราะ CONFIG ว่าง (link / base / ids / count) · `linkCaps` ตรึงหัวเส้นตามโปรเจคได้ · harvest คืนขนาด section ของ board
- **กฎ**: G1 เป็นบันได section → flow → project file · board วางใน section ของ base · fintech modifier เฉพาะเคสผลลัพธ์ทางการเงิน ·
  ⊘ อ้าง "ไม่มี component นี้บนจอ" ได้ · `screen/default` = ✓ เมื่อ base คือ state นั้น · G5 ผ่านเมื่อ `skipped` ว่าง
- **next.md**: สัญญาณ detect แบบชื่อ variable · ตาราง T3 ระบุ flow (Top-Up) · แถว Common Handling ใช้ได้ทุก flow ที่มี board นั้น ·
  `button/interaction-states` = 1 เคส · pack ที่ยังไม่มี id ให้ mint แล้วลงตาราง · สูตรความกว้างเป็นค่าเริ่มต้น ไม่ใช่กฎ

**รอบสาม (วันเดียวกัน) — audit `SKILL.md` ด้วย checklist 12 ข้อ (10/12) + Opus รัน BUILD จอ Payment 29.1 ถึง G3**
- **ไฟล์อ้างอิงตามกฎไม่ทัน** (แก้ `SKILL.md` อย่างเดียวในรอบสอง): `board-grammar.md` Hard rule ขาดขั้น "flow เดียวกัน" ·
  `case-library.md` ยังใช้ fintech modifier แบบกว้าง → แก้ให้ตรงกันแล้ว · README ตามด้วย
- **G5 พูด 3 ที่แล้วไม่ตรงกัน**: ตาราง gate + ตาราง References ไม่มี `stats.skipped` → เหลือกฎเต็มที่ Phase 5 ที่เดียว
- **AUDIT เป็นขั้นตอน 1-2-3** (หา base จาก stamp / `linkedFrom` → รัน Phase 0–2 → `scan-cases.js` → diff ตาม `caseId`) — เดิมไม่บอกว่า matrix มาจากไหน
- **Phase 3 มี shape ของข้อเสนอตำแหน่ง board** (`placement (pending G1): …` หรือ `STOP <why> · options A / B`) · Phase 1 / 5 ใส่เลขขั้น
- ตัวอย่างตรงกฎ: id `textfield/error-empty` แทน wildcard · บรรทัด counts มี `elsewhere in the flow`
- Hard rule ใน CONTRACT เหลือเฉพาะส่วนที่ไม่ซ้ำ G1 · "nearest" = ใกล้ช่องที่จะวาง board · วันที่ "proven …" ย้ายมาอยู่ที่ CHANGELOG นี้
  (use_figma clone connector ได้ 2026-08-18 · official MCP ล้นกับ board ใหญ่ 2026-07-24 · `root.name` = "Document" 2026-09-21)
- `next.md` Placement: band เป็นของ section ที่ถือ board ของ flow — base อยู่ section ข้าง ๆ ที่ไม่มี board = ต้องถาม
- **ไม่ทำตาม audit**: §Principles (ย้ำ walk every row / never guess ท้ายไฟล์ — โมเดลเล็กยังทำแถวหาย) · กฎ verbatim 2 ที่ · วิธีหา board 2 ที่ — ซ้ำโดยตั้งใจ ไม่ drift
- จากการรันเทียบ 2 โมเดลหลังแก้ (Opus 95 แถว / Sonnet 38 แถว บนจอเดียวกัน): pack ของ component ที่ไม่อยู่บนจอ **ไม่ pull และไม่ลงตาราง** ·
  `next.md`: id ของ Tier-3 ใช้ข้าม flow ได้ (สถานการณ์เดียวกัน = id เดิม)
- ตรวจซ้ำบนไฟล์จริง: `scan-cases.js` 5 จุด ตัวเลขเท่ารอบสองทุก board · `harvest-board.js` 5 board (strict / strict / loose / indexed / indexed) ·
  `verify-board.js` บน board 13.1 ที่ stamp ไว้ → `pass: true`, `skipped` รายงานเฉพาะ `knownCaseIds`

**รอบสี่ (วันเดียวกัน) — audit ซ้ำโดยคนนอก (Opus บริบทใหม่ อ่านอย่างเดียว เปิดไฟล์อ้างอิงครบ): 11/12**
- ❌ `clicx.md` สั่ง "clone an existing instance" ขัดกับ `scaffold-kit.js` ("Never `src.clone()`") และ `ptp.md` → ใช้ `freshInstance(<instance ที่มีอยู่>)`
- Project index: NEXT ใช้สัญญาณแบบชื่อ variable (official MCP ไม่คืนชื่อ collection) · PTP มี dialect B ด้วย · label `loose` = CLICX และ DGL
- Phase 2: Multiply มาก่อนการแจก bucket · fintech modifier ชี้ไป `case-library.md` §Priority (สำเนาเดิมขาดประโยค idempotency / timeout = Must)
- Phase 3: CTA reminder อยู่ก่อนประโยคยืนยัน · แผนภาพ pipeline มี `[0]Detect`
- G5: รายการ per-run CONFIG พูดครั้งเดียว และมี `linkCaps` (ว่างไว้ = จับได้แค่หัวเส้นหาย ไม่จับหัวเส้นผิดแบบ)
- LEARN ตรงกับตาราง Runtime (Bridge เมื่อ board ใหญ่) · AUDIT กับตาราง References พูดเรื่อง `DETAIL` ตรงกัน · เอ่ยชื่อ `BOARD_HINT` / `boardId`
- `dgl.md`: ความกว้างขั้นต่ำ 1 คอลัมน์ = 503 (จากสูตรในไฟล์) — กฎ STOP ของ Phase 4 step 3 ใช้กับ DGL ได้แล้ว
- ไม่ทำตาม: ตัด `compatibility` ใน frontmatter (เป็นฟิลด์ในสเปก) · เริ่ม Phase 4 ที่ 1 (project file อ้าง "step 3" อยู่) · แตกย่อหน้า G1 เป็นข้อย่อย
- `next.md` §Screen facts: Common Handling board ครอบ `screen/error-full` · `screen/retry-loading` · `screen/block-retry` ด้วย (เจ้าของ flow ยืนยัน) —
  จุดที่ Opus กับ Sonnet แตกเคสไม่ตรงกันบนจอ Payment 29.1
- จากการเขียนคำอธิบายรายบรรทัดของเล่มสอน: `board-grammar.md` Link rule เขียนว่า "four counts" แต่มี 5 ข้อ → แก้เป็น five ·
  `ptp.md` ตาราง key ของ `Title Block` เป็นของ dialect A อย่างเดียว — **dialect B ใช้ component set คนละชุด** (วัดจากไฟล์จริง 2026-09-22)
  เพิ่มตาราง key ของ dialect B 3 variant และกฎห้ามปนสองชุดใน board เดียว

**กฎ**
- Phase 1: **board เป็นของ base นี้เมื่อ stamp `baseNodeId` หรือ `linkedFrom` ตรงกับ base เท่านั้น — ไม่ใช่ตามชื่อ** ·
  base อาจเป็น variant/state ของจอที่มี board อยู่แล้ว → เข้ากรณี states-of-one-screen
- ⊘ ต้องมีเหตุผลที่ชี้ได้ (เห็นบนจอ หรืออยู่ใน §Screen facts) — สมมติฐานทางธุรกิจให้เสนอเป็น ✗ + ⚠️
- ตาราง Phase 3 ที่ยาวเกิน ~30 แถว: ✗ แสดงทุกแถว · ✓/⊘ พับเป็นบรรทัดละ pack ได้
- G0 write probe เฉพาะเมื่อจะ Scaffold · รันแบบถามไม่ได้ = พิมพ์ matrix + คำถาม แล้วหยุด
- board-grammar: label ตาม labelStyle ของโปรเจค (เดิมเขียนว่าทุกโปรเจคต้องเป็น `Case#N` — ขัดกับ CLICX / PTP)
- case-library: ตาราง id ของแถวที่ derive ไม่ได้ (ชื่อไทย/มี `/`) · รายการ **Never a pack ทุกโปรเจค** (chrome · ไอคอน · ของตกแต่ง)
- next.md / ptp.md: ความกว้าง board ขั้นต่ำ (518 / 535) · ptp.md dialect B: สูตรความกว้าง · ชื่อ board อิสระ · จอเป็น variant
- SKILL.md ลดจาก 26.5 เหลือ 25 KB โดยกฎครบทุกข้อ (ตรวจด้วยรายการ token 47 ตัว) · Phase 1 ชี้ไป `case-library.md` §Never a pack แล้ว
- Runtime: response ~20 KB ล้มทั้ง `use_figma` และ `get_metadata` (นับ script ที่ echo กลับด้วย) · Bridge อ่านข้ามหน้าต้อง `page.loadAsync()`

---

## 2026-09-21 — เตรียมแชร์: ตัดชื่อบุคคล / ชื่อ skill อื่น / ตัวชี้ phase 2

ไม่เปลี่ยน pipeline / gate · script แตะไฟล์เดียวคือ `scaffold-kit.js` (ดูหัวข้อรอบสอง)

**พฤติกรรมใหม่**
- **Phase 2 กลับเป็น "planned — not built yet"** — skill เติมจอตัวเดิมเลิกพัฒนา
  (ไม่ตอบโจทย์) จะออกแบบใหม่ภายหลัง · intro และ §pluginData Store note ไม่ชี้ไป skill อื่นแล้ว
- **"Not for" ไม่ระบุชื่อ skill ปลายทาง** — คงขอบเขตงานไว้ (design review · DS QA ·
  token binding · สร้างจอใหม่) แต่ไม่ route ด้วยชื่อ ใช้ได้แม้ไม่ได้ติดตั้ง skill เหล่านั้น
- **FigJam scope tag → tier เป็นกฎทั่วไป** — tag รูป `<name> UI` ใดก็ตาม = Tier 1
  (เดิมระบุ tag รายตัว)

**แก้ข้อขัดแย้งภายใน (รอบสอง วันเดียวกัน)**
- **scaffold-kit: stamp + guard ใช้ได้ทั้งสอง runtime** (ปลด freeze, ทดสอบสดทั้ง Bridge และ `use_figma`) —
  เดิม `stampCase`/`stampBoard` เขียน plain pluginData อย่างเดียว ซึ่ง `use_figma` throw
  ("not supported in this host runtime") และ `guard()` เทียบ `figma.root.name` ซึ่งบน `use_figma`
  เป็น `"Document"` เสมอ → scaffold ผ่าน runtime หลักตามเอกสารทำไม่ได้เลย · แก้: `setStamp()` ลอง plain
  ก่อน (Bridge เหมือนเดิมทุกไบต์) throw แล้วค่อยเขียน shared namespace `"permBuild"` ที่ scan-cases /
  verify-board อ่านอยู่แล้ว · `guard()` รับชื่อไฟล์ (Bridge) หรือ fileKey (`use_figma`) · self-check มี mock
  ทั้งสองทาง · Runtime table กลับเป็น `use_figma` primary (ตอนนี้จริงแล้ว) · ข้อจำกัดที่เหลือ: board ที่ stamp
  แบบ plain (สร้างผ่าน Bridge / ก่อนวันนี้) ยังอ่านไม่ได้บน `use_figma` → AUDIT ผ่าน Bridge
- **NEXT `slotSizes` ตามความสูง base** — §Verify config เดิมล็อก ×844 ขัดกับ §Board anatomy
  ("slot heights follow the base") → base ที่ไม่ใช่ 844 ตก G5 ทั้งที่ board ถูก (เจอจริงรอบ 29.1,
  base 862) · เพิ่มคำสั่งให้แทน 844 ด้วยความสูง base ที่วัดตอน G1 และห้ามบีบ slot ให้ผ่าน
- **NEXT link note** — ตัดบรรทัดเก่า 2 บรรทัด ("VECTOR เป็นทางเดียว", 2026-08-11) ที่ถูก
  หักล้างโดย note 2026-08-18 ในย่อหน้าเดียวกัน

**จาก BUILD เต็มผ่าน `use_figma` (รอบสาม วันเดียวกัน — จอ 19.1 Coupon Chooser, G5 pass)**
- **scan-cases: board ที่ทีมทำเอง (ไม่มี stamp) นับ designed ได้แล้ว** — เดิม cell ถอยไปที่ parent ของ label
  ซึ่งเป็นกล่อง label ไม่ใช่คอลัมน์เคส → ทุก board ของทีมอ่านได้ 0 designed (เจอจริง 0/53) · ตอนนี้ cell =
  ancestor ที่ใหญ่ที่สุดที่ยังมี label เดียว · ผลบนไฟล์จริง: 14.1 = 32/34 · Common Handling = 5/5
- **scan-cases: เลขซ้ำนับราย board** — `Case#N` เริ่มใหม่ทุก board การสแกนหลาย board พร้อมกันเคยฟ้องซ้ำ
  [1..14] ทั้งที่ไม่ซ้ำ · เพิ่ม `dupNumbers` ราย container
- **harvest-board: ขนาด slot ถูกแล้ว** — frame ขนาดจอที่ "มี Case label อยู่ข้างใน" คือคอลัมน์ ไม่ใช่จอ
  (เดิมรายงาน 390×2062 ซึ่งเป็นคอลัมน์ · ตอนนี้ 390×1878 / 375×812 ตามจริง)
- **Phase 0: project ของ board ตาม flow ไม่ใช่ DS ของจอ** (จอจาก DS อื่นที่ฝังใน flow)
- **use_figma prelude** — ทุก call เริ่มที่หน้าแรกและไม่มี selection → ใส่ `setCurrentPageAsync` เหนือทุก
  script และตั้ง selection เองให้ `scan-cases.js`
- **Rollback = board + เส้น link** (เส้นอยู่บน SECTION ไม่ได้อยู่ใน board)
- **Sibling-duplicate guard** — board ข้างเคียงไม่มี stamp ให้เทียบด้วยชื่อเคส หรือรายงานว่าข้าม ห้ามผ่านเงียบ
- **case-library: id ของแถวใน pack = `<pack>/<ชื่อแถว kebab-case>`** — สร้าง `knownCaseIds` ได้แบบ mechanical
- **โปรเจคใหม่: PTP (`projects/ptp.md`)** — เรียนจาก board `Permutation: Pg_Setting` 2 อัน: board เป็น GRID
  (4/3 คอลัมน์ · colGap 120 · rowGap 40) · หัว/caption เป็น instance `Title Block` จาก library · จอใน flow เป็น INSTANCE
- **labelStyle ตัวที่ 3: `indexed`** = `<g>.<n> | <name>` หรือ `#<n>[.<m>] <name>` (PTP มี 2 dialect ตาม flow · ไม่มีคำว่า Case เลย ·
  หัวกลุ่มที่ใช้ grammar เดียวกันไม่ถูกนับเป็นเคส) — scan-cases / verify-board /
  harvest-board รู้จักแล้ว · เดิม board ของทีม PTP อ่านได้ 0 เคส · CONTRACT: label เป็นรายโปรเจค (strict / loose / indexed)
- **PTP build บน canvas (dialect A, GRID)** — board `Permutation: Pg_Setting` 5 เคส ผ่าน G5 ด้วย labelStyle `indexed` ·
  บทเรียนลง ptp.md: สร้าง Title Block ด้วย `createInstance()` ไม่ clone จาก board ทีม · ลำดับวาง GRID · คำอธิบายเคสบรรทัดเดียว
- **harvest-board รู้จัก board ของ CLICX** — เดิมหา sibling/board ด้วยคำว่า "permutation" ในชื่อ → `B.01-01.C` มองไม่เห็น
  (`siblingBoards: []`) และ connector ที่ชื่อ "Permutation" ถูกนับเป็น board · label แบบ loose ไม่ถูกเก็บ
  (`labelSamples: []`) · ตอนนี้ใช้ `isBoard()` (ชื่อ + type) + regex strict/loose · คืน `labelStyle` · มี node self-check แล้ว
- **Link anchor: ข้อยกเว้น overflow** — instance หลักที่สูงกว่า frame ที่ clip (จอ scroll) ทำให้เส้นเริ่มใต้จอที่มองเห็น
  ดูเหมือนเส้นไม่เชื่อมกับจอ (เจอจริงบน CLICX Home: instance 1509 ใน frame 812) → ให้ anchor ที่ FRAME แทน + อ่านค่ากลับ
- **Placement: ไม่มีที่ว่างตามลำดับ flow → หยุดถามผู้ใช้** · อ่านความกว้าง board กลับหลังกลุ่มแรก
- **case-library: backtick เป็น markup ของไฟล์** ไม่ลง canvas
- **clicx.md: board กว้างขั้นต่ำ 1200** (title block `minWidth 1000`) + page variant ของหน้า CLICX เดิมของทีม
- **next.md: ตาราง Tier-3 ids ที่อยู่บน board แล้ว** (8 id อ่านกลับจาก canvas) — กัน caption เพี้ยนข้าม board

**ย้ายกฎจากข้อความไปเป็นด่านใน script (รอบสี่ วันเดียวกัน — สรุปจาก 3 รอบรันจริง NEXT / CLICX / PTP)**
- **G5 ตรวจเส้นโยง** — CONFIG `linkId`: ต้องเป็น CONNECTOR · ปลายทั้งสองเกาะ node · จบที่ board นี้ · เริ่มที่จอ base ·
  มีหัวเส้นครบ · เส้นเริ่มห่างขอบล่างจอไม่เกิน 12px (เส้นโยงโดนตีกลับ 4 ครั้ง และกฎเป็นข้อความถูกเขียนใหม่ 3 รอบ)
- **G5 ตรวจว่า board อยู่ใน section** (เคยล้น 4px แล้วยังผ่าน)
- **เคสระดับ component ที่ใส่ crop** (เช่น SOF card สูง 108) นับเป็น designed ได้แล้ว — scan-cases เลิกใช้เกณฑ์สูง > 600
  เปลี่ยนเป็น "สิ่งที่อยู่ข้าง caption และไม่ใช่ placeholder" · verify-board ข้ามการเช็คขนาดให้ cell `level:"C"` ที่ออกแบบแล้ว ·
  ผลจริง: board ทีม PTP 30/30 (เดิม 22/30)
- **scaffold-kit: factory สำหรับ caption จาก library component + GRID** — `freshInstance` · `setInstanceTexts` ·
  `equalizeRow` · `gridFrame` · `placeInGrid` (error ทุกครั้งใน 3 รอบเกิดในโค้ดส่วนนี้ที่เคยต้องเขียนเอง)
- **G1: board ข้างเคียงใน section เดียวกันคือความจริง** — harvest ทุกครั้งที่มี (1 call) · project file เป็นค่าเริ่มต้น
  (โปรเจคเดียวมีหลาย dialect: PTP 2 flow · CLICX หน้าต้นฉบับ · NEXT 2 รูปแบบชื่อ)
- **scan-cases `DETAIL = false`** — คืนเฉพาะสรุปราย board สำหรับ use_figma ที่ response เกิน ~20 KB แล้ว error
- **Project index: อ่านสัญญาณจากชื่อก่อน variables** · Phase 4 ข้อ 5 (เส้นโยง) ย่อจาก ~1,170 เหลือ ~520 ตัวอักษร รายละเอียดอยู่ใน board-grammar
- **Component maps: แถว NOT-a-pack จากหลักฐานจริง** (ชื่อ instance บนจอ 4 / 7 / 7 จอของ NEXT / CLICX / PTP) — chrome · ไอคอน ·
  ของตกแต่ง · instance ที่เป็นตัวจอเอง · NEXT ย้ายแถว quick ขึ้นเหนือแถว button (`Quick Button` เคยไป match `/button/`) ·
  Phase 1: map component ตาม DS ของตัวจอ ไม่ใช่ตาม flow
- **`scripts/smoke-test.js`** + README "เช็คว่าเครื่องพร้อม" — ให้คนในทีมเช็คเครื่องตัวเองก่อนใช้ครั้งแรก

**เอกสาร**
- ตัดชื่อบุคคลออกจากทุกไฟล์ ใช้ชื่อโปรเจคแทน
- ตัวอย่างใน report shape ไม่ใช้ชื่อแบรนด์ · อ้างถึงรอบเทสโดยไม่ระบุชื่อโมเดล
  (ยกเว้นบันทึกย้อนหลังในไฟล์นี้)
- description ตัด "(replaces …)" ออก

---

## 2026-08-18 — Audit fixes (skill audit 9.5/12 → pass)

แก้ตามผล audit โดยไม่เปลี่ยน pipeline/gate ใด ๆ

**พฤติกรรมใหม่**
- **Report shapes บังคับ** — Phase 1 profile / Phase 3 matrix ตัวอย่างแถว /
  Phase 5 summary / AUDIT ต้องตอบตามบล็อก format ที่กำหนด (เดิมปล่อยอิสระ)
- **Conciseness rule** — ตอบกระชับตาม report shape ไม่มี prose เกิน

**Known issue (แก้แล้วใน 2026-09-21 — บันทึกเดิม:)** scaffold-kit เขียน
stamp เป็น plain pluginData อย่างเดียว ซึ่ง use_figma เขียน/อ่านไม่ได้ →
scaffold ที่ต้องการ stamp ให้รันบน Bridge; build ที่ stamp ไม่ติดจะตกที่ G5
(verify-board อ่านทั้งสอง store) — ดู §pluginData Store note ใน SKILL.md

**เอกสาร**
- เพิ่ม §About (role · version · author · maintenance rule)
- Hard rule "harvest before scaffold" ชี้กลับ Gate G1 แทนเขียนคำสั่งซ้ำ
- intro ชี้ phase 2 ไปยัง skill เติมจอ (เดิมเขียน "not built yet") — ยกเลิกแล้วใน 2026-09-21
- Required input + พฤติกรรมเมื่อไม่มี selection (When to use)
- §pluginData note เรื่อง store follows runtime (plain/shared) + ตัวอย่าง import-test ใน LEARN

**Link rule (feedback จาก live run 29.1 — เส้น permutation ถูกวาดผิดบ่อยในหลายโปรเจค)**
- Phase 4 ข้อ 5 + board-grammar **§Link rule** (checklist 5 ข้อ, cross-project): ลิงก์ต้อง
  replicate exemplar ที่ healthy — **anchor = main INSTANCE ในจอ (magnet BOTTOM) → board (TOP)** ·
  route = กลางล่างจอ → กลางบน board · **หัวเส้นทั้งสองปลาย** (`TRIANGLE_FILLED`/`ARROW_LINES`;
  VECTOR ใช้ per-vertex `strokeCap` ผ่าน `setVectorNetworkAsync`) · **ต้อง attach จริง**
- ค้นพบใหม่ (พิสูจน์บนไฟล์ NEXT test): clone CONNECTOR throw ทุกเส้นแม้เส้น healthy (3/3)
  แต่ **re-point `connectorStart`/`connectorEnd` ของเส้นที่มีอยู่ทำได้** → recovery:
  ให้ user วาดมือ/Cmd+D เส้น exemplar แล้ว plugin re-point ให้เป๊ะ; VECTOR เป็นแค่
  placeholder (ไม่ attach → โดนตีกลับ)
- exemplar เสีย (endpoints ชี้ SECTION / ผูก FRAME แทน instance) ห้ามใช้เป็นแบบ —
  276:304468 / 276:304854 คือตัวอย่าง outlier ในไฟล์ทดสอบ
- **ค้นพบเพิ่ม (2026-08-18 รอบสาม): clone gate เป็นราย RUNTIME** — Bridge clone throw
  ในไฟล์ NEXT test แต่ **`use_figma` (official MCP, remote) clone + re-point เส้นเดิมได้สำเร็จ**
  (พิสูจน์: mint เส้นสมบูรณ์ 365:494 — section/caps/endpoints ถูกครบ — แล้วลบตัวพิสูจน์)
  → ladder ใหม่: clone runtime ปัจจุบัน → clone อีก runtime → human duplicate + re-point →
  VECTOR placeholder · เพิ่มแถว Runtime table (ด้านกลับ: stamps ยังเป็น Bridge-only)

**G1 scope alignment (audit รอบสอง — แก้ drift)**
- Phase 4 บรรทัดเปิด: เงื่อนไข harvest เขียนตาม gate table G1 ตรง ๆ —
  §Board anatomy ต้อง verified กับ live board ในไฟล์นี้; ยังไม่เคย (หรือทีมเปลี่ยน
  style) → รัน `harvest-board.js` verbatim. เดิมอ่านได้ว่า "บังคับทุกครั้ง" ซึ่ง
  ขัดกับ CONTRACT / board-grammar / projects/next.md ("re-harvest if style changed")
- LEARN step 2: ตัด rationale ที่ซ้ำกับ Runtime table เหลือ pointer
  ("Bridge required — see Runtime table") — เหตุผล+proof date อยู่ที่ตารางที่เดียว

---

## 2026-08-11 — Feedback revision + เทสหลายโมเดล

แก้ 6 จุดจากผลรัน Haiku บนหน้า `AI Test 05` (designer note ลงวันที่ 6 Aug 2026)
แล้วเทสซ้ำด้วย 3 โมเดล × 3 โจทย์ ก่อน merge

**พฤติกรรมใหม่**
- **§Screen facts** — project file มี section เก็บ business rule รายจอ
  (เช่น "หน้า Home เป็น empty ไม่ได้ เพราะมีบัญชี savings แล้วเสมอ")
  Phase 2 อ่านก่อน enumerate แล้วจัดเคสพวกนี้เป็น ⊘ อัตโนมัติ ·
  Phase 3 ถ้าผู้ใช้ตัดเคสแบบ "เป็นไปไม่ได้" จะเขียนกลับลงตารางนี้ —
  รันหน้าเดิมครั้งหน้าไม่เสนอผิดซ้ำ
- **Captions verbatim** — เคสมาตรฐานต้องใช้ id + caption จาก case-library
  ตรงตัว ห้ามแต่งชื่อเอง (ต้นเหตุ "Session timeout" vs "Network reconnect"
  บน board พี่น้องกัน) บังคับด้วยด่านใหม่ `knownCaseIds` ใน verify-board.js
- **กรอง hidden** — Phase 1 ข้าม subtree ที่ `visible === false`
  component ที่ปิดตาไว้ไม่งอกเป็นเคสอีก (ต้นเหตุเคสหลอน Announcement /
  Ads section / Setting overlay)
- **ตารางเต็มทุกแถว** — Phase 3 ต้องโชว์ทุกแถวของทุก pack รวม ✓ และ ⊘
  พร้อมเหตุผล ไม่ใช่แค่เคสที่เสนอ — เคสที่หายจะฟ้องตัวเอง
- **โปรโตคอลหลาย base** — ได้ base เกิน 1 จอ ให้หยุดถามความสัมพันธ์ก่อน
  (states ของจอเดียว / คนละจอ / template) + ด่านใหม่ใน Phase 4:
  case set ซ้ำ ≥90% กับ board ข้างเคียงที่คนละ base → หยุดถามผู้ใช้
- **ชื่อตามทีม + CTA** — caption เรียก component ตามชื่อใน map ของโปรเจค
  และจอที่มี CTA ได้บรรทัดเตือนให้ระบุปลายทาง navigation (🔗)

**CLICX (`projects/clicx.md`)**
- เพิ่ม §Screen facts พร้อม 2 กฎแรกจาก note ของทีม
- แก้ component map: แถว icon-exclusion `/^(gen|cus)_ic_/i` ไว้บนสุด
  (ปิด false-positive ที่ `gen_ic_my-asset` เคย match เป็น account card) ·
  เพิ่ม `/savings account/i` และ `/tooltip/i` ·
  จดข้อยกเว้นว่า eye toggle ซ้อนอยู่ใน `total balance` ได้

**case-library**
- เพิ่ม 4 id ใหม่ (รอ sync เข้า FigJam ทีม): `empty/section` ·
  `nav/badge` · `hub/card-set` · `fav/list-count`

**ผลเทส (3 โมเดล × 3 โจทย์ + รันสดบนไฟล์จริง)**
- ทุก fix ทำงานจริง ไม่มีโมเดลไหนทำผิดซ้ำแบบรอบ 6 Aug
- Haiku ไม่เหมาะกับ Phase 2 enumerate (ตกทั้ง 2 รอบ คนละอาการ) ·
  Sonnet = ตัวเลือกหลักงานประจำ · Opus/Fable สำหรับจอซับซ้อน

---

## 2026-07-31 — CLICX fixes จาก build จริง `H.02-01.B` (my asset / has pockets, 19 เคส)

- **เส้นโยงได้เส้นจริงแล้ว** — clone `CONNECTOR` ของทีมแล้วเปลี่ยนปลายทาง
  แทนการวาด VECTOR ที่ไม่เกาะ node (VECTOR เหลือเป็น fallback
  กรณีไฟล์ไม่มีเส้นให้ clone)
- **bg ของ board ต้อง bind variable** ไม่ใช่ใส่ hex ดิบ — CLICX ใช้ `color/bg_permu`
- **caption สูงเท่ากันทั้งแถว** ด้วยการเติมบรรทัดว่างท้ายข้อความแบบที่ทีมทำ
  (frame คง `HUG` ไว้) ห้าม fix ความสูง frame เพราะพังทันทีที่มีคนแก้ copy ·
  เพิ่ม gate `screensAlignPerRow`
- **caption ใช้ emoji marker** 🔍 ตรวจ · ⚠️ ยืนยันกับ BA · 🔗 ปลายทาง ·
  🚫 ไม่นับรวม แยกจาก description ด้วยบรรทัดว่าง
- `harvest-board.js` อ่าน property แบบ defensive — เดิม crash เมื่อเจอ
  CONNECTOR/VECTOR ในบอร์ด
- `verify-board.js` + `scan-cases.js` อ่าน pluginData ทั้ง plain และ shared —
  `use_figma` บล็อก `setPluginData` เลยต้อง fallback ไป `setSharedPluginData`
- `projects/clicx.md` แก้ตามของจริง: **ไม่มี frame `screen permutation`**
  (0 ครั้งใน 31 case), caption frame ชื่อ `title` ตัวเล็ก,
  `numbersScopedPerGroup: true`

---

## 2026-07-27 — Restructure v2: gates + scripts-as-enforcement

- รุ่นแรกที่ใช้กับงานจริง — board DGL Revamp 17 เคส
- pilot NEXT ผ่าน (`ORBIT Landing Permutations` 18 เคส) แต่ pilot CLICX
  โดนตีกลับ 2 รอบเพราะ "เดา style" → เกิดกฎเหล็ก **harvest ก่อน scaffold**
- rearchitect เป็น gate G0–G5 พร้อมสคริปต์บังคับ:
  `harvest-board.js` (เก็บ style board จริง 10 หัวข้อ) ·
  `scaffold-kit.js` (factory กัน auto-layout พัง + pluginData stamps) ·
  `verify-board.js` (ด่านตรวจ Phase 5 — เสร็จเมื่อ `pass: true` เท่านั้น) ·
  `scan-cases.js` v2 (รู้จัก board CLICX + loose label + ancestor-climb)
- ย้ายตัวเลขเฉพาะโปรเจคทั้งหมดออกจาก references ไปอยู่ `projects/<name>.md`
- LEARN โปรเจค CLICX ลง `projects/clicx.md`

---

## 2026-07-24 — v1

- skill ตัวแรก: pipeline 6 phase (Profile → Enumerate → Confirm →
  Scaffold → Verify) หยุดที่ Phase 3 ได้ถ้าต้องการแค่ case list
- case base 2 ระดับ (screen / component) 3 tier จาก FigJam ทีม + corpus
- `scan-cases.js` + project file NEXT · แทนที่ skill วิเคราะห์ state ตัวเดิม
  (deprecated วันเดียวกัน)
