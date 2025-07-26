"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const node_postgres_1 = require("drizzle-orm/node-postgres");
const migrator_1 = require("drizzle-orm/node-postgres/migrator");
const pg_1 = require("pg");
const schema_1 = require("../../src/db/schema");
const user_queries_1 = require("../../src/db/queries/user_queries");
const test_data_factories_1 = require("../utils/test_data_factories");
(0, vitest_1.describe)('Users Database Tests', () => {
    const pool = new pg_1.Pool({
        host: 'localhost',
        port: 5432,
        user: 'postgres',
        password: 'postgres',
        database: 'auto_order'
    });
    const db = (0, node_postgres_1.drizzle)(pool);
    (0, vitest_1.beforeAll)(async () => {
        await (0, migrator_1.migrate)(db, { migrationsFolder: './drizzle' });
        db.delete(schema_1.users);
    });
    (0, vitest_1.afterAll)(async () => {
        await pool.end();
    });
    (0, vitest_1.it)('should create a new user', async () => {
        const newUser = (0, test_data_factories_1.generateTestUserObject)();
        const result = await (0, user_queries_1.createUser)(newUser.name, newUser.email, newUser.password);
        (0, vitest_1.expect)(result.name).toBe(newUser.name);
        (0, vitest_1.expect)(result.userId).toBeDefined();
        const userId = result.userId;
        const createdUser = await (0, user_queries_1.getUserById)(userId);
        const user = await (0, user_queries_1.getUserById)(createdUser.userId);
        (0, vitest_1.expect)(user.name).toBe(newUser.name);
        const delUser = await (0, user_queries_1.deleteUserById)(user.userId);
        (0, vitest_1.expect)(delUser.name).toBe(newUser.name);
        await (0, vitest_1.expect)((0, user_queries_1.getUserById)(createdUser.userId)).rejects.toThrow(`User with ID ${createdUser.userId} not found`);
    });
});
