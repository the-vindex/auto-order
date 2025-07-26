import express from "express";
import { ProductReminderDto } from "./dto/product_reminder.dto";
import {createProductReminder, getAllProductRemindersByUserId, Products} from "../db/queries/product_reminders";

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

    let newProductReminder = await createProductReminder(productReminder);
    if (!newProductReminder) {
        return res.status(500).send("Internal Server Error: Could not create product reminder");
    }

    let newProductReminderDto: ProductReminderDto.ProductReminder = {
        productId: newProductReminder.productId,
        name: newProductReminder.name,
        urls: newProductReminder.urls,
        status: newProductReminder.status,
        reminderDetails: newProductReminder.reminderDetails as ProductReminderDto.ReminderDetails
    }

    console.debug(`Created product reminder: ${JSON.stringify(newProductReminderDto)}`);
    res.status(201).json(newProductReminderDto);
}