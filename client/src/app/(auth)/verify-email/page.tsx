// import { useAppDispatch, useAppSelector } from "@/store/hooks";
// import { useRouter } from "next/navigation";
// import React, { useEffect, useState } from "react";
// import OtpInput from "react-otp-input";
// const VerifyOtp = () => {
//   const [otp, setOtp] = useState("");
//   const { signupData, loading } = useAppSelector((state) => state.auth);
//   const dispatch = useAppDispatch();
//   const router = useRouter();

//   useEffect(() => {
//     // Only allow access of this route when user has filled the signup form
//     if (!signupData) {
//       router.push("/signup");
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const handleVerifyAndSignup = (e: any) => {
//     e.preventDefault();
//     const obj = signupData;
//     console.log("Sign Up Data", obj);

//     // dispatch(signUp({ obj }));
//   };

//   return (
//     <div>
//       <h2>Enter OTP</h2>
//       <form onSubmit={handleVerifyAndSignup}>
//         <OtpInput
//           value={otp}
//           onChange={setOtp}
//           numInputs={6}
//           renderInput={(props) => (
//             <input
//               {...props}
//               placeholder="-"
//               style={{
//                 boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
//               }}
//               className="w-[48px] lg:w-[60px] border-0 bg-richblack-800 rounded-[0.5rem] text-richblack-5 aspect-square text-center focus:border-0 focus:outline-2 focus:outline-yellow-50"
//             />
//           )}
//           containerStyle={{
//             justifyContent: "space-between",
//             gap: "0 6px",
//           }}
//         />
//         <button
//           type="submit"
//           className="w-full bg-yellow-50 py-[12px] px-[12px] rounded-[8px] mt-6 font-medium text-richblack-900"
//         >
//           Verify Email
//         </button>
//       </form>
//       <button onClick={handleSubmit}>Submit</button>
//     </div>
//   );
// };

// export default VerifyOtp;
