"use client";
import { User } from "@/types/auth/authTypes";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ProfileState = {
  user: User | null;
  loading: boolean;
};

const initialState: ProfileState = {
  user: null,
  loading: false,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
});

export const { setUser, setLoading } = profileSlice.actions;
export default profileSlice.reducer;
// const profileSlice = createSlice({
//   name: "profile",
//   initialState,
//   reducers: {
//     setUser(state, value) {
//       state.user = value.payload;
//     },
//     setLoading(state, value) {
//       state.loading = value.payload;
//     },
//   },
// });

// export const { setUser, setLoading } = profileSlice.actions;
// export default profileSlice.reducer;
