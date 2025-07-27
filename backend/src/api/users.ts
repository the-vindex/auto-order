import express from "express";
import { createUser, getAllUsers, getUserByEmail } from "../db/queries/user_queries";
import { makeJWT, setAuthCookie, validateJWT, verifyPassword } from "../auth/auth";
import { respondWithError, respondWithJSON } from "./json";
import { NotFoundError, UserAlreadyExistsError, UserNotAuthenticatedError } from "./errors";
import { scrapeAmazonPrice } from "../jobs/scrapeprices";

export async function createUserApi(req: express.Request, res: express.Response) {
	try {
		if (!req.body) {
			return res.status(400).send('Bad Request: Missing request body');
		}

		const { name, email, password } = req.body;

		//prob shouldnt be logging emails/passwords
		const newUser = await createUser(name, email, password);

		setAuthCookie(res, newUser.userId);
		respondWithJSON(res, 201, { name: newUser.name, email: newUser.email });
	} catch (error: any) {
		if (error?.cause?.code === '23505') {
			throw new UserAlreadyExistsError('Email is already in use.');
		}
		console.error('Error creating user:', error);
		throw error;
	}
}

export async function getAllUsersApi(req: express.Request, res: express.Response) {
	try {
		const allUsers = await getAllUsers();
		respondWithJSON(res, 200, allUsers);
	} catch (error) {
		console.error('Error fetching users:', error);
		throw error;
	}
}

export async function loginUserApi(req: express.Request, res: express.Response) {
	console.log('logging in user.')
	try {
		const { email, password } = req.body;


		const user = await getUserByEmail(email);
		if (!user) {
			console.log(`User with email ${email} not found.`)
			throw new NotFoundError('User not found with given email.')
		}

		const doPasswordsMatch = await verifyPassword(password, user.password);

		if (!doPasswordsMatch) {
			throw new UserNotAuthenticatedError('Incorrect password.')
		}


		setAuthCookie(res, user.userId);
		respondWithJSON(res, 200, { name: user.name, email: user.email })

	} catch (error) {
		console.error('Error logging in user:', error);
		throw error;
	}


}

export async function logoutUserApi(req: express.Request, res: express.Response) {
	console.log('logging out user.')

	const environment = process.env.ENVIRONMENT
	const isProd = environment && environment === 'production';

	if (isProd) {
		res.cookie("token", '', {
			httpOnly: true,
			secure: true,
			sameSite: 'none',
			expires: new Date(0),
			path: '/',
		});
	} else {
		res.cookie("token", '', {
			httpOnly: true,
			secure: false,
			sameSite: 'strict',
			expires: new Date(0),
			path: '/',
		});
	}
	respondWithJSON(res, 200, {});
}

export async function validateLoginApi(req: express.Request, res: express.Response) {
	const userId = req.headers['user-id'];
	if (!userId) throw new UserNotAuthenticatedError('User is not logged in.');
	respondWithJSON(res, 200, {});
}
