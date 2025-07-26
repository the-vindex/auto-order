import {pgTable, uuid, text, timestamp, check, numeric, bigint, json, pgEnum} from 'drizzle-orm/pg-core';
import {sql} from "drizzle-orm";

export const users = pgTable('users', {
    userId: uuid('user_id').primaryKey().defaultRandom(),
    name: text('full_name').notNull(),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull().$onUpdate(() => new Date()), // Automatically update on modification
});

//Product tracking table
export const products = pgTable('products', {
    productId: uuid('product_id').primaryKey().defaultRandom(),
    userId: uuid('user_id').notNull().references(() => users.userId, {onDelete: 'cascade'}),
    name: text('name').notNull(),
    urls: text('urls').array(), // Array of URLs to track the product
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull().$onUpdate(() => new Date()), // Automatically update on modification
    //status constraints: ['active', 'invalidated', 'triggered'],

});

export const ProductReminderStatus = pgEnum('status', ['active', 'invalidated', 'triggered']);

//Product Reminder Setting table
export const productReminders = pgTable('product_reminders', {
    reminderId: uuid('reminder_id').primaryKey().defaultRandom(),
    productId: uuid('product_id').notNull().references(() => products.productId, {onDelete: 'cascade'}),

    status: ProductReminderStatus('status').notNull().default('active'), // Enum for status: 'active', 'invalidated', 'triggered'
    triggeredAt: timestamp('triggered_at'), // Nullable, will be set when the reminder is triggered

    reminderType: text('reminder_type').notNull(), // e.g., 'targetDate', 'priceDrop', etc.
    reminderDetails: json('reminder_details'), // JSON or text field to store details specific to the reminder type

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull().$onUpdate(() => new Date()), // Automatically update on modification

}, (table) => [
    check("reminderType", sql`${table.reminderType} IN ('targetDate', 'priceDrop')`),
    check("status", sql`${table.status} IN ('active', 'invalidated', 'triggered')`),
]);
