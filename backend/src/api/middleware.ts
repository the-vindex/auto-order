import type { Request, Response, NextFunction } from "express";
import {
	BadRequestError,
	NotFoundError,
	UserAlreadyExistsError,
	UserForbiddenError,
	UserNotAuthenticatedError,
} from "./errors";
import { respondWithError } from "./json";
import { validateJWT } from "../auth/auth";

export function errorMiddleWare(
	err: Error,
	_: Request,
	res: Response,
	__: NextFunction,
) {
	let statusCode = 500;
	let message = "Something went wrong on our end";

	if (err instanceof BadRequestError) {
		statusCode = 400;
		message = err.message;
	} else if (err instanceof UserNotAuthenticatedError) {
		statusCode = 401;
		message = err.message;
	} else if (err instanceof UserForbiddenError) {
		statusCode = 403;
		message = err.message;
	} else if (err instanceof NotFoundError) {
		statusCode = 404;
		message = err.message;
	} else if (err instanceof UserAlreadyExistsError) {
		statusCode = 409;
		message = err.message;
	}

	if (statusCode >= 500) {
		console.log(err.message);
	}

	respondWithError(res, statusCode, message);
}

export function authMiddleWare(req: Request, res: Response, next: NextFunction) {
	try {
		const token = req.cookies.token;
		const jwtSecret = process.env.JWT_SECRET;
		if (!jwtSecret) {
			throw new Error("JWT_SECRET is not defined in environment variables.");
		}
		const userId = validateJWT(token, jwtSecret);
		req.headers['user-id'] = userId;
		next();
	} catch (error) {
		console.error("Error in jwt middleware", error)
		throw error;
	}
}

