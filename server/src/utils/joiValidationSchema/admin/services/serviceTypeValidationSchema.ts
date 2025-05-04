import Joi from "joi";
import { ServiceType } from "../../../../types/admin/services/serviceType.js";

export const serviceSchema = Joi.object<ServiceType>({
  categoryId: Joi.string().required().messages({
    "string.base": "Category ID must be a string",
    "string.empty": "Category is required",
  }),

  serviceName: Joi.string().max(100).required().messages({
    "string.base": "Service Name must be a string",
    "string.empty": "Service Name is required",
    "string.max": "Service Name must not exceed 100 characters",
  }),

  serviceDescription: Joi.string().max(300).optional().allow("").messages({
    "string.base": "Service Description must be a string",
    "string.max": "Service Description must not exceed 300 characters",
  }),

  durationInMinutes: Joi.number().integer().min(5).required().messages({
    "number.base": "Duration must be a number",
    "number.min": "Minimum duration is 5 minutes",
    "any.required": "Duration is required",
  }),

  price: Joi.number().min(0).required().messages({
    "number.base": "Price must be a number",
    "number.min": "Price must be positive",
    "any.required": "Price is required",
  }),

  offerDiscountPercent: Joi.number().min(0).max(100).optional().messages({
    "number.base": "Discount must be a number",
    "number.min": "Discount cannot be negative",
    "number.max": "Discount cannot exceed 100%",
  }),

  isFeatured: Joi.boolean().optional().messages({
    "boolean.base": "Featured flag must be a boolean",
  }),

  imageUrls: Joi.array()
    .items(
      // Joi.string().uri().required().messages({
      Joi.string().required().messages({
        "string.base": "Each image URL must be a string",
      })
    )
    .min(1)
    .required()
    .messages({
      "array.base": "Image must be an array of strings",
      "array.min": "At least one image is required",
      "any.required": "At least Single Image is required",
    }),
  videoUrls: Joi.array()
    .items(
      Joi.string().messages({
        "string.base": "Each video URL must be a string",
      })
    )
    .messages({
      "array.base": "Video URLs must be an array of strings",
    })
    .optional(),
  available: Joi.boolean().optional().messages({
    "boolean.base": "Available flag must be a boolean",
  }),
});
