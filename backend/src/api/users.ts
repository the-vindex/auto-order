import express from "express";
import { createUser, getAllUsers } from "../db/queries/user_queries";

export async function createUserApi(req: express.Request, res: express.Response) {
	try {
		if (!req.body) {
			return res.status(400).send('Bad Request: Missing request body');
		}

		if (!req.body.name) {
			return res.status(400).send('Bad Request: Missing name');
		}

		const { name, email, password } = req.body;

		const newUser = await createUser(name);
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
