import mongoose, { Schema } from "mongoose";

const TaskSchema = new Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    maxLength: [50, "Title cannot exceed 50 characters"]
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    maxLength: [300, "Description cannot exceed 300 characters"]
  },
  sprint: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Sprint",
    required: [true, "Sprint is required"]
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Assigned user is required"]
  },
  state: {
    type: String,
    enum: ["Late", "In Progress", "In Review", "finalized" ],
    default: "In Progress"
  },
  isUrgent: {
    type: Boolean,
    default: false
  },
  tags: {
    type: [String],
    default: []
  }
}, {
  versionKey: false,
  timestamps: true
});

TaskSchema.methods.toJSON = function(){
  const { _id, ...task } = this.toObject();
  task.uid = _id;
  return task;
};

export default mongoose.model("Task", TaskSchema);