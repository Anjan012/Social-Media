import test from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

process.env.RATE_LIMIT_SECRET = "test-rate-limit-secret";

const { signIn, logout, getAuthCookieOptions } = await import(
  "../controllers/user.controller.js"
);
const { default: isAuthenticated } = await import(
  "../middlewares/isAuthenticated.js"
);
const { User } = await import("../models/user.model.js");
const { Post } = await import("../models/post.model.js");
const { toggleLike, addComment, getUserPost } = await import(
  "../controllers/post.controller.js"
);
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

test("signIn sets an httpOnly auth cookie without exposing the token in JSON", async () => {
  const originalNodeEnv = process.env.NODE_ENV;
  const originalSecret = process.env.JWT_SECRET_KEY;
  const originalFindOne = User.findOne;
  const originalCompare = bcrypt.compare;

  process.env.NODE_ENV = "development";
  process.env.JWT_SECRET_KEY = "test-secret";

  User.findOne = async () => ({
    _id: "user-1",
    username: "alice",
    password: "hashed-password",
    toObject() {
      return { _id: "user-1", username: "alice" };
    },
  });
  bcrypt.compare = async () => true;

  const res = {
    statusCode: 0,
    body: null,
    cookieData: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    cookie(name, value, options) {
      this.cookieData = { name, value, options };
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };

  await signIn(
    {
      body: { email: "alice@example.com", password: "correct-password" },
    },
    res
  );

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.success, true);
  assert.equal("token" in res.body, false);
  assert.equal(res.cookieData.name, "token");
  assert.equal(res.cookieData.options.httpOnly, true);
  assert.equal(res.cookieData.options.secure, false);
  assert.equal(res.cookieData.options.sameSite, "lax");

  User.findOne = originalFindOne;
  bcrypt.compare = originalCompare;
  process.env.NODE_ENV = originalNodeEnv;
  process.env.JWT_SECRET_KEY = originalSecret;
});

test("logout clears the auth cookie with the same configuration", async () => {
  const originalNodeEnv = process.env.NODE_ENV;
  process.env.NODE_ENV = "production";

  const res = {
    statusCode: 0,
    clearCookieData: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    clearCookie(name, options) {
      this.clearCookieData = { name, options };
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };

  await logout({}, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.clearCookieData.name, "token");
  assert.equal(res.clearCookieData.options.httpOnly, true);
  assert.equal(res.clearCookieData.options.secure, true);
  assert.equal(res.clearCookieData.options.sameSite, "none");

  process.env.NODE_ENV = originalNodeEnv;
});

test("auth middleware rejects missing cookie and accepts a valid token", () => {
  const originalSecret = process.env.JWT_SECRET_KEY;
  process.env.JWT_SECRET_KEY = "test-secret";

  const missingCookieRes = {
    status(code) {
      this.code = code;
      return this;
    },
    json(payload) {
      this.payload = payload;
      return this;
    },
  };

  const missingReq = { cookies: {} };
  let missingCalled = false;
  isAuthenticated(missingReq, missingCookieRes, () => {
    missingCalled = true;
  });

  assert.equal(missingCalled, false);
  assert.equal(missingCookieRes.code, 401);

  const validToken = jwt.sign({ userId: "user-42" }, "test-secret");
  const validReq = { cookies: { token: validToken } };
  const validRes = {
    status(code) {
      this.code = code;
      return this;
    },
    json(payload) {
      this.payload = payload;
      return this;
    },
  };
  let validCalled = false;

  isAuthenticated(validReq, validRes, () => {
    validCalled = true;
  });

  assert.equal(validCalled, true);
  assert.equal(validReq.id, "user-42");

  process.env.JWT_SECRET_KEY = originalSecret;
});

test("auth cookie configuration is environment-aware", () => {
  const originalNodeEnv = process.env.NODE_ENV;

  process.env.NODE_ENV = "production";
  const productionOptions = getAuthCookieOptions();
  assert.equal(productionOptions.httpOnly, true);
  assert.equal(productionOptions.secure, true);
  assert.equal(productionOptions.sameSite, "none");

  process.env.NODE_ENV = "development";
  const developmentOptions = getAuthCookieOptions();
  assert.equal(developmentOptions.httpOnly, true);
  assert.equal(developmentOptions.secure, false);
  assert.equal(developmentOptions.sameSite, "lax");

  process.env.NODE_ENV = originalNodeEnv;
});

test("toggleLike returns a full JSON response with updated like state", async () => {
  const originalFindById = Post.findById;
  const mockPost = {
    _id: "post-1",
    likes: ["user-2"],
    async save() {
      this.likes = this.likes.includes("user-1") ? this.likes : [...this.likes, "user-1"];
      return this;
    },
  };

  Post.findById = async () => mockPost;

  const res = {
    statusCode: 0,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };

  await toggleLike({ id: "user-1", params: { id: "post-1" } }, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.success, true);
  assert.equal(res.body.postId, "post-1");
  assert.equal(res.body.isLiked, true);
  assert.equal(res.body.likeCount, 2);

  Post.findById = originalFindById;
});

test("addComment returns success JSON and handles errors", async () => {
  const originalFindById = Post.findById;
  const mockPost = {
    _id: "post-1",
    comments: [],
    async save() {
      this.comments.push({ user: "user-1", text: "hello" });
      return this;
    },
  };

  Post.findById = async () => mockPost;

  const successRes = {
    statusCode: 0,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };

  await addComment(
    { id: "user-1", params: { id: "post-1" }, body: { comment: "hello" } },
    successRes
  );

  assert.equal(successRes.statusCode, 200);
  assert.equal(successRes.body.success, true);
  assert.equal(successRes.body.message, "Comment added successfully!");

  Post.findById = async () => null;

  const notFoundRes = {
    statusCode: 0,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };

  await addComment(
    { id: "user-1", params: { id: "post-1" }, body: { comment: "hello" } },
    notFoundRes
  );

  assert.equal(notFoundRes.statusCode, 404);
  assert.equal(notFoundRes.body.success, false);

  Post.findById = originalFindById;
});

test("getUserPost returns a posts array matching the feed response shape", async () => {
  const originalFind = Post.find;
  const originalCountDocuments = Post.countDocuments;
  const fakePosts = [{ _id: "post-1" }];

  Post.find = () => ({
    populate() {
      return {
        populate() {
          return {
            sort() {
              return {
                skip() {
                  return {
                    limit() {
                      return fakePosts;
                    },
                  };
                },
              };
            },
          };
        },
      };
    },
  });
  Post.countDocuments = async () => 1;

  const res = {
    statusCode: 0,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };

  await getUserPost({ id: "user-1", query: {} }, res);

  assert.equal(res.statusCode, 200);
  assert.equal(Array.isArray(res.body.posts), true);
  assert.equal(res.body.posts[0]._id, "post-1");
  assert.equal(res.body.limit, 20);
  assert.equal(res.body.page, 1);

  Post.find = originalFind;
  Post.countDocuments = originalCountDocuments;
});

test("getAllPost applies pagination defaults and exposes hasMore metadata", async () => {
  const originalFindById = (await import("../models/user.model.js")).User.findById;
  const originalFind = Post.find;
  const originalCountDocuments = Post.countDocuments;
  const fakePosts = Array.from({ length: 5 }, (_, index) => ({ _id: `post-${index}` }));

  (await import("../models/user.model.js")).User.findById = async () => ({
    following: ["user-2"],
  });
  Post.countDocuments = async () => 25;
  Post.find = () => ({
    populate() {
      return {
        populate() {
          return {
            sort() {
              return {
                skip() {
                  return {
                    limit() {
                      return fakePosts;
                    },
                  };
                },
              };
            },
          };
        },
      };
    },
  });

  const res = {
    statusCode: 0,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };

  await (await import("../controllers/post.controller.js")).getAllPost(
    { id: "user-1", query: {} },
    res
  );

  assert.equal(res.statusCode, 200);
  assert.equal(Array.isArray(res.body.posts), true);
  assert.equal(res.body.limit, 20);
  assert.equal(res.body.page, 1);
  assert.equal(res.body.hasMore, true);

  (await import("../models/user.model.js")).User.findById = originalFindById;
  Post.find = originalFind;
  Post.countDocuments = originalCountDocuments;
});
