import express from "express";
import {
  createService,
  deleteService,
  getAllServices,
  getFeaturedServices,
  getServiceById,
  updateService,
} from "../../../controllers/admin/services/serviceTypeController.js";
import { uploadArray } from "../../../config/multerFileUpload.js"; // This handles uploading files
import {
  auth,
  roleAuthorization,
} from "../../../middlewares/authMiddleware.js";

const router = express.Router();

// Apply multer middleware first
router.post(
  "/createService",
  auth,
  roleAuthorization(["Admin"]),
  uploadArray,
  createService
);
router.put(
  "/updateService/:id",
  auth,
  roleAuthorization(["Admin"]),
  uploadArray,
  updateService
);
router.delete(
  "/deleteService/:id",
  auth,
  roleAuthorization(["Admin"]),
  deleteService
);
router.get("/getAllServices", getAllServices);
router.get("/getServiceById/:id", getServiceById);
router.get("/getFeaturedServices", getFeaturedServices);

export default router;
