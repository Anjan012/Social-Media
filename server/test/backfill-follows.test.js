import test from "node:test";
import assert from "node:assert/strict";

const { backfillFollows } = await import("../scripts/backfill-follows.js");

test("backfillFollows migrates all unique following pairs and skips duplicates on rerun", async () => {
  const userIds = [
    "64f6a1b0d5b5ea0012345678",
    "64f6a1b0d5b5ea0012345679",
    "64f6a1b0d5b5ea0012345680",
  ];

  const userRows = [
    { _id: userIds[0], following: [userIds[1], userIds[2]] },
    { _id: userIds[1], following: [userIds[2]] },
    { _id: userIds[2], following: [] },
  ];

  const memory = [];

  const fakeUserModel = {
    find: async () => userRows,
  };

  const fakeFollowModel = {
    findOne: async ({ followerUserId, followingUserId }) => {
      return memory.find((entry) => {
        return entry.followerUserId === followerUserId && entry.followingUserId === followingUserId;
      }) || null;
    },
    create: async (doc) => {
      memory.push({ ...doc, _id: `doc-${memory.length + 1}` });
      return memory[memory.length - 1];
    },
  };

  const firstRun = await backfillFollows({
    UserModel: fakeUserModel,
    FollowModel: fakeFollowModel,
    logger: { info: () => {}, error: () => {} },
  });

  const secondRun = await backfillFollows({
    UserModel: fakeUserModel,
    FollowModel: fakeFollowModel,
    logger: { info: () => {}, error: () => {} },
  });

  assert.equal(firstRun.usersProcessed, 3);
  assert.equal(firstRun.followsCreated, 3);
  assert.equal(firstRun.followsSkipped, 0);
  assert.equal(secondRun.followsCreated, 0);
  assert.equal(secondRun.followsSkipped, 3);
  assert.equal(memory.length, 3);
});
