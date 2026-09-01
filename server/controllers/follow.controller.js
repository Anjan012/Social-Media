import { asyncHandler } from "../utils/async-handler.js";
import { User } from "../models/user.model.js";
import {
  getFollowers,
  getFollowing,
  getFollowCounts,
} from "../services/follow.service.js";

const parsePageAndLimit = (query = {}) => {
  const page = Number.parseInt(query.page ?? "1", 10);
  const limit = Number.parseInt(query.limit ?? "20", 10);

  return {
    page: Number.isInteger(page) && page > 0 ? page : 1,
    limit: Number.isInteger(limit) && limit > 0 ? limit : 20,
  };
};

export const getUserFollowers = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { page, limit } = parsePageAndLimit(req.query);

  const userExists = await User.exists({ _id: id });
  if (!userExists) {
    return res.status(404).json({
      success: false,
      message: "User not found",
      data: {
        items: [],
        page,
        limit,
        total: 0,
        totalPages: 0,
        hasMore: false,
      },
    });
  }

  const payload = await getFollowers(id, { page, limit });

  return res.status(200).json({
    success: true,
    message: "Followers fetched successfully",
    data: payload,
  });
});

export const getUserFollowing = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { page, limit } = parsePageAndLimit(req.query);

  const userExists = await User.exists({ _id: id });
  if (!userExists) {
    return res.status(404).json({
      success: false,
      message: "User not found",
      data: {
        items: [],
        page,
        limit,
        total: 0,
        totalPages: 0,
        hasMore: false,
      },
    });
  }

  const payload = await getFollowing(id, { page, limit });

  return res.status(200).json({
    success: true,
    message: "Following list fetched successfully",
    data: payload,
  });
});

export const getUserFollowCounts = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const userExists = await User.exists({ _id: id });
  if (!userExists) {
    return res.status(404).json({
      success: false,
      message: "User not found",
      data: {
        followersCount: 0,
        followingCount: 0,
      },
    });
  }

  const payload = await getFollowCounts(id);

  return res.status(200).json({
    success: true,
    message: "Follow counts fetched successfully",
    data: payload,
  });
});
