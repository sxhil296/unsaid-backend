import { isMessageAppropriate } from "../lib/moderation.js";
import { Message } from "../models/messageModel.js";

export const createMessage = async (req, res) => {
  const { to, message, bgColor, textColor } = req.body;

  if (!to || !message || !bgColor || !textColor) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const isSafe = await isMessageAppropriate(message);

    if (!isSafe) {
      return res
        .status(400)
        .json({ error: "Message contains inappropriate content" });
    }

    const newMessage = new Message({ to, message, bgColor, textColor });
    const saved = await newMessage.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
export const getMessages = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;
  const search = req.query.search || "";
  const colorFilter = req.query.color;

  const query = {};

  if (search) {
    query.to = { $regex: search, $options: "i" };
  }

  if (colorFilter) {
    const colors = colorFilter
      .split(",")
      .map((c) => (c.startsWith("#") ? c : `#${c}`));
    query.bgColor = { $in: colors };
  }

  try {
    const skip = (page - 1) * limit;
    const total = await Message.countDocuments(query);
    const messages = await Message.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;

    res.json({
      page,
      totalPages,
      totalMessages: total,
      hasNextPage,
      messages,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

export const getMessageById = async (req, res) => {
  const { id } = req.params;
  console.log("Fetching message by ID:", id);

  try {
    const message = await Message.findById(id);

    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    res.status(200).json(message);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch the message" });
  }
};
