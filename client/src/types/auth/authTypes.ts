export type LoginPayload = {
  email: string;
  password: string;
};

export type User = {
  _id: string;
  name: string;
  email: string;
  role?: string;
};
