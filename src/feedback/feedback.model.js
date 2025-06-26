"use strict";
import mongoose, { Schema } from "mongoose";

const FeedbackSchema = new Schema(
  {
    relatedTo: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    relatedType: {
      type: String,
      enum: ["Sprint", "Task"],
      default: "Task",
      required: true,
    },
    strengths: {
      type: String,
      required: true,
    },
    improvementAreas: {
      type: String,
      required: true,
    },
    proposedActions: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
    lastEditAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

FeedbackSchema.methods.toJSON = function () {
  const { _id, ...retrospective } = this.toObject();
  retrospective.uid = _id;
  return retrospective;
};

export default mongoose.model("Feedback", FeedbackSchema);
