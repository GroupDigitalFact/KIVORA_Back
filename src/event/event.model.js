import mongoose, { Schema } from "mongoose";

const eventSchema = new Schema({
  tipoEvento: {
    type: String,
    enum: ["Sprint Planning", "Daily Scrum", "Sprint Review", "Sprint Retrospective"],
    required: true,
  },
  descripcion: {
    type: String,
    required: true,
    maxlength: 300,
  },
  fecha: {
    type: Date,
    required: true,
  },
  sprint: {
    type: Schema.Types.ObjectId,
    ref: "Sprint",
    required: true,
  },
  participantes: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  asistencia: [
    {
      usuario: { type: Schema.Types.ObjectId, ref: "User" },
      presente: { type: Boolean, default: false },
      timestamp: { type: Date },
    },
  ],
  recordatorioEnviado: {
    type: Boolean,
    default: false,
  },
  recordatorio10Min: {
    type: Boolean,
    default: false,
  },
  status: {
    type: Boolean,
    default: true,
  }
}, { timestamps: true, versionKey: false });

export default mongoose.model("Event", eventSchema);