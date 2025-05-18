"use client";
import { signUp } from "@/services/operations/authAPI";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { RegisterFormData } from "@/types/auth/authTypes";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import OtpInput from "react-otp-input";
import { toast } from "sonner";
const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const { signupData, loading } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    // Only allow access of this route when user has filled the signup form
    if (!signupData) {
      router.push("/signup");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleVerifyAndSignup = (e: any) => {
    e.preventDefault();

    if (otp.length < 6) {
      toast.error("Please enter a valid OTP");
      return;
    }
    if (!signupData) {
      toast.error("signupData is undefined!");
      return; // or handle accordingly
    }
    const obj: RegisterFormData = {
      ...(signupData as RegisterFormData),
      otp: otp,
    };
    console.log("Sign Up Data", obj);
    dispatch(signUp(obj, (path: string) => router.push(path)));
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] grid place-items-center mt-28">
      {loading ? (
        <div>
          <div className="spinner">Loading</div>
        </div>
      ) : (
        <div className="max-w-[500px] p-4 lg:p-8">
          <h1 className="text-richblack-5 font-semibold text-[1.875rem] leading-[2.375rem]">
            Verify Email
          </h1>
          <p className="text-[1.125rem] leading-[1.625rem] my-4 text-richblack-100">
            A verification code has been sent to you. Enter the code below
          </p>
          <h2>Enter OTP</h2>
          <form onSubmit={handleVerifyAndSignup}>
            <OtpInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              renderInput={(props) => (
                <input
                  {...props}
                  placeholder="-"
                  style={{
                    boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                  }}
                  className="w-[48px] lg:w-[60px] border-0 bg-gray-800 rounded-[0.5rem] text-gray-100 aspect-square text-center focus:border-0 focus:outline-2 focus:outline-yellow-50"
                />
              )}
              containerStyle={{
                justifyContent: "space-between",
                gap: "0 6px",
              }}
            />
            <button
              type="submit"
              className="w-full bg-yellow-200 py-[12px] px-[12px] rounded-[8px] mt-6 font-medium text-gray-900"
            >
              Verify Email
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default VerifyOtp;
