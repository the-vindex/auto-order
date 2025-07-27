import { db } from "../index";
import { productReminders, products } from "../schema";
import ProductReminder = Products.ProductReminder;
import { lte, and, eq, isNull, sql } from "drizzle-orm";

export namespace Products {
	export type ProductReminder = {
		productId?: string;
		reminderId?: string;
		userId: string;
		name: string;
		status: ReminderStatus;
		triggeredAt?: Date | null; // Nullable, will be set when the reminder is triggered
		reminderDetails: ProductReminderDetails; // Details specific to the reminder type
		urls: string[];
	}

	export type ProductReminderDetails = PriceDropReminder | TargetDateReminder;

	//'active' | 'invalidated' | 'triggered'
	export type ReminderStatus = 'active' | 'invalidated' | 'triggered';

	export type Money = {
		amount: number;
		currency: string;
	}

	export type PriceDropReminder = {
		type: 'priceDrop';
		initialPrice: Money,
		targetPrice: Money
	}

	export type TargetDateReminder = {
		type: 'targetDate';
		targetDate: Date
	}
}

type ProductResultSet = typeof products.$inferSelect;
type ProductReminderResultSet = typeof productReminders.$inferSelect;


export async function createProductReminder(productReminder: Products.ProductReminder) {
	return await db.transaction(async (tx) => {
		// Insert product
		const [product] = await tx.insert(products).values({
			userId: productReminder.userId,
			name: productReminder.name,
			urls: productReminder.urls,
		}).returning();

		if (!product || !product.productId) {
			throw new Error(`Product creation failed, input data ${JSON.stringify(productReminder)}`);
		}

		// Insert reminder
		const [newReminder] = await tx.insert(productReminders).values({
			productId: product.productId,
			status: productReminder.status,
			reminderType: productReminder.reminderDetails.type,
			reminderDetails: productReminder.reminderDetails,
		}).returning();

		return convertOrmToBusinessObject(productReminder, product, newReminder);
	}
	)
}

function convertOrmToBusinessObject(input: Products.ProductReminder, newProduct: ProductResultSet, newReminder: ProductReminderResultSet): ProductReminder {
	if (!newReminder || !newReminder.reminderId) {
		throw new Error(`Reminder creation failed, input data ${JSON.stringify(input)}`);
	}


	const result: Products.ProductReminder = {
		productId: newProduct.productId,
		reminderId: newReminder.reminderId,
		userId: input.userId,
		name: input.name,
		status: newReminder.status,
		triggeredAt: newReminder.triggeredAt,
		reminderDetails: input.reminderDetails,
		urls: input.urls
	};
	return result;
}

/**
 * Fetches all product reminders for a user, optionally filtered by product ID.
 * @param userId
 * @param productId
 * Optional product ID to filter reminders by a specific product.
 */
export async function getAllProductRemindersByUserId(userId: string, productId?: string): Promise<Products.ProductReminder[]> {
	let query = db.select({
		productId: products.productId,
		reminderId: productReminders.reminderId,
		userId: products.userId,
		name: products.name,
		status: productReminders.status,
		triggeredAt: productReminders.triggeredAt,
		reminderDetails: productReminders.reminderDetails,
		urls: products.urls
	})
		.from(productReminders)
		.innerJoin(products, eq(productReminders.productId, products.productId));


	const condition = (!productId) ? eq(products.userId, userId) : and(eq(products.userId, userId), eq(products.productId, productId))

	const finalQuery = query.where(condition);


	const result = await finalQuery

	return result.map(row => ({
		productId: row.productId,
		reminderId: row.reminderId,
		userId: row.userId,
		name: row.name,
		status: row.status,
		triggeredAt: row.triggeredAt,
		reminderDetails: row.reminderDetails as Products.ProductReminderDetails,
		urls: row.urls
	} as Products.ProductReminder));
}



export async function updateProductReminderDB(userId: string, productId: string, updates: Products.ProductReminder) {

	console.debug(`Updating product reminder in DB for user ${userId}, product ID ${productId}, updates: ${JSON.stringify(updates)}`);

	//also we should update product details
	if (!productId || !updates) {
		throw new Error("Product ID and updates are required");
	}

	const existingProduct = await db.select().from(products).where(eq(products.productId, productId));
	if (!existingProduct || existingProduct.length === 0) {
		throw new Error(`Product with ID ${productId} not found`);
	}

	const existingReminder = await db.select().from(productReminders).where(eq(productReminders.productId, productId));
	if (!existingReminder || existingReminder.length === 0) {
		throw new Error(`Product reminder for product ID ${productId} not found`);
	}

	console.debug(`Updating product reminder for user ${userId}, product ID ${productId} - data found, going for update.`);

	await db.transaction(async (tx) => {

		const updatedProduct = await tx.update(products).set({
			name: updates.name,
			urls: updates.urls
		}).where(eq(products.productId, productId)).returning();

		const updatedReminder = await tx.update(productReminders)
			.set({
				status: updates.status,
				reminderDetails: updates.reminderDetails,
				//                    triggeredAt: updates.triggeredAt // it should be set only when the reminder is triggered
			})
			.where(eq(productReminders.productId, productId))
			.returning();

		if (!updatedProduct || updatedProduct.length !== 1 || !updatedReminder || updatedReminder.length !== 1) {
			console.error(`Failed to update product reminder for product ID ${productId}`);
			console.error(`Updated product: ${JSON.stringify(updatedProduct)}`);
			console.error(`Updated reminder: ${JSON.stringify(updatedReminder)}`);
			throw new Error(`Failed to update product reminder for product ID ${productId}`);
		}

	}
	)

	const updateProductReminderResult = await getAllProductRemindersByUserId(userId, productId);
	if (!updateProductReminderResult || updateProductReminderResult.length === 0) {
		throw new Error(`Failed to fetch updated product reminder for product ID ${productId}`);
	}

	return updateProductReminderResult[0]; // Return the updated product reminder

}

export async function deleteProductReminderDB(userId: string, productId: string) {
	console.debug(`Deleting product reminder for user ${userId}, product ID ${productId}`);

	if (!productId) {
		throw new Error("Product ID is required");
	}

	// Check if the product reminder exists
	const existingReminder = await db.select().from(productReminders).where(eq(productReminders.productId, productId));
	if (!existingReminder || existingReminder.length === 0) {
		throw new Error(`Product reminder for product ID ${productId} not found`);
	}

	// Delete the product reminder
	const deletedRows = await db.delete(productReminders).where(eq(productReminders.productId, productId)).returning();
	if (deletedRows.length === 0) {
		throw new Error(`Failed to delete product reminder for product ID ${productId}`);
	}

	console.debug(`Product reminder for product ID ${productId} deleted successfully`);
}

export async function getDueTargetDateReminders(): Promise<Products.ProductReminder[]> {
	const today = new Date();
	today.setHours(0, 0, 0, 0); // normalize to start of the day

	const result = await db
		.select({
			productId: products.productId,
			reminderId: productReminders.reminderId,
			userId: products.userId,
			name: products.name,
			status: productReminders.status,
			triggeredAt: productReminders.triggeredAt,
			reminderDetails: productReminders.reminderDetails,
			urls: products.urls
		})
		.from(productReminders)
		.innerJoin(products, eq(productReminders.productId, products.productId))
		.where(and(
			eq(productReminders.status, 'active'),
			isNull(productReminders.triggeredAt),
			eq(productReminders.reminderType, 'targetDate'),
			lte(
				sql`(reminder_details->>'targetDate')::timestamp`,
				today.toISOString()
			)
		));

	return result.map(row => ({
		productId: row.productId,
		reminderId: row.reminderId,
		userId: row.userId,
		name: row.name,
		status: row.status,
		triggeredAt: row.triggeredAt,
		reminderDetails: row.reminderDetails as Products.ProductReminderDetails,
		urls: row.urls ?? [],
	}));
}


export async function markReminderAsTriggered(reminderId: string): Promise<void> {
	console.debug(`Marking reminder ${reminderId} as triggered`);

	await db.transaction(async (tx) => {
		const [reminder] = await tx
			.select()
			.from(productReminders)
			.where(eq(productReminders.reminderId, reminderId));

		if (!reminder) {
			throw new Error(`Reminder with ID ${reminderId} not found`);
		}

		const now = new Date();

		const updateResult = await tx.update(productReminders)
			.set({
				status: 'triggered',
				triggeredAt: now
			})
			.where(eq(productReminders.reminderId, reminderId))
			.returning();

		if (updateResult.length === 0) {
			throw new Error(`Failed to update reminder with ID ${reminderId}`);
		}

		console.debug(`Reminder ${reminderId} successfully marked as triggered.`);
	});
}
