import { User } from "../models/user.model.js";
import { Post } from "../models/post.model.js";
import { notFound } from "../utils/error/error-helper.js";

export const getMeService = async (userId) => {
  const user = await User.findById(userId).select("-password");

  if (!user) {
    notFound("User not Found");
  }

  return user;
};

export const updateProfileService = async ({
  userId,
  username,
  fullname,
  bio,
  location,
  website,
  dob,
  profileFile,
  coverFile,
}) => {
  let profilePictureURL = null;
  let coverPictureURL = null;

  if (profileFile) {
    const localFilePath = profileFile.path;

    const result = await cloudinary.uploader.upload(localFilePath, {
      folder: `users/${userId}/profile`,
    });

    profilePictureURL = result.secure_url;

    fs.unlinkSync(localFilePath);
  }

  if (coverFile) {
    const localFilePath = coverFile.path;

    const result = await cloudinary.uploader.upload(localFilePath, {
      folder: `users/${userId}/cover`,
    });

    coverPictureURL = result.secure_url;

    fs.unlinkSync(localFilePath);
  }

  const user = await User.findById(userId);

  if (!user) {
    notFound("User not found");
  }

  if (username) user.username = username;
  if (fullname) user.fullname = fullname;
  if (bio) user.bio = bio;
  if (location) user.location = location;
  if (website) user.website = website;
  if (dob) user.dob = dob;
  if (profilePictureURL) user.profilePicture = profilePictureURL;
  if (coverPictureURL) user.coverPicture = coverPictureURL;

  await user.save();

  const userData = user.toObject();
  delete userData.password;

  return userData;
};

export const getUserProfileService = async (
  {
    loggedInUserId,
    profileUserId
  }) => {
    const user = await User.findById(profileUserId).select("-password");

    if (!user) {
      notFound("User not found!");
    }

    const posts = await Post.find({ createdBy: profileUserId })
      .sort({
        createdAt: -1,
      })
      .populate("createdBy", "username fullname profilePicture");

    const isOwnProfile = loggedInUserId === profileUserId;

    const isFollowing = user.followers?.includes(loggedInUserId);

    return{
      success: true,
      user,
      posts,
      isOwnProfile,
      isFollowing,
      message: "User profile fetched successfully!",
    };
};

