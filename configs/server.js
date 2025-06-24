"use strict";

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { dbConnection } from "./mongo.js";
import apiLimiter from "../src/middlewares/validate-limiter.js";
import authRoutes from "../src/auth/auth.routes.js";
import userRoutes from "../src/user/user.routes.js";
import clusterRoutes from "../src/cluster/cluster.routes.js";
import projectRoutes from "../src/project/project.routes.js";
import sprintRoutes from "../src/sprint/sprint.routes.js";
import taskRoutes from "../src/task/task.routes.js"


const middlewares = (app) => {
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use(cors());
  app.use(helmet());
  app.use(morgan("dev"));
  app.use(apiLimiter);
};

const routes = (app) => {
    app.use("/kivora/v1/auth", authRoutes);
    app.use("/kivora/v1/sprint", sprintRoutes);
    app.use("/kivora/v1/cluster", clusterRoutes);
    app.use("/kivora/v1/user", userRoutes);
    app.use("/kivora/v1/project", projectRoutes);
    app.use("/kivora/v1/task", taskRoutes);
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
  const app = express();
  try {
    middlewares(app);
    conectarDB();
    routes(app);
    app.listen(process.env.PORT);
    console.log(`Server running on port ${process.env.PORT}`);
  } catch (err) {
    console.log(`Server init failed: `, err);
  }
};
