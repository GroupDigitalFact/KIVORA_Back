import { Router } from "express";
import { 
    createRetrospective,
    updateRetrospective,
    deleteRetrospective,
    getSprintSummary,
    exportRetrospectiveToPDF,
    exportTaskRetrospectiveToPDF
 } from "./feedback.controller.js";
import { authScrumMasterMiddleware } from "../middlewares/auth-validate.js";

const router = Router();

/**
 * @swagger
 * /kivora/v1/feedback/createRetrospective:
 *   post:
 *     summary: Crear una retroalimentación (Sprint o Tarea)
 *     tags: [Retrospectivas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - relatedTo
 *               - relatedType
 *               - strengths
 *               - improvementAreas
 *               - proposedActions
 *               - createdBy
 *               - project
 *             properties:
 *               relatedTo:
 *                 type: string
 *               relatedType:
 *                 type: string
 *                 enum: [Sprint, Task]
 *               strengths:
 *                 type: string
 *               improvementAreas:
 *                 type: string
 *               proposedActions:
 *                 type: string
 *               createdBy:
 *                 type: string
 *               project:
 *                 type: string
 *     responses:
 *       201:
 *         description: Retroalimentación creada exitosamente
 *       500:
 *         description: Error del servidor
 */

router.post("/createRetrospective", authScrumMasterMiddleware, createRetrospective);

/**
 * @swagger
 * /kivora/v1/feedback/updateRetrospective/{id}/{projectId}:
 *   put:
 *     summary: Editar una retroalimentación existente
 *     tags: [Retrospectivas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: projectId
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
 *               strengths:
 *                 type: string
 *               improvementAreas:
 *                 type: string
 *               proposedActions:
 *                 type: string
 *     responses:
 *       200:
 *         description: Retroalimentación actualizada
 *       404:
 *         description: No encontrada
 *       500:
 *         description: Error del servidor
 */


router.put("/updateRetrospective/:id/:projectId", authScrumMasterMiddleware, updateRetrospective);

/**
 * @swagger
 * /kivora/v1/feedback/deleteRetrospective/{id}/{projectId}:
 *   delete:
 *     summary: Eliminar una retroalimentación
 *     tags: [Retrospectivas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Retroalimentación eliminada
 *       404:
 *         description: No encontrada
 *       500:
 *         description: Error del servidor
 */

router.delete("/deleteRetrospective/:id/:projectId", authScrumMasterMiddleware, deleteRetrospective);

/**
 * @swagger
 * /kivora/v1/feedback/getSprintSummary/{projectId}:
 *   get:
 *     summary: Obtener resumen de todas las retroalimentaciones por sprint
 *     tags: [Retrospectivas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Resumen obtenido
 *       404:
 *         description: Proyecto no encontrado
 *       500:
 *         description: Error del servidor
 */

router.get("/getSprintSummary/:projectId", authScrumMasterMiddleware, getSprintSummary);

/**
 * @swagger
 * /kivora/v1/feedback/exportRetrospectiveToPDF/{sprintId}:
 *   get:
 *     summary: Exportar retroalimentación de un sprint a PDF
 *     tags: [Retrospectivas]
 *     parameters:
 *       - in: path
 *         name: sprintId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: PDF generado correctamente
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Sprint no encontrado
 *       500:
 *         description: Error al generar el PDF
 */

router.get("/exportRetrospectiveToPDF/:sprintId", exportRetrospectiveToPDF)

/**
 * @swagger
 * /kivora/v1/feedback/exportTaskRetrospectiveToPDF/{taskId}:
 *   get:
 *     summary: Exportar retroalimentación de una tarea a PDF
 *     tags: [Retrospectivas]
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: PDF generado correctamente
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Tarea no encontrada
 *       500:
 *         description: Error al generar el PDF
 */

router.get("/exportTaskRetrospectiveToPDF/:taskId", exportTaskRetrospectiveToPDF)

export default router; 