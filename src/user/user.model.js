import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      maxLength: [25, "Name cannot exceed 30 characters"],
    },
    surname: {
      type: String,
      required: [true, "Surname is required"],
      maxLength: [25, "Surname cannot exceed 30 characters"],
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    profilePicture: {
      type: String,
    },
    phone: {
      type: String,
      minLength: [8, "Phone number must be at least 8 digits"],
      required: true,
    },
    state: {
      type: Boolean,
      default: true,
    },
    contacts: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        rol: {
          type: String,
          enum: ["ARCHIVADO", "ELIMINAR", "DESTACADO", "ACTIVO"],
          default: "ACTIVO",
        },
      },
    ],
  },
  {
    versionKey: false,
    timeStamps: true,
  }
);

UserSchema.methods.toJSON = function () {
  const { _v, password, _id, ...usuario } = this.toObject();
  usuario.uid = _id;
  return usuario;
};

export default mongoose.model("User", UserSchema);
