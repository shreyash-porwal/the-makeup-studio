import { Document } from "mongoose";

export type ServiceCategoryType = Document & {
  catName: string;
  catDescription?: string;
};
