import {afterAll, beforeAll, describe, expect, it} from 'vitest';
import {drizzle} from 'drizzle-orm/node-postgres';
import {migrate} from 'drizzle-orm/node-postgres/migrator';
import {Pool} from 'pg';

import 'dotenv/config';
import {createUser} from "../../src/db/queries/user_queries";
import {createProductReminder, Products} from "../../src/db/queries/product_reminders";
import {users} from "../../src/db/schema";
// @ts-ignore
import {generateTestUserObject} from "../utils/test_data_factories";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);


describe('Product Database Tests', () => {
    beforeAll(async () => {
        await migrate(db, {migrationsFolder: './drizzle'});
        db.delete(users);
    });

    afterAll(async () => {
        await pool.end();
    });

    it('should create a new product reminder', async () =>{
        const user = generateTestUserObject();

        const newUser = await createUser(user.name, user.email, user.password);

        const productReminder = {
            userId: newUser.userId,
            name: 'Test Product',
            urls: ['https://example.com/product1'],
            status: 'active',
            reminderDetails: {
                type: 'targetDate',
                targetDate: new Date('2023-01-01'),
            } as Products.TargetDateReminder,
        } as Products.ProductReminder;

        // Assuming you have a function to create a product reminder
        const result: Products.ProductReminder = await createProductReminder(productReminder);

        expect(result).toBeDefined();
        expect(result.userId).toBe(productReminder.userId);
        expect(result.name).toBe(productReminder.name);
        expect(result.urls).toEqual(productReminder.urls);
        expect(result.status).toBe(productReminder.status);
        expect(result.reminderDetails).toEqual(productReminder.reminderDetails);

        // Check for additional database-generated fields
        expect(result).toBeDefined();
        expect(result.productId).toBeDefined();
        expect(result.reminderId).toBeDefined();
    }, 1000000);


});