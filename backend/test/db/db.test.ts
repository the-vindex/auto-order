import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';
import { users } from '../../src/db/schema';
import { eq } from 'drizzle-orm';
import { createUser, deleteUserById, getAllUsers, getUserById } from "../../src/db/queries/user_queries";
import {generateTestUserObject} from "../utils/test_data_factories";

describe('Users Database Tests', () => {
	const pool = new Pool({
		host: 'localhost',
		port: 5432,
		user: 'postgres',
		password: 'postgres',
		database: 'auto_order'
	});

	const db = drizzle(pool);

	beforeAll(async () => {
		await migrate(db, { migrationsFolder: './drizzle' });
		db.delete(users);
	});

	afterAll(async () => {
		await pool.end();
	});

	it('should create a new user', async () => {
		const newUser = generateTestUserObject();

		const result = await createUser(newUser.name, newUser.email, newUser.password);
		expect(result.name).toBe(newUser.name);
		expect(result.userId).toBeDefined();

		const userId = result.userId;
		const createdUser = await getUserById(userId);

		const user = await getUserById(createdUser.userId);
		expect(user.name).toBe(newUser.name);

		const delUser = await deleteUserById(user.userId);
		expect(delUser.name).toBe(newUser.name);

		await expect(getUserById(createdUser.userId)).rejects.toThrow(`User with ID ${createdUser.userId} not found`);
	});
});
