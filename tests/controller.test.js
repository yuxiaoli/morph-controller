import assert from "node:assert/strict";
import { test } from "node:test";
import { createController } from "../src/js/controller.js";
import { DEFAULTS } from "../src/js/configuration.js";

function setup(context) {
  context.mock.timers.enable({ apis: ["setTimeout"] });
  const applications = [];
  const changes = [];
  const controller = createController({
    onChange: (state) => changes.push(state),
    onApply: (draft, closePanel) => applications.push({ draft, closePanel }),
  });
  return { controller, applications, changes, tick: (ms) => context.mock.timers.tick(ms) };
}

test("manual edits preserve the applied configuration until Apply", (context) => {
  const { controller, applications, tick } = setup(context);
  controller.update({ ...DEFAULTS, current: 17 });
  tick(1000);
  assert.equal(applications.length, 0);
  assert.equal(controller.getState().pending, true);
  assert.equal(controller.getState().applied.values.current, 1);
  assert.equal(controller.apply(), true);
  assert.equal(applications.length, 1);
  assert.equal(applications[0].closePanel, true);
  assert.equal(controller.getState().applied.values.current, 17);
  assert.equal(controller.getState().pending, false);
});

test("continuous edits apply once, 800ms after the last edit", (context) => {
  const { controller, applications, tick } = setup(context);
  controller.setAutoApply(true);
  controller.update({ ...DEFAULTS, n: 100 });
  tick(500);
  controller.update({ ...DEFAULTS, n: 101 });
  tick(799);
  assert.equal(applications.length, 0);
  tick(1);
  assert.equal(applications.length, 1);
  assert.equal(applications[0].draft.values.n, 101);
  assert.equal(applications[0].closePanel, false);
  tick(800);
  assert.equal(applications.length, 1);
});

test("invalid input cancels auto apply and blocks manual apply", (context) => {
  const { controller, applications, tick } = setup(context);
  controller.setAutoApply(true);
  controller.update({ ...DEFAULTS, current: 17 });
  tick(500);
  controller.update({ ...DEFAULTS, bg: "invalid" });
  tick(1000);
  assert.equal(applications.length, 0);
  assert.equal(controller.apply(), false);
  assert.equal(controller.getState().applied.values.current, 1);
  controller.update({ ...DEFAULTS, bg: "ffffff" });
  tick(800);
  assert.equal(applications.length, 1);
});

test("disabling auto apply cancels pending work and keeps the draft", (context) => {
  const { controller, applications, changes, tick } = setup(context);
  controller.update({ ...DEFAULTS, loop: false });
  controller.setAutoApply(true);
  tick(799);
  controller.setAutoApply(false);
  tick(1000);
  assert.equal(applications.length, 0);
  assert.equal(changes.at(-1).autoApply, false);
  assert.equal(controller.getState().draft.values.loop, false);
  assert.equal(controller.getState().pending, true);
});

test("enabling auto apply schedules an existing valid draft", (context) => {
  const { controller, applications, tick } = setup(context);
  controller.update({ ...DEFAULTS, pixel: "ff2b2b" });
  controller.setAutoApply(true);
  tick(799);
  assert.equal(applications.length, 0);
  tick(1);
  assert.equal(applications.length, 1);
});

test("manual Apply cancels the timer to prevent a second navigation", (context) => {
  const { controller, applications, tick } = setup(context);
  controller.setAutoApply(true);
  controller.update({ ...DEFAULTS, delay: 500 });
  tick(400);
  controller.apply();
  tick(1000);
  assert.equal(applications.length, 1);
});

test("returning to the applied configuration cancels pending navigation", (context) => {
  const { controller, applications, tick } = setup(context);
  controller.setAutoApply(true);
  controller.update({ ...DEFAULTS, n: 100 });
  tick(400);
  controller.update({ ...DEFAULTS, n: "02000", bg: "#000000" });
  tick(1000);
  assert.equal(applications.length, 0);
  assert.equal(controller.getState().pending, false);
});

test("Reset restores defaults without applying in manual mode", (context) => {
  const { controller, applications, tick } = setup(context);
  controller.update({ ...DEFAULTS, current: 17 });
  controller.apply();
  controller.update({ ...DEFAULTS, n: "" });
  controller.reset();
  tick(1000);
  assert.equal(applications.length, 1);
  assert.deepEqual(controller.getState().draft.values, DEFAULTS);
  assert.equal(controller.getState().applied.values.current, 17);
  assert.equal(controller.getState().pending, true);
});

test("Reset follows the current auto apply mode", (context) => {
  const { controller, applications, tick } = setup(context);
  controller.update({ ...DEFAULTS, current: 17 });
  controller.apply();
  controller.setAutoApply(true);
  controller.update({ ...DEFAULTS, n: 10 });
  tick(400);
  controller.reset();
  tick(799);
  assert.equal(applications.length, 1);
  tick(1);
  assert.equal(applications.length, 2);
  assert.deepEqual(controller.getState().applied.values, DEFAULTS);
});
