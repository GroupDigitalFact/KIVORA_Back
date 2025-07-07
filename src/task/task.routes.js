import { Router } from "express";
import {addTask,listTasks,updateTask,deleteService,reassignTask  ,markTaskUrgent, addTaskAttachments,  deleteTaskAttachments, setTaskTags} from "./task.controller.js";
import { uploadTaskFiles } from "../middlewares/multer-uploads.js";
import{ authMiddleware, authScrumMasterMiddleware } from "../middlewares/auth-validate.js";
const router = Router();

router.post("/addTask", uploadTaskFiles.array("attachments", 10), authScrumMasterMiddleware, addTask);

router.post("/listTasks", listTasks);

router.put("/updateTask", updateTask);

router.delete("/deleteTask", deleteService);

router.put("/reassignTask", reassignTask);

router.post("/markTaskUrgent", markTaskUrgent)

router.post("/setTaskTags", setTaskTags);

router.put(
  "/addTaskAttachments/:taskId",
  uploadTaskFiles.array("attachments", 10),
  authMiddleware,
  addTaskAttachments
);

router.delete(
  "/deleteTaskAttachments/:taskId",
  authMiddleware,
  deleteTaskAttachments
);


export default router;