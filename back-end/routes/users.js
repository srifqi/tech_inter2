import express from "express";
import bcrypt from "bcrypt";
import { param, query } from "express-validator";
import { addNotEmptyStringValidation, handleValidationResult } from "../middlewares/validation.js";
import authenticateToken from "../middlewares/authentication.js";
import authorizeRoles from "../middlewares/authorization.js";
import dbPool from "../db.js";
import attendancesRoutes from "./attendances.js";

const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS);

const router = express.Router();

// GET /users -> List of users with attendance info
router.get("/",
	[
		query("limit").isInt({ gt: 0 }).withMessage("Limit must be an integer greater than 0.").toInt(),
		query("page").optional().isInt({ gt: 0 }).withMessage("Page must be an integer greater than 0.").toInt()
	],
	handleValidationResult,
	authenticateToken,
	authorizeRoles("admin"),
	async (req, res) => {
		try {
			const limit = Number(req.query.limit);
			let queryString = "SELECT * " +
				"FROM users_attendance_summary " +
				"ORDER BY user_id ASC " +
				"LIMIT ?";
			let queryParameters = [limit];
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

// GET /users/:id -> Detail of one user
router.get("/:id",
	[param("id").isInt({ gt: 0 }).withMessage("User ID must be an integer greater than 0.").toInt()],
	handleValidationResult,
	authenticateToken,
	authorizeRoles("employee", "admin"),
	async (req, res) => {
		try {
			const [rows] = await dbPool.query(
				"SELECT * " +
				"FROM users " +
				"WHERE user_id = ? " +
				"LIMIT 1;",
				[req.params.id]
			);
			if (rows.length === 0) {
				return res.status(404).json({ message: "User not found." });
			}
			const returnedRow = rows[0];
			delete returnedRow.password_hash; // Don't return password hash
			res.json(returnedRow);
		} catch (err) {
			console.error(err);
			return res.status(500).json({
				message: "Database query failed.",
				sqlMessage: err.sqlMessage
			});
		}
	}
);

// POST /users -> Insert one new user
router.post("/",
	addNotEmptyStringValidation("join_date", "phone", "position", "department", "full_name", "roles", "email", "password", "username"),
	handleValidationResult,
	authenticateToken,
	authorizeRoles("admin"),
	async (req, res) => {
		try {
			const { username, password, email, roles, full_name, department, position, phone, join_date } = req.body;
			const password_hash = await bcrypt.hash(password, saltRounds);
			const [result] = await dbPool.query(
				"INSERT INTO users (username, password_hash, email, roles, full_name, department, position, phone, join_date) " +
				"VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);",
				[username, password_hash, email, roles, full_name, department, position, phone, join_date]
			);
			res.status(201).json({
				user_id: result.insertId,
				username, email, roles, full_name, department, position, phone, join_date
			});
		} catch (err) {
			console.error(err);
			return res.status(500).json({
				message: "Database query failed.",
				sqlMessage: err.sqlMessage
			});
		}
	}
);

// PUT /users/:id -> Update one existing user
router.put("/:id",
	[param("id").isInt({ gt: 0 }).withMessage("User ID must be an integer greater than 0.").toInt()],
	addNotEmptyStringValidation("join_date", "phone", "position", "department", "full_name", "email"),
	handleValidationResult,
	authenticateToken,
	authorizeRoles("admin"),
	async (req, res) => {
		try {
			const user_id = req.params.id;
			const { email, full_name, department, position, phone, join_date } = req.body;
			const [result] = await dbPool.query(
				"UPDATE users " +
				"SET email = ?, full_name = ?, department = ?, position = ?, phone = ?, join_date = ? " +
				"WHERE user_id = ? " +
				"LIMIT 1;",
				[email, full_name, department, position, phone, join_date, user_id]
			);
			if (result.affectedRows === 0) {
				return res.status(404).json({ message: "User not found." });
			}
			res.json({ user_id, email, full_name, department, position, phone, join_date });
		} catch (err) {
			console.error(err);
			return res.status(500).json({
				message: "Database query failed.",
				sqlMessage: err.sqlMessage
			});
		}
	}
);

// DELETE /users/:id -> Delete one existing user
router.delete("/:id",
	[param("id").isInt({ gt: 0 }).withMessage("User ID must be an integer greater than 0.").toInt()],
	handleValidationResult,
	authenticateToken,
	authorizeRoles(), // not-allowed
	async (req, res) => {
		try {
			await dbPool.query("START TRANSACTION;");
			await dbPool.query(
				"DELETE FROM attendances " +
				"WHERE user_id = ?;",
				[req.params.id]
			);
			const [result1] = await dbPool.query(
				"DELETE FROM users " +
				"WHERE user_id = ? " +
				"LIMIT 1;",
				[req.params.id]
			);
			await dbPool.query("COMMIT;");
			if (result1.affectedRows === 0) {
				return res.status(404).json({ message: "User not found." });
			}
			res.json({ message: "User deleted." });
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

router.use("/:id/attendances", attendancesRoutes);

export default router;
