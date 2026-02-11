import nodemailer from "nodemailer";
import dotenv from "dotenv";
import Message from "../Models/Message.js";
import { isAdmin } from "./productControlle.js";

dotenv.config();

const transport = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "shancreation62@gmail.com",
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function createMessage(req, res) {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const newMessage = new Message({
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
    });

    await newMessage.save();

    return res.json({
      success: true,
      message: "Message sent successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to send message",
      error: error.message,
    });
  }
}

export async function getMessages(req, res) {
  if (!isAdmin(req)) {
    return res.status(403).json({
      message: "forbidden",
    });
  }

  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    return res.json(messages);
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching messages",
      error: error.message,
    });
  }
}

export async function markMessageRead(req, res) {
  if (!isAdmin(req)) {
    return res.status(403).json({
      message: "forbidden",
    });
  }

  try {
    const messageId = req.params.messageId;
    await Message.updateOne({ _id: messageId }, { isRead: true });
    return res.json({ message: "Message marked as read" });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update message",
      error: error.message,
    });
  }
}

export async function deleteMessage(req, res) {
  if (!isAdmin(req)) {
    return res.status(403).json({
      message: "forbidden",
    });
  }

  try {
    const messageId = req.params.messageId;
    await Message.deleteOne({ _id: messageId });
    return res.json({ message: "Message deleted successfully" });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete message",
      error: error.message,
    });
  }
}

export async function replyToMessage(req, res) {
  if (!isAdmin(req)) {
    return res.status(403).json({
      message: "forbidden",
    });
  }

  try {
    const messageId = req.params.messageId;
    const { replyMessage } = req.body;

    if (!replyMessage || !replyMessage.trim()) {
      return res.status(400).json({
        message: "Reply message is required",
      });
    }

    const messageDoc = await Message.findById(messageId);
    if (!messageDoc) {
      return res.status(404).json({
        message: "Message not found",
      });
    }

    const mail = {
      from: "shancreation62@gmail.com",
      to: messageDoc.email,
      subject: `Re: ${messageDoc.subject}`,
      text: replyMessage.trim(),
    };

    transport.sendMail(mail, async (err) => {
      if (err) {
        return res.status(500).json({
          message: "Failed to send reply",
          error: err.message,
        });
      }

      messageDoc.replyMessage = replyMessage.trim();
      messageDoc.repliedAt = new Date();
      messageDoc.isRead = true;
      await messageDoc.save();

      return res.json({ message: "Reply sent successfully" });
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to reply",
      error: error.message,
    });
  }
}
