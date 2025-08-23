class ErrorHandler extends Error {
	constructor(message, statusCode) {
		super(message);
		this.statusCode = statusCode;
	}
}

export const errorMiddleware = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.message = err.message || "Internal Server error";

	if (err.name === "CastError") {
		const message = `Invalid ${err.path}`;
		err = new ErrorHandler(message, 400);
	}
	if (err.name === "JsonWebTokenError") {
		const message = `JSON Web Token Invalid `;
		err = new ErrorHandler(message, 400);
	}
	if (err.name === "TokenExpiredError") {
		const message = `JSON Web Token is expired`;
		err = new ErrorHandler(message, 400);
	}

	if (err.code === 11000) {
		const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
		err = new ErrorHandler(message, 400);
	}

	return res.status(err.statusCode).json({
		success: false,
		message: err.message,
	});
};

export default ErrorHandler;
