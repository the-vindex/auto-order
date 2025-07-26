import express from "express";
import { createUser, getAllUsers, getUserByEmail } from "../db/queries/user_queries";
import { verifyPassword } from "../auth/auth";

export async function createUserApi(req: express.Request, res: express.Response) {
	try {
		console.log(req.body)
		if (!req.body) {
			return res.status(400).send('Bad Request: Missing request body');
		}

		const { name, email, password } = req.body;

		//prob shouldnt be logging emails/passwords
		console.log(`creating user with name ${name} email ${email} password ${password}`)
		const newUser = await createUser(name, email, password);
		res.status(201).json(newUser);
	} catch (error) {
		console.error('Error creating user:', error);
		res.status(500).send('Internal Server Error');
	}
}

export async function getAllUsersApi(req: express.Request, res: express.Response) {
	try {
		const allUsers = await getAllUsers();
		res.status(200).json(allUsers);
	} catch (error) {
		console.error('Error fetching users:', error);
		res.status(500).send('Internal Server Error');
	}
}

export async function loginUserApi(req: express.Request, res: express.Response) {
	try {
		const { email, password } = req.body;

		console.log(`Logging in user ${email}`)

		const user = await getUserByEmail(email);

		console.log('Verifying password...')
		const doPasswordsMatch = await verifyPassword(password, user.password);
		console.log(`Password verification result: ${doPasswordsMatch}`)

		if (!doPasswordsMatch) {
			res.status(401).send('Invalid username/password.');
			return;
		}

		res.status(200).send()

	} catch (error) {
		console.error('Error logging in user:', error);
		res.status(500).send('Internal Server Error');
	}


}
