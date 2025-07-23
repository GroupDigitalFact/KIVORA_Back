"use strict";
import mongoose, { Schema } from "mongoose";

const MessageSchema = new Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text:{
        type: String, 
    },
    image:{
        type: String, 
    },
    seen: {
        type: Boolean, 
        default: false
    },
    state: {
        type: Boolean, 
        default: true
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

MessageSchema.methods.toJSON = function () {
  const { _id, ...message } = this.toObject();
  message.uid = _id;
  return message;
};

export default mongoose.model("Message", MessageSchema);
