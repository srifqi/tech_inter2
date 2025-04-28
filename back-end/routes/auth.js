import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { addNotEmptyStringValidation, handleValidationResult } from "../middlewares/validation.js";
import authenticateToken from "../middlewares/authentication.js";
import dbPool from "../db.js";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_ISSUER = process.env.JWT_ISSUER;

const TOKEN_VIA_COOKIE = process.env.TOKEN_VIA_COOKIE;

const router = express.Router();

// GET /auth/login -> Login, create a new JWT token
router.post("/login/:role",
	addNotEmptyStringValidation("password", "username"),
	handleValidationResult,
	async (req, res) => {
		if (req.params.role !== "employee" && req.params.role !== "admin") {
			return res.status(404).send("Cannot POST /login/" + req.params.role);
		}
		try {
			const username = req.body.username;
			const [rows] = await dbPool.query(
				"SELECT user_id, username, password_hash, roles, full_name " +
				"FROM users " +
				"WHERE username = ? " +
				"LIMIT 1;",
				[username]
			);
			let cannotLogin = false;
			if (rows.length === 0) {
				cannotLogin = true;
			} else {
				const same_password = await bcrypt.compare(req.body.password, rows[0].password_hash);
				if (!same_password) {
					cannotLogin = true;
				} else {
					if (req.params.role !== rows[0].roles) {
						cannotLogin = true;
					}
				}
			}
			if (cannotLogin) {
				return res.status(403).json({ message: "Invalid username or password." });
			}
			const selectedUser = {
				user_id: rows[0].user_id,
				username: rows[0].username,
				full_name: rows[0].full_name
			};
			const userData = {
				user_id: selectedUser.user_id,
				username: username
			};
			const token = jwt.sign(userData, JWT_SECRET, { issuer: JWT_ISSUER, expiresIn: "12h" });
			if (TOKEN_VIA_COOKIE) {
				res.cookie("token", token, {
					httpOnly: true,
					// secure: true,
					sameSite: 'Strict',
					maxAge: 12 * 60 * 60 * 1000 // 12 hours
				});
				res.json({
					message: "Login successful!",
					user: selectedUser
				});
			} else {
				res.json({ token, user: selectedUser });
			}
		} catch (err) {
			console.error(err);
			return res.status(500).json({
				message: "Database query failed.",
				sqlMessage: err.sqlMessage
			});
		}
	}
);

// GET /auth/check -> Check a JWT token, returning user data
router.get("/check",
	authenticateToken,
	async (req, res) => {
		res.json({
			user_id: req.user.user_id,
			username: req.user.username,
			full_name: req.user.full_name
		});
	}
);

// GET /auth/logout -> Logout, remove cookie
router.get("/logout",
	authenticateToken,
	async (req, res) => {
		res.clearCookie("token", req.token, {
			httpOnly: true,
			// secure: true,
			sameSite: 'Strict'
		});
		res.json({ message: "Logout successful!" });
	}
);

export default router;
