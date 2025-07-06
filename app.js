import express from "express";
import dotenv from "dotenv";
import messageRoutes from "./routes/messageRoutes.js";
import { connectDB } from "./config/db.js";

dotenv.config();
connectDB();

const app = express();

app.use(express.json());

app.use("/api/messages", messageRoutes);

export default app;
