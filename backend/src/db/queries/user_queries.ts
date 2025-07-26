import { hashPassword } from "../../auth/auth";
import { db } from "../index";
import { users } from "../schema";
import { eq, lt, gte, ne } from 'drizzle-orm';

export async function getAllUsers() {
	let allUsers = await db.select().from(users);
	return allUsers;
}

export async function getUserById(id: string) {
	const user = await db.select().from(users).where(eq(users.userId, id));
	if (!user || user.length === 0) {
		throw new Error(`User with ID ${id} not found`);
	}
	return user[0];
}

export async function getUserByEmail(email: string) {
	const user = await db.select().from(users).where(eq(users.email, email));
	if (!user || user.length === 0) {
		return null;
	}
	return user[0];
}

export async function createUser(name: string, email: string, password: string) {
	const hashedPassword = await hashPassword(password)
	const [newUser] = await db.insert(users).values({ name, email, password: hashedPassword }).returning();
	return newUser;
}

export async function deleteUserById(id: string) {
	const result = await db
		.delete(users)
		.where(eq(users.userId, id))
		.returning();

	if (result.length === 0) {
		throw new Error(`User with ID ${id} not found`);
	}

	return result[0];
}
