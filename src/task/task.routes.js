import { Router } from "express";
import {addTask, calificarEntrega, listTasksSprint,updateTask,deleteTask,reassignTask,listTasksUser, listTasksProject ,markTaskUrgent, addTaskAttachments, updateState, deleteTaskAttachments, setTaskTags} from "./task.controller.js";
import { uploadTaskFiles } from "../middlewares/multer-uploads.js";
import{ authMiddleware, authScrumMasterMiddleware } from "../middlewares/auth-validate.js";
const router = Router();

/**
 * @swagger
 * /kivora/v1/tasks/addTask:
 *   post:
 *     summary: Crear una nueva tarea con archivos adjuntos
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - sprint
 *               - project
 *               - assignedTo
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               sprint:
 *                 type: string
 *               project:
 *                 type: string
 *               assignedTo:
 *                 type: string
 *               attachments:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Tarea creada correctamente
 *       400:
 *         description: Datos inválidos
 *       500:
 *         description: Error del servidor
 */

router.post("/addTask", uploadTaskFiles.array("attachments", 10), authScrumMasterMiddleware, addTask);

/**
 * @swagger
 * /kivora/v1/tasks/listTasks/{sprint}:
 *   get:
 *     summary: Obtener tareas de un sprint
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: sprint
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del sprint
 *     responses:
 *       200:
 *         description: Lista de tareas del sprint
 *       500:
 *         description: Error del servidor
 */

router.get("/listTasks/:sprint", listTasksSprint);

/**
 * @swagger
 * /kivora/v1/tasks/listTasksProject/{project}:
 *   get:
 *     summary: Obtener tareas por proyecto
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: project
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del proyecto
 *     responses:
 *       200:
 *         description: Lista de tareas del proyecto
 *       500:
 *         description: Error del servidor
 */

router.get("/listTasksProject/:project", listTasksProject);

/**
 * @swagger
 * /kivora/v1/tasks/listTasksUser:
 *   get:
 *     summary: Obtener tareas asignadas al usuario autenticado
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de tareas del usuario
 *       500:
 *         description: Error del servidor
 */

router.get("/listTasksUser", authMiddleware, listTasksUser);

/**
 * @swagger
 * /kivora/v1/tasks/updateTask:
 *   put:
 *     summary: Actualizar datos de una tarea
 *     tags: [Tasks]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - _id
 *             properties:
 *               _id:
 *                 type: string
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               state:
 *                 type: string
 *               isUrgent:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Tarea actualizada
 *       500:
 *         description: Error del servidor
 */

router.put("/updateTask", updateTask);

/**
 * @swagger
 * /kivora/v1/tasks/deleteTask:
 *   delete:
 *     summary: Eliminar una tarea
 *     tags: [Tasks]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - _id
 *             properties:
 *               _id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Tarea eliminada
 *       500:
 *         description: Error del servidor
 */

router.delete("/deleteTask", deleteTask);

/**
 * @swagger
 * /kivora/v1/tasks/reassignTask:
 *   put:
 *     summary: Reasignar una tarea a otro usuario
 *     tags: [Tasks]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - taskId
 *               - newUserId
 *             properties:
 *               taskId:
 *                 type: string
 *               newUserId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Tarea reasignada
 *       500:
 *         description: Error del servidor
 */

router.put("/reassignTask", reassignTask);

/**
 * @swagger
 * /kivora/v1/tasks/markTaskUrgent:
 *   post:
 *     summary: Marcar o desmarcar una tarea como urgente
 *     tags: [Tasks]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - taskId
 *               - isUrgent
 *             properties:
 *               taskId:
 *                 type: string
 *               isUrgent:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Estado de urgencia actualizado
 *       500:
 *         description: Error del servidor
 */

router.post("/markTaskUrgent", markTaskUrgent)

/**
 * @swagger
 * /kivora/v1/tasks/setTaskTags:
 *   post:
 *     summary: Asignar etiquetas a una tarea
 *     tags: [Tasks]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - taskId
 *               - tags
 *             properties:
 *               taskId:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Etiquetas actualizadas
 *       500:
 *         description: Error del servidor
 */

router.post("/setTaskTags", setTaskTags);

/**
 * @swagger
 * /kivora/v1/tasks/addTaskAttachments/{taskId}:
 *   put:
 *     summary: Agregar archivos a una tarea
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               attachments:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Archivos agregados correctamente
 *       500:
 *         description: Error del servidor
 */

router.put(
  "/addTaskAttachments/:taskId",
  uploadTaskFiles.array("attachments", 10),
  authMiddleware,
  addTaskAttachments
);

/**
 * @swagger
 * /kivora/v1/tasks/deleteTaskAttachments/{taskId}:
 *   delete:
 *     summary: Eliminar archivos adjuntos de una tarea
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - files
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Archivos eliminados
 *       500:
 *         description: Error del servidor
 */

router.delete(
  "/deleteTaskAttachments/:taskId",
  authMiddleware,
  deleteTaskAttachments
);

/**
 * @swagger
 * /kivora/v1/tasks/updateStateTask/{id}:
 *   put:
 *     summary: Actualizar estado de una tarea
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la tarea
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               state:
 *                 type: string
 *                 enum: [Late, In Progress, In Review, finalized]
 *     responses:
 *       200:
 *         description: Estado actualizado
 *       500:
 *         description: Error del servidor
 */

router.put("/updateStateTask/:id", updateState);

/**
 * @swagger
 * /kivora/v1/tasks/calificar:
 *   post:
 *     summary: Calificar una entrega de tarea
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - taskId
 *               - comment
 *             properties:
 *               taskId:
 *                 type: string
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Comentario agregado correctamente
 *       500:
 *         description: Error del servidor
 */

router.post("/calificar", authMiddleware, calificarEntrega);

export default router;