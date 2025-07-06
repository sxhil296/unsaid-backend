import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    to: { type: String, required: true },
    message: { type: String, required: true },
    bgColor: { type: String, required: true },
    textColor: { type: String, required: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
  }
);

export const Message = mongoose.model("Message", messageSchema);
