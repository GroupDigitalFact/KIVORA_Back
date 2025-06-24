import { Router } from "express";
import {addTask,listTasks,updateTask,deleteService,reassignTask  ,markTaskUrgent , setTaskTags} from "./task.controller.js";

const router = Router();

router.post("/addTask", addTask);

router.post("/listTasks", listTasks);

router.put("/updateTask", updateTask);

router.delete("/deleteTask", deleteService);

router.put("/reassignTask", reassignTask);

router.post("/markTaskUrgent", markTaskUrgent)

router.post("/setTaskTags", setTaskTags);


export default router;