import cron from 'node-cron';
import { getDueTargetDateReminders, markReminderAsTriggered, updateProductReminderDB } from '../db/queries/product_reminders';
import { getUserById } from '../db/queries/user_queries';
import { sendReminderEmail } from '../notifier/notifier';

console.log('task being scheduled...')
cron.schedule('*/15 * * * * *', () => {
	console.log('Starting notification batch.');
	checkProductsForNotification();
});

export async function checkProductsForNotification() {
	try {
		const dueReminders = await getDueTargetDateReminders()
		console.log(`Due reminders: ${dueReminders}`)
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
}
