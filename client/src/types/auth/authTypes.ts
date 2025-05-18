export type LoginPayload = {
  email: string;
  password: string;
};

export type User = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "Admin" | "User";
  dob?: string;
  gender?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type RegisterFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  dob: Date | null;
  gender: string;
  otp?: string;
};
