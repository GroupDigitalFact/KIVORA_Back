  import { Router } from "express";
  import {
    addProject,
    getProjects,
    updateProject,
    deleteProject,
    listUserProjects,
    getProjectStats
  } from "./project.controller.js";
  import { authMiddleware } from "../middlewares/auth-validate.js"


  const router = Router();

  /**
 * @swagger
 * /kivora/v1/projects/addProject:
 *   post:
 *     summary: Crear un nuevo proyecto
 *     tags: [Proyectos]
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
 *               - description
 *               - startDate
 *               - endDate
 *               - projectType
 *               - cluster
 *               - productOwner
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               projectType:
 *                 type: string
 *                 enum: [Academic, Informatic]
 *               cluster:
 *                 type: string
 *               productOwner:
 *                 type: string
 *     responses:
 *       201:
 *         description: Proyecto creado correctamente
 *       400:
 *         description: Error de validación o proyecto duplicado
 *       500:
 *         description: Error en la creación del proyecto
 */

  router.post("/addProject", authMiddleware, addProject);

  /**
 * @swagger
 * /kivora/v1/projects/getProjects/{idGroup}:
 *   get:
 *     summary: Obtener todos los proyectos de un grupo específico
 *     tags: [Proyectos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idGroup
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del grupo (cluster)
 *     responses:
 *       200:
 *         description: Lista de proyectos obtenida exitosamente
 *       404:
 *         description: No se encontraron proyectos
 *       500:
 *         description: Error al obtener los proyectos
 */

  router.get("/getProjects/:idGroup", authMiddleware, getProjects);

  /**
 * @swagger
 * /kivora/v1/projects/updateProject/{idProject}:
 *   put:
 *     summary: Actualizar un proyecto existente
 *     tags: [Proyectos]
 *     parameters:
 *       - in: path
 *         name: idProject
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del proyecto a actualizar
 *     requestBody:
 *       description: Datos del proyecto a actualizar
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
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               projectType:
 *                 type: string
 *                 enum: [Academic, Informatic]
 *               productOwner:
 *                 type: string
 *     responses:
 *       200:
 *         description: Proyecto actualizado correctamente
 *       404:
 *         description: Proyecto no encontrado
 *       500:
 *         description: Error actualizando el proyecto
 */

  router.put("/updateProject/:idProject", updateProject);

  /**
 * @swagger
 * /kivora/v1/projects/deleteProject/{idProject}:
 *   delete:
 *     summary: Eliminar un proyecto (estado lógico)
 *     tags: [Proyectos]
 *     parameters:
 *       - in: path
 *         name: idProject
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del proyecto a eliminar
 *     responses:
 *       200:
 *         description: Proyecto eliminado correctamente
 *       404:
 *         description: Proyecto no encontrado
 *       500:
 *         description: Error al eliminar el proyecto
 */

  router.delete("/deleteProject/:idProject", deleteProject);

  /**
 * @swagger
 * /kivora/v1/projects/listUserProjects:
 *   get:
 *     summary: Obtener todos los proyectos en los que participa el usuario autenticado
 *     tags: [Proyectos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de proyectos obtenida correctamente
 *       404:
 *         description: El usuario no pertenece a ningún proyecto
 *       500:
 *         description: Error al obtener los proyectos
 */

  router.get("/listUserProjects", authMiddleware, listUserProjects);

  /**
 * @swagger
 * /kivora/v1/projects/projectstats/{projectId}:
 *   get:
 *     summary: Obtener estadísticas completas de un proyecto
 *     tags: [Proyectos]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del proyecto
 *     responses:
 *       200:
 *         description: Estadísticas del proyecto generadas correctamente
 *       404:
 *         description: Proyecto o grupo no encontrado
 *       500:
 *         description: Error generando estadísticas
 */

  router.get("/projectstats/:projectId", getProjectStats);


  export default router;