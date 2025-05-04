import { Response } from "express";
import { CustomRequest } from "../../types/reqResTypes/responseTypes.js";
import { errorResponse, successResponse } from "../../utils/genericResponse.js";
import { TryCatch } from "../../middlewares/errorMiddleware.js";

export const uploadMedia = TryCatch(
  async (req: CustomRequest, res: Response) => {
    // let urls: string[] = [];
    const uploadedFiles = [];

    const getFilePath = (file: any) => {
      const folder = file.mimetype.startsWith("video/") ? "videos" : "images";
      return `/uploads/${folder}/${file.filename}`;
    };

    if (req.file) {
      uploadedFiles.push(getFilePath(req.file));
    } else if (Array.isArray(req.files)) {
      if (Array.isArray(req.files)) {
        for (const file of req.files) {
          uploadedFiles.push(getFilePath(file));
        }
      } else {
        Object.values(req.files).forEach((fileArray: any) => {
          fileArray.forEach((file: any) =>
            uploadedFiles.push(getFilePath(file))
          );
        });
      }
    }

    return res
      .status(201)
      .json(successResponse(uploadedFiles, "Files Uploaded Successfully"));
  }
);
