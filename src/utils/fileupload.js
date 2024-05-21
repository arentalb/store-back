import multer from "multer";
import path from "path";

// Set storage engine for multer
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(
      null,
      file.originalname + "-" + Date.now() + path.extname(file.originalname),
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
});

// Check file type
function checkFileType(file, cb) {
  // Allowed file extensions
  const filetypes = /jpeg|jpg|png|gif|avif|webp/;
  // Check file extension
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check MIME type
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    return cb(new Error("Error: Images Only!"));
  }
}

//how use it
// server.post("/newWay", upload.single("image"), (req, res) => {
//   const { name } = req.body;
//   const image = req.file ? req.file.filename : null;
//
//   const pro = { name, image };
//   sendSuccess(res, pro);
// });

//use it separately
// // Handle file upload via POST request
// router.post("/", (req, res) => {
//   upload(req, res, (err) => {
//     if (err) {
//       sendFailure(res, err || "Error uploading file", 401);
//     } else {
//       if (req.file === undefined) {
//         sendFailure(res, "No file selected!", 401);
//       } else {
//         sendSuccess(res, `/uploads/${req.file.filename}`, 200);
//       }
//     }
//   });
// });

export default upload;
