import { Schema, model } from "mongoose";
import { ServiceCategoryType } from "../../../types/admin/services/serviceCategoryTypes.js";

const ServiceCategorySchema = new Schema<ServiceCategoryType>(
  {
    catName: {
      type: String,
      required: [true, "Category Name is required"],
      unique: true,
      maxLength: [100, "Category Name must not exceed 100 characters"],
    },
    catDescription: {
      type: String,
      maxLength: [200, "Category Description must not exceed 100 characters"],
    },
  },
  { timestamps: true }
);

export const ServiceCategory = model<ServiceCategoryType>(
  "ServiceCategory",
  ServiceCategorySchema
);
