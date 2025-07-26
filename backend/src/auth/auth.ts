import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { JwtPayload } from 'jsonwebtoken';
import { UserNotAuthenticatedError } from '../api/errors';
import express from "express";

const TOKEN_ISSUER = 'auto_order';
const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
	return await bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
	return await bcrypt.compare(password, hashedPassword);
}


type payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

export function makeJWT(userID: string, expiresIn: number, secret: string) {
	const issuedAt = Math.floor(Date.now() / 1000);
	const expiresAt = issuedAt + expiresIn;
	const token = jwt.sign(
		{
			iss: TOKEN_ISSUER,
			sub: userID,
			iat: issuedAt,
			exp: expiresAt,
		} satisfies payload,
		secret,
		{ algorithm: "HS256" },
	);

	return token;
}

export function validateJWT(tokenString: string, secret: string) {
	let decoded: payload;
	try {
		decoded = jwt.verify(tokenString, secret) as JwtPayload;
	} catch (e) {
		throw new UserNotAuthenticatedError("Invalid token");
	}

	if (decoded.iss !== TOKEN_ISSUER) {
		throw new UserNotAuthenticatedError("Invalid issuer");
	}

	if (!decoded.sub) {
		throw new UserNotAuthenticatedError("No user ID in token");
	}

	return decoded.sub;
}

export function setAuthCookie(res: express.Response, userId: string) {
	const jwtSecret = process.env.JWT_SECRET;
	if (!jwtSecret) {
		throw new Error("JWT_SECRET is not defined in environment variables.");
	}
	const jwt = makeJWT(userId, 3600 * 24, jwtSecret);

	res.cookie("token", jwt, {
		httpOnly: true,
		secure: false,
		sameSite: "strict",
		maxAge: 1000 * 60 * 60 * 24,
	});
}

export function getUserIdFrom(req: express.Request) {
	const token = req.cookies.token;
	const jwtSecret = process.env.JWT_SECRET;
	if (!jwtSecret) {
		throw new Error("JWT_SECRET is not defined in environment variables.");
	}
	const userId = validateJWT(token, jwtSecret)
}

declare global {
	namespace Express {
		interface Request {
			userId?: string;
		}
	}
}
