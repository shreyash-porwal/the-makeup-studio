import API from "@/api/axios";
import { categoriesEndpoints } from "../apiEndpoints";
const { GET_CATEGORIES } = categoriesEndpoints;

export async function getCategories(url: string) {
  const response = await API.get(GET_CATEGORIES + url);
  console.log("response", response);
  return response.data;
}
