"use client";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { RegisterFormData } from "@/types/auth/authTypes";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { setSignupData } from "@/store/slices/authSlice";
import { sendOtp } from "@/services/operations/authAPI";
const SignUpPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const signupDataa = useAppSelector((state) => state.auth.signupData);

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<RegisterFormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      dob: null,
      gender: "",
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const signupData = {
      ...data,
      dob: data.dob ? format(data.dob, "yyyy-MM-dd") : null,
    };

    dispatch(setSignupData(signupData));
    dispatch(sendOtp(data.email, (path: string) => router.push(path)));
    reset();
  };

  const password = watch("password");

  return (
    <div className="min-h-screen w-full flex items-center justify-center my-8 mt-20">
      <div className="w-full max-w-md p-8 rounded-md border border-gray-600 shadow-lg">
        <h1 className="text-2xl font-semibold text-richblack-5 mb-6 text-center">
          Create an account
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="text-sm text-richblack-5">
                First Name <sup className="text-pink-500">*</sup>
              </label>
              <input
                {...register("firstName", {
                  required: "First name is required",
                })}
                className="w-full p-2 mt-1 rounded-md bg-richblack-700 text-richblack-5 border border-richblack-600"
                placeholder="Enter first name"
              />
              {errors.firstName && (
                <p className="text-xs text-pink-500 mt-1">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div className="w-1/2">
              <label className="text-sm text-richblack-5">
                Last Name <sup className="text-pink-500">*</sup>
              </label>
              <input
                {...register("lastName", { required: "Last name is required" })}
                className="w-full p-2 mt-1 rounded-md bg-richblack-700 text-richblack-5 border border-richblack-600"
                placeholder="Enter last name"
              />
              {errors.lastName && (
                <p className="text-xs text-pink-500 mt-1">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="text-sm text-richblack-5">
              Email Address <sup className="text-pink-500">*</sup>
            </label>
            <input
              {...register("email", { required: "Email is required" })}
              className="w-full p-2 mt-1 rounded-md bg-richblack-700 text-richblack-5 border border-richblack-600"
              placeholder="Enter email"
            />
            {errors.email && (
              <p className="text-xs text-pink-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm text-richblack-5">
              Gender <sup className="text-pink-500">*</sup>
            </label>
            <select
              {...register("gender", { required: "Gender is required" })}
              className="w-full p-2 mt-1 rounded-md bg-richblack-700 text-richblack-5 border border-richblack-600"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && (
              <p className="text-xs text-pink-500 mt-1">
                {errors.gender.message}
              </p>
            )}
          </div>

          <div className="w-full flex justify-between items-center">
            <label className="text-sm text-richblack-5 w-1/3">
              Date of Birth <sup className="text-pink-500">*</sup>
            </label>
            <Controller
              control={control}
              name="dob"
              rules={{ required: "Date of birth is required" }}
              render={({ field }) => (
                <DatePicker
                  placeholderText="Select your date of birth"
                  dateFormat="yyyy-MM-dd"
                  maxDate={new Date()}
                  showYearDropdown
                  scrollableYearDropdown
                  yearDropdownItemNumber={100}
                  selected={field.value}
                  onChange={(date) => field.onChange(date)}
                  className="w-full p-2 mt-1 rounded-md bg-richblack-700 text-richblack-5 border border-richblack-600"
                />
              )}
            />
            {errors.dob && (
              <p className="text-xs text-pink-500 mt-1">{errors.dob.message}</p>
            )}
          </div>

          <div>
            <label className="text-sm text-richblack-5">
              Password <sup className="text-pink-500">*</sup>
            </label>
            <div className="relative">
              <input
                {...register("password", { required: "Password is required" })}
                type={showPassword ? "text" : "password"}
                className="w-full p-2 mt-1 rounded-md bg-richblack-700 text-richblack-5 border border-richblack-600 pr-10"
                placeholder="Enter password"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-richblack-200"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>
            {errors.password && (
              <p className="text-xs text-pink-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm text-richblack-5">
              Confirm Password <sup className="text-pink-500">*</sup>
            </label>
            <div className="relative">
              <input
                {...register("confirmPassword", {
                  required: "Confirm password is required",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
                type={showConfirmPassword ? "text" : "password"}
                className="w-full p-2 mt-1 rounded-md bg-richblack-700 text-richblack-5 border border-richblack-600 pr-10"
                placeholder="Confirm password"
              />
              <span
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-richblack-200"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-pink-500 mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-50 text-richblack-900 font-semibold rounded-md py-2 hover:bg-yellow-200 transition-colors duration-200"
          >
            Create an account
          </button>

          <p className="text-sm text-center text-richblack-100 mt-4">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-yellow-500 underline hover:text-yellow-100"
            >
              Login here
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;

// "use client";
// import { setSignupData } from "@/store/slices/authSlice";
// import { Eye, EyeOff } from "lucide-react";
// import { useState } from "react";
// import { toast } from "sonner";
// import { useAppDispatch } from "@/store/hooks";
// import { sendOtp } from "@/services/operations/authAPI";
// import { useRouter } from "next/navigation";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import Image from "next/image";
// const SignUpPage = () => {
//   const router = useRouter();
//   const dispatch = useAppDispatch();

//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     dob: null as Date | null,
//     gender: "",
//   });

//   const { firstName, lastName, email, password, confirmPassword } = formData;

//   // Handle input fields, when some value changes
//   const handleDateChange = (date: Date | null) => {
//     setFormData((prevData) => ({
//       ...prevData,
//       dob: date,
//     }));
//   };

//   const handleOnChange = (e: any) => {
//     setFormData((prevData) => ({
//       ...prevData,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   // Handle Form Submission
//   const handleOnSubmit = (e: any) => {
//     e.preventDefault();

//     if (password !== confirmPassword) {
//       toast.error("Passwords Do Not Match");
//       return;
//     }
//     const signupData = {
//       ...formData,
//       dob: formData.dob ? formData.dob.toISOString() : null,
//     };
//     console.log("Sign up data === ", signupData);

//     // Setting signup data to state
//     // To be used after otp verification
//     dispatch(setSignupData(signupData));
//     // Send OTP to user for verification
//     dispatch(sendOtp(formData.email, (path: string) => router.push(path)));

//     // Reset
//     setFormData({
//       firstName: "",
//       lastName: "",
//       email: "",
//       password: "",
//       confirmPassword: "",
//       dob: null,
//       gender: "",
//     });
//   };
//   return (
//     <div className="h-full pt-50 pb-40 bg-gray-100">
//       <section className="">
//         <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
//           <a
//             href="#"
//             className="flex items-center mb-6 text-2xl font-semibold text-gray-900"
//           >
//             Register
//           </a>
//           <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
//             <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
//               <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
//                 Create an account
//               </h1>
//               <form
//                 onSubmit={handleOnSubmit}
//                 className="space-y-4 md:space-y-6"
//                 action="#"
//               >
//                 <div className="flex gap-x-4">
//                   <div>
//                     <label
//                       htmlFor="firstName"
//                       className="block mb-2 text-sm font-medium text-gray-900"
//                     >
//                       First Name <sup className="text-pink-600">*</sup>
//                     </label>
//                     <input
//                       required
//                       type="text"
//                       name="firstName"
//                       value={firstName}
//                       onChange={handleOnChange}
//                       placeholder="Enter first name"
//                       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
//                     />
//                   </div>

//                   <div>
//                     <label
//                       htmlFor="lastName"
//                       className="block mb-2 text-sm font-medium text-gray-900"
//                     >
//                       Last Name <sup className="text-pink-600">*</sup>
//                     </label>
//                     <input
//                       required
//                       type="text"
//                       name="lastName"
//                       value={lastName}
//                       onChange={handleOnChange}
//                       placeholder="Enter last name"
//                       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
//                     />
//                   </div>
//                 </div>
//                 <div>
//                   <label
//                     htmlFor="email"
//                     className="block mb-2 text-sm font-medium text-gray-900"
//                   >
//                     Email Address <sup className="text-pink-500">*</sup>
//                   </label>
//                   <input
//                     required
//                     type="email"
//                     name="email"
//                     value={email}
//                     onChange={handleOnChange}
//                     placeholder="Enter email address"
//                     className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
//                   />
//                 </div>

//                 <div className="w-full relative">
//                   <label
//                     htmlFor="gender"
//                     className="block mb-2 text-sm font-medium text-gray-900"
//                   >
//                     Gender <sup className="text-pink-500">*</sup>
//                   </label>
//                   <select
//                     name="gender"
//                     id="gender"
//                     required
//                     value={formData.gender}
//                     onChange={handleOnChange}
//                     className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
//                   >
//                     <option value="">Please Select Gender</option>
//                     <option value="Male">Male</option>
//                     <option value="Female">Female</option>
//                     <option value="Other">Other</option>
//                   </select>
//                 </div>

//                 <div className="w-full">
//                   <label
//                     htmlFor="dob"
//                     className="block mb-2 text-sm font-medium text-gray-900"
//                   >
//                     Date of Birth <sup className="text-pink-500">*</sup>
//                   </label>

//                   <DatePicker
//                     id="dob"
//                     selected={formData.dob}
//                     onChange={handleDateChange}
//                     placeholderText="Select your date of birth"
//                     dateFormat="yyyy-MM-dd"
//                     maxDate={new Date()}
//                     showYearDropdown
//                     scrollableYearDropdown
//                     yearDropdownItemNumber={100}
//                     wrapperClassName="w-full" // Ensures wrapper is full width
//                     className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
//                   />
//                 </div>

//                 <div>
//                   <label
//                     htmlFor="password"
//                     className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
//                   >
//                     Password <sup className="text-pink-500">*</sup>
//                   </label>

//                   <div className="relative">
//                     <input
//                       required
//                       type={showPassword ? "text" : "password"}
//                       name="password"
//                       value={password}
//                       onChange={handleOnChange}
//                       placeholder="Enter Password"
//                       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 pr-10"
//                     />
//                     <span
//                       onClick={() => setShowPassword((prev) => !prev)}
//                       className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
//                     >
//                       {showPassword ? (
//                         <EyeOff fontSize={20} fill="#AFB2BF" />
//                       ) : (
//                         <Eye fontSize={20} fill="#AFB2BF" />
//                       )}
//                     </span>
//                   </div>
//                 </div>

//                 <div>
//                   <label
//                     htmlFor="confirmPassword"
//                     className="block mb-2 text-sm font-medium text-gray-900"
//                   >
//                     Confirm password <sup className="text-pink-500">*</sup>
//                   </label>

//                   <div className="relative">
//                     <input
//                       required
//                       type={showConfirmPassword ? "text" : "password"}
//                       name="confirmPassword"
//                       value={confirmPassword}
//                       onChange={handleOnChange}
//                       placeholder="Confirm Password"
//                       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 pr-10"
//                     />
//                     <span
//                       onClick={() => setShowConfirmPassword((prev) => !prev)}
//                       className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
//                     >
//                       {showConfirmPassword ? (
//                         <EyeOff fontSize={20} fill="#AFB2BF" />
//                       ) : (
//                         <Eye fontSize={20} fill="#AFB2BF" />
//                       )}
//                     </span>
//                   </div>
//                 </div>

//                 <button
//                   type="submit"
//                   className="w-full text-black bg-primary-800 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center border border-black"
//                 >
//                   Create an account
//                 </button>
//                 <p className="text-sm font-light text-gray-500 dark:text-gray-400">
//                   Already have an account?{" "}
//                   <a
//                     href="/login"
//                     className="font-medium text-primary-600 hover:underline dark:text-primary-500"
//                   >
//                     Login here
//                   </a>
//                 </p>
//               </form>
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default SignUpPage;
