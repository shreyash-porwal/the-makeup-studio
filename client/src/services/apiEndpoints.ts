// const BASE_URL = process.env.REACT_APP_BASE_URL;
const BASE_URL = "http://localhost:4000/api/v1";

// AUTH ENDPOINTS
export const endpoints = {
  GET_USER: BASE_URL + "/auth/me",
  SENDOTP_API: BASE_URL + "/auth/sendotp",
  SIGNUP_API: BASE_URL + "/auth/signup",
  LOGIN_API: BASE_URL + "/auth/login",
  LOGOUT_API: BASE_URL + "/auth/logout",
  RESETPASSTOKEN_API: BASE_URL + "/auth/reset-password-token",
  RESETPASSWORD_API: BASE_URL + "/auth/reset-password",
};

export const categoriesEndpoints = {
  GET_CATEGORIES: BASE_URL + "/services",
  // GET_CATEGORY: (id: string) => `${BASE_URL}/categories/${id}`,
  // CREATE_CATEGORY: BASE_URL + "/categories",
  // UPDATE_CATEGORY: (id: string) => `${BASE_URL}/categories/${id}`,
  // DELETE_CATEGORY: (id: string) => `${BASE_URL}/categories/${id}`,
};
