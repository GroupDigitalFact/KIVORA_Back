import mongoose, { Schema } from "mongoose";

const sprintSchema = Schema({
    tittle: {
        type: String,
        required: [true, 'Title is required'],
    },
    number: {
        type: Number,
        required: [true, 'Sprint number is required'],
        unique: true,
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
    },
    task: [
        {
        type: Schema.Types.ObjectId,
        ref: 'Task',
        required: [true, 'Task is required'],
        }
    ],
    state: {
        type: String,
        enum: ['Atrasado', 'En curso', 'Finalizado'],
        required: [true, 'State is required']
    },
    project: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
        required: [true, 'Project is required']
    },
    dateStart: {
        type: Date,
        default: Date.now
    },
    dateEnd: {
        type: Date,
        required: [true, 'End date is required'],
    },
    status: {
        type: Boolean,
        default: true
    }
},{
    timestamps: true,
    versionKey: false
})

sprintSchema.methods.toJSON = function() {
    const { __v, _id, ...sprint } = this.toObject();
    sprint.uid = _id;
    return sprint;
}

export default mongoose.model('Sprint', sprintSchema);