import { Resend } from 'resend';

export async function sendEmail(email: string, text: string) {
	const resend = new Resend(process.env.RESEND_API_KEY);

	await resend.emails.send({
		from: 'Your Name <onboarding@resend.dev>',
		to: 'willbartholomay@gmail.com',
		subject: 'Test Email',
		html: '<p>Hello world!</p>',
	});
}
