import Joi from "joi";
import { UserType } from "../../types/userType.js";

export const userSchema = Joi.object<UserType>({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});
