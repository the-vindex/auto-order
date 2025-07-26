import {db} from "../index";
import {productReminders, products} from "../schema";
import ProductReminder = Products.ProductReminder;
import {eq} from "drizzle-orm";

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

export async function getAllProductRemindersByUserId(userId: string): Promise<Products.ProductReminder[]> {
    const result = await db.select({
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
        .where(eq(products.userId, userId));

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