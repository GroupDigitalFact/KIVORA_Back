import { Router } from "express";
import { 
    createRetrospective,
    updateRetrospective
 } from "./feedback.controller.js";
import { authScrumMasterMiddleware } from "../middlewares/auth-validate.js";

const router = Router();

router.post("/createRetrospective", authScrumMasterMiddleware, createRetrospective);

router.put("/updateRetrospective/:id", authScrumMasterMiddleware, updateRetrospective);


export default router; 