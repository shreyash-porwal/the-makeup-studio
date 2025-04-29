import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 465,
  secure: true, // true for 465, false for other ports like 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Send an email
 */
export async function sendEmail(
  to: string,
  subject: string,
  text: string,
  html?: string
) {
  try {
    const info = await transporter.sendMail({
      from: `"THE MAKEUP STUDIO" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      html,
    });

    console.log("📧 Email sent successfully :", info.messageId);
  } catch (error) {
    console.error("❌ Failed to send email:", error);
    throw error;
  }
}
