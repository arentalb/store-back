import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
    destination: "./public/images/",
    filename: (req, file, cb) => {
        const fileName = "\\" + file.originalname.split(".")[0] + "-" + Date.now() + path.extname(file.originalname);
        cb(null, fileName);
    },
});

const upload = multer({
    storage: storage,
    limits: {fileSize: 1000000},
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    },
});

function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif|avif|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
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

    });
};

export default upload;
