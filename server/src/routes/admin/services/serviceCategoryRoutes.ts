import express from "express";
import {
  createServiceCategory,
  getAllServiceCategories,
  getServiceCategoryById,
  updateServiceCategory,
  deleteServiceCategory,
} from "../../../controllers/admin/services/serviceCategoryController.js";
import {
  auth,
  roleAuthorization,
} from "../../../middlewares/authMiddleware.js";

const router = express.Router();

// POST: Create a new service category
router.post(
  "/create-category",
  auth,
  roleAuthorization(["Admin"]),
  createServiceCategory
);
// GET: Get all service categories
router.get("/categories", getAllServiceCategories);
// GET: Get a service category by ID
router.get("/getServiceCategory/:id", getServiceCategoryById);
// PUT: Update a service category by ID
router.put(
  "/updateServiceCategory/:id",
  auth,
  roleAuthorization(["Admin"]),
  updateServiceCategory
);
// DELETE: Delete a service category by ID
router.delete(
  "/categories/delete/:id",
  auth,
  roleAuthorization(["Admin"]),
  deleteServiceCategory
);

export default router;
