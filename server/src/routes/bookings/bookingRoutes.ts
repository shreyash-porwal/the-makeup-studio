import express from "express";
import {
  cancelBooking,
  createBooking,
  getAllBookings,
  getBookingById,
  getBookingHistory,
  getBookingsByUserId,
  rescheduleBooking,
  updateBookingStatus,
} from "../../controllers/masters/bookingController.js";
import { auth, roleAuthorization } from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.post(
  "/request-booking",
  auth,
  roleAuthorization(["User"]),
  createBooking
);

router.get(
  "/getAllBookings",
  auth,
  roleAuthorization(["Admin"]),
  getAllBookings
);

router.get("/booking-id/:id", getBookingById);
router.get("/user-bookings/:userId", getBookingsByUserId);
router.post("/cancel/:id", auth, roleAuthorization(["User"]), cancelBooking);
router.post(
  "/reschedule/:id",
  auth,
  roleAuthorization(["User"]),
  rescheduleBooking
);
router.patch(
  "/admin/updateBookingStatus/:id",
  auth,
  roleAuthorization(["Admin"]),
  updateBookingStatus
);

router.get("/history", auth, roleAuthorization(["User"]), getBookingHistory);
export default router;
