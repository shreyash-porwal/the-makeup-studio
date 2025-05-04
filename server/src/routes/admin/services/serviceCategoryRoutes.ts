import express from "express";
import {
  createServiceCategory,
  getAllServiceCategories,
  getServiceCategoryById,
  updateServiceCategory,
  deleteServiceCategory,
} from "../../../controllers/admin/services/serviceCategoryController.js";
import {
  authorizeUser,
  roleAuthorization,
} from "../../../middlewares/authMiddleware.js";

const router = express.Router();

// POST: Create a new service category
router.post(
  "/createServiceCategory",
  authorizeUser,
  roleAuthorization(["Admin"]),
  createServiceCategory
);
// GET: Get all service categories
router.get("/getAllServiceCategories", getAllServiceCategories);
// GET: Get a service category by ID
router.get("/getServiceCategory/:id", getServiceCategoryById);
// PUT: Update a service category by ID
router.put(
  "/updateServiceCategory/:id",
  authorizeUser,
  roleAuthorization(["Admin"]),
  updateServiceCategory
);
// DELETE: Delete a service category by ID
router.delete(
  "/deleteServiceCategory/:id",
  authorizeUser,
  roleAuthorization(["Admin"]),
  deleteServiceCategory
);

export default router;
