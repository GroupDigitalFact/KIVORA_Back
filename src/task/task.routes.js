import { Router } from "express";
import {addTask,listTasksSprint,updateTask,deleteTask,reassignTask,listTasksUser, listTasksProject ,markTaskUrgent, addTaskAttachments, updateState, deleteTaskAttachments, setTaskTags} from "./task.controller.js";
import { uploadTaskFiles } from "../middlewares/multer-uploads.js";
import{ authMiddleware, authScrumMasterMiddleware } from "../middlewares/auth-validate.js";
const router = Router();

router.post("/addTask", uploadTaskFiles.array("attachments", 10), authScrumMasterMiddleware, addTask);

router.get("/listTasks/:sprint", listTasksSprint);

router.get("/listTasksProject/:project", listTasksProject);

router.get("/listTasksUser", authMiddleware, listTasksUser);

router.put("/updateTask/:id", updateTask);

router.delete("/deleteTask", deleteTask);

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

router.put("/updateStateTask/:id", updateState);


export default router;