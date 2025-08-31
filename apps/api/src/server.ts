import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { userRoutes } from "./routes/userRoutes";
import { authRoutes } from "./routes/authRoutes";
import { projectRoutes } from "./routes/projectRoutes";
import { projectImageRoutes } from "./routes/projectImageRoutes";

dotenv.config();

const app = express();
app.use(cors());
// Increase body size limits to allow larger project payloads (e.g. base64 images in JSON)
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/projects/images', projectImageRoutes);

app.get("/", (_req, res) => {
  res.send("MorphoPymes API is running");
});

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/morphopymes";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`API running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });
