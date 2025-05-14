import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER!,
    pass: process.env.SMTP_PASS!,
  },
  secure: true,
  port: 465,
});

export const sendMail = async (mailOptions: {
  from: string;
  to: string;
  subject: string;
  html: string;
}) => {
  let info = await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error:", error);
    } else {
      console.log("Email sent:", info.response);
    }
    return info;
  });
};
