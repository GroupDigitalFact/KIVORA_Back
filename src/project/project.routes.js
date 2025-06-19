import { Router } from "express";
import {
  addProject,
  getProjects,
  updateProject,
  deleteProject
} from "./project.controller.js";

const router = Router();

// Crear un nuevo proyecto
router.post("/addProject", addProject);

// Obtener proyectos por grupo
router.get("/getProjects/:idGroup", getProjects);

// Actualizar un proyecto por ID
router.put("/updateProject/:idProject", updateProject);

// Eliminar (soft delete) un proyecto por ID
router.delete("/deleteProject/:idProject", deleteProject);

export default router;