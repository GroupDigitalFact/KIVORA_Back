import { Router } from "express";
import {
    createSprint,
    getSprints,
    getSprint,
    updateSprint,
    deleteSprint,
    searchSprints,
    stateDurationSprint,
    addBacklogToSprint,
    removeBacklogFromSprint
} from "./sprint.controller.js";
import {
    validatorCreateSprint,
    validatorDeleteSprint,
    validatorUpdateSprint
} from "../middlewares/sprint-validate.js";
import { authMiddleware } from "../middlewares/auth-validate.js"


const router = Router();
 
/**
 * @swagger
 * /kivora/v1/sprints/createSprint:
 *   post:
 *     summary: Crear un nuevo sprint
 *     tags: [Sprints]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tittle
 *               - number
 *               - objective
 *               - project
 *               - dateEnd
 *             properties:
 *               tittle:
 *                 type: string
 *               number:
 *                 type: number
 *               objective:
 *                 type: string
 *               project:
 *                 type: string
 *               dateEnd:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Sprint creado correctamente
 *       400:
 *         description: Error de validación
 *       500:
 *         description: Error del servidor
 */


router.post("/createSprint", authMiddleware, createSprint);

/**
 * @swagger
 * /kivora/v1/sprints/getSprints/{projectId}:
 *   get:
 *     summary: Obtener todos los sprints de un proyecto
 *     tags: [Sprints]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del proyecto
 *     responses:
 *       200:
 *         description: Lista de sprints obtenida
 *       500:
 *         description: Error del servidor
 */

router.get("/getSprints/:projectId", getSprints);

/**
 * @swagger
 * /kivora/v1/sprints/getSprint/{id}:
 *   get:
 *     summary: Obtener un sprint específico por ID
 *     tags: [Sprints]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del sprint
 *     responses:
 *       200:
 *         description: Sprint encontrado
 *       404:
 *         description: Sprint no encontrado
 *       500:
 *         description: Error del servidor
 */

router.get("/getSprint/:id", getSprint);

/**
 * @swagger
 * /kivora/v1/sprints/updateSprint/{id}:
 *   put:
 *     summary: Actualizar información de un sprint
 *     tags: [Sprints]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del sprint
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tittle:
 *                 type: string
 *               objective:
 *                 type: string
 *               dateEnd:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Sprint actualizado correctamente
 *       404:
 *         description: Sprint no encontrado
 *       500:
 *         description: Error del servidor
 */

router.put("/updateSprint/:id", authMiddleware, updateSprint);

/**
 * @swagger
 * /kivora/v1/sprints/stateDurationSprint/{id}:
 *   put:
 *     summary: Actualizar estado y duración del sprint
 *     tags: [Sprints]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del sprint
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               state:
 *                 type: string
 *                 enum: [Atrasado, En curso, Finalizado]
 *     responses:
 *       200:
 *         description: Estado del sprint actualizado
 *       404:
 *         description: Sprint no encontrado
 *       500:
 *         description: Error del servidor
 */

router.put("/stateDurationSprint/:id", authMiddleware, stateDurationSprint);

/**
 * @swagger
 * /kivora/v1/sprints/deleteSprint/{id}:
 *   delete:
 *     summary: Eliminar un sprint (borrado lógico)
 *     tags: [Sprints]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del sprint
 *     responses:
 *       200:
 *         description: Sprint eliminado correctamente
 *       404:
 *         description: Sprint no encontrado
 *       500:
 *         description: Error del servidor
 */

router.delete("/deleteSprint/:id", authMiddleware, deleteSprint);

/**
 * @swagger
 * /kivora/v1/sprints/searchSprints:
 *   get:
 *     summary: Buscar sprints por número, estado o fechas
 *     tags: [Sprints]
 *     parameters:
 *       - in: query
 *         name: number
 *         schema:
 *           type: number
 *       - in: query
 *         name: state
 *         schema:
 *           type: string
 *           enum: [Atrasado, En curso, Finalizado]
 *       - in: query
 *         name: dateStart
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: dateEnd
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Resultados encontrados
 *       500:
 *         description: Error del servidor
 */

router.get("/searchSprints", searchSprints);

/**
 * @swagger
 * /kivora/v1/sprints/addBacklogToSprint/{id}:
 *   post:
 *     summary: Agregar un ítem de backlog al sprint
 *     tags: [Sprints]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del sprint
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - backlogId
 *             properties:
 *               backlogId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Backlog agregado correctamente
 *       500:
 *         description: Error del servidor
 */

router.post("/addBacklogToSprint/:id", authMiddleware, addBacklogToSprint)

/**
 * @swagger
 * /kivora/v1/sprints/removeBacklogFromSprint/{id}:
 *   delete:
 *     summary: Eliminar un ítem de backlog de un sprint
 *     tags: [Sprints]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del sprint
 *       - in: query
 *         name: backlogId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Backlog eliminado correctamente
 *       500:
 *         description: Error del servidor
 */

router.delete("/removeBacklogFromSprint/:id",authMiddleware, removeBacklogFromSprint)

export default router;