import { Router } from "express";
import {
  createEvent,
  listEvents,
  updateEvent,
  deleteEvent,
  markAttendance,
  userAttendanceHistory,
  filterEventsByTypeOrDate
} from "./event.controller.js";

const router = Router();

router.post("/create", createEvent); // userId en body
router.get("/list", listEvents); // userId en body o query
router.put("/update/:id", updateEvent); // userId en body
router.delete("/delete/:id", deleteEvent); // userId en body
router.post("/attendance", markAttendance); // eventId, userId, presente en body
router.post("/userAttendance", userAttendanceHistory); // userId en body
router.post("/filter", filterEventsByTypeOrDate);

export default router;