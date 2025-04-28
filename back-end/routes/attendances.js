import express from "express";
import { param, query } from "express-validator";
import { addNotEmptyStringValidation, handleValidationResult } from "../middlewares/validation.js";
import authenticateToken from "../middlewares/authentication.js";
import authorizeRoles from "../middlewares/authorization.js";
import dbPool from "../db.js";
import uploadRoutes from "./uploads.js";

const router = express.Router({ mergeParams: true });

// GET /users/:id/attendances -> List of a user's attendances
router.get("/",
	[
		param("id").isInt({ gt: 0 }).withMessage("User ID must be an integer greater than 0.").toInt(),
		query("limit").isInt({ gt: 0 }).withMessage("Limit must be an integer greater than 0.").toInt(),
		query("page").optional().isInt({ gt: 0 }).withMessage("Page must be an integer greater than 0.").toInt()
	],
	handleValidationResult,
	authenticateToken,
	authorizeRoles("employee", "admin"),
	async (req, res) => {
		try {
			const limit = Number(req.query.limit);
			let queryString = "SELECT attendance_id, check_in_date, check_in_time, photo_path " +
				"FROM attendances " +
				"WHERE user_id = ? " +
				"ORDER BY check_in_date DESC " +
				"LIMIT ?";
			let queryParameters = [req.params.id, limit];
			if (req.query.page) {
				const page = Number(req.query.page);
				queryString += " OFFSET ?;";
				queryParameters.push((page - 1) * limit);
			} else {
				queryString += ";";
			}
			const [rows] = await dbPool.query(
				queryString,
				queryParameters
			);
			res.json(rows);
		} catch (err) {
			console.error(err);
			return res.status(500).json({
				message: "Database query failed.",
				sqlMessage: err.sqlMessage
			});
		}
	}
);

// GET /users/:id/attendances/:aid -> Detail of a single user attendance
router.get("/:aid",
	[
		param("aid").isInt({ gt: 0 }).withMessage("Attendance ID must be an integer greater than 0.").toInt(),
		param("id").isInt({ gt: 0 }).withMessage("User ID must be an integer greater than 0.").toInt()
	],
	handleValidationResult,
	authenticateToken,
	authorizeRoles("employee", "admin"),
	async (req, res) => {
		try {
			const [rows] = await dbPool.query(
				"SELECT * " +
				"FROM attendances " +
				"WHERE attendance_id = ? AND user_id = ? " +
				"LIMIT 1;",
				[req.params.aid, req.params.id]
			);
			if (rows.length === 0) {
				return res.status(404).json({ message: "Attendance not found." });
			}
			res.json(rows[0]);
		} catch (err) {
			console.error(err);
			return res.status(500).json({
				message: "Database query failed.",
				sqlMessage: err.sqlMessage
			});
		}
	}
);

// POST /users/:id/attendances -> Insert one new attendance of a user
router.post("/",
	[param("id").isInt({ gt: 0 }).withMessage("User ID must be an integer greater than 0.").toInt()],
	addNotEmptyStringValidation("photo_path"),
	handleValidationResult,
	authenticateToken,
	authorizeRoles("employee"),
	async (req, res) => {
		try {
			await dbPool.query("START TRANSACTION;");
			const user_id = req.params.id;
			const { photo_path } = req.body;
			const [result] = await dbPool.query(
				"INSERT INTO attendances (user_id, photo_path) " +
				"VALUES (?, ?);",
				[user_id, photo_path]
			);
			const [rows] = await dbPool.query(
				"SELECT * " +
				"FROM attendances " +
				"WHERE attendance_id = LAST_INSERT_ID() AND user_id = ? " +
				"LIMIT 1;",
				[user_id]
			);
			await dbPool.query("COMMIT;");
			res.status(201).json(rows[0]);
		} catch (err) {
			console.error(err);
			await dbPool.query("ROLLBACK;");
			return res.status(500).json({
				message: "Database query failed.",
				sqlMessage: err.sqlMessage
			});
		}
	}
);

// PUT /users/:id/attendances/:aid -> Update one existing attendance
router.put("/:aid",
	[
		param("aid").isInt({ gt: 0 }).withMessage("Attendance ID must be an integer greater than 0.").toInt(),
		param("id").isInt({ gt: 0 }).withMessage("User ID must be an integer greater than 0.").toInt()
	],
	addNotEmptyStringValidation("photo_path"),
	handleValidationResult,
	authenticateToken,
	authorizeRoles("employee"),
	async (req, res) => {
		try {
			const user_id = req.params.id;
			const attendance_id = req.params.aid;
			const { photo_path } = req.body;
			const [result] = await dbPool.query(
				"UPDATE attendances " +
				"SET photo_path = ? " +
				"WHERE attendance_id = ? AND user_id = ? " +
				"LIMIT 1;",
				[photo_path, attendance_id, user_id]
			);
			if (result.affectedRows === 0) {
				return res.status(404).json({ message: "Attendance not found." });
			}
			res.json({ attendance_id, user_id, photo_path });
		} catch (err) {
			console.error(err);
			return res.status(500).json({
				message: "Database query failed.",
				sqlMessage: err.sqlMessage
			});
		}
	}
);

// DELETE /users/:id/attendances/:aid -> Delete one existing attendance
router.delete("/:aid",
	[
		param("aid").isInt({ gt: 0 }).withMessage("Attendance ID must be an integer greater than 0.").toInt(),
		param("id").isInt({ gt: 0 }).withMessage("User ID must be an integer greater than 0.").toInt()
	],
	handleValidationResult,
	authenticateToken,
	authorizeRoles(), // not-allowed
	async (req, res) => {
		try {
			const [result] = await dbPool.query(
				"DELETE FROM attendances " +
				"WHERE attendance_id = ? AND user_id = ? " +
				"LIMIT 1;",
				[req.params.aid, req.params.id]
			);
			if (result.affectedRows === 0) {
				return res.status(404).json({ message: "Attendance not found." });
			}
			res.json({ "message": "Attendance deleted." });
		} catch (err) {
			console.error(err);
			return res.status(500).json({
				message: "Database query failed.",
				sqlMessage: err.sqlMessage
			});
		}
	}
);

router.use("/", uploadRoutes);

export default router;
