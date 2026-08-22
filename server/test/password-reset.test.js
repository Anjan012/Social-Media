import test from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";

process.env.RATE_LIMIT_SECRET = "test-rate-limit-secret";

const { normalizeEmail, validateResetInput } = await import(
  "../services/forgetPassword.service.js"
);
const { getWindow, hashRateLimitIdentifier } = await import(
  "../services/rate-limit.service.js"
);

test("normalizes valid email addresses", () => {
  assert.equal(normalizeEmail("  User@Example.COM "), "user@example.com");
});

test("rejects missing, non-string, and malformed emails", () => {
  for (const value of [undefined, null, 42, "", "not-an-email"]) {
    assert.throws(() => normalizeEmail(value), { statusCode: 400 });
  }
});

test("validates reset token format and password length", () => {
  const token = crypto.randomBytes(32).toString("hex");

  assert.doesNotThrow(() => validateResetInput(token, "password"));
  assert.throws(() => validateResetInput(undefined, "password"), {
    statusCode: 400,
  });
  assert.throws(() => validateResetInput(token, "short"), {
    statusCode: 400,
  });
});

test("HMAC produces stable, distinct rate-limit identifiers", () => {
  const first = hashRateLimitIdentifier("user@example.com");
  const second = hashRateLimitIdentifier("other@example.com");

  assert.match(first, /^[a-f0-9]{64}$/);
  assert.notEqual(first, second);
});

test("fixed rate-limit windows have the expected expiration", () => {
  const now = new Date("2026-08-20T12:34:56.000Z");
  const { startAt, expiresAt } = getWindow(now, 10 * 60 * 1000);

  assert.equal(startAt.toISOString(), "2026-08-20T12:30:00.000Z");
  assert.equal(expiresAt.toISOString(), "2026-08-20T12:40:00.000Z");
});
