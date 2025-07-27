import { Resend } from 'resend';

export async function sendReminderEmail(email: string, urls: string[]) {
	const resend = new Resend(process.env.RESEND_API_KEY);

	const linksHtml = urls.map(url => `<li><a href="${url}" target="_blank">${url}</a></li>`).join("");

	console.log(`Sending email to ${email}`)

	const html = `
		<h2>Your Reminder Has Been Triggered</h2>
		<p>Here are the product links you asked to be reminded about:</p>
		<ul>
			${linksHtml}
		</ul>
	`;

	await resend.emails.send({
		from: 'Auto Order <onboarding@resend.dev>',
		to: email,
		subject: 'Your Product Reminder',
		html,
	});
}
