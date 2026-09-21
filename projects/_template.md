# Project: <NAME> — permutation profile

> LEARN mode fills this in by reading the project's existing permutation boards + FigJam. The user confirms before it is saved. `next.md` is a filled-in example to copy the shape from.

## About / recognition
- Product: <name + platform>
- Detect: <variable collection / key the base binds to, or a file-name pattern>
- Default screen size: <W × H> · Small: <W> · Large: <W>
- Font in the product: <family + available weights>

## Board anatomy — **harvested <date>** (from board `<example board name>`)
> Fill this in from the output of `scripts/harvest-board.js` — **never copy it from another project**; every project lays boards out differently.
> The 10 items that must be captured are listed in `references/board-grammar.md`.

```
<paste the harvested shell here: levels / auto-layout direction / gap / padding / fill / parent>
```

| Role | Font (family + **weight**) | Size / line-height | Color |
|---|---|---|---|
| Sub-group title | | | |
| Label `Case#N` (+ case name) | | | |
| Description | | | |

- Caption: how many text nodes, in what order, does `Case#N` contain a space, which language sits where: <...>
- Screen slot sizes: normal `<W×H>` · small `<W>` · large `<W>`
- Internal layer names: <...>
- **Link:** kind <CONNECTOR / VECTOR / none> · color · weight · line type · endpoints (which node, which magnet)
- **Placement:** flow band vs permutation band · parent = <SECTION / PAGE> · what orders the boards
- **Board width:** the formula for choosing a column count that avoids overlapping neighbours

## Layout (school and conventions)
- **School:** <A / B / C / mixed — which is primary, what is mixed in>
- Canvas: <light/dark> · captions: <language(s) and format>
- Device variants: <separate cases / extra columns>
- Granularity: <per-field / per-screen / per-tab>
- Sub-group categories this project uses: <e.g. Input / Error Handling / Screen State>
- Shared boards, if any: <e.g. a Common Handling board holding server/timeout cases → individual screens must not duplicate them>

## Naming
- Board name pattern: <...> · how it follows the base screen's name / number · section band pattern: <...>

## Component → category (Phase 1, L2 detection)
| If instance.name / key matches | → category (pack in case-library) |
|---|---|
| `<pattern>` | `<pack>/*` |
> No match = flag as "unmapped", never guess. Keys are more precise than names — harvest them from the DS registry if there is one.

## Anchors (READ-ONLY)
- File `<fileKey>`: <board name> `<node-id>` (for harvesting and comparison) · always write tests to a scratch file, never a production one

## Tier-3 packs (project-specific — read off the captions on existing boards)
| Pack | ~cases | Notable business rules (⚠️ confirm values with the brief) |
|---|---|---|
| <pack> | <n> | <...> |

## Screen facts (business rules per screen — grown by Phase 3 trims)
> Phase 2 reads this FIRST: a case listed here for the current screen is pre-bucketed **⊘ with the stored reason** before anything is proposed. Phase 3 appends a row whenever the user trims a case as "impossible for this screen" (not "skip this time").
| Screen (name pattern) | Case (`caseId`) | Rule (why it can/can't happen) | Learned |
|---|---|---|---|
| `<pattern>` | `<caseId>` | <business reason> | <date> |

## Verify config (paste into `scripts/verify-board.js` CONFIG)
```js
labelStyle: "<strict|loose|indexed>",   // strict = `Case#N` exactly (renumber-compatible) · loose = `Case #N - name` · indexed = `1.2 | name`
slotSizes: ["<WxH>", ...],
titlesFullWidth: <true|false>,  // do group headers span the group's full width?
```
