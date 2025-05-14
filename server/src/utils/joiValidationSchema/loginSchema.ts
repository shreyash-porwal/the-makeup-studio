import Joi from "joi";
import { LogInType } from "../../types/auth/authType.js";

export const logInSchema = Joi.object<LogInType>({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});
