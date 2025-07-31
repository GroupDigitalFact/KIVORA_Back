"use strict";

import express from "express";
import cors from "cors";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express"
import swaggerJsDoc from "swagger-jsdoc";
import morgan from "morgan";
import http from "http";
import { dbConnection } from "./mongo.js";
import apiLimiter from "../src/middlewares/validate-limiter.js";
import authRoutes from "../src/auth/auth.routes.js";
import userRoutes from "../src/user/user.routes.js";
import clusterRoutes from "../src/cluster/cluster.routes.js";
import projectRoutes from "../src/project/project.routes.js";
import sprintRoutes from "../src/sprint/sprint.routes.js";
import backlogRoutes from "../src/backlog/backlog.routes.js";
import taskRoutes from "../src/task/task.routes.js";
import eventRoutes from "../src/event/event.routes.js";
import feedbackRoutes from "../src/feedback/feedback.routes.js";
import notificationsRoutes from "../src/notifications/notifications.routes.js";
import messageRoutes from "../src/message/message.routes.js";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

export const io = new Server(server, {
  cors: { origin: "*" },
});

export const userSocketMap = {};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("User Connected", userId);
  if (userId) userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("User disconnect", userId);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: "Kivora API Documentation",
        version: "1.0.0",
        description: "Documentación de la API Kivora",
    },
    servers: [
        {
            url: `http://localhost:${process.env.PORT || 3002}`,
            description: "Servidor local",
        },
    ],
};

const swaggerOptions = {
    swaggerDefinition,
    apis: ["./src/**/*.routes.js", "./src/**/*.model.js"],
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);



const middlewares = (app) => {
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use(cors());
  app.use(helmet());
  app.use(morgan("dev"));
  app.use(apiLimiter);
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

const routes = (app) => {
  app.use("/kivora/v1/auth", authRoutes);
  app.use("/kivora/v1/sprint", sprintRoutes);
  app.use("/kivora/v1/cluster", clusterRoutes);
  app.use("/kivora/v1/user", userRoutes);
  app.use("/kivora/v1/project", projectRoutes);
  app.use("/kivora/v1/backlog", backlogRoutes);
  app.use("/kivora/v1/task", taskRoutes);
  app.use("/kivora/v1/event", eventRoutes);
  app.use("/kivora/v1/feedback", feedbackRoutes);
  app.use("/kivora/v1/notifications", notificationsRoutes);
  app.use("/kivora/v1/message", messageRoutes);
};

const conectarDB = async () => {
  try {
    await dbConnection();
  } catch (err) {
    console.log(`Database connection failed: ${err}`);
    process.exit(1);
  }
};

export const initServer = () => {
  try {
    middlewares(app);
    conectarDB();
    routes(app);
    server.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
      console.log(`Swagger docs available at http://localhost:${process.env.PORT}/api-docs`);
    });
  } catch (err) {
    console.log(`Server init failed: `, err);
  }
};
