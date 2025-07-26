//AI generated from product_reminder.schema.json
export namespace ProductReminderDto {
    export interface Money {
        amount: number;
        currency: string;
    }

    export interface PriceDropReminder {
        type: 'priceDrop';
        initialPrice: Money;
        targetPrice: Money;
    }

    export interface TargetDateReminder {
        type: 'targetDate';
        targetDate: string;
    }

    export type ReminderDetails = PriceDropReminder | TargetDateReminder;

    export interface ProductReminder {
        productId?: string;
        name: string;
        reminderDetails: ReminderDetails;
        urls: string[];
        status: 'active' | 'invalidated' | 'triggered';
    }
}