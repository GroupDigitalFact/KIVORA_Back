import { Router } from "express";
import { uploadProfilePicture } from "../middlewares/multer-uploads.js";
import { validatorLogin, validatorRegister } from "../middlewares/user-validate.js";
import { login, register, generateCodigo } from "./auth.controller.js";

const router = Router();

router.post("/register", uploadProfilePicture.single("profilePicture"), validatorRegister,  register);

router.post("/login", validatorLogin, login);

router.post("/recuperacion", generateCodigo);

export default router;
