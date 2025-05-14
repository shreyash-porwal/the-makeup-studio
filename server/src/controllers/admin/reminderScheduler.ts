import cron from "node-cron";
import Booking from "../../models/masters/bookingSchema.js";
import { User } from "../../models/masters/userSchema.js";
import { sendMail } from "../../config/nodemailer.js";

interface PopulatedService {
  serviceName: string;
}

export const sendBookingReminders = async () => {
  console.log("📧 Sending booking reminders...");

  const dateStr = new Date().toISOString().split("T")[0]; // Today's date
  const bookings = await Booking.find({
    // date: dateStr,
    status: "confirmed",
  })
    .populate({
      path: "serviceId",
      select: "serviceName -_id", // include serviceName, exclude _id
    })
    .exec();

  console.log(bookings);
  for (const booking of bookings) {
    const user = await User.findById(booking.userId);
    console.log(user);
    if (!user?.email) continue;

    console.log(booking);
    const { serviceName } = booking.serviceId;
    const message = `
      <p>Hi! This is a reminder for your upcoming booking:</p>
      <ul>
        <li><strong>Date:</strong> ${booking.date}</li>
        <li><strong>Time:</strong> ${booking.time}</li>
        <li><strong>Service:</strong> ${serviceName}</li>
        <li><strong>Location:</strong> ${booking.serviceLocation}</li>
      </ul>
    `;

    console.log(`📨 Sending email to ${user.email}`);
    await sendMail({
      from: "THE MAKEUP STUDIO",
      to: user.email,
      subject: "Booking Reminder",
      html: message,
    });
  }

  console.log("✅ Reminder emails sent.");
};

// Schedule the task to run every day at 6 PM
export const scheduleBookingReminderJob = () => {
  cron.schedule("0 18 * * *", sendBookingReminders);
  console.log("🕕 Booking reminder job scheduled for 6:00 PM daily.");
};
// export const scheduleBookingReminderJob = () => {
//   cron.schedule("* * * * *", sendBookingReminders); // every minute
//   console.log("⏱️ Booking reminder job scheduled to run every minute.");
// };
