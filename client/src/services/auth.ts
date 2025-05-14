// // services/auth.ts
// import API from "@/api/axios";
// import { LoginPayload } from "@/types/auth/authTypes";

// export const login = async (data: LoginPayload) => {
//   const response = await API.post("/auth/login", data);
//   return response.data;
// };

// const handleLogin = async (e: React.FormEvent) => {
//   e.preventDefault();
//   try {
//     const res = await login(formData);
//     if (res?.success == true) {
//       const { token, user } = res.data;

//       // Store in localStorage
//       localStorage.setItem("token", token);
//       localStorage.setItem("user", JSON.stringify(user));
//       dispatch(setUser(res.data));
//       dispatch(setToken(res.data));

//       if (user?.role === "User") {
//         console.log("User === ", res.data);
//       } else if (user?.role == "Admin") {
//         console.log("Admin === ", res.data);
//       }
//     } else {
//       toast.error("Something Went Wrong");
//     }
//   } catch (err) {
//     console.error("Login failed", err);
//   }
// };
