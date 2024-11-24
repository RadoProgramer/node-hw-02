const multer = require("multer");
const path = require("path");

const tmpDir = path.join(process.cwd(), "tmp"); // Ścieżka do tymczasowego folderu

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, tmpDir); // Przechowywanie w folderze tmp
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`; // Unikalna nazwa pliku
        cb(null, uniqueName);
    },
});

const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedMimeTypes.includes(file.mimetype)) {
        return cb(new Error("Unsupported file type"), false); // Obsługa błędu dla nieobsługiwanych typów
    }
    cb(null, true);
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 2 * 1024 * 1024, // Limit rozmiaru pliku do 2MB
    },
});

module.exports = upload.single("avatar"); // Obsługa jednego pliku o nazwie "avatar"

