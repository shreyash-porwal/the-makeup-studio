import API from "@/api/axios";
import { categoriesEndpoints } from "../apiEndpoints";
import { CategoryType } from "@/types/categoryType";
const {
  GET_CATEGORIES,
  CREATE_CATEGORY,
  DELETE_CATEGORY,
  GET_CATEGORY_BY_ID,
  UPDATE_CATEGORY,
} = categoriesEndpoints;

export async function getCategories(url: string) {
  const response = await API.get(GET_CATEGORIES + url);
  console.log("response", response);
  return response.data;
}

export async function getCategoryById(id: string) {
  const response = await API.get(GET_CATEGORY_BY_ID(id));
  return response.data;
}

export async function createCategory(data: CategoryType) {
  const response = await API.post(CREATE_CATEGORY, data);
  return response.data;
}

export async function updateCategory(id: string, data: any) {
  const response = await API.put(UPDATE_CATEGORY(id), data);
  return response.data;
}

export async function deleteCategory(id: string) {
  const response = await API.delete(DELETE_CATEGORY(id));
  return response.data;
}
