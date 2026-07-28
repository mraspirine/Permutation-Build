# figma-permutation-build

A Claude Code skill that turns **one base screen in Figma** into a **Permutation board** —
it enumerates the cases that screen should have (2 levels: screen-wide + per-component),
proposes a prioritized matrix for you to trim, then scaffolds the board on canvas in
**your project's own layout style**.

**Phase 1 (this version): structure + cases only.** Each case gets a `Case#N` label, a
description, and an **empty screen slot** (`◻︎ Case Spec — awaiting design`) for the designer
to fill. Generating the screens inside the cases is phase 2 (not built yet).

---

## Install

```bash
# copy the folder into your Claude Code skills directory
cp -R figma-permutation-build ~/.claude/skills/
```

Then invoke it with `/figma-permutation-build`, or just say what you want in chat —
e.g. "แตกเคสจอนี้", "generate cases for this screen", "state ครบยัง".

## Requirements

| Need | Why |
|---|---|
| **Figma MCP** (official) | reads the base screen, writes the scaffold |
| **figma-console Desktop Bridge** | required only to read/audit *large existing* permutation boards (the official MCP overflows on big ones) |
| Node.js *(optional)* | to run the scripts' built-in self-checks: `node scripts/scan-cases.js` |

## First run in a new project

The skill ships with two learned projects (`projects/next.md`, `projects/clicx.md`) — those are
**one team's conventions, not defaults for you**. For your own project it will:

1. detect that the project is unknown
2. run `scripts/harvest-board.js` against a permutation board your team already made
3. draft `projects/<yourproject>.md` from `projects/_template.md` and ask you to confirm
4. build every future board to exactly those values

If you have no existing board at all, it asks you rather than guessing.

## What's inside

```
SKILL.md                  the engine: pipeline, 6 gates, the shared contract
references/
  case-library.md         case base — screen-level + per-component packs, Tier 1/2
  archetype-cases.md      archetype → signature cases + the 9 permutation axes
  board-grammar.md        cross-project layout grammar + the 10-item harvest checklist
                          (deliberately contains no project-specific numbers)
scripts/
  scan-cases.js           finds boards/cases, reports fill status  (Phase 1 + AUDIT)
  harvest-board.js        captures a team board's style             (gate G1)
  scaffold-kit.js         build factories: safe auto-layout, stamps (Phase 4 prelude)
  verify-board.js         the full check battery, pass/fail         (gate G5)
projects/
  _template.md            blank profile for a new project
  next.md · clicx.md      two worked examples (very different from each other)
```

## How it runs

```
Base → Profile → Enumerate → Confirm ◄ stop here for just the case list (nothing written)
                                 ↓
                            Scaffold → Verify → board on canvas
```

Every stage has a gate. The two that matter most:

- **G1 — harvest before scaffold.** Board style differs per project (spacing, font weight,
  line-height, caption shape, link style). The skill measures a real board in *your* file
  instead of assuming.
- **G5 — verify must pass.** `verify-board.js` checks case count, duplicate numbers, label
  style, pluginData completeness, slot sizes, overlap with neighbouring boards, and that the
  **base screen was never touched**. The scaffold isn't done until it returns `pass: true`.

## Safety

- Everything is written **inside one board node** → rollback = delete that node
- The base screen is never modified (phase 1 doesn't even clone it)
- Every write batch is guarded against writing into the wrong file
- AUDIT reports orphaned cases but **never deletes** anything

## Known limitation

In Figma **design** files the plugin API cannot create or clone `CONNECTOR` nodes (FigJam only).
Where a project links screens to boards with connectors, the skill draws a matching VECTOR elbow
and tells you it won't auto-attach — draw a real connector by hand (`Shift+C`) if you need one.

## License / provenance

Built and pilot-tested against real production-style Figma boards. The bundled `projects/*.md`
describe one specific team's conventions — treat them as examples and learn your own.
