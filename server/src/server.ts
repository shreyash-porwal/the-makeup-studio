import app from "./app.js";
import dotenv from "dotenv";
import { connectDb } from "./config/connectDb.js";

dotenv.config();
const PORT = process.env.PORT || 4000;

async function startServer() {
  try {
    await connectDb();

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

// Run the server
startServer();
