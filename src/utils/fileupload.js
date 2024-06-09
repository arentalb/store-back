import multer from "multer";
import path from "path";
import fs from "fs";

// Set storage engine for multer
const storage = multer.diskStorage({
    destination: "./public/images/",
    filename: (req, file, cb) => {
        cb(
            null,
            file.originalname.split(".")[0] + "-" + Date.now() + path.extname(file.originalname),
        );
    },
});

// Initialize upload variable
const upload = multer({
    storage: storage,
    limits: {fileSize: 1000000}, // Limit file size to 1MB
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

const __dirname = path.resolve();
export const deleteImage = (filename) => {
    const filePath = path.join(__dirname, '', filename);

    fs.unlink(filePath, (err) => {
        if (err) {
            console.error('Error deleting file:', err);
        } else {
            console.log('File deleted successfully');
        }
    });
};

export default upload;
