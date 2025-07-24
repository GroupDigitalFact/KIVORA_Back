import { Router } from "express";
import { uploadProfilePicture } from "../middlewares/multer-uploads.js";
import {
  getUser,
  updateUser,
  deleteUser,
  updateImage,
  deleteImage,
  modificarContraseña,
  getMyUser,
  checkAuth,
  getMyContacts,
  updatePassword
} from "./user.controller.js";
import { validatorUpdateUser } from "../middlewares/user-validate.js";
import { authMiddleware } from "../middlewares/auth-validate.js";

const router = Router();

router.get("/getUser", authMiddleware, getUser);

router.put("/updateUser", validatorUpdateUser, updateUser);

router.delete("/deleteUser", authMiddleware, deleteUser);

router.put(
  "/profilePictureUpdate",
  uploadProfilePicture.single("profilePicture"),
  authMiddleware,
  updateImage
);

router.delete("/profilePictureDelete", authMiddleware, deleteImage);

router.patch("/changePassword", authMiddleware, modificarContraseña);

router.get("/getMyUser", authMiddleware, getMyUser);

router.get("/check", authMiddleware, checkAuth);

router.get("/getMyContacts", authMiddleware, getMyContacts);

router.put("/updatePassword", updatePassword)

export default router;