import { Router } from "express";
import { uploadMedia } from "../../controllers/media/fileUploadsController.js";
import {
  uploadSingle,
  uploadArray,
  uploadFields,
} from "../../config/multerFileUpload.js";

const router = Router();

router.post("/single", uploadSingle, uploadMedia);
router.post("/array", uploadArray, uploadMedia);
router.post("/fields", uploadFields, uploadMedia);

export default router;
