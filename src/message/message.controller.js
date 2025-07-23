import Message from "./message.model.js";
import User from "../user/user.model.js";
import { io, userSocketMap } from "../../configs/server.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const userId = req.usuario._id;

    const filteredUsers = await User.find({ _id: { $ne: userId } });

    const unseenMessages = {};

    const promises = filteredUsers.map(async (user) => {
      const messages = await Message.find({
        senderId: user._Id,
        receiverId: userId,
        seen: false,
      });

      if (messages.length > 0) {
        unseenMessages[user._id] = messages.length;
      }
    });

    await Promise.all(promises);

    return res.status(200).json({
      success: true,
      users: filteredUsers,
      unseenMessages,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      error: error,
    });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: selectedUserId } = req.params;

    const myId = req.usuario._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: selectedUserId },
        { senderId: selectedUserId, receiverId: myId },
      ],
    });

    await Message.updateMany(
      { senderId: selectedUserId, receiverId: myId },
      { seen: true }
    );

    return res.status(200).json({
      success: false,
      messages,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      error: error,
    });
  }
};

export const markMessageAsSeen = async (req, res) => {
  try {
    const { id } = req.params;
    await Message.findByIdAndUpdate(id, { seen: true });

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      error: error,
    });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text } = req.body;
    const { receiverId } = req.params;

    const senderId = req.usuario._id;

    const existingMessages = await Message.findOne({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    });

    console.log(existingMessages)

    if (!existingMessages) {
      const sender = await User.findById(senderId);
      const receiver = await User.findById(receiverId);

      const senderHasReceiver = sender.contacts.some(
        (contact) => contact.user.toString() === receiverId
      );

      if (!senderHasReceiver) {
        sender.contacts.push({ user: receiverId, status: "accepted" });
        await sender.save();
      }

      const receiverHasSender = receiver.contacts.some(
        (contact) => contact.user.toString() === senderId
      );

      if (!receiverHasSender) {
        receiver.contacts.push({ user: senderId, status: "accepted" });
        await receiver.save();
      }
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      text,
    });

    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    return res.status(200).json({
      success: true,
      newMessage,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      error: error,
    });
  }
};
