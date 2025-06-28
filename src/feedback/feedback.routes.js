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

router.post("/createRetrospective", authScrumMasterMiddleware, createRetrospective);

router.put("/updateRetrospective/:id/:projectId", authScrumMasterMiddleware, updateRetrospective);

router.delete("/deleteRetrospective/:id/:projectId", authScrumMasterMiddleware, deleteRetrospective);

router.get("/getSprintSummary/:projectId", authScrumMasterMiddleware, getSprintSummary);

router.get("/exportRetrospectiveToPDF/:sprintId", exportRetrospectiveToPDF)

router.get("/exportTaskRetrospectiveToPDF/:taskId", exportTaskRetrospectiveToPDF)

export default router; 