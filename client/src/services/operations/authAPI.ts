// "use client";
import { AppDispatch } from "@/store";
import { endpoints } from "../apiEndpoints";
import { toast } from "sonner";
import { setLoading, setToken } from "@/store/slices/authSlice";
import API from "@/api/axios";
import { setUser } from "@/store/slices/profileSlice";
const { SENDOTP_API, SIGNUP_API, LOGIN_API } = endpoints;

export function sendOtp(email: string, navigate: (path: string) => void) {
  return async (dispatch: AppDispatch): Promise<void> => {
    dispatch(setLoading(true));

    try {
      const response = await API.post(SENDOTP_API, {
        email,
        checkUserPresent: true,
      });

      console.log("SENDOTP API RESPONSE............", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("OTP sent successfully");
      navigate("/verify-email");
    } catch (error: any) {
      console.error("SENDOTP API ERROR............", error);
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

      console.log("LOGIN API RESPONSE............", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      console.log("Success ====== ", response.data.data.success);
      toast.success("Login Successful");
      const user = response.data?.data?.user;
      const token = response.data?.data?.token;

      if (!user || !token) {
        throw new Error("Invalid user data or token.");
      }

      console.log("User", user, token);
      dispatch(setToken(token));
      const userImage = `https://api.dicebear.com/5.x/initials/svg?seed=${user.firstName} ${user.lastName}`;
      console.log("User Image ===", userImage);
      dispatch(setUser({ user }));
      localStorage.setItem("token", JSON.stringify(token));
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/dashboard/my-profile");
    } catch (error: any) {
      console.log("LOGIN API ERROR............", error);
      toast.error(error?.message || "Login Failed");
    } finally {
      dispatch(setLoading(false));
    }
  };
}
