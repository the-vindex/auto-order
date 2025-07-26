import request from 'supertest';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import {configureApp} from '../../src/server';
import {createUser} from "../../src/db/queries/user_queries";
import {generateTestUserObject} from "../utils/test_data_factories";
import {ProductReminderDto} from "../../src/api/dto/product_reminder.dto";
import {fakeAuth} from "../../src/auth/fakeAuth";
import express from 'express';
import {createAndLoginUser, createExpressAppWithFakeAuth} from '../utils/fakeAuthExpress';
import {Products} from "../../src/db/queries/product_reminders";



describe('Product tracking API Integration Tests', () => {
    let app: express.Express;
    beforeAll(async () => {
        // You might want to clear the database or seed it before running tests
        // For now, we'll just ensure the app is ready.
        app = createExpressAppWithFakeAuth();
    });

    afterAll(async () => {

    });

    it('should create a new product tracking record via POST /api/v1/product-tracking', async () => {
        const {newUser, authCookie} = await createAndLoginUser(app);

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
            .set('Cookie', authCookie) // Use the auth cookie to authenticate the request
            .set('Accept', 'application/json')
//            .expect('Content-Type', /json/)
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