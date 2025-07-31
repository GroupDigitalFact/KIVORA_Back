import { Router } from "express";
import {
  createEvent,
  listEvents,
  updateEvent,
  deleteEvent,
  markAttendance,
  userAttendanceHistory,
  filterEventsByTypeOrDate
} from "./event.controller.js";
import { authMiddleware } from "../middlewares/auth-validate.js";

const router = Router();
/**
 * @swagger
 * /kivora/v1/event/create:
 *   post:
 *     summary: Crear un evento dentro de un sprint
 *     tags: [Eventos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tipoEvento
 *               - descripcion
 *               - fecha
 *               - sprint
 *             properties:
 *               tipoEvento:
 *                 type: string
 *                 enum: [Sprint Planning, Daily Scrum, Sprint Review, Sprint Retrospective]
 *               descripcion:
 *                 type: string
 *                 example: Reunión diaria para revisar el progreso
 *               fecha:
 *                 type: string
 *                 format: date-time
 *               sprint:
 *                 type: string
 *               participantes:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Evento creado correctamente
 *       404:
 *         description: Sprint o grupo no encontrado
 *       500:
 *         description: Error del servidor
 */

router.post("/create", createEvent); // userId en body

/**
 * @swagger
 * /kivora/v1/event/list:
 *   get:
 *     summary: Listar eventos disponibles para el usuario autenticado
 *     tags: [Eventos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: sprintId
 *         schema:
 *           type: string
 *       - in: query
 *         name: tipoEvento
 *         schema:
 *           type: string
 *       - in: query
 *         name: fecha
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Lista de eventos obtenida exitosamente
 *       401:
 *         description: Usuario no autenticado
 *       500:
 *         description: Error del servidor
 */

router.get("/list", authMiddleware, listEvents); // userId en body o query

/**
 * @swagger
 * /kivora/v1/event/update/{id}:
 *   put:
 *     summary: Actualizar los datos de un evento
 *     tags: [Eventos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tipoEvento:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               fecha:
 *                 type: string
 *                 format: date-time
 *               participantes:
 *                 type: array
 *                 items:
 *                   type: string
 *               statusEvent:
 *                 type: string
 *                 enum: [Pendiente, En Curso, Finalizado, Cancelado]
 *     responses:
 *       200:
 *         description: Evento actualizado correctamente
 *       404:
 *         description: Evento no encontrado
 *       500:
 *         description: Error del servidor
 */

router.put("/update/:id", updateEvent); // userId en body

/**
 * @swagger
 * /kivora/v1/event/delete/{id}:
 *   delete:
 *     summary: Eliminar (desactivar) un evento
 *     tags: [Eventos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Evento eliminado exitosamente
 *       404:
 *         description: Evento no encontrado
 *       500:
 *         description: Error del servidor
 */

router.delete("/delete/:id", authMiddleware, deleteEvent); // userId en body

/**
 * @swagger
 * /kivora/v1/event/attendance:
 *   post:
 *     summary: Registrar asistencia de un usuario a un evento
 *     tags: [Eventos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - eventId
 *               - userId
 *               - presente
 *             properties:
 *               eventId:
 *                 type: string
 *               userId:
 *                 type: string
 *               presente:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Asistencia registrada correctamente
 *       403:
 *         description: El usuario no es parte del grupo
 *       404:
 *         description: Evento no encontrado
 *       500:
 *         description: Error del servidor
 */

router.post("/attendance", markAttendance); // eventId, userId, presente en body

/**
 * @swagger
 * /kivora/v1/event/userAttendance:
 *   post:
 *     summary: Obtener historial de asistencia del usuario a eventos
 *     tags: [Eventos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Historial de asistencia del usuario
 *       500:
 *         description: Error del servidor
 */

router.post("/userAttendance", userAttendanceHistory); // userId en body

/**
 * @swagger
 * /kivora/v1/event/filter:
 *   post:
 *     summary: Filtrar eventos por tipo y fecha
 *     tags: [Eventos]
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tipoEvento:
 *                 type: string
 *               fecha:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Eventos filtrados correctamente
 *       500:
 *         description: Error del servidor
 */

router.post("/filter", filterEventsByTypeOrDate);

export default router;