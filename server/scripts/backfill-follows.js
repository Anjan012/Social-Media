import dotenv from "dotenv";
import mongoose from "mongoose";
import { pathToFileURL } from "node:url";
import connectDB from "../utils/db.js";
import { User } from "../models/user.model.js";
import { Follow } from "../models/follow.model.js";

dotenv.config();

const normalizeFollowingIds = (following = []) => {
  const uniqueIds = new Set(); // for storing unique values

  for (const followingId of following) {
    if (!followingId) continue;

    const idString = String(followingId);
    if (mongoose.Types.ObjectId.isValid(idString)) {
      uniqueIds.add(idString);
    }
  }

  return [...uniqueIds];
};

export const backfillFollows = async ({
  UserModel = User,
  FollowModel = Follow,
  logger = console,
} = {}) => {
  const summary = {
    usersProcessed: 0,
    usersFailed: [],
    followsCreated: 0,
    followsSkipped: 0,
    totalFollowingPairs: 0,
  };

  logger.info("Starting Follow backfill from legacy User.following arrays...");

  const rawUsers = await UserModel.find({});
  const users = Array.isArray(rawUsers)
    ? rawUsers
    : typeof rawUsers?.lean === "function"
      ? await rawUsers.lean()
      : rawUsers || [];

  for (const user of users || []) {
    summary.usersProcessed += 1;

    const followingIds = normalizeFollowingIds(user.following);
    summary.totalFollowingPairs += followingIds.length;

    for (const followingId of followingIds) {
      try {
        const existingFollowResult = await FollowModel.findOne({
          followerUserId: user._id,
          followingUserId: followingId,
        });
        const existingFollow =
          existingFollowResult && typeof existingFollowResult.lean === "function"
            ? await existingFollowResult.lean()
            : existingFollowResult;

        if (existingFollow) {
          summary.followsSkipped += 1;
          continue;
        }

        await FollowModel.create({
          followerUserId: user._id,
          followingUserId: followingId,
          createdAt: new Date(),
        });

        summary.followsCreated += 1;
      } catch (error) {
        logger.error("Follow backfill failed for user relationship", {
          userId: user._id,
          followingId,
          error,
        });
        summary.usersFailed.push({
          userId: user._id.toString(),
          followingId,
          reason: error?.message || "Unknown error",
        });
      }
    }
  }

  logger.info("Follow backfill complete", summary);

  return summary;
};

export const runBackfill = async () => {
  await connectDB();

  try {
    return await backfillFollows();
  } finally {
    await mongoose.disconnect();
  }
};

const isDirectExecution =
  process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isDirectExecution) {
  runBackfill().catch((error) => {
    console.error("Follow backfill failed", error);
    process.exitCode = 1;
  });
}
