import { Request } from "express";
import multer, { FileFilterCallback } from "multer";
import path from "path";
import ErrorHandler from "../utils/customError.js";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import fs from "fs";

const storage = multer.diskStorage({
  destination: (_req, file, cb) => {
    const folder = file.mimetype.startsWith("video/") ? "videos" : "images";
    const uploadPath = path.join(__dirname, "../../uploads", folder);

    // Ensure directory exists
    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },
  filename: (_req, file, cb) => {
    const name = path
      .basename(file.originalname, path.extname(file.originalname))
      .toLowerCase()
      .replace(/\s+/g, "-");
    const ext = path.extname(file.originalname);
    cb(null, `${name}-${Date.now()}${ext}`);
  },
});

// const storage = multer.diskStorage({
//   destination: (_req, file, cb) => {
//     const folder = file.mimetype.startsWith("video/") ? "videos" : "images";
//     cb(null, path.join(__dirname, "../../uploads", folder));
//   },
//   filename: (_req, file, cb) => {
//     const name = path
//       .basename(file.originalname, path.extname(file.originalname))
//       .toLowerCase()
//       .replace(/\s+/g, "-");
//     const ext = path.extname(file.originalname);
//     cb(null, `${name}-${Date.now()}${ext}`);
//   },
// });

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void => {
  const allowed = /^(image\/(jpeg|png|gif)|video\/(mp4|quicktime))$/;
  if (allowed.test(file.mimetype)) cb(null, true);
  else cb(new ErrorHandler("Unsupported file type", 415));
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20 MB per file
    files: 5, // max 5 files per request
  },
});

export const uploadSingle = upload.single("file");
export const uploadArray = upload.array("files", 5);
export const uploadFields = upload.fields([
  { name: "thumbnail", maxCount: 1 },
  { name: "gallery", maxCount: 4 },
]);
