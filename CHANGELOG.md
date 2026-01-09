# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

