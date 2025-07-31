import { Router } from "express";
import {
  getMyNotifications,
  updateNotificationState,
  getNotificationById,
  getClusterNotifications,
} from "./notifications.controller.js";
import { authMiddleware } from "../middlewares/auth-validate.js"

const router = Router();

/**
 * @swagger
 * /kivora/v1/notifications/getMyNotifications:
 *   get:
 *     summary: Obtener notificaciones del usuario autenticado
 *     tags: [Notificaciones]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de notificaciones del usuario y cantidad de pendientes
 *       400:
 *         description: Problemas listando notificaciones
 *       500:
 *         description: Error interno del servidor
 */

router.get("/getMyNotifications",authMiddleware, getMyNotifications);

/**
 * @swagger
 * /kivora/v1/notifications/getClusterNotifications/{clusterId}:
 *   get:
 *     summary: Obtener notificaciones relacionadas a un cluster
 *     tags: [Notificaciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: clusterId
 *         required: true
 *         description: ID del cluster
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de notificaciones relacionadas al cluster
 *       500:
 *         description: Error interno del servidor
 */

router.get("/getClusterNotifications/:clusterId",authMiddleware, getClusterNotifications);

/**
 * @swagger
 * /kivora/v1/notifications/getNotificationById/{notificationId}:
 *   get:
 *     summary: Obtener una notificación específica por ID (solo si pertenece al usuario)
 *     tags: [Notificaciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         required: true
 *         description: ID de la notificación
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notificación obtenida exitosamente
 *       404:
 *         description: Notificación no encontrada o no pertenece al usuario
 *       500:
 *         description: Error al obtener la notificación
 */

router.get("/getNotificationById/:notificationId", authMiddleware, getNotificationById);

/**
 * @swagger
 * /kivora/v1/notifications/updateNotificationState/{notificationId}:
 *   patch:
 *     summary: Actualizar el estado de una notificación
 *     tags: [Notificaciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         required: true
 *         description: ID de la notificación
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Estado nuevo de la notificación
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - state
 *             properties:
 *               state:
 *                 type: string
 *                 enum: [Pendiente, Vista, Aceptada, Rechazada, Archivada, Eliminada]
 *     responses:
 *       200:
 *         description: Estado actualizado correctamente
 *       400:
 *         description: Estado no válido
 *       404:
 *         description: Notificación no encontrada
 *       500:
 *         description: Error interno al actualizar estado
 */

router.patch("/updateNotificationState/:notificationId", authMiddleware, updateNotificationState);

export default router;