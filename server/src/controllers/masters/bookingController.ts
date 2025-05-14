import { Response } from "express";
import { TryCatch } from "../../middlewares/errorMiddleware.js";
import { CustomRequest } from "../../types/reqResTypes/responseTypes.js";
import { errorResponse, successResponse } from "../../utils/genericResponse.js";
import {
  BookingType,
  CreateBookingDto,
  RescheduleBookingDto,
  UpdateBookingDto,
} from "../../types/masters/bookingTypes.js";
import Booking from "../../models/masters/bookingSchema.js";
import { validateWithSchema } from "../../utils/validationFunction.js";
import {
  createBookingSchema,
  rescheduleBookingSchema,
  updateBookingSchema,
} from "../../utils/joiValidationSchema/masters/bookingValidationSchema.js";
import dayjs from "dayjs";

import { User } from "../../models/masters/userSchema.js";
import { sendMail } from "../../config/nodemailer.js";
import { Service } from "../../models/admin/services/serviceTypeSchema.js";
// Create Booking
export const createBooking = TryCatch(
  async (req: CustomRequest, res: Response) => {
    const reqObj: CreateBookingDto = req.body;

    if (req?.user) {
      const reqUser: any = req.user._id;
      reqObj.userId = reqUser.toString();
      console.log(reqObj);
    } // Validate time format HH:mm (24-hour)
    const isValid24HourTime = /^([01]\d|2[0-3]):([0-5]\d)$/.test(reqObj.time);
    if (!isValid24HourTime) {
      return res
        .status(400)
        .json(errorResponse("Invalid time format. Use HH:mm (24-hour)."));
    }

    // Check if the slot is already booked
    const isSlotTaken = await Booking.findOne({
      serviceId: reqObj.serviceId,
      date: reqObj.date,
      time: reqObj.time,
      status: { $ne: "cancelled" },
    });

    const service = await Service.findById(reqObj.serviceId);
    console.log(service, isSlotTaken, reqObj);

    if (!service) {
      // service exists, continue logic
      return res
        .status(404)
        .json(errorResponse(`Service with id ${reqObj.serviceId} not found.`));
    }

    if (isSlotTaken) {
      return res.status(409).json(errorResponse("Slot is already booked."));
    }

    const validObj = validateWithSchema<BookingType>(
      createBookingSchema,
      reqObj
    );

    // Validate time is between 06:00 and 14:00
    // const timeOnly = dayjs(validObj.time, "HH:mm", true);
    // const minTime = dayjs("06:00", "HH:mm");
    // const maxTime = dayjs("14:00", "HH:mm");

    // if (
    //   !timeOnly.isValid() ||
    //   timeOnly.isBefore(minTime) ||
    //   timeOnly.isAfter(maxTime)
    // ) {
    //   return res
    //     .status(400)
    //     .json(errorResponse("Time must be between 06:00 and 14:00."));
    // }

    const booking = await Booking.create({
      userId: validObj.userId,
      serviceId: validObj.serviceId,
      date: validObj.date,
      time: validObj.time,
      address: validObj.isOnSite
        ? validObj.serviceLocation
        : "2,Gopal Mandir,Ujjain,MP",
      isOnSite: validObj.isOnSite,
      status: "pending",
      rescheduleFlag: false,
    });

    return res
      .status(201)
      .json(successResponse(booking, "Booking requested successfully."));
  }
);

// Get All Bookings (Admin)
export const getAllBookings = TryCatch(
  async (req: CustomRequest, res: Response) => {
    const bookings = await Booking.find()
      .populate("userId")
      .populate("serviceId");
    return res
      .status(200)
      .json(successResponse(bookings, "All bookings fetched successfully."));
  }
);

// Get Booking by booking ID
export const getBookingById = TryCatch(
  async (req: CustomRequest, res: Response) => {
    const booking = await Booking.findById(req.params.id)
      .populate("userId")
      .populate("serviceId");
    if (!booking)
      return res.status(404).json(errorResponse("Booking not found."));
    return res
      .status(200)
      .json(successResponse(booking, "Booking fetched successfully."));
  }
);

//Get all bookings for a particular user by user id
export const getBookingsByUserId = TryCatch(
  async (req: CustomRequest, res: Response) => {
    const userId = req.params.userId;

    // const user = await User.findById(userId);
    const bookings = await Booking.find({ userId }).populate("serviceId");

    if (!bookings || bookings.length === 0) {
      return res
        .status(404)
        .json(errorResponse("No bookings found for this user."));
    }

    // const result = {
    //   user: user?.toObject?.(), // optional, to avoid circular refs
    //   bookings: bookings.map((b) => b.toObject?.() ?? b),
    // };

    return res
      .status(200)
      .json(successResponse(bookings, "User's bookings fetched successfully."));
  }
);

// Cancel Booking (User/Admin)
export const cancelBooking = TryCatch(
  async (req: CustomRequest, res: Response) => {
    const booking = await Booking.findById(req.params.id);
    if (!booking)
      return res.status(404).json(errorResponse("Booking not found."));

    if (!req.user || booking.userId.toString() !== req.user._id) {
      return res
        .status(403)
        .json(errorResponse("You are not authorized to cancel this booking."));
    }

    // Get current date and compare with the booking date
    const currentDate = new Date();
    const bookingDate = new Date(booking.date);
    const timeDifference = bookingDate.getTime() - currentDate.getTime();
    const daysDifference = timeDifference / (1000 * 3600 * 24); // Convert time difference to days

    // Check if the booking is at least 4 days before the scheduled date
    if (daysDifference < 4) {
      return res
        .status(400)
        .json(
          errorResponse(
            "Booking can only be cancelled 4 days before the scheduled date."
          )
        );
    }

    // Proceed with cancellation if it's within the allowed time window
    booking.status = "cancelled";
    await booking.save();

    return res
      .status(200)
      .json(successResponse(booking, "Booking cancelled successfully."));
  }
);

// Reschedule Booking (User)
export const rescheduleBooking = TryCatch(
  async (req: CustomRequest, res: Response) => {
    const reqObj: RescheduleBookingDto = req.body;

    const booking = await Booking.findById(req.params.id);
    if (!booking)
      return res.status(404).json(errorResponse("Booking not found."));

    if (booking.rescheduleFlag) {
      return res
        .status(403)
        .json(errorResponse("Rescheduling allowed only once."));
    }

    if (!req.user || booking.userId.toString() !== req.user._id) {
      return res
        .status(403)
        .json(
          errorResponse("You are not authorized to reschedule this booking.")
        );
    }

    // ✅ Validate input with Joi
    const validObj = validateWithSchema<RescheduleBookingDto>(
      rescheduleBookingSchema,
      reqObj
    );

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json(errorResponse("User not found."));
    }

    // Parse dates using dayjs
    const originalDate = dayjs(booking.date);
    const today = dayjs();
    const newDate = dayjs(validObj.newDate);

    // ✅ Check if rescheduling is requested at least 4 days in advance
    if (originalDate.diff(today, "day") < 4) {
      return res
        .status(403)
        .json(
          errorResponse("Rescheduling must be done at least 4 days in advance.")
        );
    }

    // ✅ Ensure new date is within 4 days after original date
    const maxRescheduleDate = originalDate.add(4, "day");
    if (newDate.isBefore(originalDate) || newDate.isAfter(maxRescheduleDate)) {
      return res
        .status(400)
        .json(
          errorResponse(
            `New date must be within 4 days after the original date (${originalDate.format(
              "YYYY-MM-DD"
            )}).`
          )
        );
    }

    // // ✅ Check new time is between 06:00 and 14:00
    // const timeOnly = dayjs(validObj.newTime, "HH:mm", true);
    // const minTime = dayjs("06:00", "HH:mm");
    // const maxTime = dayjs("14:00", "HH:mm");

    // if (
    //   !timeOnly.isValid() ||
    //   timeOnly.isBefore(minTime) ||
    //   timeOnly.isAfter(maxTime)
    // ) {
    //   return res
    //     .status(400)
    //     .json(errorResponse("Time must be between 06:00 and 14:00."));
    // }

    // ✅ Check if the new slot is already booked
    const isSlotTaken = await Booking.findOne({
      serviceId: booking.serviceId,
      date: validObj.newDate,
      time: validObj.newTime,
      status: { $ne: "cancelled" },
    });

    if (isSlotTaken)
      return res.status(409).json(errorResponse("Slot already booked."));

    const service = await Service.findById(booking.serviceId);
    if (!service) {
      return res.status(404).json(errorResponse("Service not found."));
    }

    const oldBookingDate = booking.date;
    const oldBookingTime = booking.time;

    booking.date = validObj.newDate;
    booking.time = validObj.newTime;
    booking.rescheduleFlag = true;

    const result = await booking.save();

    await sendMail({
      from: "THE MAKEUP STUDIO",
      to: user.email,
      subject: "Booking Rescheduled",
      html: `Your booking for <b>${service.serviceName}</b> on <b>${oldBookingDate}</b> at <b>${oldBookingTime}</b> has been rescheduled to <b>${validObj.newDate}</b> at <b>${validObj.newTime}</b>.`,
    });

    return res
      .status(200)
      .json(successResponse(result, "Booking rescheduled successfully."));
  }
);

// Update Booking Status (Admin)
export const updateBookingStatus = TryCatch(
  async (req: CustomRequest, res: Response) => {
    const reqObj: UpdateBookingDto = req.body;

    const booking = await Booking.findById(req.params.id)
      .populate("userId")
      .populate("serviceId");

    if (!booking)
      return res.status(404).json(errorResponse("Booking not found."));

    const user = await User.findById(booking.userId);

    if (!user) return res.status(404).json(errorResponse("User not found."));

    const service = await Service.findById(booking.serviceId);

    if (!service)
      return res.status(404).json(errorResponse("Service not found."));

    const validObj = validateWithSchema<UpdateBookingDto>(
      updateBookingSchema,
      reqObj
    );
    booking.status = validObj.status;
    booking.rejectionReason = validObj?.rejectionReason || "";
    await booking.save();

    // Send email to client
    if (validObj.status === "confirmed") {
      await sendMail({
        from: "THE MAKEUP STUDIO",
        to: user?.email,
        subject: "Booking Confirmed",
        html: `Your booking for ${service.serviceName} on ${booking.date} at ${booking.time} has been confirmed.`,
      });
    } else if (validObj.status === "cancelled") {
      await sendMail({
        from: "THE MAKEUP STUDIO",
        to: user?.email,
        subject: "Booking Not Confirmed",
        html: `We couldn't confirm your booking. ${
          validObj.rejectionReason ? `Reason: ${validObj.rejectionReason}` : ""
        }`,
      });
    }

    return res
      .status(200)
      .json(
        successResponse(true, `Booking ${reqObj.status} successfully by admin`)
      );
  }
);

// export const getUserBookings = TryCatch(
//   async (req: CustomRequest, res: Response) => {
//     const bookings = await Booking.find({ userId: req.user?._id }) // assuming `req.user` is set by auth middleware
//       .populate("serviceId");

//     return res
//       .status(200)
//       .json(successResponse(bookings, "User bookings fetched successfully."));
//   }
// );

export const getBookingHistory = TryCatch(
  async (req: CustomRequest, res: Response) => {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json(errorResponse("Unauthorized"));

    const { status, date, service } = req.query;
    const query: any = { userId };

    if (status) query.status = status;

    if (date) {
      const parsedDate = new Date(date as string);

      // Calculate start and end of the day in UTC
      const startOfDay = new Date(parsedDate);
      startOfDay.setUTCHours(0, 0, 0, 0);

      const endOfDay = new Date(parsedDate);
      endOfDay.setUTCHours(23, 59, 59, 999);

      query.date = { $gte: startOfDay, $lte: endOfDay };
      console.log(query.date);
    }

    if (service) {
      const matchingServices = await Service.find({
        serviceName: { $regex: new RegExp(service as string, "i") },
      });

      if (matchingServices.length > 0) {
        query.serviceId = {
          $in: matchingServices.map((s) => s._id),
        };
      } else {
        // If no matching services, return empty result
        return res
          .status(200)
          .json(successResponse([], "No matching services found"));
      }
    }

    const bookings = await Booking.find(query)
      .populate("serviceId")
      .sort({ date: -1, time: -1 });

    return res
      .status(200)
      .json(successResponse(bookings, "Booking history fetched"));
  }
);
