import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const UserId = req.id;
    const baseDir = path.join("uploads", "users", UserId.toString(), "cover");

    // create dir if not exists
    fs.mkdirSync(baseDir, {recursive: true});

    cb(null, baseDir);
  },
  filename: function (req, file, cb) {
    crypto.randomBytes(12, function (err, name) {
      const fn = `cover_${name.toString("hex") + path.extname(file.originalname)}`;
      cb(null, fn);
    });
  }
});


export const uploadCoverPicture = multer({
  storage
});