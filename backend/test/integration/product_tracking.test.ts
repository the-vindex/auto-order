import request from 'supertest';
import {afterAll, beforeAll, describe, expect, it} from 'vitest';
import {ProductReminderDto} from "../../src/api/dto/product_reminder.dto";
import express from 'express';
import {createAndLoginUser, createExpressAppWithFakeAuth} from '../utils/fakeAuthExpress';


describe('Product tracking API Integration Tests', () => {
    let app: express.Express;
    const createdUserIds: string[] = [];

    beforeAll(async () => {
        app = createExpressAppWithFakeAuth();
    });

    afterAll(async () => {
        if (createdUserIds.length > 0) {
            const { inArray } = await import('drizzle-orm');
            const { users } = await import('../../src/db/schema');
            const { db } = await import('../../src/db');
            await db.delete(users).where(inArray(users.userId, createdUserIds));
        }
    });

    it('should create a new product tracking record via POST /api/v1/product-tracking', async () => {
        let { newUser, authCookie } = await createAndLoginUser(app);
        createdUserIds.push(newUser.userId); // Track the created user

        console.log(newUser.userId);

        const productReminderData = {
            name: "Test Product",
            urls: ["https://example.com/product1"],
            reminderDetails: {
                type: "targetDate",
                targetDate: "2023-01-01",
            }
        } as ProductReminderDto.ProductReminder;

        let result = await request(app)
            .post('/api/v1/product-reminders')
            .send(productReminderData)
            .set('Accept', 'application/json')
            .set('Cookie', authCookie) // Use the auth cookie from login
            .expect(201)

        expect(result).toBeDefined();
        let resultBody = result.body;
        expect(result.statusCode, JSON.stringify(resultBody)).toEqual(201);

        expect(resultBody).toBeDefined();
        expect(resultBody).toHaveProperty('productId');
        expect(resultBody).toHaveProperty('name', productReminderData.name);
        expect(resultBody).toHaveProperty('urls', productReminderData.urls);
        expect(resultBody).toHaveProperty('status', 'active');
        expect(resultBody).toHaveProperty('reminderDetails');

        const reminderDetails = productReminderData.reminderDetails;
        if (reminderDetails.type === 'targetDate') {
            expect(resultBody.reminderDetails).toHaveProperty('type', reminderDetails.type);
            expect(resultBody.reminderDetails).toHaveProperty('targetDate', reminderDetails.targetDate);
        } else {
            throw new Error(`This shouldn't happen, Unsupported reminder type: ${reminderDetails.type}`);
        }

    });
});