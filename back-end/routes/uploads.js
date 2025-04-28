import express from "express";
import multer from "multer";
import path from "path";
import { param } from "express-validator";
import { handleValidationResult } from "../middlewares/validation.js";
import authenticateToken from "../middlewares/authentication.js";
import authorizeRoles from "../middlewares/authorization.js";

const router = express.Router({ mergeParams: true });

const storage = multer.diskStorage({
	destination: (req, file, callback) => {
		callback(null, "uploads/");
	},
	filename: (req, file, callback) => {
		callback(null, Date.now() + req.params.id + path.extname(file.originalname));
	}
});

const upload = multer({ storage });

// GET /users/:id/attendances/upload -> Upload an image for submitting attendance
router.post("/upload",
	[param("id").isInt({ gt: 0 }).withMessage("User ID must be an integer greater than 0.").toInt()],
	handleValidationResult,
	authenticateToken,
	authorizeRoles("employee"),
	upload.single("image"),
	(req, res) => {
		if (!req.file) {
			return res.status(400).json({ message: "No file was uploaded." });
		}
		res.send({
			message: "File upload is successful.",
			fileName: req.file.filename
		});
	}
);

export default router;
