import { body, validationResult } from "express-validator";

/**
 * A middleware function to add not-empty string validation
 * @param paramNames List of parameters' name
 * @returns An array of validator
 */
export function addNotEmptyStringValidation(...paramNames) {
	return paramNames.map((x) => body(x)
		.exists({ values: "falsy" }).withMessage("Parameter " + x + " is required.")
		.isString().withMessage("Parameter " + x + " must be string."));
}

/**
 * A middleware function to convert an array of validation result into a list of key-value pair
 * @param req Request
 * @param res Response
 * @param next Callback to the next handler
 */
export function handleValidationResult(req, res, next) {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const formattedErrors = {};
		errors.array().forEach(error => {
			formattedErrors[error.param] = error.msg;
		});
		return res.status(400).json({ errors: formattedErrors });
	}
	next();
}
