import { Router } from "express";
import { authMiddleware, authScrumMasterMiddleware } from "../middlewares/auth-validate.js";
import { uploadTaskFiles } from "../middlewares/multer-uploads.js";
import { addTask, addTaskAttachments, deleteService, deleteTaskAttachments, getMyTasks, listTasks, markTaskUrgent, reassignTask, setTaskTags, updateTask, updateTaskState } from "./task.controller.js";
const router = Router();

router.post("/addTask", uploadTaskFiles.array("attachments", 10), authScrumMasterMiddleware, addTask);

router.post("/listTasks", listTasks);
//Pa devyn
router.get("/myTasks", authMiddleware, getMyTasks);

router.put("/updateTaskState/:id", authScrumMasterMiddleware, updateTaskState);

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