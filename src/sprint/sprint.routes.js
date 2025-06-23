import { Router } from "express";
import {
    createSprint,
    getSprints,
    getSprint,
    updateSprint,
    deleteSprint,
    searchSprints,
    stateDurationSprint
} from "./sprint.controller.js";
import {
    validatorCreateSprint,
    validatorDeleteSprint,
    validatorUpdateSprint
} from "../middlewares/sprint-validate.js";
import { authMiddleware } from "../middlewares/auth-validate.js"


const router = Router();

router.post("/createSprint", authMiddleware, createSprint);

router.get("/getSprints/:projectId", getSprints);

router.get("/getSprint/:id", getSprint);

router.put("/updateSprint/:id", authMiddleware, updateSprint);

router.put("/stateDurationSprint/:id", authMiddleware, stateDurationSprint);

router.delete("/deleteSprint/:id", authMiddleware, deleteSprint);

router.get("/searchSprints", searchSprints);

export default router;