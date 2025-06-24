"use strict";
import mongoose, { Schema } from "mongoose";

const BacklogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      maxlength: 100,
    },
    description: {
      type: String,
      maxlength: 500,
    },
    priority: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    state: {
      type: String,
      enum: ["Pending", "ReadySprint", "Discarded"],
      default: "Pending",
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    fechaCreacion: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

BacklogSchema.methods.toJSON = function(){
    const { _id, ...backlog} = this.toObject()
    backlog.uid = _id
    return backlog
}

export default mongoose.model("Backlog", BacklogSchema);
