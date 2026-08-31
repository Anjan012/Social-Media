import test from "node:test";
import assert from "node:assert/strict";

const { Follow } = await import("../models/follow.model.js");
const {
  followUser,
  unfollowUser,
  isFollowing,
  getFollowers,
  getFollowing,
  getFollowCounts,
} = await import("../services/follow.service.js");
const { User } = await import("../models/user.model.js");

const makeUserId = (suffix) => {
  const map = {
    a: "64f6a1b0d5b5ea0012345678",
    b: "64f6a1b0d5b5ea0012345679",
    c: "64f6a1b0d5b5ea0012345680",
    z: "64f6a1b0d5b5ea00123456ff",
  };

  return map[suffix] || `64f6a1b0d5b5ea00123456${String(suffix).slice(0, 2)}`;
};

const setupFollowState = ({ existing = [], userMap = {} } = {}) => {
  const seededFollows = [...existing];

  const originalFindById = User.findById;
  const originalFindOne = Follow.findOne;
  const originalFind = Follow.find;
  const originalCountDocuments = Follow.countDocuments;
  const originalDeleteOne = Follow.deleteOne;
  const originalFindOneAndUpdate = Follow.findOneAndUpdate;

  User.findById = async (id) => {
    const user = userMap[id];
    return user ? { ...user, _id: id } : null;
  };

  Follow.findOne = async (query) => {
    const match = seededFollows.find((item) => {
      const sameFollower = item.followerUserId === query.followerUserId;
      const sameFollowing = item.followingUserId === query.followingUserId;
      return sameFollower && sameFollowing;
    });

    return match ? { ...match, toObject: () => ({ ...match }) } : null;
  };

  Follow.findOneAndUpdate = async (filter, update, options) => {
    const key = `${filter.followerUserId}:${filter.followingUserId}`;
    const existingIndex = seededFollows.findIndex((item) => {
      return item.followerUserId === filter.followerUserId && item.followingUserId === filter.followingUserId;
    });

    if (existingIndex >= 0) {
      const current = seededFollows[existingIndex];
      return { ...current, toObject: () => ({ ...current }) };
    }

    const inserted = {
      followerUserId: filter.followerUserId,
      followingUserId: filter.followingUserId,
      createdAt: new Date(),
    };

    seededFollows.push(inserted);
    return { ...inserted, toObject: () => ({ ...inserted }) };
  };

  Follow.deleteOne = async (query) => {
    const initialLength = seededFollows.length;
    const filtered = seededFollows.filter((item) => {
      return !(item.followerUserId === query.followerUserId && item.followingUserId === query.followingUserId);
    });

    seededFollows.length = 0;
    filtered.forEach((item) => seededFollows.push(item));

    return { deletedCount: initialLength - seededFollows.length };
  };

  Follow.countDocuments = async (query) => {
    const field = query.followingUserId ? "followingUserId" : "followerUserId";
    const value = query[field];

    return seededFollows.filter((item) => item[field] === value).length;
  };

  Follow.find = (query) => {
    const field = query.followingUserId ? "followingUserId" : "followerUserId";
    const value = query[field];
    const items = seededFollows.filter((item) => item[field] === value).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return {
      sort: () => ({
        skip: () => ({
          limit: () => ({
            populate: () => ({
              lean: async () => items,
            }),
          }),
        }),
      }),
      populate: () => ({
        lean: async () => items,
      }),
      lean: async () => items,
    };
  };

  return {
    restore: () => {
      User.findById = originalFindById;
      Follow.findOne = originalFindOne;
      Follow.find = originalFind;
      Follow.countDocuments = originalCountDocuments;
      Follow.deleteOne = originalDeleteOne;
      Follow.findOneAndUpdate = originalFindOneAndUpdate;
    },
  };
};

const toSeededUsers = (ids) => {
  const map = {};
  ids.forEach((id) => {
    map[id] = { _id: id, username: `user-${id.slice(-2)}` };
  });
  return map;
};

test("followUser rejects self-follow and missing users", async () => {
  const userA = makeUserId("a");
  const userB = makeUserId("b");
  const stub = setupFollowState({ userMap: toSeededUsers([userA, userB]) });

  try {
    await assert.rejects(() => followUser(userA, userA), (error) => {
      assert.equal(error.statusCode, 400);
      assert.equal(error.message, "You cannot follow yourself");
      return true;
    });

    await assert.rejects(() => followUser(userA, makeUserId("z")), (error) => {
      assert.equal(error.statusCode, 404);
      assert.equal(error.message, "User not found");
      return true;
    });
  } finally {
    stub.restore();
  }
});

test("followUser is idempotent and duplicate follow does not create a second row", async () => {
  const userA = makeUserId("a");
  const userB = makeUserId("b");
  const stub = setupFollowState({
    existing: [{ followerUserId: userA, followingUserId: userB, createdAt: new Date() }],
    userMap: toSeededUsers([userA, userB]),
  });

  try {
    const firstResult = await followUser(userA, userB);
    const secondResult = await followUser(userA, userB);

    assert.equal(firstResult.alreadyFollowing, true);
    assert.equal(secondResult.alreadyFollowing, true);
    assert.equal(await Follow.countDocuments({ followerUserId: userA }), 1);
  } finally {
    stub.restore();
  }
});

test("unfollowUser removes the follow relationship", async () => {
  const userA = makeUserId("a");
  const userB = makeUserId("b");
  const stub = setupFollowState({
    existing: [{ followerUserId: userA, followingUserId: userB, createdAt: new Date() }],
    userMap: toSeededUsers([userA, userB]),
  });

  try {
    const removed = await unfollowUser(userA, userB);
    const stillExists = await isFollowing(userA, userB);

    assert.equal(removed, true);
    assert.equal(stillExists, false);
  } finally {
    stub.restore();
  }
});

test("getFollowCounts and paginated list helpers return the expected values", async () => {
  const userA = makeUserId("a");
  const userB = makeUserId("b");
  const userC = makeUserId("c");
  const stub = setupFollowState({
    existing: [
      { followerUserId: userA, followingUserId: userB, createdAt: new Date("2024-01-02T00:00:00Z") },
      { followerUserId: userA, followingUserId: userC, createdAt: new Date("2024-01-03T00:00:00Z") },
      { followerUserId: userB, followingUserId: userA, createdAt: new Date("2024-01-04T00:00:00Z") },
      { followerUserId: userC, followingUserId: userA, createdAt: new Date("2024-01-05T00:00:00Z") },
    ],
    userMap: toSeededUsers([userA, userB, userC]),
  });

  try {
    const counts = await getFollowCounts(userA);
    const followers = await getFollowers(userA, { page: 1, limit: 10 });
    const following = await getFollowing(userA, { page: 1, limit: 10 });

    assert.equal(counts.followersCount, 2);
    assert.equal(counts.followingCount, 2);
    assert.equal(followers.items.length, 2);
    assert.equal(following.items.length, 2);
    assert.equal(followers.total, 2);
    assert.equal(following.total, 2);
    assert.equal(followers.hasMore, false);
    assert.equal(following.hasMore, false);
  } finally {
    stub.restore();
  }
});
