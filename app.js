import express from "express";
import dotenv from "dotenv";
import messageRoutes from "./src/routes/messageRoutes.js";
import { connectDB } from "./src/config/db.js";
import cors from "cors";

dotenv.config();
connectDB();

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    // origin: "http://localhost:3000",
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running...");
});
app.use("/api/messages", messageRoutes);

export default app;
