import {describe, it, expect, beforeAll, afterAll} from 'vitest';
import {drizzle} from 'drizzle-orm/node-postgres';
import {migrate} from 'drizzle-orm/node-postgres/migrator';
import {Pool} from 'pg';
import {users} from '../../src/db/schema';
import {eq} from 'drizzle-orm';
import {createUser, getAllUsers, getUserById} from "../../src/db/queries/user_queries";

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
        await migrate(db, {migrationsFolder: './drizzle'});
        db.delete(users);
    });

    afterAll(async () => {
        await pool.end();
    });

    it('should create a new user', async () => {
        const newUser = {
            name: 'Test User'
        };

        const result = await createUser(newUser.name);
        expect(result.name).toBe(newUser.name);
        expect(result.userId).toBeDefined();
    });

    it('should retrieve a user', async () => {
        const testFullName = 'Test User for Retrieval';
        const newUser = await createUser(testFullName);

        const user = await getUserById(newUser.userId);
        expect(user.name).toBe(testFullName);
    }, 1000000); // Increased timeout for this test

});