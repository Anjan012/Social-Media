import { User } from "../models/user.model.js";
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

  return res.status(200).json({
    message: "Profile updated Successfully",
    success: true,
    userData,
  });
};

