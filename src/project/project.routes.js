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

  router.post("/addProject", authMiddleware, addProject);

  router.get("/getProjects/:idGroup", authMiddleware, getProjects);

  router.put("/updateProject/:idProject", updateProject);

  router.delete("/deleteProject/:idProject", deleteProject);

  router.get("/listUserProjects", authMiddleware, listUserProjects);

  router.get("/projectstats/:projectId", getProjectStats);


  export default router;