import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { JwtPayload } from 'jsonwebtoken';
import { UserNotAuthenticatedError } from '../api/errors';
import express from "express";
import fs from 'fs';

// Read JWT secret from Docker secret file or environment variable
let _jwtSecret: string | undefined;

export function initAuth() {
	if (process.env.JWT_SECRET) {
		_jwtSecret = process.env.JWT_SECRET;
	} else {
		try {
			// Docker secrets are mounted at /run/secrets/<secret_name>
			_jwtSecret = fs.readFileSync('/run/secrets/jwt_secret', 'utf8').trim();
		} catch (error) {
			console.error("JWT_SECRET is not set in environment variables or as a Docker secret.");
			process.exit(1);
		}
	}
}

export function getJwtSecret(): string {
	if (!_jwtSecret) {
		throw new Error("JWT secret not initialized. Call initAuth() first.");
	}
	return _jwtSecret;
}

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
	const token = makeJWT(userId, 3600 * 24, getJwtSecret());
	const environment = process.env.ENVIRONMENT
	const isProd = environment && environment === 'production';

	if (isProd) {
		res.cookie("token", token, {
			httpOnly: true,
			secure: true,
			sameSite: 'none',
			maxAge: 1000 * 60 * 60 * 24,
			path: '/',
		});
	} else {
		res.cookie("token", token, {
			httpOnly: true,
			secure: false,
			sameSite: 'strict',
			maxAge: 1000 * 60 * 60 * 24,
			path: '/',
		});
	}
}

export function getUserIdFrom(req: express.Request) {
	const token = req.cookies.token;
	const userId = validateJWT(token, getJwtSecret())
	return userId;
}

declare global {
	namespace Express {
		interface Request {
			userId?: string;
		}
	}
}
