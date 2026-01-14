#!/usr/bin/env node

/**
 * Documentation Publisher for rw-elements-tools
 *
 * Copies generated documentation from .docs-output/ to the external docs repository.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const OUTPUT_DIR = path.join(ROOT_DIR, '.docs-output');

// =============================================================================
// CONFIGURATION
// =============================================================================

/**
 * Resolve the docs repo path from various sources
 */
async function resolveConfig() {
  // 1. Environment variable (highest priority)
  if (process.env.RW_DOCS_REPO_PATH) {
    return {
      docsRepoPath: process.env.RW_DOCS_REPO_PATH,
      docsTargetDir: process.env.RW_DOCS_TARGET_DIR || 'development-resources/build-tools'
    };
  }

  // 2. package.json config
  const packageJsonPath = path.join(ROOT_DIR, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    if (packageJson['rw-elements-tools']) {
      const config = packageJson['rw-elements-tools'];
      if (config.docsRepoPath) {
        return {
          docsRepoPath: config.docsRepoPath,
          docsTargetDir: config.docsTargetDir || 'development-resources/build-tools'
        };
      }
    }
  }

  // 3. Config file
  const configPaths = [
    path.join(ROOT_DIR, 'rw-elements-tools.config.js'),
    path.join(ROOT_DIR, 'rw-elements-tools.config.mjs')
  ];

  for (const configPath of configPaths) {
    if (fs.existsSync(configPath)) {
      const config = await import(configPath);
      if (config.default?.docsRepoPath) {
        return {
          docsRepoPath: config.default.docsRepoPath,
          docsTargetDir: config.default.docsTargetDir || 'development-resources/build-tools'
        };
      }
    }
  }

  // 4. Default (try common locations)
  const defaultPaths = [
    path.join(path.dirname(ROOT_DIR), 'rapidweaver-elements-docs-api'),
    path.join(process.env.HOME || '', 'Developer', 'rapidweaver-elements-docs-api')
  ];

  for (const defaultPath of defaultPaths) {
    if (fs.existsSync(defaultPath)) {
      console.log(`📍 Found docs repo at: ${defaultPath}`);
      return {
        docsRepoPath: defaultPath,
        docsTargetDir: 'development-resources/build-tools'
      };
    }
  }

  return null;
}

// =============================================================================
// UTILITIES
// =============================================================================

/**
 * Recursively copy a directory
 */
function copyDir(src, dest) {
  if (!fs.existsSync(src)) {
    return;
  }

  fs.mkdirSync(dest, { recursive: true });

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      // Check if file exists and preserve DESCRIPTION markers
      if (fs.existsSync(destPath)) {
        const existingContent = fs.readFileSync(destPath, 'utf-8');
        const newContent = fs.readFileSync(srcPath, 'utf-8');

        // Preserve content between DESCRIPTION markers
        const descriptionMatch = existingContent.match(/<!-- DESCRIPTION_START -->([\s\S]*?)<!-- DESCRIPTION_END -->/);
        if (descriptionMatch && descriptionMatch[1].trim()) {
          const preservedDescription = descriptionMatch[0];
          const mergedContent = newContent.replace(
            /<!-- DESCRIPTION_START -->[\s\S]*?<!-- DESCRIPTION_END -->/,
            preservedDescription
          );
          fs.writeFileSync(destPath, mergedContent);
          continue;
        }
      }

      fs.copyFileSync(srcPath, destPath);
    }
  }
}

/**
 * Count files in a directory recursively
 */
function countFiles(dir) {
  if (!fs.existsSync(dir)) return 0;

  let count = 0;
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory()) {
      count += countFiles(path.join(dir, entry.name));
    } else if (entry.name.endsWith('.md')) {
      count++;
    }
  }

  return count;
}

/**
 * Merge SUMMARY-FRAGMENT.md into the main SUMMARY.md
 * Replaces the Build Tools section with the full navigation structure
 */
function mergeSummaryFragment(docsRepoPath, fragmentPath) {
  const summaryPath = path.join(docsRepoPath, 'SUMMARY.md');

  if (!fs.existsSync(summaryPath)) {
    console.log('   ⚠️  SUMMARY.md not found, skipping merge');
    return false;
  }

  if (!fs.existsSync(fragmentPath)) {
    console.log('   ⚠️  SUMMARY-FRAGMENT.md not found, skipping merge');
    return false;
  }

  const summaryContent = fs.readFileSync(summaryPath, 'utf-8');
  const fragmentContent = fs.readFileSync(fragmentPath, 'utf-8');

  // Remove the "## Build Tools" header from fragment - we just want the list items
  const fragmentItems = fragmentContent
    .replace(/^## Build Tools\n+/, '')
    .trim();

  // Find the Build Tools entry in SUMMARY.md
  const lines = summaryContent.split('\n');
  let buildToolsStartIndex = -1;
  let buildToolsEndIndex = -1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Find the start: "* [Build Tools]" (with possible leading spaces)
    if (buildToolsStartIndex === -1 && line.match(/^\* \[Build Tools\]/)) {
      buildToolsStartIndex = i;
      continue;
    }

    // Find the end: next line that starts with "* [" at the same level (no indentation)
    // or a section header "##"
    if (buildToolsStartIndex !== -1 && buildToolsEndIndex === -1) {
      if ((line.match(/^\* \[/) && !line.match(/^\* \[Build Tools\]/)) || line.match(/^##/)) {
        buildToolsEndIndex = i;
        break;
      }
    }
  }

  // If we didn't find the end, it goes to the end of the section
  if (buildToolsStartIndex !== -1 && buildToolsEndIndex === -1) {
    // Find the next ## section or end of file
    for (let i = buildToolsStartIndex + 1; i < lines.length; i++) {
      if (lines[i].match(/^##/)) {
        buildToolsEndIndex = i;
        break;
      }
    }
    if (buildToolsEndIndex === -1) {
      buildToolsEndIndex = lines.length;
    }
  }

  if (buildToolsStartIndex === -1) {
    console.log('   ⚠️  Could not find Build Tools entry in SUMMARY.md');
    return false;
  }

  // Build the new content
  const beforeBuildTools = lines.slice(0, buildToolsStartIndex).join('\n');
  const afterBuildTools = lines.slice(buildToolsEndIndex).join('\n');

  const newSummary = beforeBuildTools + '\n' + fragmentItems + '\n' + afterBuildTools;

  fs.writeFileSync(summaryPath, newSummary);
  return true;
}

// =============================================================================
// MAIN
// =============================================================================

async function main() {
  console.log('📤 Publishing documentation...\n');

  // Check if docs have been generated
  if (!fs.existsSync(OUTPUT_DIR)) {
    console.error('❌ No generated documentation found.');
    console.error('   Run "npm run docs:generate" first.');
    process.exit(1);
  }

  // Resolve configuration
  const config = await resolveConfig();

  if (!config) {
    console.error('❌ Could not find docs repository path.');
    console.error('\nConfigure the path in one of these ways:\n');
    console.error('1. Set environment variable:');
    console.error('   export RW_DOCS_REPO_PATH="/path/to/rapidweaver-elements-docs-api"\n');
    console.error('2. Add to package.json:');
    console.error('   "rw-elements-tools": {');
    console.error('     "docsRepoPath": "/path/to/rapidweaver-elements-docs-api"');
    console.error('   }\n');
    console.error('3. Create rw-elements-tools.config.js:');
    console.error('   export default {');
    console.error('     docsRepoPath: "/path/to/rapidweaver-elements-docs-api"');
    console.error('   }');
    process.exit(1);
  }

  const { docsRepoPath, docsTargetDir } = config;
  const targetPath = path.join(docsRepoPath, docsTargetDir);

  console.log(`📂 Source: ${OUTPUT_DIR}`);
  console.log(`📂 Target: ${targetPath}\n`);

  // Verify docs repo exists
  if (!fs.existsSync(docsRepoPath)) {
    console.error(`❌ Docs repository not found at: ${docsRepoPath}`);
    process.exit(1);
  }

  // Check if we need to migrate build-tools.md to build-tools/README.md
  const oldBuildToolsPath = path.join(docsRepoPath, 'development-resources', 'build-tools.md');
  const newBuildToolsDir = path.join(docsRepoPath, 'development-resources', 'build-tools');

  if (fs.existsSync(oldBuildToolsPath) && !fs.existsSync(newBuildToolsDir)) {
    console.log('🔄 Migrating build-tools.md to build-tools/README.md...');
    fs.mkdirSync(newBuildToolsDir, { recursive: true });

    // Read existing content
    const existingContent = fs.readFileSync(oldBuildToolsPath, 'utf-8');

    // Write as README.md in the new folder
    fs.writeFileSync(path.join(newBuildToolsDir, 'README.md'), existingContent);

    // Remove old file
    fs.unlinkSync(oldBuildToolsPath);

    console.log('   ✓ Migrated successfully\n');
  }

  // Count files before copy
  const fileCount = countFiles(OUTPUT_DIR);

  // Copy controls
  console.log('📁 Copying controls...');
  copyDir(
    path.join(OUTPUT_DIR, 'controls'),
    path.join(targetPath, 'controls')
  );

  // Copy properties
  console.log('📁 Copying properties...');
  copyDir(
    path.join(OUTPUT_DIR, 'properties'),
    path.join(targetPath, 'properties')
  );

  // Copy shared hooks
  console.log('📁 Copying shared-hooks...');
  copyDir(
    path.join(OUTPUT_DIR, 'shared-hooks'),
    path.join(targetPath, 'shared-hooks')
  );

  // Copy main README (but preserve the existing overview if it has custom content)
  const mainReadmePath = path.join(targetPath, 'README.md');
  const existingReadme = fs.existsSync(mainReadmePath) ? fs.readFileSync(mainReadmePath, 'utf-8') : '';

  // Only overwrite if it's the default GitBook content or doesn't exist
  if (!existingReadme || existingReadme.includes('For more detailed information about this package')) {
    // Keep existing overview, append API reference links
    const newReadme = fs.readFileSync(path.join(OUTPUT_DIR, 'README.md'), 'utf-8');

    // If there's existing content, prepend it
    if (existingReadme && existingReadme.trim()) {
      // Keep the existing content as the overview, add API reference section
      const combined = existingReadme + '\n\n---\n\n' + newReadme.split('## Quick Links')[1];
      fs.writeFileSync(mainReadmePath, combined);
    } else {
      fs.writeFileSync(mainReadmePath, newReadme);
    }
  }

  // Copy SUMMARY fragment and merge into main SUMMARY.md
  const summaryFragmentSrc = path.join(OUTPUT_DIR, 'SUMMARY-FRAGMENT.md');
  const summaryFragmentDest = path.join(targetPath, 'SUMMARY-FRAGMENT.md');
  if (fs.existsSync(summaryFragmentSrc)) {
    fs.copyFileSync(summaryFragmentSrc, summaryFragmentDest);

    // Merge fragment into main SUMMARY.md
    console.log('\n📋 Updating SUMMARY.md...');
    const merged = mergeSummaryFragment(docsRepoPath, summaryFragmentSrc);
    if (merged) {
      console.log('   ✓ SUMMARY.md updated with Build Tools navigation');
    }
  }

  console.log(`\n✅ Published ${fileCount} documentation files!`);
  console.log(`\n📌 Next steps:`);
  console.log(`   1. cd ${docsRepoPath}`);
  console.log(`   2. Review changes: git status`);
  console.log(`   3. Commit: git add . && git commit -m "Update build tools API reference"`);
  console.log(`   4. Push: git push`);
  console.log(`\n   GitBook will automatically sync the changes.`);
}

main().catch(err => {
  console.error('❌ Error publishing documentation:', err);
  process.exit(1);
});
