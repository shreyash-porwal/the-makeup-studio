"use client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  signupData: null,
  loading: false,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSignupData(state, value) {
      state.signupData = value.payload;
    },
    setLoading(state, value) {
      state.loading = value.payload;
    },
    setToken(state, value) {
      state.token = value.payload;
    },
  },
});

export const { setSignupData, setLoading, setToken } = authSlice.actions;
export default authSlice.reducer;

// import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import API from "@/api/axios";
// import { User } from "@/types/auth/authTypes";

// type AuthState = {
//   user: User | null;
//   isAuthenticated: boolean;
// };

// const initialState: AuthState = {
//   user: null,
//   isAuthenticated: false,
// };

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     setUser: (state, action: PayloadAction<User>) => {
//       state.user = action.payload;
//       state.isAuthenticated = true;
//     },
//     logoutUser: (state) => {
//       state.user = null;
//       state.isAuthenticated = false;
//     },
//   },
// });

// export const { setUser, logoutUser } = authSlice.actions;
// export default authSlice.reducer;
