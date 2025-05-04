import { Document, Types } from "mongoose";
import { ServiceCategoryType } from "./serviceCategoryTypes.js";

export type ServiceType = Document & {
  categoryId: Types.ObjectId | ServiceCategoryType | string;
  serviceName: string;
  serviceDescription?: string;
  durationInMinutes: number;
  price: number;
  offerDiscountPercent?: number;
  isFeatured?: boolean;
  imageUrls: string[];
  videoUrls?: string[];
  available?: boolean;
};
