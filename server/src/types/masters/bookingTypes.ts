import { Document, Types } from "mongoose";

export type BookingType = Document & {
  userId: string | Types.ObjectId; // User who made the booking
  serviceId: string | Types.ObjectId | any; // The service booked
  date: Date; // Booking date (YYYY-MM-DD)
  time: string; // Booking time (HH:mm)
  serviceLocation?: string | null; // Optional address (for On-Site bookings)
  isOnSite: boolean; // Whether the service is at the parlour or on-site
  status: "pending" | "confirmed" | "cancelled"; // Booking status
  rescheduleFlag: boolean; // Whether the booking has been rescheduled
  rejectionReason?: string;
};

// For validating requests during CRUD operations
export type CreateBookingDto = {
  userId?: string;
  serviceId: string;
  date: string;
  time: string;
  serviceLocation?: string;
  isOnSite: boolean;
};

export type UpdateBookingDto = {
  status: "confirmed" | "cancelled";
  rejectionReason?: string;
};

export type RescheduleBookingDto = {
  newDate: Date;
  newTime: string;
};
