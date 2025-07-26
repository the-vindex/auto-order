import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { ProductReminderDto } from "../../src/api/dto/product_reminder.dto";
import express from 'express';
// @ts-ignore
import { createAndLoginUser, createTestExpressInstance } from '../utils/auth_tools';


function generateProductReminderData() {
	const productReminderData = {
		name: "Test Product",
		urls: ["https://example.com/product1"],
		reminderDetails: {
			type: "targetDate",
			targetDate: "2023-01-01",
		}
	} as ProductReminderDto.ProductReminder;
	return productReminderData;
}

async function callApi_createProductReminder(app: express.Express, productReminderData: ProductReminderDto.ProductReminder, authCookie: string) {
	return await request(app)
		.post('/api/v1/product-reminders')
		.send(productReminderData)
		.set('Cookie', authCookie) // Use the auth cookie to authenticate the request
		.set('Accept', 'application/json')
		.expect(201);
}

describe('Product tracking API Integration Tests', () => {
	let app: express.Express;
	beforeAll(async () => {
		// You might want to clear the database or seed it before running tests
		// For now, we'll just ensure the app is ready.
		app = createTestExpressInstance();
	});

	afterAll(async () => {

	});

	it('should create a new product tracking record via POST /api/v1/product-tracking', async () => {
		const { newUser, authCookie } = await createAndLoginUser(app);
		const productReminderData = generateProductReminderData();

		let result = await callApi_createProductReminder(app, productReminderData, authCookie);

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


	it('Should read all product reminders for a user', async () => {
		const { newUser, authCookie } = await createAndLoginUser(app);
		const productReminder = generateProductReminderData();
		const result = await callApi_createProductReminder(app, productReminder, authCookie);
		const newProductReminder = result.body;

		const getResult = await request(app)
			.get('/api/v1/product-reminders')
			.set('Cookie', authCookie) // Use the auth cookie to authenticate the request
			.set('Accept', 'application/json')
			.expect(200)

		expect(getResult).toBeDefined();
		expect(getResult.body).toBeDefined();
		expect(getResult.body).toBeInstanceOf(Array);
		expect(getResult.body.length).toBeGreaterThan(0);
		const foundProductReminder = getResult.body.find((reminder: any) => reminder.productId === newProductReminder.productId);
		expect(foundProductReminder).toBeDefined();
		expect(foundProductReminder.name).toBe(newProductReminder.name);
		expect(foundProductReminder.urls).toEqual(newProductReminder.urls);

	});

	it('should be able to PUT a product reminder', async () => {
		const { newUser, authCookie } = await createAndLoginUser(app);
		const productReminder = generateProductReminderData();
		const result = await callApi_createProductReminder(app, productReminder, authCookie);
		const newProductReminder = result.body;

		const updatedReminderData = {
			name: "Updated Test Product",
			urls: ["https://example.com/updated-product1"],
			reminderDetails: {
				type: "targetDate",
				targetDate: "2024-01-01",
			}
		} as ProductReminderDto.ProductReminder;

		const putResult = await request(app)
			.put(`/api/v1/product-reminders/${newProductReminder.productId}`)
			.send(updatedReminderData)
			.set('Cookie', authCookie) // Use the auth cookie to authenticate the request
			.expect(200);

		expect(putResult).toBeDefined
		expect(putResult.body).toBeDefined();
		expect(putResult.body).toHaveProperty('productId', newProductReminder.productId);
		expect(putResult.body).toHaveProperty('name', updatedReminderData.name);
		expect(putResult.body).toHaveProperty('urls', updatedReminderData.urls);
		expect(putResult.body).toHaveProperty('status', 'active');
		expect(putResult.body).toHaveProperty('reminderDetails');
		const reminderDetails = updatedReminderData.reminderDetails;
		if (reminderDetails.type === 'targetDate') {
			expect(putResult.body.reminderDetails).toHaveProperty('type', reminderDetails.type);
			expect(putResult.body.reminderDetails).toHaveProperty('targetDate', reminderDetails.targetDate);
		} else {
			throw new Error(`This shouldn't happen, Unsupported reminder type: ${reminderDetails.type}`);
		}

	});
});
