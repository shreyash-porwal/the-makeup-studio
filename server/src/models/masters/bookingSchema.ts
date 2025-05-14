import mongoose, { Schema } from "mongoose";
import { BookingType } from "../../types/masters/bookingTypes.js";

const BookingSchema = new Schema<BookingType>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    serviceId: { type: Schema.Types.ObjectId, ref: "Service", required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    serviceLocation: { type: String, default: "2,Gopal Mandir,Ujjain,MP" },
    isOnSite: { type: Boolean, required: false },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
    rescheduleFlag: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Booking = mongoose.model<BookingType>("Booking", BookingSchema);

export default Booking;
