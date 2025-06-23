import { Router } from "express";
import {
    createSprint,
    getSprints,
    getSprint,
    updateSprint,
    deleteSprint,
    searchSprints
} from "./sprint.controller.js";
import {
    validatorCreateSprint,
    validatorDeleteSprint,
    validatorUpdateSprint
} from "../middlewares/sprint-validate.js";

const router = Router();

router.post("/createSprint", validatorCreateSprint, createSprint);

router.get("/getSprints", getSprints);

router.get("/getSprint/:id", getSprint);

router.put("/updateSprint/:id", validatorUpdateSprint, updateSprint);

router.delete("/deleteSprint/:id", validatorDeleteSprint, deleteSprint);

router.get("/searchSprints", searchSprints);

export default router;