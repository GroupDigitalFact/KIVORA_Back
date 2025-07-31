import { authMiddleware } from "../middlewares/auth-validate.js";
import { getMessages, getUsersForSidebar, markMessageAsSeen, sendMessage } from "./message.controller.js";
import { uploadMessageFiles } from "../middlewares/multer-uploads.js";
import {} from "./message.model.js";

import { Router} from "express";

const router = Router();

/**
 * @swagger
 * /kivora/v1/messages/users:
 *   get:
 *     summary: Obtener usuarios para la barra lateral del chat
 *     tags: [Mensajes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios y cantidad de mensajes no vistos
 *       500:
 *         description: Error al obtener usuarios
 */

router.get("/users", authMiddleware, getUsersForSidebar);

/**
 * @swagger
 * /kivora/v1/messages/{id}:
 *   get:
 *     summary: Obtener historial de mensajes entre el usuario actual y otro usuario
 *     tags: [Mensajes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del otro usuario
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de mensajes entre usuarios
 *       500:
 *         description: Error al obtener mensajes
 */

router.get("/:id", authMiddleware, getMessages);

/**
 * @swagger
 * /kivora/v1/messages/mark/{id}:
 *   put:
 *     summary: Marcar un mensaje como visto
 *     tags: [Mensajes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del mensaje a marcar como visto
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Mensaje marcado como visto
 *       500:
 *         description: Error al marcar el mensaje
 */

router.put("/mark/:id", authMiddleware, markMessageAsSeen);

/**
 * @swagger
 * /kivora/v1/messages/send/{receiverId}:
 *   post:
 *     summary: Enviar un mensaje con texto y archivos opcionales
 *     tags: [Mensajes]
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: receiverId
 *         required: true
 *         description: ID del receptor del mensaje
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Mensaje enviado exitosamente
 *       500:
 *         description: Error al enviar mensaje
 */

router.post("/send/:receiverId", uploadMessageFiles.array("files", 10), authMiddleware, sendMessage)


export default  router;