import express from "express";
import {
  createMessage,
  deleteMessage,
  getMessages,
  markMessageRead,
  replyToMessage,
} from "../Controllers/messageController.js";

const messageRouter = express.Router();

messageRouter.post("/", createMessage);
messageRouter.get("/", getMessages);
messageRouter.put("/:messageId/read", markMessageRead);
messageRouter.delete("/:messageId", deleteMessage);
messageRouter.post("/:messageId/reply", replyToMessage);

export default messageRouter;
