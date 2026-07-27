import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import vm from "node:vm";

import { buildAll } from "../build-shared-hooks.js";

const SOURCE = `
const transformHook = (rw) => {
  return {
    classes: classnames(["block", rw.props.cssClasses]).toString(),
    tag: globalHTMLTag(rw, "section"),
  };
};
`;

/**
 * Builds a throwaway component through the real buildAll pipeline and returns
 * the generated hooks.js contents.
 */
async function buildFixture() {
  const projectRoot = fs.mkdtempSync(path.join(os.tmpdir(), "rw-hooks-shake-"));
  const componentDir = path.join(
    projectRoot,
    "packs",
    "Test.elementsdevpack",
    "components",
    "com.example.fixture"
  );

  fs.mkdirSync(componentDir, { recursive: true });
  fs.writeFileSync(path.join(componentDir, "hooks.source.js"), SOURCE, "utf8");

  await buildAll({ packsDir: path.join(projectRoot, "packs"), projectRoot });

  const code = fs.readFileSync(path.join(componentDir, "hooks.js"), "utf8");
  fs.rmSync(projectRoot, { recursive: true, force: true });

  return code;
}

test("tree shaking keeps the shared hooks a component reaches", async () => {
  const code = await buildFixture();

  assert.match(code, /\bclassnames\b/, "Expected classnames to survive - the fixture calls it");
  assert.match(code, /\bglobalHTMLTag\b/, "Expected globalHTMLTag to survive - the fixture calls it");
});

test("tree shaking drops the shared hooks a component never reaches", async () => {
  const code = await buildFixture();

  // These live in shared-hooks/ and are concatenated in before the shake, so their
  // absence is what proves treeShaking is switched on.
  for (const unused of [
    "globalNavItems",
    "globalMenuItem",
    "globalBackground",
    "globalTransforms3D",
    "globalBordersTable",
  ]) {
    assert.doesNotMatch(
      code,
      new RegExp(`\\b${unused}\\b`),
      `Expected ${unused} to be shaken out - the fixture never references it`
    );
  }
});

test("tree shaken output still exports a working transformHook", async () => {
  const code = await buildFixture();
  const context = { exports: {}, module: { exports: {} }, console };

  vm.runInNewContext(code, context);

  assert.equal(typeof context.exports.transformHook, "function");

  // Actually invoke it: an over-aggressive shake would only surface as a
  // ReferenceError at call time, not at load time.
  const result = context.exports.transformHook({ props: { cssClasses: "p-4" } });

  assert.equal(result.tag, "section");
  assert.match(result.classes, /\bblock\b/);
  assert.match(result.classes, /\bp-4\b/);
});
