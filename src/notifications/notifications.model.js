"use strict";
import mongoose, { Schema } from "mongoose";

const NotificationsSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: ["Invitacion", "Recordatorio", "Notificar"],
    default: "Notificar",
    required: true,
  },
  title: {
    type: String,
  },
  message: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    enum: ["Pendiente", "Vista", "Aceptada", "Rechazada", "Archivada", "Eliminada"],
    default: "Pendiente",
  },
  dateCreation: {
    type: Date,
    default: Date.now,
  },
  relatedTo: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  relatedType: {
    type: String,
    enum: ["Sprint", "Task", "Cluster", "Project"],
    default: "Task",
    required: true,
  },
});

export default mongoose.model("Notifications", NotificationsSchema);
