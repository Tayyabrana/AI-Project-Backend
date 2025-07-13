import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import database from "./config/database.js";
import { get404, get500 } from "./controllers/error.js";

import projectRoutes from "./routes/project.js";
import employeeRoutes from "./routes/employee.js";
import featureRoutes from "./routes/feature.js";
import taskRoutes from "./routes/task.js";
import assignmentRoutes from "./routes/assignment.js";
import openaiRoutes from './routes/openai.js';

const app = express();
const port = process.env.PORT || 6050;

database
    .getConnection()
    .then((connection) => {
        console.log("MySQL connected!");

        app.use(express.json());
        app.use(cors({
            origin: "*",
            credentials: true
        }));

        app.get("/", (req, res) => {
            res.status(200).json({ message: "AI Project Backend Running" });
        });

        app.use("/v1/projects", projectRoutes);
        app.use("/v1/employees", employeeRoutes);
        app.use("/v1/features", featureRoutes);
        app.use("/v1/tasks", taskRoutes);
        app.use("/v1/assignments", assignmentRoutes);
        app.use("/v1/openai",openaiRoutes);

        app.use(get404);
        app.use(get500);

        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((error) => {
        console.error("Unable to connect with MySQL!", error.message);
    });
