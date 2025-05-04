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

const router = express.Router();

// Apply multer middleware first
router.post("/createService", uploadArray, createService);
router.put("/updateService/:id", uploadArray, updateService);
router.delete("/deleteService/:id", deleteService);
router.get("/getAllServices", getAllServices);
router.get("/getServiceById/:id", getServiceById);
router.get("/getFeaturedServices", getFeaturedServices);

export default router;
