import Joi from "joi";
import { CreateBookingDto } from "../../../types/masters/bookingTypes.js";

export const createBookingSchema = Joi.object<CreateBookingDto>({
  userId: Joi.string().required().messages({
    "string.base": "User ID must be a string",
    "string.empty": "User ID is required",
  }),
  serviceId: Joi.string().required().messages({
    "string.base": "Service ID must be a string",
    "string.empty": "Service ID is required",
  }),
  date: Joi.date().iso().required().messages({
    "date.base": "Date must be a valid ISO 8601 date",
    "any.required": "Date is required",
  }),
  time: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .required()
    .messages({
      "string.pattern.base": "Time must be in 24-hour format (e.g., 14:30)",
    }),
  serviceLocation: Joi.string().optional().messages({
    "string.base": "Service Location must be a string",
  }),
  isOnSite: Joi.boolean().required().messages({
    "boolean.base": "On-Site status must be a boolean",
    "any.required": "On-Site status is required",
  }),
});

export const rescheduleBookingSchema = Joi.object({
  newDate: Joi.string().isoDate().required().messages({
    "string.base": "New date must be a string",
    "string.isoDate": "New date must be in ISO date format (YYYY-MM-DD)",
    "any.required": "New date is required",
  }),
  newTime: Joi.string()
    .pattern(/^([0-1]\d|2[0-3]):([0-5]\d)$/)
    .required()
    .messages({
      "string.base": "New time must be a string",
      "string.pattern.base": "New time must be in HH:mm format (24-hour)",
      "any.required": "New time is required",
    }),
});

export const updateBookingSchema = Joi.object({
  status: Joi.string().valid("confirmed", "cancelled").required().messages({
    "any.only": "Status must be either 'confirmed' or 'cancelled'",
    "any.required": "Status is required",
  }),

  rejectionReason: Joi.string().allow("", null).optional().messages({
    "string.base": "Rejection reason must be a string",
  }),
});
