import { Router } from "express";
import { uploadProfilePicture } from "../middlewares/multer-uploads.js";
import { validatorLogin, validatorRegister } from "../middlewares/user-validate.js";
import { login, register, generateCodigo } from "./auth.controller.js";

const router = Router();

/**
 * @swagger
 * /kivora/v1/auth/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - surname
 *               - username
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Juan
 *               surname:
 *                 type: string
 *                 example: Pérez
 *               username:
 *                 type: string
 *                 example: juanp
 *               email:
 *                 type: string
 *                 example: juan@example.com
 *               password:
 *                 type: string
 *                 example: mypassword123
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *       500:
 *         description: Error del servidor al registrar usuario
 */
router.post("/register", uploadProfilePicture.single("profilePicture"), validatorRegister,  register);

/**
 * @swagger
 * /kivora/v1/auth/login:
 *   post:
 *     summary: Iniciar sesión de usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: juan@example.com
 *               username:
 *                 type: string
 *                 example: juanp
 *               password:
 *                 type: string
 *                 example: mypassword123
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *       400:
 *         description: Credenciales inválidas
 *       500:
 *         description: Error del servidor al iniciar sesión
 */
router.post("/login", validatorLogin, login);

/**
 * @swagger
 * /kivora/v1/auth/recuperacion:
 *   post:
 *     summary: Generar y enviar código de recuperación por correo
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: juan@example.com
 *     responses:
 *       200:
 *         description: Código enviado exitosamente
 *       500:
 *         description: Error al enviar el código
 */
router.post("/recuperacion", generateCodigo);

export default router;
