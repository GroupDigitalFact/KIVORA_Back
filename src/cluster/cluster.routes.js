import { Router } from "express";
import {crearGrupo,listarGrupos,agregarIntegrante,eliminarIntegrante,editarDescripcion, buscarGrupoId} from "./cluster.controller.js";
import {validatorCrearGrupo,validatorAgregarIntegrante,validatorEliminarIntegrante,validatorEditarDescripcion,} from "../middlewares/cluster-validate.js";
import { uploadProfilePicture } from "../middlewares/multer-uploads.js";
import { authMiddleware } from "../middlewares/auth-validate.js"

const router = Router();


/**
 * @swagger
 * /kivora/v1/cluster/crear:
 *   post:
 *     summary: Crear un nuevo grupo
 *     tags: [Cluster]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Grupo de desarrollo
 *               descripcion:
 *                 type: string
 *                 example: Grupo dedicado a desarrollo de software
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Grupo creado exitosamente
 *       400:
 *         description: Ya existe un grupo con ese nombre
 *       500:
 *         description: Error del servidor
 */

router.post("/crear",uploadProfilePicture.single("profilePicture"), authMiddleware, crearGrupo);

/**
 * @swagger
 * /kivora/v1/cluster/listar/{usuario}:
 *   get:
 *     summary: Listar todos los grupos donde participa un usuario
 *     tags: [Cluster]
 *     parameters:
 *       - in: path
 *         name: usuario
 *         required: true
 *         schema:
 *           type: string
 *         description: Email o nombre de usuario del integrante
 *     responses:
 *       200:
 *         description: Lista de grupos obtenida exitosamente
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error del servidor
 */

router.get("/listar/:usuario", listarGrupos);

/**
 * @swagger
 * /kivora/v1/cluster/buscar/{grupoId}:
 *   get:
 *     summary: Buscar grupo por su ID
 *     tags: [Cluster]
 *     parameters:
 *       - in: path
 *         name: grupoId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del grupo
 *     responses:
 *       200:
 *         description: Grupo encontrado exitosamente
 *       500:
 *         description: Grupo no encontrado o error del servidor
 */

router.get("/buscar/:grupoId", buscarGrupoId);

/**
 * @swagger
 * /kivora/v1/cluster/agregar:
 *   post:
 *     summary: Agregar integrante a un grupo
 *     tags: [Cluster]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - grupoId
 *               - integrante
 *             properties:
 *               grupoId:
 *                 type: string
 *                 example: 64f5123414fa1324bcabc123
 *               integrante:
 *                 type: string
 *                 example: ema.lopez@example.com
 *     responses:
 *       200:
 *         description: Integrante agregado exitosamente
 *       400:
 *         description: Ya pertenece al grupo
 *       403:
 *         description: No autorizado (solo propietario puede agregar)
 *       404:
 *         description: Grupo o integrante no encontrado
 *       500:
 *         description: Error del servidor
 */

router.post("/agregar", validatorAgregarIntegrante, agregarIntegrante);

/**
 * @swagger
 * /kivora/v1/cluster/eliminar:
 *   delete:
 *     summary: Eliminar integrante de un grupo
 *     tags: [Cluster]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - grupoId
 *               - integrante
 *             properties:
 *               grupoId:
 *                 type: string
 *                 example: 64f5123414fa1324bcabc123
 *               integrante:
 *                 type: string
 *                 example: ema.lopez@example.com
 *     responses:
 *       200:
 *         description: Integrante eliminado exitosamente
 *       403:
 *         description: No autorizado
 *       404:
 *         description: Grupo o integrante no encontrado
 *       500:
 *         description: Error del servidor
 */

router.delete("/eliminar", validatorEliminarIntegrante, eliminarIntegrante);

/**
 * @swagger
 * /kivora/v1/cluster/editar:
 *   put:
 *     summary: Editar la descripción de un grupo
 *     tags: [Cluster]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - grupoId
 *               - descripcion
 *             properties:
 *               grupoId:
 *                 type: string
 *                 example: 64f5123414fa1324bcabc123
 *               descripcion:
 *                 type: string
 *                 example: Nuevo grupo de trabajo para el sprint final
 *     responses:
 *       200:
 *         description: Descripción editada exitosamente
 *       403:
 *         description: No autorizado
 *       404:
 *         description: Grupo no encontrado
 *       500:
 *         description: Error del servidor
 */

router.put("/editar", validatorEditarDescripcion, editarDescripcion);

export default router;