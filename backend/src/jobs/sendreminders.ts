import cron from 'node-cron';
import { getActivePriceDropReminders, getDueTargetDateReminders, markReminderAsTriggered, updateProductReminderDB } from '../db/queries/product_reminders';
import { getUserById } from '../db/queries/user_queries';
import { sendReminderEmail } from '../notifier/notifier';
import { scrapeAmazonPrice } from './scrapeprices';

console.log('task being scheduled...')
cron.schedule('*/15 * * * * *', () => {
	console.log('Starting notification batch.');
	checkProductsForPriceNotificiation();
});

/*
export async function checkProductsForDueDateNotification() {
	try {
		const dueReminders = await getDueTargetDateReminders()
		for (const reminder of dueReminders) {
			const user = await getUserById(reminder.userId)
			await sendReminderEmail(user.email, reminder.urls)

			if (!reminder.reminderId) {
				throw new Error('Error updating product reminder, does not contain field reminder id.')
			}
			await markReminderAsTriggered(reminder.reminderId)
		}
	} catch (error) {
		console.error(`Error checking products for notification:`, error)
		throw error
	}
} */

export async function checkProductsForPriceNotificiation() {
	try {
		const reminders = await getActivePriceDropReminders()
		for (const reminder of reminders) {
			await singleReminderPriceCheck(reminder)
		}
	} catch (error) {
		console.error('Error checking all products for price notifications', error)
	}
}

async function singleReminderPriceCheck(reminder: any) {
	try {
		if (reminder.reminderDetails.type === 'priceDrop') {

			const url = reminder.urls[0];
			const priceStr = await scrapeAmazonPrice(url);

			if (!priceStr) {
				throw new Error(`Error getting price from ${url}`)
			}
			const clean = priceStr.replace(/[^0-9.]/g, '');
			const price = parseFloat(clean);
			const targetPrice = reminder.reminderDetails.targetPrice.amount;
			console.log(`Reminder Details: ${JSON.stringify(reminder.reminderDetails)}`)
			console.log(`Target Price: ${targetPrice}`)
			if (price <= targetPrice) {
				const user = await getUserById(reminder.userId);
				await sendReminderEmail(user.email, reminder.urls[0], targetPrice, price)
				await markReminderAsTriggered(reminder.reminderId)
			}
		}
	}
	catch (error) {
		console.error('Error fetching price', error)
	}
}
