import express from "express";
import multer from "multer";
import path from "path";
import { sendFailure, sendSuccess } from "./resposeSender.js";

const router = express.Router();

// Set storage engine for multer
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname),
    );
  },
});

// Initialize upload variable
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // Limit file size to 1MB
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
}).single("image");

// Check file type
function checkFileType(file, cb) {
  // Allowed file extensions
  const filetypes = /jpeg|jpg|png|gif/;
  // Check file extension
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check MIME type
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
}

// Handle file upload via POST request
router.post("/", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      sendFailure(res, err || "Error uploading file", 401);
    } else {
      if (req.file === undefined) {
        sendFailure(res, "No file selected!", 401);
      } else {
        sendSuccess(res, `uploads/${req.file.filename}`, 200);
      }
    }
  });
});

export default router;
