"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const node_postgres_1 = require("drizzle-orm/node-postgres");
const migrator_1 = require("drizzle-orm/node-postgres/migrator");
const pg_1 = require("pg");
require("dotenv/config");
const user_queries_1 = require("../../src/db/queries/user_queries");
const product_reminders_1 = require("../../src/db/queries/product_reminders");
const schema_1 = require("../../src/db/schema");
const test_data_factories_1 = require("../utils/test_data_factories");
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
});
const db = (0, node_postgres_1.drizzle)(pool);
(0, vitest_1.describe)('Product Database Tests', () => {
    (0, vitest_1.beforeAll)(async () => {
        await (0, migrator_1.migrate)(db, { migrationsFolder: './drizzle' });
        db.delete(schema_1.users);
    });
    (0, vitest_1.afterAll)(async () => {
        await pool.end();
    });
    (0, vitest_1.it)('should create a new product reminder', async () => {
        const user = (0, test_data_factories_1.generateTestUserObject)();
        const newUser = await (0, user_queries_1.createUser)(user.name, user.email, user.password);
        const productReminder = {
            userId: newUser.userId,
            name: 'Test Product',
            urls: ['https://example.com/product1'],
            status: 'active',
            reminderDetails: {
                type: 'targetDate',
                targetDate: new Date('2023-01-01'),
            },
        };
        // Assuming you have a function to create a product reminder
        const result = await (0, product_reminders_1.createProductTracking)(productReminder);
        (0, vitest_1.expect)(result).toBeDefined();
        (0, vitest_1.expect)(result.userId).toBe(productReminder.userId);
        (0, vitest_1.expect)(result.name).toBe(productReminder.name);
        (0, vitest_1.expect)(result.urls).toEqual(productReminder.urls);
        (0, vitest_1.expect)(result.status).toBe(productReminder.status);
        (0, vitest_1.expect)(result.reminderDetails).toEqual(productReminder.reminderDetails);
        // Check for additional database-generated fields
        (0, vitest_1.expect)(result).toBeDefined();
        (0, vitest_1.expect)(result.productId).toBeDefined();
        (0, vitest_1.expect)(result.reminderId).toBeDefined();
    }, 1000000);
});
