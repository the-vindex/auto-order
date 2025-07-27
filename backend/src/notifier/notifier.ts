import { Resend } from 'resend';

export async function sendReminderEmail(
	email: string,
	url: string,
	targetPrice: number,
	currentPrice: number
) {
	const resend_key = process.env.RESEND_API_KEY || "re_DXytwZ9g_6M9Un9d13RXprJx7LyRRuQbz";
	const resend = new Resend(resend_key);

	console.log(`Sending email to ${email}`);
	console.log(`Target Price: ${targetPrice}, Current Price: ${currentPrice}`)

	const html = `
	<h2>Price Alert Triggered 🎉</h2>
	<p>The price of a product you were watching has dropped below your target!</p>
	<p><strong>Target Price:</strong> $${targetPrice.toFixed(2)}<br>
	<strong>Current Price:</strong> $${currentPrice.toFixed(2)}</p>
	<p>Here is the product link you asked to be reminded about:</p>
	<p><a href="${url}" target="_blank">${url}</a></p>
`;

	await resend.emails.send({
		from: 'Auto Order <onboarding@resend.dev>',
		to: email,
		subject: '🎯 Price Drop Alert – Your Product is on Sale!',
		html,
	});
}
