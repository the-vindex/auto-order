import express from "express";
// TODO: This file is getting large and contains a lot of business logic.
// Consider introducing a "service layer" that would be responsible for the business logic,
// and keeping the API handlers (the functions in this file) responsible only for handling
// the HTTP request and response. This will make the code more modular, easier to test, and more reusable.

import { ProductReminderDto } from "./dto/product_reminder.dto";
import {
	createProductReminder,
	deleteProductReminderDB,
	getAllProductRemindersByUserId,
	Products,
	updateProductReminderDB
} from "../db/queries/product_reminders";
import { scrapeAmazonPrice } from "../jobs/scrapeprices";

export async function getAllProductRemindersForUserApi(req: express.Request, res: express.Response) {
	const userId = req.userId || (req.headers['user-id'] as string);
	if (!userId) {
		return res.status(401).send("Unauthorized: No user ID found in request");
	}

	console.debug(`Fetching all product reminders for user ${userId}`);

	const productReminders = await getAllProductRemindersByUserId(userId);
	if (!productReminders) {
		return res.status(500).send("Internal Server Error: Could not fetch product reminders");
	}

	const productRemindersDto: ProductReminderDto.ProductReminder[] = productReminders.map(pr => ({
		productId: pr.productId,
		name: pr.name,
		urls: pr.urls,
		status: pr.status,
		reminderDetails: pr.reminderDetails as ProductReminderDto.ReminderDetails
	}));

	console.debug(`Fetched ${productRemindersDto.length} product reminders for user ${userId}`);
	res.status(200).json(productRemindersDto);
}




export async function createProductReminderApi(req: express.Request, res: express.Response) {
	const userId = req.userId || (req.headers['user-id'] as string);
	if (!userId) {
		return res.status(401).send("Unauthorized: No user ID found in request");
	}

	console.debug(`Creating product reminder for user ${userId}, request body: ${JSON.stringify(req.body)}`);

	const productTrackingRequest: ProductReminderDto.ProductReminder = req.body;

	//map DTO to domain objects Products.ProductReminder
	const productReminder: Products.ProductReminder = {
		userId: userId,
		name: productTrackingRequest.name,
		urls: productTrackingRequest.urls,
		status: "active",
		reminderDetails: productTrackingRequest.reminderDetails as Products.ProductReminderDetails
	}

	if (productReminder.reminderDetails.type === 'priceDrop') {

		const url = productReminder.urls[0];
		const price = await scrapeAmazonPrice(url);
		if (!price) {
			throw new Error(`Error getting price from ${url}`)
		}
		const clean = price.replace(/[^0-9.]/g, '');
		const priceAsNumber = parseFloat(clean);
		productReminder.reminderDetails.initialPrice = {
			currency: 'USD',
			amount: priceAsNumber
		};
	}


	const newProductReminder = await createProductReminder(productReminder);
	if (!newProductReminder) {
		return res.status(500).send("Internal Server Error: Could not create product reminder");
	}

	// Map domain object back to DTO for response
	let newProductReminderDto = mapper_productReminder_to_DTO(newProductReminder);

	console.debug(`Created product reminder: ${JSON.stringify(newProductReminderDto)}`);
	res.status(201).json(newProductReminderDto);
}

export async function updateProductReminderApi(req: express.Request, res: express.Response) {
	const userId = req.userId || (req.headers['user-id'] as string);
	if (!userId) {
		return res.status(401).send("Unauthorized: No user ID found in request");
	}

	console.debug(`Updating product reminder for user ${userId}, request body: ${JSON.stringify(req.body)}`);

	const productReminderUpdate: ProductReminderDto.ProductReminder = req.body;

	const productId = req.params.productId;
	if (!productId) {
		return res.status(400).send("Bad Request: No product ID found in request URL");
	}

	// Validate that the product reminder exists and belongs to the user
	const existingReminders = await getAllProductRemindersByUserId(userId);
	const existingReminder = existingReminders.find(pr => pr.productId === productId);

	if (!existingReminder) {
		return res.status(404).send(`Not Found: Product reminder does not exist or does not belong to the user`);
	}

	// if call stries to change status, we raise an error
	if (productReminderUpdate.status && productReminderUpdate.status !== existingReminder.status) {
		return res.status(400).send("Bad Request: Cannot change status of product reminder from UI");
	}

	const productReminderBusinessObject: Products.ProductReminder = {
		userId: userId,
		name: productReminderUpdate.name,
		urls: productReminderUpdate.urls,
		status: existingReminder.status, // Keep existing status, can't change it from UI
		reminderDetails: productReminderUpdate.reminderDetails as Products.ProductReminderDetails
	}

	const updateResult = await updateProductReminderDB(userId, productId, productReminderBusinessObject);

	console.debug(`Updated product reminder: ${JSON.stringify(productReminderUpdate)}`);
	res.status(200).json(updateResult);
}

export async function deleteProductReminderApi(req: express.Request, res: express.Response) {
	const userId = req.userId || (req.headers['user-id'] as string);
	if (!userId) {
		return res.status(401).send("Unauthorized: No user ID found in request");
	}

	const productId = req.params.productId;
	if (!productId) {
		return res.status(400).send("Bad Request: No product ID found in request URL");
	}

	console.debug(`Deleting product reminder for user ${userId}, product ID: ${productId}`);

	// Delete the product reminder
	await deleteProductReminderDB(userId, productId);

	console.debug(`Deleted product reminder for user ${userId}, product ID: ${productId}`);
	res.status(204).send();
}

//////////////////////////////////// Utils functions ////////////////////////////////////
function mapper_productReminder_to_DTO(newProductReminder: Products.ProductReminder) {
	let newProductReminderDto: ProductReminderDto.ProductReminder = {
		productId: newProductReminder.productId,
		name: newProductReminder.name,
		urls: newProductReminder.urls,
		status: newProductReminder.status,
		reminderDetails: newProductReminder.reminderDetails as ProductReminderDto.ReminderDetails
	}
	return newProductReminderDto;
}
