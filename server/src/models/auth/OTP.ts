import mongoose, { Schema, Document } from "mongoose";
import otpTemplate from "../../mail/emailVerificationTemplate.js";
import { sendMail } from "../../config/nodemailer.js";

type otpType = {
  email: string;
  otp: string;
  createdAt: Date;
} & Document;

type mailOptionsType = {
  from: string;
  to: string;
  subject: string;
  html: string;
};

const OTPSchema: Schema<otpType> = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 60 * 5, // The document will be automatically deleted after 5 minutes
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

// Define a function to send verification email
async function sendVerificationEmail(
  email: string,
  otp: string
): Promise<void> {
  try {
    const mailOptions: mailOptionsType = {
      from: `Aditi's Makeover | Aditi Tiwari`,
      to: `${email}`,
      subject: "Verification Email",
      html: otpTemplate(otp),
    };
    const mailResponse = await sendMail(mailOptions);
    console.log("Email sent successfully: ");
  } catch (error) {
    console.error("Error occurred while sending email: ", error);
    throw error;
  }
}

// Define a pre-save hook to send an email after saving the OTP document
OTPSchema.pre<otpType>("save", async function (next) {
  console.log("New OTP document saved to database");

  // Only send an email when a new document is created
  if (this.isNew) {
    await sendVerificationEmail(this.email, this.otp);
  }
  next();
});

// Create and export the OTP model
const OTP = mongoose.model<otpType>("OTP", OTPSchema);

export default OTP;
