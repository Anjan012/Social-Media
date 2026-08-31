import mongoose from "mongoose";
import { Follow } from "../models/follow.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/error/api-error.js";

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

const normalizeObjectId = (value) => {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const candidate = value.toString();
  return mongoose.Types.ObjectId.isValid(candidate) ? candidate : null;
};

const normalizePagination = ({ page = 1, limit = DEFAULT_PAGE_SIZE } = {}) => {
  const safePage =
    Number.isFinite(Number(page)) && Number(page) > 0 ? Number(page) : 1;
  const safeLimit =
    Number.isFinite(Number(limit)) && Number(limit) > 0
      ? Math.min(Number(limit), MAX_PAGE_SIZE)
      : DEFAULT_PAGE_SIZE;

  return {
    page: Math.floor(safePage),
    limit: Math.floor(safeLimit),
    skip: (Math.floor(safePage) - 1) * Math.floor(safeLimit),
  };
};

const normalizeFollowDoc = (doc) => {
  if (!doc) {
    return null;
  }

  if (typeof doc.toObject === "function") {
    return doc.toObject();
  }

  return { ...doc };
};

const findFollowDocument = async (query) => {
  const doc = await Follow.findOne(query);
  return normalizeFollowDoc(doc);
};

export const followUser = async (followerUserId, followingUserId) => {
  if (!followerUserId || !followingUserId) {
    throw new ApiError(400, "Follower and following user IDs are required");
  }

  const followerId = followerUserId.toString();
  const followingId = followingUserId.toString();

  if (followerId === followingId) {
    throw new ApiError(400, "You cannot follow yourself");
  }

  const [followerUser, targetUser] = await Promise.all([
    User.findById(followerId),
    User.findById(followingId),
  ]);

  if (!followerUser || !targetUser) {
    throw new ApiError(404, "User not found");
  }

  const existingFollow = await findFollowDocument({
    followerUserId: followerId,
    followingUserId: followingId,
  });

  if (existingFollow) {
    return {
      ...existingFollow,
      alreadyFollowing: true,
    };
  }

  const followDoc = await Follow.findOneAndUpdate(
    {
      followerUserId: followerId,
      followingUserId: followingId,
    },
    {
      $setOnInsert: {
        followerUserId: followerId,
        followingUserId: followingId,
        createdAt: new Date(),
      },
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    },
  );

  return {
    ...normalizeFollowDoc(followDoc),
    alreadyFollowing: false,
  };
};

export const unfollowUser = async (followerUserId, followingUserId) => {
  const normalizedFollowerId = normalizeObjectId(followerUserId);
  const normalizedFollowingId = normalizeObjectId(followingUserId);

  if (!normalizedFollowerId || !normalizedFollowingId) {
    return false;
  }

  const result = await Follow.deleteOne({
    followerUserId: normalizedFollowerId,
    followingUserId: normalizedFollowingId,
  });

  return result.deletedCount > 0;
};

export const isFollowing = async (followerUserId, followingUserId) => {
  const normalizedFollowerId = normalizeObjectId(followerUserId);
  const normalizedFollowingId = normalizeObjectId(followingUserId);

  if (!normalizedFollowerId || !normalizedFollowingId) {
    return false;
  }

  const followDoc = await findFollowDocument({
    followerUserId: normalizedFollowerId,
    followingUserId: normalizedFollowingId,
  });

  return Boolean(followDoc);
};

export const getFollowers = async (
  userId,
  { page = 1, limit = DEFAULT_PAGE_SIZE } = {},
) => {
  const normalizedUserId = normalizeObjectId(userId);

  if (!normalizedUserId) {
    return {
      items: [],
      page: 1,
      limit: DEFAULT_PAGE_SIZE,
      total: 0,
      totalPages: 1,
      hasMore: false,
    };
  }

  const {
    skip,
    page: safePage,
    limit: safeLimit,
  } = normalizePagination({ page, limit });

  const [items, total] = await Promise.all([
    Follow.find({ followingUserId: normalizedUserId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(safeLimit)
      .populate("followerUserId", "username fullname profilePicture")
      .lean(),
    Follow.countDocuments({ followingUserId: normalizedUserId }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / safeLimit));

  return {
    items,
    page: safePage,
    limit: safeLimit,
    total,
    totalPages,
    hasMore: safePage < totalPages,
  };
};

export const getFollowing = async (
  userId,
  { page = 1, limit = DEFAULT_PAGE_SIZE } = {},
) => {
  const normalizedUserId = normalizeObjectId(userId);

  if (!normalizedUserId) {
    return {
      items: [],
      page: 1,
      limit: DEFAULT_PAGE_SIZE,
      total: 0,
      totalPages: 1,
      hasMore: false,
    };
  }

  const {
    skip,
    page: safePage,
    limit: safeLimit,
  } = normalizePagination({ page, limit });

  const [items, total] = await Promise.all([
    Follow.find({ followerUserId: normalizedUserId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(safeLimit)
      .populate("followingUserId", "username fullname profilePicture")
      .lean(),
    Follow.countDocuments({ followerUserId: normalizedUserId }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / safeLimit));

  return {
    items,
    page: safePage,
    limit: safeLimit,
    total,
    totalPages,
    hasMore: safePage < totalPages,
  };
};

export const getFollowCounts = async (userId) => {
  const normalizedUserId = normalizeObjectId(userId);

  if (!normalizedUserId) {
    return {
      followersCount: 0,
      followingCount: 0,
    };
  }

  const [followersCount, followingCount] = await Promise.all([
    Follow.countDocuments({ followingUserId: normalizedUserId }),
    Follow.countDocuments({ followerUserId: normalizedUserId }),
  ]);

  return {
    followersCount,
    followingCount,
  };
};
