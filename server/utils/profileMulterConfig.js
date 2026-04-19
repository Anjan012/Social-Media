import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const UserId = req.id;
    const profileDir = path.join("uploads", "users", UserId.toString(), "profile");
    let dir;

    if(file.fieldname === "profilePicture") {
      dir = profileDir;
    } else if(file.fieldname === "coverPicture") {
      dir = path.join("uploads", "users", UserId.toString(), "cover");
    } else {
      return cb(new Error("Invalid field name"), null);
    }

    // create dir if not exists
    fs.mkdirSync(dir, {recursive: true});

    cb(null, dir);
  },
  filename: function (req, file, cb) {
    crypto.randomBytes(12, function (err, name) {
      const fn = `${file.fieldname}_${name.toString("hex") + path.extname(file.originalname)}`;
      cb(null, fn);
    });
  }
});


export const uploadProfileAndCover = multer({
  storage,
  limits: {fileSize: 5 * 1024 * 1024}, // 5MB
  fileFilter: function (req, file, cb) {
    if(file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  }
}). fields([
  {name: "profilePicture", maxCount: 1},
  {name: "coverPicture", maxCount: 1}
]);