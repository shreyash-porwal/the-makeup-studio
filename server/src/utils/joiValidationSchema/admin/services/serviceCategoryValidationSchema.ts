import Joi from "joi";
import { ServiceCategoryType } from "../../../../types/admin/services/serviceCategoryTypes.js";

export const serviceCategorySchema = Joi.object<ServiceCategoryType>({
  catName: Joi.string().max(100).required().messages({
    "string.base": "Category Name must be a string",
    "string.empty": "Category Name is required",
    "string.max": "Category Name must not exceed 100 characters",
  }),
  catDescription: Joi.string().max(200).optional().messages({
    "string.base": "Category Description must be a string",
    "string.max": "Category Description must not exceed 200 characters",
  }),
});
