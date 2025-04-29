import express from "express";
import { sendEmail } from "./config/nodemailer.js";
const app = express();

// Middleware
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Hello from Express with TypeScript!");
});

app.post("/send-mail", async (req, res) => {
  const { to, subject, message } = req.body;

  try {
    await sendEmail(to, subject, message, `<p>${message}</p>`);
    res
      .status(200)
      .json({ success: true, message: "Email sent successfully!" });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to send email." + error.message,
    });
  }
});
export default app;
