import test from "node:test";
import assert from "node:assert/strict";
import { formatBadgeCount } from "./badgeUtils.js";

test("formatBadgeCount handles zero, negative, and empty values", () => {
  assert.equal(formatBadgeCount(0), "");
  assert.equal(formatBadgeCount(-3), "");
  assert.equal(formatBadgeCount("0"), "");
  assert.equal(formatBadgeCount(0, { hideZero: false }), "0");
  assert.equal(formatBadgeCount(null), "");
  assert.equal(formatBadgeCount(undefined), "");
  assert.equal(formatBadgeCount(""), "");
});

test("formatBadgeCount formats positive counts and caps overflow to max+", () => {
  assert.equal(formatBadgeCount(1), "1");
  assert.equal(formatBadgeCount(9, { max: 9 }), "9");
  assert.equal(formatBadgeCount(10, { max: 9 }), "9+");
  assert.equal(formatBadgeCount(99, { max: 99 }), "99");
  assert.equal(formatBadgeCount(1428, { max: 99 }), "99+");
  assert.equal(formatBadgeCount("1,428", { max: 99 }), "99+");
  assert.equal(formatBadgeCount("120", { max: 99 }), "99+");
});

test("formatBadgeCount preserves non-numeric indicator text", () => {
  assert.equal(formatBadgeCount("4.9★"), "4.9★");
  assert.equal(formatBadgeCount("PRO"), "PRO");
});
