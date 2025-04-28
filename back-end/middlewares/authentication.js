import jwt from "jsonwebtoken";
import dbPool from "../db.js";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_ISSUER = process.env.JWT_ISSUER;

const TOKEN_VIA_COOKIE = process.env.TOKEN_VIA_COOKIE;

/**
 * A middleware function to get and verify token and also retrieve user data from the database
 * @param req Request
 * @param res Response
 * @param next Callback to the next handler
 */
export default function authenticateToken(req, res, next) {
	let token = "";

	if (TOKEN_VIA_COOKIE) { // Get token from the cookie
		const authCookie = req.cookies.token;

		if (!authCookie) {
			return res.status(401).json({ error: "No auth token is provided." });
		}

		token = authCookie;
	} else { // Get token from the header
		const authHeader = req.headers.authorization;

		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			return res.status(401).json({ error: "No auth token is provided." });
		}

		// Bearer ey....
		//        ^
		token = authHeader.split(" ")[1];
	}

	jwt.verify(token, JWT_SECRET, { issuer: JWT_ISSUER }, async (error, user) => {
		if (error) {
			return res.status(403).json({ error: "Token is invalid." });
		}

		const [rows] = await dbPool.query(
			"SELECT * " +
			"FROM users " +
			"WHERE user_id = ? AND username = ? " +
			"LIMIT 1;",
			[user.user_id, user.username]
		);
		if (rows.length === 0) {
			return res.status(403).json({ error: "Token is invalid." });
		}

		req.token = token;
		req.user = rows[0];
		next();
	});
}
