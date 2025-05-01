export type UserType = {
  name: string;
  email: string;
  password: string;
  gender: "Male" | "Female" | "Other";
  dob: Date;
  otp?: string;
  otpExpiry?: Date;
  isVerified?: boolean;
};
