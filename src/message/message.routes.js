import { authMiddleware } from "../middlewares/auth-validate.js";
import { getMessages, getUsersForSidebar, markMessageAsSeen, sendMessage } from "./message.controller.js";
import {} from "./message.model.js";

import { Router} from "express";

const router = Router();

router.get("/users", authMiddleware, getUsersForSidebar);

router.get("/:id", authMiddleware, getMessages);

router.put("/mark/:id", authMiddleware, markMessageAsSeen);

router.post("/send/:receiverId", authMiddleware, sendMessage)


export default  router; 