import test from "node:test";
import assert from "node:assert/strict";

const { Follow } = await import("../models/follow.model.js");

test("Follow defines the required unique and compound indexes", () => {
  const indexes = Follow.schema.indexes();

  const uniquePairIndex = indexes.find(([definition, options]) => {
    return (
      definition.followerUserId === 1 &&
      definition.followingUserId === 1 &&
      options?.unique === true
    );
  });

  const followingCreatedIndex = indexes.find(([definition]) => {
    return definition.followingUserId === 1 && definition.createdAt === -1;
  });

  const followerCreatedIndex = indexes.find(([definition]) => {
    return definition.followerUserId === 1 && definition.createdAt === -1;
  });

  assert.ok(uniquePairIndex, "expected unique pair index on followerUserId + followingUserId");
  assert.ok(followingCreatedIndex, "expected index on followingUserId + createdAt");
  assert.ok(followerCreatedIndex, "expected index on followerUserId + createdAt");
});
