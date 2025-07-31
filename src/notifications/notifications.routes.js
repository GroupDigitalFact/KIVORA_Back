import { Router } from "express";
import {
  getMyNotifications,
  updateNotificationState,
  getNotificationById,
  getClusterNotifications,
} from "./notifications.controller.js";
import { authMiddleware } from "../middlewares/auth-validate.js"

const router = Router();

router.get("/getMyNotifications",authMiddleware, getMyNotifications);

router.get("/getClusterNotifications/:clusterId",authMiddleware, getClusterNotifications);

router.get("/getNotificationById/:notificationId", authMiddleware, getNotificationById);

router.patch("/updateNotificationState/:notificationId", authMiddleware, updateNotificationState);

export default router;