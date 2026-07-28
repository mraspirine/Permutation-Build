# board-grammar — how permutation boards are laid out (Phase 4)

> **This file is the cross-project grammar and deliberately contains no numbers from any project** — every project lays boards out differently.
> The real values (spacing · fonts · colors · structure) live only in **`projects/<name>.md` §Board anatomy**.
> No data for that project yet → **run `scripts/harvest-board.js` on a board the team already made**, then record it in the project file (LEARN).

---

## Hard rule: harvest before scaffold
**Never build a board from memory, from defaults, or from another project.** Every time you scaffold in a file you have not built in before:
1. Find a board the team made in that file (`scan-cases.js` locates containers)
2. **Run `scripts/harvest-board.js` verbatim** against it (replace `BOARD_HINT`). **Never hand-write a shortened version** — the pilot did that, dropped the links section, and reported "no connector" for a project that clearly had one (2026-07-27). The script exists precisely so nothing gets skipped.
3. Compare with `projects/<name>.md` — if it differs or is missing, update the project file first, then build
4. **No existing board at all (greenfield)** → use the project file's defaults; if there are none → **ask the user**, do not guess

## What the harvest must capture (miss one and the board won't match the team's)
| # | Item | What you need |
|---|---|---|
| 1 | **Shell** | How many nested levels · auto-layout direction per level · does it wrap |
| 2 | **Spacing** | gap + padding at **every level** (board / group / row / column / caption / label group) |
| 3 | **Typography** | Per role: `fontName.family` **plus style (weight)** · size · **lineHeight (PIXELS vs AUTO)** · color |
| 4 | **Colors** | Board fill · text color per role · strokes |
| 5 | **Caption shape** | How many text nodes · their order · does `Case#N` contain a space · which language sits in which node |
| 6 | **Screen slot sizes** | Normal / small / large screen widths that board uses |
| 7 | **Grouping** | Are there sub-groups · title levels · what criterion groups them |
| 8 | **Link to the screen** | Kind (CONNECTOR / VECTOR / none) · color · weight · line type · endpoints (which node, which magnet). **Do not conclude "none" without checking** — links live on the SECTION, not inside the board, and a file often has two kinds (a flow link and a permutation link) distinguished only by name and dash pattern |
| 9 | **Placement** | Which band the board sits in (x/y relative to the flow) · parent is SECTION or PAGE · where the neighbours are |
| 10 | **Naming** | Board name pattern · internal layer names |

> `harvest-board.js` returns all ten in a single call — read the result and fill in the project file.

## The shape most boards take (a common silhouette, not required values)
```
board                          ← name per project convention; fill/padding from the harvest
└── group (one per case category)   ← present or not, depending on the project
    ├── title                       ← size/weight from the harvest
    └── row (usually wrapping)
        └── case column
            ├── caption block       ← 1–3 text nodes, per the harvest
            │   └── label `Case#N` + (case name) + (description)
            └── screen slot         ← phase 1 = placeholder · phase 2 = the real screen
    setPluginData("permBuild", {...}) on the case column
```

## Rules that hold for every project (independent of style)
- **The label must be its own text node** whose entire string is `Case#N` / `Case #N` (satisfies the `renumber-cases` regex `/^\s*Case\s*#?\s*(\d+)\s*$/`) — no trailing text is allowed on that node
- **Everything is written inside one board node** → rollback = delete it
- **Never touch the base**, and never modify the team's existing boards
- **line-height**: if the team sets PIXELS, set PIXELS (AUTO throws off spacing across the whole board)
- **Caption fonts ≠ the fonts inside the screens** — a harvest will show both sets; never apply a screen font to captions
- **Size the board so it cannot overlap its neighbours**: read `siblingBoards` from the harvest, then pick a column count where `n×cellW + (n-1)×gap + padding×2` fits the available gap
- **Placeholder (phase 1)**: sized like that project's real screen slot, centered label `◻︎ Case Spec — awaiting design`. **Never use the words "Pending Design"** — on some boards that is a genuine status for a case the team hasn't designed yet

## The 3 layout schools (used to classify how a project lays boards out)
| School | Shape | Typically |
|---|---|---|
| **A · Flow + Perm** | Flow band on top · permutation band below · a link drawn from the screen down to its board | Long multi-step flows |
| **B · Grid-matrix** | Matrix of row=dimension × column=state · numbered sub-groups | Multi-dimensional cases / component-heavy screens |
| **C · Section-per-tab** | Section bands separating zones · multiplied by tab / branch / partner / language | Several tabs or scenarios |

Real boards **mix schools** — record the primary school and the mix in `projects/<name>.md`.

## Tool limitation (applies to every project)
**A design file cannot create CONNECTOR nodes through the plugin API** — `figma.createConnector` is undefined, and `clone()` throws *"Cloning CONNECTOR nodes is not supported in the current editor"* (FigJam only · verified 2026-07-27).
→ If the project links screens to boards with connectors: draw a **VECTOR** elbow with the same stroke and weight instead, **and tell the user it will not auto-attach** — a real connector has to be drawn by hand (`Shift+C`).
