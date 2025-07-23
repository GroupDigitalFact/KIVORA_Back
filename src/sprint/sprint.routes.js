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
 
// Se Crea el Sprint 
router.post("/createSprint", authMiddleware, createSprint);

//Solicita las sprint que le pertenece a un projecto
router.get("/getSprints/:projectId", getSprints);

//Se busca una sprint en especifico para obtener sus datos
router.get("/getSprint/:id", getSprint);

//Actualiza algo del sprint ya sea titulo descripcion o lo que se desea
router.put("/updateSprint/:id", authMiddleware, updateSprint);

// Cambia el estado y duración del sprint (En curso, Atrasado, Finalizado)
router.put("/stateDurationSprint/:id", authMiddleware, stateDurationSprint);

// Elimina (desactiva) un sprint
router.delete("/deleteSprint/:id", authMiddleware, deleteSprint);

// Busca sprints según filtros (número, estado, fechas)
router.get("/searchSprints", searchSprints);

// Agrega un backlog a un sprint
router.post("/addBacklogToSprint/:id", authMiddleware, addBacklogToSprint)

// Elimina un backlog de un sprint
router.delete("/removeBacklogFromSprint/:id",authMiddleware, removeBacklogFromSprint)

export default router;