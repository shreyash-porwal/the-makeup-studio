import { Request, Response } from "express";
import { TryCatch } from "../../../middlewares/errorMiddleware.js";
import { CustomRequest } from "../../../types/reqResTypes/responseTypes.js";
import {
  errorResponse,
  successResponse,
} from "../../../utils/genericResponse.js";
import { ServiceCategoryType } from "../../../types/admin/services/serviceCategoryTypes.js";
import { validateWithSchema } from "../../../utils/validationFunction.js";
import { ServiceCategory } from "../../../models/admin/services/serviceCategorySchema.js";
import { serviceCategorySchema } from "../../../utils/joiValidationSchema/admin/services/serviceCategoryValidationSchema.js";

// CREATE a new category
export const createServiceCategory = TryCatch(
  async (
    req: CustomRequest,
    res: Response
  ): Promise<Response<any, Record<string, any>> | void> => {
    const reqObjCategory: ServiceCategoryType = req.body;

    const validateReqObj = validateWithSchema<ServiceCategoryType>(
      serviceCategorySchema,
      reqObjCategory
    );
    const category = await ServiceCategory.create(validateReqObj);

    return res
      .status(201)
      .json(successResponse(category, "Category Created Successfully"));
  }
);

// READ all categories
export const getAllServiceCategories = TryCatch(
  async (req: CustomRequest, res: Response) => {
    const categories = await ServiceCategory.find().sort({ createdAt: -1 });
    return res
      .status(200)
      .json(successResponse(categories, "All categories fetched successfully"));
  }
);

// READ single category by ID
export const getServiceCategoryById = TryCatch(
  async (req: CustomRequest, res: Response) => {
    const id = req.params.id;
    if (id) {
      const category = await ServiceCategory.findById(id);
      if (!category)
        return res.status(404).json(errorResponse("Category not found"));

      return res
        .status(200)
        .json(successResponse(category, `Category by id ${id}`));
    }
    return res.json(errorResponse("Please provide category id"));
  }
);

// UPDATE category by ID
export const updateServiceCategory = TryCatch(
  async (req: CustomRequest, res: Response) => {
    const reqObjCategory = req.body;
    const validObj = validateWithSchema<ServiceCategoryType>(
      serviceCategorySchema,
      reqObjCategory
    );
    const category = await ServiceCategory.findByIdAndUpdate(
      req.params.id,
      validObj,
      { new: true, runValidators: true }
    );

    if (!category)
      return res.status(404).json(errorResponse("Category not found"));

    return res
      .status(200)
      .json(successResponse(category, "Category Updated Successfully"));
  }
);

// DELETE category by ID
export const deleteServiceCategory = TryCatch(
  async (req: CustomRequest, res: Response) => {
    const category = await ServiceCategory.findByIdAndDelete(req.params.id);
    if (!category)
      return res.status(404).json(errorResponse("Category not found"));

    return res.json(successResponse("Category deleted successfully"));
  }
);
