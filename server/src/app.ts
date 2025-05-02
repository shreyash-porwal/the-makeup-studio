import express from "express";
import { sendMail } from "./config/nodemailer.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import userRoutes from "./routes/userRoutes.js";
import { authorizeUser, roleAuthorization } from "./middlewares/authMiddleware.js";
import { CustomRequest } from "./types/reqResTypes/responseTypes.js";
import cookieParser from "cookie-parser";
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

app.get("/hello", authorizeUser,roleAuthorization(["Admin"]), (req:CustomRequest, res) => {
  res.send(`Hello ${req.user?.email} from Express with TypeScript!`);
});

app.post("/send-mail", async (req, res) => {
  const { to, subject, message } = req.body;

  try {
    await sendMail({
      from: "THE MAKEUP STUDIO",
      to: to,
      subject: subject,
      html: `<p>${message}</p>`,
    });
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
app.use("/api/v1", userRoutes);

app.use(errorMiddleware);
export default app;
