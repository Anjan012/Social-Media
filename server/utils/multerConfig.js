import multer from "multer";
import path from "path";
import fs from "fs";
import cryto from "crypto";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const UserId = req.id;
    const baseDir = path.join("uploads", "users", UserId.toString(), "posts");

    // create dir if not exists
    fs.mkdirSync(baseDir, {recursive: true});

    cb(null, baseDir);
  },
  filename: function (req, file, cb) {
    cryto.randomBytes(12, function (err, name) {
      const fn = `post_${name.toString("hex") + path.extname(file.originalname)}`;
      cb(null, fn);
    });
  }
});


export const uploadPostImage = multer({
  storage
});