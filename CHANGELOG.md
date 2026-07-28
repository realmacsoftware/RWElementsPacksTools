# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed
- Responsive hover Scale emitted conflicting classes across devices (e.g. `md:hover:scale-x-[300%] hover:scale-y-[300%]` — the y class missing its breakpoint modifier). Root cause: Elements prepends responsive prefixes **once per formatted string**, so Scale's two-class format (`scale-x-[{{value}}%] scale-y-[{{value}}%]`, introduced in 1.4.0 for scale-z composability) only got the breakpoint prefix on its first class; the hover prefixer then faithfully prefixed the damaged input. The Scale control now emits a single `scale-x-[{{value}}%]` class per breakpoint and `globalTransforms.js` mirrors each scale-x class to a scale-y twin with all modifiers preserved — uniform scale still composes with scale-z, and every class carries the right breakpoint + state modifiers. Rebuild packs (`rw-build all`) so `properties.json` and `hooks.js` update together so only the first class of a multi-class end value got the state prefix — the rest leaked as unconditional classes that overrode the start state, differently per device. Scale's two-class format (`scale-x-… scale-y-…`) and any responsive end value (e.g. `blur-[2px] md:blur-[5px]`) were affected. `globalTransforms.js` and `globalTransforms3D.js` (active/focus branches) and `globalFilters.js` (hover, active, and focus branches) now route every end value through `addPrefixToTailwindClasses`, matching the `globalEffects.js` fix from 1.5.0 — third instance of the #7/#8 family. Affects `filterTags` (active), `filter` (focus), and every component using hover Filters
- `globalFilters.js` blur/backdrop-blur zero-gating now applies to the active and focus branches too, so a fully-zero blur no longer emits `data-[active=true]:blur-[0px]`-style classes that force `filter: blur(0px)` in those states
- `addPrefixToTailwindClasses` returns `""` for empty input instead of a stray `prefix:` token, and ignores extra whitespace between classes


## [1.6.0] - 2026-07-28

### Added
- Curated `transformOrigin` alias on `globalTransformOrigin` in `TransformOrigin.js` — the anchor point for scale/rotate/skew transforms, accepting the 9 `TransformOrigins` tokens (`center`, `top`, `top-right`, `right`, `bottom-right`, `bottom`, `bottom-left`, `left`, `top-left`)
- Widened `ai.visible` on the base Scale/Rotate/Translate/Skew embeddings in `Transforms.js` from `transforms == 'static'` to `transforms != 'none'`, so the start-state transform values are discoverable when a component is in hover mode
- Curated `ai` aliases across the remaining `controls/typography/` shared controls: `Typography` (`typography`), the underline fields in `TextFontsAndTextStyles` (`decorationStyle`/`decorationOffset`/`decorationColor`/`decorationOpacity`), `TextSimple` (`align`/`color`/`colorOpacity`/`family`/`size`), `TextStyles` (`weight`/`letterSpacing`/`lineHeight`), `TextDecoration` (`decoration`/`decorationThickness`/`decorationOffset`/`decorationStyle`/`decorationColor`), and `TextColorHover` (`colorHover`/`colorOpacityHover`)
- `rw-build audit` — AI property coverage audit shipped as a first-class CLI subcommand (`audit-ai-properties.js` at package root, added to `files`). Accepts `--packs <dir>` (repeatable), `--core-packs <dir>`, `--no-core-packs`, `--out-dir <dir>`; env overrides `RW_CORE_PACKS_DIR`, `RW_AUDIT_PACK_ROOTS`, `RW_AUDIT_OUT_DIR`; all three also configurable via `package.json` / `rw-elements-tools.config.js` (`auditCorePacks`, `auditPacks`, `auditOutDir`). Writes `AI-Audit-Index.md` + `AI-Audit-Report.md` + `Packs/AI-Audit-<PackName>.md`. Core packs default to `../RWElementsCorePack/packs` if it exists; additional roots default to the project's configured `packsDir` if it exists. Usage/Impact in the shared-controls table is computed over all resolved roots combined. Third-party packs repos can run the audit by passing their own `--packs` and `--out-dir` without the public tools repo knowing anything about their private paths.

## [1.5.1] - 2026-07-27

### Fixed
- **Tree shaking now actually runs.** `build-shared-hooks.js` documented dead code elimination since its first commit, but never enabled it: the build calls esbuild's `transform()` API, which only tree shakes by default when bundling or emitting `iife` — with `format: 'cjs'` and no explicit `treeShaking` flag it was off, so every component shipped all 42 shared hooks (~78 KB) whether it used them or not. The earlier `minifySyntax` pass was not DCE either; it simplifies expressions but never removes unreachable top-level declarations. `transform()` is now called with `treeShaking: true`, rooted at `exports.transformHook`. Across the 63 components in the pack repos this cuts total generated `hooks.js` from ~4540 KB to ~1158 KB (−74%); components with small sources shrink most (e.g. `reveal`, a 547-byte source, drops from 70 KB to 10 KB). Rebuild your packs with `rw-build hooks` to pick this up

### Changed
- Build output is no longer minified. `properties.json` is written with 2-space indentation and `hooks.js` keeps its original formatting (with the `// AUTO-GENERATED` banner always emitted), so generated files are readable, greppable, and produce meaningful git diffs. `hooks.js` is still wrapped as CommonJS and transpiled to es2018 — only the minification passes were dropped

### Removed
- `--no-minify` flag — nothing is minified any more, so the flag had no remaining purpose. Passing it is silently ignored rather than an error

## [1.5.0] - 2026-07-27

### Added
- Curated `ai` aliases for hover/End-state controls across Background, Borders, Effects, Filters, Transforms, and button/heading text color — components can now be styled for hover via MCP, not just their resting state
- `build-properties.js` supports `{{value}}` templating in an override's `ai.name` (e.g. `"{{value}}Hover"`), resolved against each sibling control's own existing alias so a single End/Hover block override can curate several leaf properties at once without alias collisions. Siblings with no existing alias (e.g. `themeShadow` controls) fall back to `ai: { exclude: true }` instead of emitting a half-resolved name
- Curated `ai` aliases for every `themeShadow` control (`BoxShadow`, `DropShadow`, and the text-shadow fields in `TextFontsAndTextStyles`, `InputFontAndTextStyles`, `ButtonFontAndTextStyles`, `MenuItem`), now that the MCP/Assistant integration supports the `themeShadow` domain end-to-end
- Broader MCP curation across gradients, overlays, outline, transforms/translate, sizing, layout/grid-flex, video/SVG backgrounds, Image custom-source and CMS fields, and background image alias vocabulary (`bg` / `bgImage` / position / size / repeat)
- `build-properties.js` merge helper for combining `ai` objects from a control and its overrides

### Changed
- Sizing AI aliases use `widthMode` / `heightMode` and `widthSize` / `heightSize` so models no longer write mode values like `full` into themeSize fields
- Background and overlay image AI descriptions tightened to say "resource ID"
- Removed example theme tokens from sizing property descriptions

### Fixed
- Hover box-shadow end classes were missing the `hover:` modifier (#7); `build-properties.js` now applies `{{value}}` format templates even when the leaf control has no base format
- Container hover border-width end classes were missing the hover modifier (#8)
- `globalEffects.js` end-state prefix handling: stops double-prefixed opacity, restores hover-group support, and avoids active/focus stacking onto a baked `hover:` prefix

## [1.4.2] - 2026-07-16

### Changed
- Resource controls now declare `accepts` / `excludes` filters: `Image` and background/overlay image controls accept raster images (`image/*`, excluding `.svg`); `Background_SVG` accepts `.svg` only; video controls accept `video/*`
- README documents resource `accepts` / `excludes` token grammar and override behaviour

## [1.4.0] - 2026-07-13

### Added
- New "Mouse" type for the `Transforms3D` control: 3D transforms track the cursor over the existing "Over" target, interpolating between the Start and End values (cursor X drives Rotate Y, cursor Y drives Rotate X, distance-from-centre drives Scale Z / Depth)
- `globalTransforms3D` mouse branch emits per-device CSS `calc()` mix classes driven by unitless `--rw-m3d-x/y/r` progress variables (raw values read from `responsiveProps`; responsive Start/End values supported)
- New shared hook `globalMouse3D.js` returning the `data-m3d-over` attribute consumed by the pack's `mouseTransforms3d.js` runtime
- Tests for the transforms3d hooks (`tests/transforms3d-hooks.test.js`)

## [1.2.1] - 2026-01-09

### Changed
- **BREAKING**: Package renamed from `rw-element-tools` to `rw-elements-tools`

### Fixed
- Default packs directory now resolves relative to current working directory instead of package location
- Updated documentation paths (removed incorrect `src/` references)

### Added
- Subfolder support for `shared-hooks/` directory
- LICENSE file (MIT)
- CHANGELOG.md
- CONTRIBUTING.md
- .npmignore for npm publish control
- New shared hook files split from multi-method files:
  - `getAlpineTransitionAttributesMobile.js`
  - `getAlpineTransitionAttributesDesktop.js`
  - `getHoverPrefix.js`
  - `injectPrefixOnDarkModeColors.js`
  - `globalSpacingPadding.js`
  - `globalSpacingMargin.js`
  - `objectClasses.js`

### Changed
- Reorganized 37 shared hook files into 13 logical subfolders:
  - `animations/` - Animation and reveal functions
  - `background/` - Background processing
  - `borders/` - Border and outline functions
  - `core/` - Essential utilities (classnames, etc.)
  - `effects/` - Visual effects (opacity, filters)
  - `interactive/` - Link and filter functions
  - `layout/` - Layout and positioning
  - `navigation/` - Navigation component styles
  - `sizing/` - Dimensions and aspect ratios
  - `spacing/` - Margin and padding
  - `transforms/` - CSS transform functions
  - `transitions/` - CSS and Alpine transitions
  - `typography/` - Text and font styles
- Renamed files to match exported function names:
  - `HTMLTag.js` → `globalHTMLTag.js`
  - `globalGridItem.js` → `globalActAsGridOrFlexItem.js`
  - `buttonFontsAndTextStyles.js` → `globalButtonFontAndTextStyles.js`
  - `textFontsAndTextStyles.js` → `globalTextFontsAndTextStyles.js`

### Removed
- 26 unused shared hook files (legacy/replaced code)

## [1.1.2] - 2026-01-08

### Changed
- Updated README with improved `transformHook` examples
- Fixed prop destructuring examples to use `rw.props`

## [1.1.1] - 2026-01-08

### Changed
- Enhanced Quick Start documentation for junior developers
- Added detailed project setup instructions
- Improved directory structure examples

## [1.1.0] - 2026-01-08

### Added
- Watch mode for properties build (`rw-build properties --watch`)
- Watch mode for hooks build (`rw-build hooks --watch`)
- Combined watch mode (`rw-build all --watch`)
- `watchProperties` and `watchHooks` exports for programmatic use

### Changed
- Updated CLI help message with watch examples
- Concurrent watchers run via `Promise.all` for `all --watch` command

## [1.0.1] - 2026-01-07

### Fixed
- Minor documentation fixes

## [1.0.0] - 2026-01-07

### Added
- Initial release
- CLI tool (`rw-build`) for building properties and hooks
- Properties build system with `properties.config.json` support
- Shared hooks build system with dead code elimination via esbuild
- Reusable controls library for RapidWeaver Elements
- Reusable properties definitions
- Configuration via CLI args, environment variables, package.json, or config file

