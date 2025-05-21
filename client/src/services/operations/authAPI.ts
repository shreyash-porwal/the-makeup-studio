// "use client";
import { AppDispatch } from "@/store";
import { endpoints } from "../apiEndpoints";
import { toast } from "sonner";
import { setLoading, setToken } from "@/store/slices/authSlice";
import API from "@/api/axios";
import { setUser } from "@/store/slices/profileSlice";
import { RegisterFormData } from "@/types/auth/authTypes";
const { SENDOTP_API, SIGNUP_API, LOGIN_API, GET_USER, LOGOUT_API } = endpoints;

export function sendOtp(email: string, navigate: (path: string) => void) {
  return async (dispatch: AppDispatch): Promise<void> => {
    dispatch(setLoading(true));

    try {
      const response = await API.post(SENDOTP_API, {
        email,
        checkUserPresent: true,
      });

      // console.log("SENDOTP API RESPONSE............", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("OTP sent successfully");
      navigate("/verify-email");
    } catch (error: any) {
      // console.error("SENDOTP API ERROR............", error);
      toast.error(
        error?.response?.data?.message || error.message || "Could not send OTP"
      );
    } finally {
      dispatch(setLoading(false));
    }
  };
}

export function login(
  email: string,
  password: string,
  navigate: (path: string) => void
) {
  return async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    try {
      const formData = { email, password };
      const response = await API.post(LOGIN_API, formData);

      // console.log("LOGIN API RESPONSE............", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      if (response && response.data.success === false) {
        throw new Error(response.data.message);
      }

      if (response && response.data.success === true) {
        toast.success("Login Successful");
        const user = response.data.data;
        if (!user) {
          throw new Error("Invalid user data or token.");
        }
        const userImage = `https://api.dicebear.com/5.x/initials/svg?seed=${user.firstName} ${user.lastName}`;
        console.log("User Image URL:", userImage);
        dispatch(setUser(user));
        navigate(
          user.role === "Admin" ? "/admin-dashboard" : "/user-dashboard"
        );
      }
    } catch (error: any) {
      toast.error(error?.message || "Login Failed");
    } finally {
      dispatch(setLoading(false));
    }
  };
}

export async function getUserData() {
  const response = await API.get(GET_USER);
  // console.log("response", response);
  return response.data;
}

export async function LogOut() {
  const response = await API.post(LOGOUT_API);
  // console.log(response);
  return response.data;
}

export function signUp(
  data: RegisterFormData,
  navigate: (path: string) => void
) {
  return async (dispatch: AppDispatch): Promise<void> => {
    dispatch(setLoading(true));
    try {
      // console.log("SIGNUP_API", SIGNUP_API);
      const response = await API.post(SIGNUP_API, data);

      // console.log("SIGNUP API RESPONSE............", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("Signup Successful");
      navigate("/login");
    } catch (error: any) {
      // console.log("SIGNUP API ERROR............", error.message);
      toast.error("Signup Failed");
      navigate("/signup");
    }
    dispatch(setLoading(false));
  };
}
