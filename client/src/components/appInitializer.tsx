"use client";
import { getUserData } from "@/services/operations/authAPI";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setLoading, setUser } from "@/store/slices/profileSlice";
import { set } from "date-fns";
import React, { useEffect } from "react";

const AppInitializer = ({ children }: any) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.profile.user);
  useEffect(() => {
    console.log("====================Inside App Initializer ==============");
    const fetchData = async () => {
      try {
        dispatch(setLoading(true));
        const res = await getUserData();
        console.log("User data:", res);

        if (!res) {
          console.error("No response from server");
          dispatch(setLoading(false));
          return;
        }

        if (res && res.success === false) {
          console.error("Error fetching user data", res?.message);
          dispatch(setLoading(false));
          return;
        }

        if (res && res.success && res.data !== null) {
          dispatch(setUser(res.data));
        }

        dispatch(setLoading(false));
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    };

    fetchData();
  }, []);
  return children;
};

export default AppInitializer;
