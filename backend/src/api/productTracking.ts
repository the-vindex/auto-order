import express from "express";
import { ProductReminderDto } from "./dto/product_reminder.dto";
import {createProductTracking, Products} from "../db/queries/product_reminders";


export async function createProductReminderApi(req: express.Request, res: express.Response) {
    const userId = req.userId;
    if (!userId) {
        return res.status(401).send("Unauthorized: No user ID found in request");
    }

    const productTrackingRequest: ProductReminderDto.ProductReminder = req.body;

    //map DTO to domain objects Products.ProductReminder
    const productReminder: Products.ProductReminder = {
        userId: userId,
        name: productTrackingRequest.name,
        urls: productTrackingRequest.urls,
        status: "active",
        reminderDetails: productTrackingRequest.reminderDetails as Products.ProductReminderDetails
    }

    let newProductReminder = await createProductTracking(productReminder);

    let newProductReminderDto: ProductReminderDto.ProductReminder = {
        productId: newProductReminder.productId,
        name: newProductReminder.name,
        urls: newProductReminder.urls,
        status: newProductReminder.status,
        reminderDetails: newProductReminder.reminderDetails as ProductReminderDto.ReminderDetails
    }

    res.status(201).json(newProductReminderDto);
}