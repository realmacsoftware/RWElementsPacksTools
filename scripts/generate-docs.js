#!/usr/bin/env node

/**
 * Documentation Generator for rw-elements-tools
 *
 * Generates GitBook-compatible Markdown documentation for:
 * - Controls (globalControl references)
 * - Properties (use references)
 * - Shared Hooks (utility functions)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const OUTPUT_DIR = path.join(ROOT_DIR, '.docs-output');

// =============================================================================
// UTILITIES
// =============================================================================

/**
 * Convert PascalCase to kebab-case for file names
 */
function toKebabCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();
}

/**
 * Convert kebab-case or UPPERCASE to Title Case for display
 */
function toTitleCase(str) {
  // If string has hyphens (kebab-case), split by hyphens
  if (str.includes('-')) {
    return str
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
  // Otherwise split by spaces/ampersand and convert to proper case
  return str
    .split(/(\s+|&)/)
    .map(part => {
      if (part === '&' || /^\s+$/.test(part)) return part;
      return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
    })
    .join('');
}

/**
 * Ensure directory exists
 */
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * Write file with directory creation
 */
function writeFile(filePath, content) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`  ✓ ${path.relative(OUTPUT_DIR, filePath)}`);
}

/**
 * Extract description from JSDoc comment if present
 */
function extractJSDocDescription(content) {
  const jsdocMatch = content.match(/\/\*\*[\s\S]*?\*\//);
  if (jsdocMatch) {
    const lines = jsdocMatch[0]
      .split('\n')
      .map(line => line.replace(/^\s*\*\s?/, '').trim())
      .filter(line => line && !line.startsWith('@') && !line.startsWith('/*') && !line.startsWith('*/'));
    return lines.join(' ').trim();
  }
  return null;
}

// =============================================================================
// CONTROL PARSING
// =============================================================================

/**
 * Parse the controls index to get all exported controls
 */
function parseControlsIndex() {
  const indexPath = path.join(ROOT_DIR, 'controls', 'index.js');
  const content = fs.readFileSync(indexPath, 'utf-8');

  const controls = [];
  const categories = {};
  let currentCategory = null;

  const lines = content.split('\n');

  for (const line of lines) {
    // Check for category comments
    const categoryMatch = line.match(/\/\/\s*=+\s*\n?\/\/\s*(.+?)\s*\n?\/\/\s*=+/);
    if (line.includes('// ===')) {
      // Look ahead for category name
      continue;
    }

    const catNameMatch = line.match(/\/\/\s*([A-Z][A-Z\s&()]+)\s*$/);
    if (catNameMatch && !line.includes('export')) {
      currentCategory = catNameMatch[1].trim();
      if (!categories[currentCategory]) {
        categories[currentCategory] = [];
      }
      continue;
    }

    // Parse export statements
    const exportMatch = line.match(/export\s*{\s*(?:default\s+as\s+)?(\w+)(?:\s*,\s*(\w+))?\s*}\s*from\s*["']\.\/([^"']+)["']/);
    if (exportMatch) {
      const [, name1, name2, filePath] = exportMatch;
      const category = currentCategory || 'Uncategorized';

      // Extract folder from path (e.g., "alignment/AlignContent.js" -> "alignment")
      const folder = path.dirname(filePath);

      controls.push({
        name: name1,
        filePath: `controls/${filePath}`,
        category,
        folder: folder !== '.' ? folder : category.toLowerCase()
      });

      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(name1);

      // Handle named exports (e.g., AlignItemsBasic)
      if (name2) {
        controls.push({
          name: name2,
          filePath: `controls/${filePath}`,
          category,
          folder: folder !== '.' ? folder : category.toLowerCase(),
          isNamedExport: true
        });
        categories[category].push(name2);
      }
    }
  }

  return { controls, categories };
}

/**
 * Parse a control file to extract its structure
 */
function parseControlFile(controlName, filePath) {
  const fullPath = path.join(ROOT_DIR, filePath);
  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const content = fs.readFileSync(fullPath, 'utf-8');
  const description = extractJSDocDescription(content);

  // Try to extract the control definition
  const info = {
    name: controlName,
    description,
    properties: [],
    nestedControls: [],
    isArray: false
  };

  // Check if it's an array or object
  if (content.match(/const\s+\w+\s*=\s*\[/)) {
    info.isArray = true;
  }

  // Extract ID
  const idMatch = content.match(/id:\s*["']([^"']+)["']/);
  if (idMatch) {
    info.id = idMatch[1];
  }

  // Extract format
  const formatMatch = content.match(/format:\s*["']([^"']+)["']/);
  if (formatMatch) {
    info.format = formatMatch[1];
  }

  // Extract title
  const titleMatch = content.match(/title:\s*["']([^"']+)["']/);
  if (titleMatch) {
    info.title = titleMatch[1];
  }

  // Find UI element type
  const uiTypes = ['select', 'segmented', 'switch', 'slider', 'number', 'text', 'textArea',
    'link', 'resource', 'heading', 'divider', 'information',
    'themeColor', 'themeSpacing', 'themeBorderRadius', 'themeBorderWidth',
    'themeShadow', 'themeFont', 'themeTextStyle'];

  for (const uiType of uiTypes) {
    const regex = new RegExp(`${uiType}:\\s*{`);
    if (regex.test(content)) {
      info.uiType = uiType;
      break;
    }
  }

  // Extract nested globalControls
  const globalControlMatches = content.matchAll(/globalControl:\s*["']([^"']+)["']/g);
  for (const match of globalControlMatches) {
    info.nestedControls.push(match[1]);
  }

  // Extract default value
  const defaultMatch = content.match(/default:\s*["']([^"']+)["']/);
  if (defaultMatch) {
    info.default = defaultMatch[1];
  }

  return info;
}

// =============================================================================
// PROPERTIES PARSING
// =============================================================================

/**
 * Parse the properties index to get all exported properties
 */
function parsePropertiesIndex() {
  const indexPath = path.join(ROOT_DIR, 'properties', 'index.js');
  const content = fs.readFileSync(indexPath, 'utf-8');

  const properties = [];
  const exportMatches = content.matchAll(/export\s*{\s*default\s+as\s+(\w+)\s*}\s*from\s*["']\.\/([^"']+)["']/g);

  for (const match of exportMatches) {
    properties.push({
      name: match[1],
      filePath: `properties/${match[2]}`
    });
  }

  return properties;
}

/**
 * Parse a property file to extract its values
 */
function parsePropertyFile(propertyName, filePath) {
  const fullPath = path.join(ROOT_DIR, filePath);
  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const content = fs.readFileSync(fullPath, 'utf-8');
  const description = extractJSDocDescription(content);

  const info = {
    name: propertyName,
    description,
    items: [],
    default: null
  };

  // Extract default
  const defaultMatch = content.match(/default:\s*["']([^"']+)["']/);
  if (defaultMatch) {
    info.default = defaultMatch[1];
  }

  // Extract items
  const itemMatches = content.matchAll(/{\s*(?:value:\s*["']([^"']+)["']\s*,\s*)?title:\s*["']([^"']+)["'](?:\s*,\s*value:\s*["']([^"']+)["'])?\s*}/g);
  for (const match of itemMatches) {
    const value = match[1] || match[3];
    const title = match[2];
    if (value && title) {
      info.items.push({ value, title });
    }
  }

  return info;
}

// =============================================================================
// SHARED HOOKS PARSING
// =============================================================================

/**
 * Parse all shared hooks from the shared-hooks directory
 */
function parseSharedHooks() {
  const hooksDir = path.join(ROOT_DIR, 'shared-hooks');
  const hooks = [];
  const categories = {};

  const folders = fs.readdirSync(hooksDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  for (const folder of folders) {
    const folderPath = path.join(hooksDir, folder);
    const files = fs.readdirSync(folderPath)
      .filter(file => file.endsWith('.js'));

    if (!categories[folder]) {
      categories[folder] = [];
    }

    for (const file of files) {
      const filePath = path.join(folderPath, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const description = extractJSDocDescription(content);

      // Extract function names
      const funcMatches = content.matchAll(/(?:const|function)\s+(\w+)\s*=?\s*(?:\([^)]*\)|function\s*\([^)]*\))\s*(?:=>)?\s*{/g);

      for (const match of funcMatches) {
        const funcName = match[1];

        // Extract parameters
        const paramMatch = content.match(new RegExp(`(?:const|function)\\s+${funcName}\\s*=?\\s*\\(([^)]*)\\)`));
        const params = paramMatch ? paramMatch[1].trim() : '';

        hooks.push({
          name: funcName,
          params,
          filePath: `shared-hooks/${folder}/${file}`,
          category: folder,
          description
        });

        categories[folder].push(funcName);
      }
    }
  }

  return { hooks, categories };
}

// =============================================================================
// MARKDOWN GENERATION
// =============================================================================

/**
 * Generate the main README for the build tools section
 */
function generateMainReadme() {
  return `---
description: API Reference for rw-elements-tools - the build toolkit for RapidWeaver Elements
---

# Build Tools API Reference

This section documents all the reusable controls, properties, and shared hooks available in the \`rw-elements-tools\` package.

## Quick Links

| Section | Description | Count |
|---------|-------------|-------|
| [Controls](controls/README.md) | UI control definitions for \`properties.config.json\` | 90+ |
| [Properties](properties/README.md) | Reusable value definitions (\`use\` references) | 13 |
| [Shared Hooks](shared-hooks/README.md) | JavaScript utility functions for \`hooks.source.js\` | 35+ |

## Installation

\`\`\`bash
npm install --save-dev rw-elements-tools
\`\`\`

## Usage Overview

### Controls in properties.config.json

\`\`\`json
{
  "globalControl": "Spacing"
}
\`\`\`

### Properties in controls

\`\`\`json
{
  "select": {
    "use": "FontWeight"
  }
}
\`\`\`

### Shared Hooks in hooks.source.js

\`\`\`javascript
function transformHook(rw) {
    const classes = classnames()
        .add(globalSpacing(rw))
        .add(globalBackground(rw))
        .toString();

    return { classes };
}
\`\`\`

For installation details and full documentation, see the [main documentation](../build-tools.md) or visit [NPM](https://www.npmjs.com/package/rw-elements-tools).
`;
}

/**
 * Generate controls overview README
 */
function generateControlsReadme(categories) {
  let content = `---
description: Reusable UI control definitions for properties.config.json
---

# Controls

Use these in your \`properties.config.json\` with \`"globalControl": "Name"\`.

`;

  // Sort categories
  const sortedCategories = Object.keys(categories).sort();

  for (const category of sortedCategories) {
    const controls = categories[category];
    if (!controls || controls.length === 0) continue;

    const categorySlug = toKebabCase(category.replace(/[()]/g, '').replace(/\s*&\s*/g, '-and-').trim());
    content += `## ${toTitleCase(category)}\n\n`;
    content += `| globalControl | Description |\n`;
    content += `|---------------|-------------|\n`;

    for (const controlName of controls.sort()) {
      const link = `[${controlName}](${categorySlug}/${toKebabCase(controlName)}.md)`;
      content += `| \`${controlName}\` | ${link} |\n`;
    }

    content += `\n`;
  }

  content += `## Quick Usage

\`\`\`json
{
  "globalControl": "Spacing"
}
\`\`\`

With overrides:

\`\`\`json
{
  "globalControl": "BackgroundColor",
  "themeColor": {
    "default": {
      "name": "brand",
      "shade": 500
    }
  }
}
\`\`\`
`;

  return content;
}

/**
 * Generate a category README for controls
 */
function generateControlCategoryReadme(category, controls) {
  const categoryTitle = toTitleCase(category);

  let content = `---
description: ${categoryTitle} controls for properties.config.json
---

# ${categoryTitle}

| globalControl | Description |
|---------------|-------------|
`;

  for (const control of controls.sort()) {
    content += `| \`${control}\` | [View details](${toKebabCase(control)}.md) |\n`;
  }

  content += `
## Usage

\`\`\`json
{
  "globalControl": "${controls[0]}"
}
\`\`\`
`;

  return content;
}

/**
 * Generate an individual control page
 */
function generateControlPage(control, info) {
  let content = `---
description: ${info.description || `${control} control for properties.config.json`}
---

# ${control}

${info.description || `Add ${info.title || control} to your element.`}

## Usage

\`\`\`json
{
  "globalControl": "${control}"
}
\`\`\`
`;

  // Properties table
  const props = [];
  if (info.id) props.push(['id', 'string', `\`${info.id}\``]);
  if (info.format) props.push(['format', 'string', `\`${info.format}\``]);
  if (info.uiType) props.push(['UI Type', 'string', `\`${info.uiType}\``]);
  if (info.default) props.push(['default', 'string', `\`${info.default}\``]);

  if (props.length > 0) {
    content += `
## Properties

| Property | Type | Value |
|----------|------|-------|
`;
    for (const [prop, type, value] of props) {
      content += `| ${prop} | ${type} | ${value} |\n`;
    }
  }

  // Nested controls
  if (info.nestedControls && info.nestedControls.length > 0) {
    content += `
## Includes

This control includes the following nested controls:

`;
    for (const nested of info.nestedControls) {
      content += `- \`${nested}\`\n`;
    }
  }

  return content;
}

/**
 * Generate properties overview README
 */
function generatePropertiesReadme(properties) {
  let content = `---
description: Reusable value definitions for controls
---

# Properties

Use these in your controls with \`"use": "Name"\` to get pre-defined option lists.

| use | Description | Default |
|-----|-------------|---------|
`;

  for (const prop of properties) {
    const info = parsePropertyFile(prop.name, prop.filePath);
    const defaultVal = info?.default ? `\`${info.default}\`` : '-';
    content += `| \`${prop.name}\` | [View details](${toKebabCase(prop.name)}.md) | ${defaultVal} |\n`;
  }

  content += `
## Usage

\`\`\`json
{
  "title": "Weight",
  "id": "fontWeight",
  "select": {
    "use": "FontWeight"
  }
}
\`\`\`

The property's \`items\` and \`default\` will be merged into your control definition.
`;

  return content;
}

/**
 * Generate an individual property page
 */
function generatePropertyPage(property, info) {
  let content = `---
description: ${info.description || `${property} property values`}
---

# ${property}

${info.description || `Pre-defined values for ${property}.`}

## Usage

\`\`\`json
{
  "select": {
    "use": "${property}"
  }
}
\`\`\`
`;

  if (info.default) {
    content += `
## Default

\`${info.default}\`
`;
  }

  if (info.items && info.items.length > 0) {
    content += `
## Values

| Value | Title |
|-------|-------|
`;
    for (const item of info.items) {
      content += `| \`${item.value}\` | ${item.title} |\n`;
    }
  }

  return content;
}

/**
 * Generate shared hooks overview README
 */
function generateSharedHooksReadme(categories) {
  let content = `---
description: JavaScript utility functions for hooks.source.js
---

# Shared Hooks

Call these functions in your \`hooks.source.js\`. No imports needed - they're automatically available.

`;

  const sortedCategories = Object.keys(categories).sort();

  for (const category of sortedCategories) {
    const hooks = categories[category];
    if (!hooks || hooks.length === 0) continue;

    content += `## ${toTitleCase(category)}\n\n`;
    content += `| Function | Description |\n`;
    content += `|----------|-------------|\n`;

    for (const hookName of [...new Set(hooks)].sort()) {
      const link = `[Details](${category}/${toKebabCase(hookName)}.md)`;
      content += `| \`${hookName}()\` | ${link} |\n`;
    }

    content += `\n`;
  }

  content += `## Quick Usage

\`\`\`javascript
function transformHook(rw) {
    const classes = classnames()
        .add(globalSpacing(rw))
        .add(globalBackground(rw))
        .toString();

    return { classes };
}

exports.transformHook = transformHook;
\`\`\`
`;

  return content;
}

/**
 * Generate a category README for shared hooks
 */
function generateHookCategoryReadme(category, hooks) {
  const categoryTitle = toTitleCase(category);
  const uniqueHooks = [...new Set(hooks)];

  let content = `---
description: ${categoryTitle} utility functions
---

# ${categoryTitle}

| Function | Description |
|----------|-------------|
`;

  for (const hook of uniqueHooks.sort()) {
    content += `| \`${hook}()\` | [View details](${toKebabCase(hook)}.md) |\n`;
  }

  return content;
}

/**
 * Generate an individual hook page
 */
function generateHookPage(hook) {
  let content = `---
description: ${hook.description || `${hook.name} utility function`}
---

# ${hook.name}

${hook.description || `Utility function for ${hook.category}.`}

## Signature

\`\`\`javascript
${hook.name}(${hook.params})
\`\`\`
`;

  if (hook.params) {
    content += `
## Parameters

| Parameter | Description |
|-----------|-------------|
`;
    const params = hook.params.split(',').map(p => p.trim()).filter(Boolean);
    for (const param of params) {
      const paramName = param.split('=')[0].trim();
      content += `| \`${paramName}\` | - |\n`;
    }
  }

  content += `
## Usage

${generateHookUsageExample(hook)}
`;

  return content;
}

/**
 * Generate a realistic usage example for a shared hook
 */
function generateHookUsageExample(hook) {
  const name = hook.name;
  const param = hook.params.includes('rw') || hook.params.includes('app') ? 'rw' : '';

  // Hooks that return objects with specific properties
  const objectHooks = {
    globalAnimations: `\`\`\`javascript
const transformHook = (rw) => {
    const animation = globalAnimations(rw);
    // animation.isEnabled, animation.data, etc.
};
\`\`\``,
    globalReveal: `\`\`\`javascript
const transformHook = (rw) => {
    const revealAttrs = globalReveal(rw);
    // Returns data attributes for reveal animations
};
\`\`\``,
    globalLink: `\`\`\`javascript
const transformHook = (rw) => {
    const link = globalLink(rw);
    // link.hasLink, link.args
};
\`\`\``,
    globalFilter: `\`\`\`javascript
const transformHook = (rw) => {
    const filter = globalFilter(rw);
    // filter.wantsFilter, filter.args
};
\`\`\``,
    globalBgImageFetchPriority: `\`\`\`javascript
const transformHook = (rw) => {
    const priority = globalBgImageFetchPriority(rw);
    // priority.globalBgImageFetchPriorityEnabled
};
\`\`\``
  };

  if (objectHooks[name]) {
    return objectHooks[name];
  }

  // Default: hooks that return CSS class strings
  return `\`\`\`javascript
const transformHook = (rw) => {
    const classes = ${name}(${param});
};
\`\`\``;
}

/**
 * Generate SUMMARY fragment for GitBook navigation
 */
function generateSummaryFragment(controlCategories, properties, hookCategories) {
  let content = `## Build Tools

* [Build Tools](development-resources/build-tools/README.md)
  * [Controls](development-resources/build-tools/controls/README.md)
`;

  // Controls categories
  const sortedControlCategories = Object.keys(controlCategories).sort();
  for (const category of sortedControlCategories) {
    const controls = controlCategories[category];
    if (!controls || controls.length === 0) continue;

    const categorySlug = toKebabCase(category.replace(/[()]/g, '').replace(/\s*&\s*/g, '-and-').trim());
    content += `    * [${toTitleCase(category)}](development-resources/build-tools/controls/${categorySlug}/README.md)\n`;

    for (const control of controls.sort()) {
      content += `      * [${control}](development-resources/build-tools/controls/${categorySlug}/${toKebabCase(control)}.md)\n`;
    }
  }

  content += `  * [Properties](development-resources/build-tools/properties/README.md)\n`;

  for (const prop of properties) {
    content += `    * [${prop.name}](development-resources/build-tools/properties/${toKebabCase(prop.name)}.md)\n`;
  }

  content += `  * [Shared Hooks](development-resources/build-tools/shared-hooks/README.md)\n`;

  const sortedHookCategories = Object.keys(hookCategories).sort();
  for (const category of sortedHookCategories) {
    const hooks = hookCategories[category];
    if (!hooks || hooks.length === 0) continue;

    const uniqueHooks = [...new Set(hooks)];
    content += `    * [${toTitleCase(category)}](development-resources/build-tools/shared-hooks/${category}/README.md)\n`;

    for (const hook of uniqueHooks.sort()) {
      content += `      * [${hook}](development-resources/build-tools/shared-hooks/${category}/${toKebabCase(hook)}.md)\n`;
    }
  }

  return content;
}

// =============================================================================
// MAIN
// =============================================================================

async function main() {
  console.log('🚀 Generating documentation...\n');

  // Clean output directory
  if (fs.existsSync(OUTPUT_DIR)) {
    fs.rmSync(OUTPUT_DIR, { recursive: true });
  }
  ensureDir(OUTPUT_DIR);

  // Parse all sources
  console.log('📖 Parsing controls...');
  const { controls, categories: controlCategories } = parseControlsIndex();
  console.log(`   Found ${controls.length} controls in ${Object.keys(controlCategories).length} categories\n`);

  console.log('📖 Parsing properties...');
  const properties = parsePropertiesIndex();
  console.log(`   Found ${properties.length} properties\n`);

  console.log('📖 Parsing shared hooks...');
  const { hooks, categories: hookCategories } = parseSharedHooks();
  console.log(`   Found ${hooks.length} hooks in ${Object.keys(hookCategories).length} categories\n`);

  // Generate main README
  console.log('📝 Generating documentation files...\n');
  writeFile(path.join(OUTPUT_DIR, 'README.md'), generateMainReadme());

  // Generate controls
  console.log('\n📁 Controls:');
  writeFile(path.join(OUTPUT_DIR, 'controls', 'README.md'), generateControlsReadme(controlCategories));

  for (const category of Object.keys(controlCategories)) {
    const categorySlug = toKebabCase(category.replace(/[()]/g, '').replace(/\s*&\s*/g, '-and-').trim());
    const categoryDir = path.join(OUTPUT_DIR, 'controls', categorySlug);

    // Category README
    writeFile(
      path.join(categoryDir, 'README.md'),
      generateControlCategoryReadme(category, controlCategories[category])
    );

    // Individual control pages
    for (const controlName of controlCategories[category]) {
      const control = controls.find(c => c.name === controlName);
      if (control) {
        const info = parseControlFile(controlName, control.filePath);
        if (info) {
          writeFile(
            path.join(categoryDir, `${toKebabCase(controlName)}.md`),
            generateControlPage(controlName, info)
          );
        }
      }
    }
  }

  // Generate properties
  console.log('\n📁 Properties:');
  writeFile(path.join(OUTPUT_DIR, 'properties', 'README.md'), generatePropertiesReadme(properties));

  for (const prop of properties) {
    const info = parsePropertyFile(prop.name, prop.filePath);
    if (info) {
      writeFile(
        path.join(OUTPUT_DIR, 'properties', `${toKebabCase(prop.name)}.md`),
        generatePropertyPage(prop.name, info)
      );
    }
  }

  // Generate shared hooks
  console.log('\n📁 Shared Hooks:');
  writeFile(path.join(OUTPUT_DIR, 'shared-hooks', 'README.md'), generateSharedHooksReadme(hookCategories));

  for (const category of Object.keys(hookCategories)) {
    const categoryDir = path.join(OUTPUT_DIR, 'shared-hooks', category);
    const categoryHooks = hooks.filter(h => h.category === category);

    // Category README
    writeFile(
      path.join(categoryDir, 'README.md'),
      generateHookCategoryReadme(category, hookCategories[category])
    );

    // Individual hook pages
    const processedHooks = new Set();
    for (const hook of categoryHooks) {
      if (processedHooks.has(hook.name)) continue;
      processedHooks.add(hook.name);

      writeFile(
        path.join(categoryDir, `${toKebabCase(hook.name)}.md`),
        generateHookPage(hook)
      );
    }
  }

  // Generate SUMMARY fragment
  console.log('\n📋 SUMMARY fragment:');
  writeFile(
    path.join(OUTPUT_DIR, 'SUMMARY-FRAGMENT.md'),
    generateSummaryFragment(controlCategories, properties, hookCategories)
  );

  console.log('\n✅ Documentation generated successfully!');
  console.log(`   Output: ${OUTPUT_DIR}`);
  console.log('\n   Run "npm run docs:publish" to copy to the docs repo.');
}

main().catch(err => {
  console.error('❌ Error generating documentation:', err);
  process.exit(1);
});
