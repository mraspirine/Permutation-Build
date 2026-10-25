# เทียบ skill A กับ B — เปลี่ยนตรงไหนบ้าง (2026-10-25)

A = ฉบับก่อน (`versions/SKILL-A-2026-10-22.md` · git `a06d8e3`) · B = ฉบับภาษาคนที่ติดตั้งเป็น `SKILL.md` เมื่อ 2026-10-25 (B ที่ทดสอบ 16,495 ตัวอักษร + บรรทัด Ten things #3 ปรับให้ตรงกฎ mint → 16,602)

## 1. ภาพรวมตัวเลข

| | A | B | หมายเหตุ |
|---|---|---|---|
| SKILL.md | 24,913 ตัวอักษร · 193 บรรทัด | **16,495 · 172** | B = 66% ของ A |
| ประโยค "never" | 49 | **3** | ที่เหลือเขียนเป็นพฤติกรรมบวก + เหตุผล |
| ประโยค GUARD | 11 | **0** | กลายเป็น "Ten things that went wrong before" |
| แถวตาราง | 50 | 30 | ตารางด่าน + ตารางกล่อง ①–⑤ หายไป (เป็น checklist/รายการแทน) |
| references/ | 5 ไฟล์ | 5 ไฟล์เดิม + แนบท้าย 3 ไฟล์ (+3,111 ตัวอักษร) | ไม่มีไฟล์ใหม่ |
| projects/ | — | `ptp.md` +1 บรรทัด (§About) | กฎ R057 ที่ตารางโปรเจคใน A เคยถือไว้ |
| scripts/ · contract-and-runtime · learn-audit · next/clicx/dgl/_template | เหมือนกันทุกตัวอักษร | | |
| ตัวอย่าง Phase 3 + Report | เหมือนกันทุกตัวอักษร | | B เติมตัวอย่างที่ 2 (CLICX Home) 5 บรรทัด |

## 2. โครงสร้าง — ของใน A ไปอยู่ตรงไหนใน B

| ส่วนใน A | ไปอยู่ใน B | เปลี่ยนยังไง |
|---|---|---|
| About (Role · Version · Author · Maintenance) | **About** | เหมือนเดิม สั้นลง |
| How to talk to the user (8 bullet) | **How to talk** (5 bullet) | ตัดบรรทัดกฎกล่องคำถามออกไปรวมที่ Messages · เพิ่มกฎบรรทัดสรุป `High N · Medium N · Low N` และ stamp mapping |
| When to use / not use | **Your job** (1 ย่อหน้า) | เขียนเป็นคำอธิบายงานแทนรายการ use / not for |
| Pipeline + ตารางด่าน G0–G5 | **Each run** — checklist 6 phase ทุก phase จบด้วย "Done when …" | ด่านถูกยุบเข้า "Done when" ของแต่ละ phase · เหลือชื่อ G1 (harvest) กับ G5 (verify) เป็นคำเรียก |
| Project index (ตารางสัญญาณ 4 โปรเจค) | Phase 0 ขั้น 5 ประโยคเดียว | สัญญาณไปอยู่ใน `projects/*.md` §About ของแต่ละโปรเจค (ptp.md ได้บรรทัดที่ขาด) |
| Phase 0–5 (ย่อหน้าแน่น) | Each run — ขั้นมีเลข 1 บรรทัดต่อขั้น | ประโยคไทยตายตัวทุกจุดยังอยู่ครบ · ลำดับ harvest เขียนในประโยคเดียว · scan section นอกเฉพาะเมื่อ section ในไม่มี board |
| Phase 3: ตัวอย่าง + กฎรายส่วน 6 bullet + ตารางกล่อง | **Messages**: ตัวอย่าง (เหมือนเดิม) + กฎ 5 bullet สั้น + "The boxes" เป็นรายการ ①–⑤ | ตัวเลือกกล่อง ⑤ เขียนไว้ในบรรทัด · "ไม่มีข้อค้าง → ถามแค่ ① กับ ⑤" |
| Phase 5 Report + บรรทัดเงื่อนไข | Messages: Report + 3 ประโยคเงื่อนไข | เหมือนเดิม |
| LEARN · AUDIT (2 bullet) | 1 บรรทัดชี้ `learn-audit.md` | รายละเอียดอยู่ในไฟล์นั้นอยู่แล้ว |
| References table | **Which file to open when** + บรรทัด smoke-test | path แก้ให้ถูก (projects/ scripts/ อยู่ root) |
| GUARD 11 ประโยคที่กระจายอยู่ | **Ten things that went wrong before** | แต่ละข้อ = ทำอะไร + ทำไม (จาก CHANGELOG) |

## 3. กฎ 21 ข้อที่ย้ายจาก SKILL.md ไปแนบท้าย references (A ยังมีใน SKILL.md)

| ไปอยู่ที่ | กฎ | อ่านเมื่อ |
|---|---|---|
| `archetype-cases.md` §Several Key Screens (+701) | ได้หลาย Key Screen → ถามความสัมพันธ์ก่อน · states ของจอเดียว / จอแยก / mockup ทำต่างกันยังไง (R040–R043) | Phase 0 ขั้น 2 |
| `case-library.md` §Buckets (+1,074) | pre-sort §Screen facts · ✓ มีแล้ว (รวม `screen/default`) · ✗ + business assumption เป็นคำถาม · ⊘ ต้องมีเหตุผลชี้ได้ · ค่าธุรกิจจาก brief ไม่งั้น `⚠️ ยืนยันค่า` (R086, R093–R096, R244) | Phase 2 |
| `board-grammar.md` §Scaffold stops (+1,336) | sibling-duplicate ≥90% · no free span → หยุดถาม · บรรทัด Report เงื่อนไข (label แบบ loose/indexed · เทียบไม่ได้ · ไม่มี link) (R142–R151, R125 บางส่วน, R144, R161, R169, R170, R210) | Phase 4–5 |

ตรวจแล้วในรอบ A/B: กฎ 244 ข้อ อยู่ครบ 243 · R057 (สัญญาณชื่อ PTP) หล่น → แก้แล้วใน `ptp.md`

## 4. ถ้อยคำที่เปลี่ยน (ตัวอย่าง)

| A | B |
|---|---|
| `GUARD: hidden layers grew phantom Cases` | `Profile visible layers only — hidden layers turn into phantom Cases.` |
| `GUARD: never 2–3 questions in one box` | `Ask one decision per AskUserQuestion box … — three questions in one box get one answer.` |
| `**Never printed**: node ids · gate names …` | `Keep internal until asked ("ขอดูผล Verify"): node ids · gate names …` |
| ตารางกล่อง 5 แถว × 3 ช่อง | รายการ ①–⑤ บรรทัดละข้อ พร้อมตัวเลือก |
| ด่าน `G3 user confirmed matrix + placement` | `Done when: box ⑤ says สร้าง Permutation Board เลย, or the Case List ends the run.` |

## 5. สิ่งที่แก้ใน B รอบ 2026-10-25 (จากผลเทสต์ A/B)
1. scan section นอก*เฉพาะเมื่อ* section ในไม่มี board (สาเหตุที่ Figma call เพิ่ม 2 เท่า) + วาง scan-cases.js โดยตัด self-check ท้ายไฟล์
2. ลำดับ harvest ครบในประโยคเดียว (sibling → §Board anatomy → ถาม · sibling ชนะ project file · บันทึกถ้าต่าง)
3. กฎ mint: ห้ามก๊อปชุดเคสจาก board ข้างเคียง · mint เฉพาะจาก pack row หรือของที่เห็นบนจอ · 1 Case ใหม่ = 1 แถว Confirm · id ที่มี ⚠ อยู่แล้วไม่ต้องถาม
4. กล่อง ①–⑤ อยู่ที่เดียว + ตัวเลือกกล่อง ⑤ + "ไม่มีข้อค้าง → ① กับ ⑤"
5. ตัวอย่าง: MWA = 🟠 Medium · Report 4/6/4 (บั๊กเดียวกับใน A แก้แล้วทั้งคู่)
6. กฎบรรทัดสรุป `High N · Medium N · Low N` ไม่มีคำไทย
7. แถวคลังที่ไม่มีไทย (Image pack) พิมพ์อังกฤษตามต้นฉบับ · Group `Image`
8. path ตารางไฟล์ถูกต้อง
9. Report เมื่อไม่มี Connector Line · Verify พลาดให้แก้แล้วรันซ้ำก่อน
10. write probe เฉพาะเมื่อ user ขอ board แล้ว
11. ข้อยกเว้น Phase 1 ขั้น 5 เหลือข้อเดียว (มี board อยู่แล้ว)
12. นิยาม "free span"
13. ptp.md §About เติมสัญญาณที่ขาด
14. สถานการณ์ใหม่ที่เกิดซ้ำ → เสนอเข้า Case Library
15. โปรเจคไม่มี link → Report บอกว่าข้าม link check

## 6. ปรับตอนติดตั้ง (2026-10-25)
- Ten things #3: "one pack row = one Case" → "pack ที่ board ข้างเคียงใน flow ทำแล้ว = มีแล้ว ไม่ mint ซ้ำ · mint เฉพาะที่จอนี้แสดงต่างจาก board นั้น · 1 สถานการณ์ = 1 Case" ให้ตรงกับ `case-library.md` §Enumeration guards (ไฟล์ขยับจาก 16,495 → 16,602 ตัวอักษร)
- Version ใน §About → 2026-10-25 · CHANGELOG ใช้ของ A ต่อแล้วเพิ่ม entry ใหม่
