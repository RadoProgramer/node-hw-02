const multer = require("multer");
const path = require("path");
const tmpDir = path.join(process.cwd(), "tmp");
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, tmpDir);
	},
	filename: (req, file, cb) => {
		const uniqueName = `${Date.now()}-${file.originalname}`;
		cb(null, uniqueName);
	},
});

const fileFilter = (req, file, cb) => {
	const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"];
	if (!allowedMimeTypes.includes(file.mimetype)) {
		return cb(new Error("Unsupported file type"), false);
	}
	cb(null, true);
};

const upload = multer({
	storage,
	fileFilter,
	limits: {
		fileSize: 5 * 1024 * 1024,
	},
});

module.exports = upload.single("avatar");
