import { Schema, model } from "mongoose";
import { ServiceType } from "../../../types/admin/services/serviceType.js";

const ServiceSchema = new Schema<ServiceType>(
  {
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "ServiceCategory",
      required: [true, "Category is required"],
    },
    serviceName: {
      type: String,
      required: [true, "Service Name is required"],
      maxLength: [150, "Service Name must not exceed 150 characters"],
    },
    serviceDescription: {
      type: String,
      maxLength: [300, "Service Description must not exceed 300 characters"],
    },
    durationInMinutes: {
      type: Number,
      required: true,
      min: [5, "Minimum duration is 5 minutes"],
    },
    price: {
      type: Number,
      required: true,
      min: [0, "Price must be positive"],
    },
    offerDiscountPercent: {
      type: Number,
      min: [0, "Discount can't be negative"],
      max: [100, "Discount can't exceed 100%"],
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    imageUrls: {
      type: [String],
      required: [true, "At least one image is required"],
      validate: {
        validator: (arr: string[]) => Array.isArray(arr) && arr.length > 0,
        message: "At least one image must be provided",
      },
    },
    videoUrls: {
      type: [String],
    },
    available: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Service = model<ServiceType>("Service", ServiceSchema);
