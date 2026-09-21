# Changelog — figma-permutation-build

บันทึกทุกการเปลี่ยนแปลงที่มีผลต่อพฤติกรรมของ skill เรียงใหม่ → เก่า
(การแก้ README/เอกสารอย่างเดียวไม่ลงในนี้)

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

**เอกสาร**
- ตัดชื่อบุคคลออกจากทุกไฟล์ ใช้ชื่อโปรเจคแทน
- ตัวอย่างใน report shape ไม่ใช้ชื่อแบรนด์ · อ้างถึงรอบเทสโดยไม่ระบุชื่อโมเดล
  (ยกเว้นบันทึกย้อนหลังในไฟล์นี้)
- description ตัด "(replaces …)" ออก

---

## 2026-08-18 — Audit fixes (skill-md-auditor 9.5/12 → pass)

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
- `scan-cases.js` + project file NEXT · แทนที่ `ui-state-edge-generator`
  (deprecated วันเดียวกัน)
