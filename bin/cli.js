#!/usr/bin/env node
/**
 * rw-elements-tools CLI
 * 
 * Build tools for RapidWeaver element packs
 * 
 * Usage:
 *   rw-build <command> [options]
 * 
 * Commands:
 *   properties    Build properties.json files from properties.config.json
 *   hooks         Build hooks.js files from hooks.source.js
 *   all           Build both properties and hooks
 * 
 * Options:
 *   --packs <dir>    Override the packs directory
 *   --watch, -w      Watch for changes
 *   --help, -h       Show this help message
 *   --version, -v    Show version number
 */

import { fileURLToPath } from 'url';
import path from 'path';
import { resolveConfig } from '../config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageRoot = path.join(__dirname, '..');

/**
 * Parse command line arguments
 */
function parseArgs(args) {
  const result = {
    command: null,
    packs: null,
    watch: false,
    help: false,
    version: false,
    minify: true, // Minify by default
  };
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === '--help' || arg === '-h') {
      result.help = true;
    } else if (arg === '--version' || arg === '-v') {
      result.version = true;
    } else if (arg === '--watch' || arg === '-w') {
      result.watch = true;
    } else if (arg === '--no-minify') {
      result.minify = false;
    } else if (arg === '--packs') {
      result.packs = args[++i];
    } else if (arg.startsWith('--packs=')) {
      result.packs = arg.split('=')[1];
    } else if (!arg.startsWith('-') && !result.command) {
      result.command = arg;
    }
  }
  
  return result;
}

/**
 * Show help message
 */
function showHelp() {
  console.log(`
rw-elements-tools - Build tools for RapidWeaver element packs

Usage:
  rw-build <command> [options]

Commands:
  properties    Build properties.json files from properties.config.json
  hooks         Build hooks.js files from hooks.source.js
  all           Build both properties and hooks

Options:
  --packs <dir>    Override the packs directory (default: ./packs)
  --watch, -w      Watch for changes
  --no-minify      Disable minification (output is minified by default)
  --help, -h       Show this help message
  --version, -v    Show version number

Configuration:
  The packs directory can be configured via (in priority order):
  1. CLI argument: --packs ./my-elements
  2. Environment variable: RW_PACKS_DIR=./my-elements
  3. package.json: { "rw-elements-tools": { "packsDir": "./my-elements" } }
  4. Config file: rw-elements-tools.config.js
  5. Default: ./packs

Examples:
  rw-build all                          Build everything
  rw-build properties                   Build properties only
  rw-build hooks --watch                Build and watch hooks
  rw-build properties --watch           Build and watch properties
  rw-build all --watch                  Build and watch both hooks and properties
  rw-build all --packs ./my-elements    Build with custom packs directory
`);
}

/**
 * Show version
 */
async function showVersion() {
  try {
    const packageJsonPath = path.join(packageRoot, 'package.json');
    const { default: fs } = await import('fs');
    const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    console.log(`rw-elements-tools v${pkg.version}`);
  } catch {
    console.log('rw-elements-tools (version unknown)');
  }
}

/**
 * Run the properties build
 */
async function buildProperties(config, watch = false, minify = true) {
  console.log(`[rw-build] Building properties${watch ? ' (watch mode)' : ''}${minify ? '' : ' (no minify)'}...`);
  console.log(`[rw-build] Packs directory: ${config.packsDir}`);
  
  const buildConfig = { ...config, minify };
  const buildModule = await import('../build-properties.js');
  
  if (watch) {
    await buildModule.startWatch(buildConfig);
  } else {
    await buildModule.buildProperties(buildConfig);
  }
}

/**
 * Run the hooks build
 */
async function buildHooks(config, watch = false, minify = true) {
  console.log(`[rw-build] Building hooks${watch ? ' (watch mode)' : ''}${minify ? '' : ' (no minify)'}...`);
  console.log(`[rw-build] Packs directory: ${config.packsDir}`);
  
  const buildConfig = { ...config, minify };
  const buildModule = await import('../build-shared-hooks.js');
  
  if (watch) {
    await buildModule.startWatch(buildConfig);
  } else {
    await buildModule.buildAll(buildConfig);
  }
}

/**
 * Main entry point
 */
async function main() {
  const args = parseArgs(process.argv.slice(2));
  
  if (args.help) {
    showHelp();
    process.exit(0);
  }
  
  if (args.version) {
    await showVersion();
    process.exit(0);
  }
  
  if (!args.command) {
    console.error('Error: No command specified. Use --help for usage information.');
    process.exit(1);
  }
  
  // Resolve configuration
  const config = await resolveConfig({
    packs: args.packs,
  });
  
  try {
    switch (args.command) {
      case 'properties':
        await buildProperties(config, args.watch, args.minify);
        break;
        
      case 'hooks':
        await buildHooks(config, args.watch, args.minify);
        break;
        
      case 'all':
        if (args.watch) {
          // In watch mode, start both watchers concurrently
          // They will both run indefinitely, watching for changes
          await Promise.all([
            buildProperties(config, true, args.minify),
            buildHooks(config, true, args.minify),
          ]);
        } else {
          // One-time build: run sequentially
          await buildProperties(config, false, args.minify);
          await buildHooks(config, false, args.minify);
        }
        break;
        
      default:
        console.error(`Error: Unknown command '${args.command}'. Use --help for usage information.`);
        process.exit(1);
    }
  } catch (err) {
    console.error(`[rw-build] Build failed: ${err.message}`);
    if (process.env.DEBUG) {
      console.error(err.stack);
    }
    process.exit(1);
  }
}

main();

