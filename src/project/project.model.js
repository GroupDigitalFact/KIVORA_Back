import mongoose, { Schema} from "mongoose";


const ProjectSchema = new Schema({
  title: {
    type: String,
    required: [true, "Project title is required"],
    maxLength: [100, "Title cannot exceed 100 characters"]
  },
  description: {
    type: String,
    required: [true, "Project description is required"],
    maxLength: [1000, "Description cannot exceed 1000 characters"]
  },
  startDate: {
    type: Date,
    required: [true, "Start date is required"]
  },
  endDate: {
    type: Date,
    required: [true, "End date is required"]
  },
  projectType: {
    type: String,
    enum: ["Academic", "Informatic"],
    required: [true, "Project type is required"]
  },
  cluster: {
    type: Schema.Types.ObjectId,
    ref: "Cluster",
    required: [true, "Group is required"]
  },
  scrumMaster: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Project manager is required"]
  },
  productOwner:{
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Product owner is required"]
  },
  developers: [
    {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  ],
  sprints: [
    {
      type: Schema.Types.ObjectId,
      ref: "Sprint"
    }
  ],
  state:{
      type: Boolean,
      default: true
    },

}, {
  timestamps: true,
  versionKey: false
});

ProjectSchema.methods.toJSON = function(){
    const { _id, ...project} = this.toObject()
    project.uid = _id
    return project
}

export default mongoose.model("Project", ProjectSchema)