'use strict'
import mongoose, { Schema } from "mongoose"

const ClusterSchema = new Schema({
  nombre: {
    type: String,
    required: true,
    maxlength: 50,
  },
  descripcion: {
    type: String,
    maxlength: 200,
  },
  profilePicture: {
    type: String, 
  },
  integrantes: [
    {
      usuario: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      rol: { type: String, enum: ["admin", "usuario"], default: "usuario" },
    },
  ],
  propietario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export default mongoose.model('Cluster', ClusterSchema)