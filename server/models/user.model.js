import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      minlength: [6, "Password must be at least 6 characters long"],
      default: null,
    },

    // OAuth fields-------------------------
    provider: {
      type: String,
      enum: ["local", "facebook", "google"],
      default: "local",
    },

    providerId: {
      type: String,
      default: null,
    },
    // -------------------

    fullname: {
      type: String,
      trim: true,
      maxlength: 50,
    },
    bio: {
      type: String,
      trim: true,
      maxlength: 160,
      default: "",
    },
    profilePicture: {
      type: String,
      default: "",
    },
    coverPicture: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    website: {
      type: String,
    },
    dob: {
      type: Date,
    },
    facebookId,
    provider,

    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  },
);

userSchema.index(
  {provider: 1, providerId: 1},
  {unique: true, sparse: true}
);


export const User = mongoose.model("User", userSchema);
