"use client";
import { getUserData } from "@/services/operations/authAPI";
import { useAppDispatch } from "@/store/hooks";
import { setLoading, setUser } from "@/store/slices/profileSlice";
import { set } from "date-fns";
import React, { useEffect } from "react";

const AppInitializer = ({ children }: any) => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    console.log("====================Inside App Initializer ==============");
    const fetchData = async () => {
      try {
        dispatch(setLoading(true));
        const res = await getUserData();
        console.log("User data:", res);
        if (res?.success) {
          // Handle successful user data retrieval
          if (res?.data !== null) {
            dispatch(setUser(res?.data?.user));
          }
          console.log("User data retrieved successfully");
        }
        dispatch(setLoading(false));
        // You could store in global state if needed
      } catch (error) {
        console.error("Error fetching user data", error);
        // Avoid reload/redirect unless necessary
      }
    };

    fetchData();
  }, []);
  return children;
};

export default AppInitializer;
