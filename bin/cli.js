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
    packs: null,      // single value for properties/hooks
    auditPacks: [],   // repeatable for audit
    corePacks: null,
    noCorePacks: false,
    outDir: null,
    watch: false,
    help: false,
    version: false,
  };
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === '--help' || arg === '-h') {
      result.help = true;
    } else if (arg === '--version' || arg === '-v') {
      result.version = true;
    } else if (arg === '--watch' || arg === '-w') {
      result.watch = true;
    } else if (arg === '--packs') {
      const val = args[++i];
      result.packs = val;        // last value wins for properties/hooks
      result.auditPacks.push(val); // all values accumulated for audit
    } else if (arg.startsWith('--packs=')) {
      const val = arg.split('=')[1];
      result.packs = val;
      result.auditPacks.push(val);
    } else if (arg === '--core-packs') {
      result.corePacks = args[++i];
    } else if (arg.startsWith('--core-packs=')) {
      result.corePacks = arg.split('=')[1];
    } else if (arg === '--no-core-packs') {
      result.noCorePacks = true;
    } else if (arg === '--out-dir') {
      result.outDir = args[++i];
    } else if (arg.startsWith('--out-dir=')) {
      result.outDir = arg.split('=')[1];
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
  audit         Run the AI property coverage audit across one or more pack directories

Options (properties / hooks / all):
  --packs <dir>    Override the packs directory (default: ./packs)
  --watch, -w      Watch for changes
  --help, -h       Show this help message
  --version, -v    Show version number

Options (audit):
  --packs <dir>        Additional packs directory (repeatable; each must contain *.elementsdevpack subdirs).
                       Defaults to the project's configured packsDir (./packs) if it exists.
  --core-packs <dir>   Core packs directory to fuse with shared controls in the main report.
                       Defaults to ../RWElementsCorePack/packs if it exists.
  --no-core-packs      Disable the default core-packs directory.
  --out-dir <dir>      Report output directory (default: ./audit/ai-block-coverage).
                       Override: env RW_AUDIT_OUT_DIR

Configuration:
  The packs directory can be configured via (in priority order):
  1. CLI argument: --packs ./my-elements
  2. Environment variable: RW_PACKS_DIR=./my-elements
  3. package.json: { "rw-elements-tools": { "packsDir": "./my-elements" } }
  4. Config file: rw-elements-tools.config.js
  5. Default: ./packs

  Audit-specific config keys (package.json / config file):
    auditCorePacks  - core packs directory (string)
    auditPacks      - additional pack roots (array of strings)
    auditOutDir     - report output directory (string)

Examples:
  rw-build all                          Build everything
  rw-build properties                   Build properties only
  rw-build hooks --watch                Build and watch hooks
  rw-build all --watch                  Build and watch both
  rw-build all --packs ./my-elements    Build with custom packs directory

  rw-build audit                                     Audit shared controls + default core pack
  rw-build audit --no-core-packs                     Audit shared controls only
  rw-build audit --packs ./packs                     Audit one additional packs directory
  rw-build audit --packs ./a --packs ./b             Audit two additional packs directories
  rw-build audit --core-packs ../MyCorePack/packs    Use a custom core pack
  rw-build audit --out-dir ./reports/ai-audit        Write report to a custom directory
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
async function buildProperties(config, watch = false) {
  console.log(`[rw-build] Building properties${watch ? ' (watch mode)' : ''}...`);
  console.log(`[rw-build] Packs directory: ${config.packsDir}`);

  const buildModule = await import('../build-properties.js');

  if (watch) {
    await buildModule.startWatch(config);
  } else {
    await buildModule.buildProperties(config);
  }
}

/**
 * Run the hooks build
 */
async function buildHooks(config, watch = false) {
  console.log(`[rw-build] Building hooks${watch ? ' (watch mode)' : ''}...`);
  console.log(`[rw-build] Packs directory: ${config.packsDir}`);

  const buildModule = await import('../build-shared-hooks.js');

  if (watch) {
    await buildModule.startWatch(config);
  } else {
    await buildModule.buildAll(config);
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
    auditPacks: args.auditPacks,
    corePacks: args.corePacks,
    noCorePacks: args.noCorePacks,
    outDir: args.outDir,
  });
  
  try {
    switch (args.command) {
      case 'properties':
        await buildProperties(config, args.watch);
        break;

      case 'hooks':
        await buildHooks(config, args.watch);
        break;
        
      case 'all':
        if (args.watch) {
          // In watch mode, start both watchers concurrently
          // They will both run indefinitely, watching for changes
          await Promise.all([
            buildProperties(config, true),
            buildHooks(config, true),
          ]);
        } else {
          // One-time build: run sequentially
          await buildProperties(config, false);
          await buildHooks(config, false);
        }
        break;

      case 'audit': {
        const { runAudit } = await import('../audit-ai-properties.js');
        await runAudit(config);
        break;
      }
        
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

