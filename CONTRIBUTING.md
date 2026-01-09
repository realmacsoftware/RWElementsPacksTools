# Contributing to rw-element-tools

Thank you for your interest in contributing to rw-element-tools! This guide will help you get started.

## Getting Started

1. **Fork the repository**
2. **Clone your fork**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/RWElementsPacksTools.git
   cd RWElementsPacksTools
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```

## Project Structure

```
rw-element-tools/
├── bin/cli.js           # CLI entry point
├── build-properties.js  # Properties build script
├── build-shared-hooks.js # Shared hooks build script
├── config.js            # Configuration resolver
├── index.js             # Package entry point
├── controls/            # Reusable UI control definitions
├── properties/          # Reusable property value definitions
└── shared-hooks/        # Shared JavaScript hook functions
    ├── animations/      # Animation and reveal functions
    ├── background/      # Background processing
    ├── borders/         # Border and outline functions
    ├── core/            # Essential utilities
    ├── effects/         # Visual effects
    ├── interactive/     # Link and filter functions
    ├── layout/          # Layout and positioning
    ├── navigation/      # Navigation component styles
    ├── sizing/          # Dimensions and aspect ratios
    ├── spacing/         # Margin and padding
    ├── transforms/      # CSS transform functions
    ├── transitions/     # CSS and Alpine transitions
    └── typography/      # Text and font styles
```

## Adding New Controls

1. **Create the control file** in the appropriate `controls/` subdirectory:

   ```javascript
   // controls/Effects/MyControl.js
   import { BaseControl } from '../core/BaseControl.js';

   export default {
       title: "My Control",
       properties: [
           {
               id: "myProperty",
               title: "My Property",
               type: "string",
               defaultValue: "default"
           }
       ]
   };
   ```

2. **Export from index.js**:
   
   Add your export to `controls/index.js`.

3. **Test the control** by using it in a component's `properties.config.json`.

## Adding New Properties

1. **Create the property file** in `properties/`:

   ```javascript
   // properties/MyProperty.js
   export default {
       value1: "Value 1",
       value2: "Value 2",
       value3: "Value 3"
   };
   ```

2. **Export from index.js**:
   
   Add your export to `properties/index.js`.

## Adding Shared Hooks

1. **Create the hook file** in the appropriate `shared-hooks/` subfolder:

   ```javascript
   // shared-hooks/effects/myHelper.js
   const myHelper = (rw) => {
       const { myProp } = rw.props;
       return classnames([myProp]).toString();
   };
   ```

2. **Use in component hooks**:

   Reference the function in any `hooks.source.js` - no import needed.

3. **Test the build**:
   ```bash
   cd /path/to/your/elements-pack
   npx rw-build hooks
   ```

### Naming Conventions

- **Folder organization**: Place files in the appropriate category folder
- **Prefix with `global`**: For element property processing functions
- **Match file and function names**: File name should match the exported function name

## Code Style

- Use ES modules (`export`/`import`) for controls and properties
- Use CommonJS (`exports`) for shared hooks (they're concatenated, not bundled)
- Use descriptive function and variable names
- Add JSDoc comments for public functions

## Testing Changes

1. **Test properties build**:
   ```bash
   npx rw-build properties
   ```

2. **Test hooks build**:
   ```bash
   npx rw-build hooks
   ```

3. **Test watch mode**:
   ```bash
   npx rw-build all --watch
   ```

## Submitting Changes

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/my-new-feature
   ```

2. **Make your changes** and commit with clear messages:
   ```bash
   git commit -m "feat: add new control for X"
   ```

3. **Push to your fork**:
   ```bash
   git push origin feature/my-new-feature
   ```

4. **Open a Pull Request** with a clear description of your changes.

## Commit Message Format

We follow conventional commits:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `refactor:` - Code refactoring
- `chore:` - Maintenance tasks

## Questions?

If you have questions or need help, please open an issue on GitHub.

