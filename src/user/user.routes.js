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

/**
 * @swagger
 * /kivora/v1/users/getUser:
 *   get:
 *     summary: Obtener información del usuario autenticado
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Datos del usuario autenticado
 *       401:
 *         description: No autorizado
 */

router.get("/getUser", authMiddleware, getUser);

/**
 * @swagger
 * /kivora/v1/users/updateUser:
 *   put:
 *     summary: Actualizar información del usuario
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               surname:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuario actualizado
 *       400:
 *         description: Datos inválidos
 */

router.put("/updateUser", validatorUpdateUser, updateUser);

/**
 * @swagger
 * /kivora/v1/users/deleteUser:
 *   delete:
 *     summary: Eliminar (desactivar) el usuario autenticado
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usuario eliminado
 *       401:
 *         description: No autorizado
 */

router.delete("/deleteUser", authMiddleware, deleteUser);

/**
 * @swagger
 * /kivora/v1/users/profilePictureUpdate:
 *   put:
 *     summary: Actualizar imagen de perfil del usuario
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - profilePicture
 *             properties:
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Imagen de perfil actualizada
 */

router.put(
  "/profilePictureUpdate",
  uploadProfilePicture.single("profilePicture"),
  authMiddleware,
  updateImage
);

/**
 * @swagger
 * /kivora/v1/users/profilePictureDelete:
 *   delete:
 *     summary: Eliminar la imagen de perfil del usuario
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Imagen eliminada
 *       401:
 *         description: No autorizado
 */

router.delete("/profilePictureDelete", authMiddleware, deleteImage);

/**
 * @swagger
 * /kivora/v1/users/changePassword:
 *   patch:
 *     summary: Cambiar la contraseña del usuario
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Contraseña actualizada
 *       400:
 *         description: Contraseña incorrecta
 */

router.patch("/changePassword", authMiddleware, modificarContraseña);

/**
 * @swagger
 * /kivora/v1/users/updatePassword:
 *   put:
 *     summary: Reestablecer la contraseña de un usuario (sin autenticación)
 *     tags: [Users]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - newPassword
 *             properties:
 *               email:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Contraseña actualizada
 *       400:
 *         description: Email no encontrado o datos inválidos
 */

router.get("/getMyUser", authMiddleware, getMyUser);

/**
 * @swagger
 * /kivora/v1/users/getMyUser:
 *   get:
 *     summary: Obtener los datos del usuario autenticado (detallado)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Datos del usuario autenticado
 */

router.get("/check", authMiddleware, checkAuth);

/**
 * @swagger
 * /kivora/v1/users/check:
 *   get:
 *     summary: Verificar si el token es válido
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token válido
 *       401:
 *         description: Token inválido
 */

router.get("/getMyContacts", authMiddleware, getMyContacts);
/**
 * @swagger
 * /kivora/v1/users/getMyContacts:
 *   get:
 *     summary: Obtener lista de contactos del usuario autenticado
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de contactos
 */

router.put("/updatePassword", updatePassword)

export default router;