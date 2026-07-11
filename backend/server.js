import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { error } from "console";

import connectDB from "./config/db.js";
import errorHandler from "./middleware/errorHandler.js";
import authRoutes from "./routes/authRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";
import flashcardRoutes from "./routes/flashcardRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
//ES6 module __dirname alternavtive
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Initialze express app

const app = express();

//Connect to MongoDB
connectDB();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.use(express.json());
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ success: false, error: "Invalid JSON" });
  }
  next(err);
});
app.use(express.urlencoded({ extended: true }));

//Static folder for uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/flashcards", flashcardRoutes);
app.use("/api/ai", aiRoutes);

app.use(errorHandler);
//404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
    statusCode: 404,
  });
});

//Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(
    `Server running on port ${process.env.NODE_ENV} mode on port ${PORT}`,
  );
});

process.on("unhandledRejection", (error) => {
  console.error(`Error : ${error.message}`);
  process.exit(1);
});
