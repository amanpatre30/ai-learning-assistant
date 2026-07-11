import express from "express";
import multer from "multer";
import {
  uploadDocument,
  getDocuments,
  getDocument,
  deleteDocument,
} from "../controllers/documentController.js";
import protect from "../middleware/auth.js";
import upload from "../config/multer.js";

const handleUpload = (req, res, next) => {
  console.log(">>> handleUpload started");
  upload.single("file")(req, res, (err) => {
    console.log(">>> multer callback");
    if (err) {
      console.log(">>> Multer Error:", err);
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            success: false,
            error: "File size exceeds the maximum limit of 10MB",
            statusCode: 400,
          });
        }

        return res.status(400).json({
          success: false,
          error:
            "Invalid multipart upload. Please send the file as form-data with the field name 'file'.",
          statusCode: 400,
        });
      }

      if (err.message === "Malformed part header") {
        return res.status(400).json({
          success: false,
          error:
            "Invalid multipart upload. Please send the file as form-data with the field name 'file'.",
          statusCode: 400,
        });
      }

      return next(err);
    }
    console.log(">>> req.file =", req.file);
    console.log(">>> calling uploadDocument");
    next();
  });
};

const router = express.Router();

//All routes are protected
router.use(protect);
router.post("/upload", handleUpload, uploadDocument);
router.get("/", getDocuments);
router.get("/:id", getDocument);
router.delete("/:id", deleteDocument);


export default router;
