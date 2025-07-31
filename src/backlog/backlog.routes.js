import {Router} from 'express';
import { createBacklog, deleteBacklog, exportBacklogToPDF, getBacklogs, updateBacklog } from './backlog.controller.js';
import { authProductOwnerMiddleware } from '../middlewares/auth-validate.js';
const router = Router();

/**
 * @swagger
 * /kivora/v1/backlog/createBacklog:
 *   post:
 *     summary: Crear un nuevo backlog
 *     tags: [Backlog]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - priority
 *               - project
 *             properties:
 *               title:
 *                 type: string
 *                 example: Crear vista de login
 *               description:
 *                 type: string
 *                 example: El login debe permitir autenticación con correo o usuario
 *               priority:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 2
 *               project:
 *                 type: string
 *                 example: 64d0b9ff9f1a1d2c77c2a123
 *     responses:
 *       200:
 *         description: Backlog creado exitosamente
 *       400:
 *         description: Ya existe un backlog con ese título en este proyecto
 *       500:
 *         description: Error del servidor
 */
router.post('/createBacklog', authProductOwnerMiddleware, createBacklog);

/**
 * @swagger
 * /kivora/v1/backlog/getBacklogs/{projectId}:
 *   get:
 *     summary: Obtener los backlogs de un proyecto
 *     tags: [Backlog]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del proyecto
 *     responses:
 *       200:
 *         description: Lista de backlogs obtenida exitosamente
 *       404:
 *         description: No se encontraron backlogs para este proyecto
 *       500:
 *         description: Error del servidor
 */
router.get('/getBacklogs/:projectId', getBacklogs);

/**
 * @swagger
 * /kivora/v1/backlog/exportBacklogToPDF/{projectId}:
 *   get:
 *     summary: Exportar el backlog de un proyecto a PDF
 *     tags: [Backlog]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del proyecto
 *     responses:
 *       200:
 *         description: PDF generado exitosamente
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Proyecto o backlog no encontrado
 *       500:
 *         description: Error al generar el PDF
 */
router.get('/exportBacklogToPDF/:projectId', exportBacklogToPDF);

/**
 * @swagger
 * /kivora/v1/backlog/updateBacklog/{projectId}/{backlogId}:
 *   put:
 *     summary: Actualizar un backlog existente
 *     tags: [Backlog]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: backlogId
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
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               priority:
 *                 type: number
 *               state:
 *                 type: string
 *                 enum: [Pending, ReadySprint, Discarded]
 *     responses:
 *       200:
 *         description: Backlog actualizado exitosamente
 *       404:
 *         description: Backlog no encontrado
 *       500:
 *         description: Error del servidor
 */
router.put('/updateBacklog/:projectId/:backlogId', authProductOwnerMiddleware, updateBacklog);

/**
 * @swagger
 * /kivora/v1/backlog/deleteBacklog/{projectId}/{backlogId}:
 *   delete:
 *     summary: Eliminar (desactivar) un backlog
 *     tags: [Backlog]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: backlogId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Backlog eliminado exitosamente
 *       404:
 *         description: Backlog no encontrado
 *       500:
 *         description: Error del servidor
 */
router.delete('/deleteBacklog/:projectId/:backlogId', authProductOwnerMiddleware, deleteBacklog);


export default router;