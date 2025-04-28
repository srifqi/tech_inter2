/**
 * A middleware function to check incoming request's roles based on allowed roles
 * @param allowedRoles List of roles
 * @returns A function that do checks authorization based on allowed roles
 */
export default function authorizeRoles(...allowedRoles) {
	return (req, res, next) => {
		if (!req.user || !allowedRoles.includes(req.user.roles)) {
			return res.status(403).json({ error: "Access is denied." });
		}
		if (req.user.roles === "employee" && req.params.id !== req.user.user_id){
			return res.status(403).json({ error: "Access is denied." });
		}
		next();
	};
}
