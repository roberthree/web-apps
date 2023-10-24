import { isValidEmail } from '$lib/server/email.js';

// export const MESSAGES_API_URL = 'http://127.0.0.1:8787'
export const MESSAGES_API_URL = 'https://messages.roberthree.workers.dev'

export async function parse_password_request(request: Request): Promise<{email: string; password: string}> {
	// const form_data = await request.formData();
	// const email = form_data.get('email')?.toString().toLowerCase();
	// const password = form_data.get('password')?.toString() ?? undefined;
	const data = await request.json() as {email: string, password: string};
	const email = data.email.toLowerCase();
	const password = data.password;

	if (!email) throw Error('EMAIL_UNDEFINED');
	if (!password) throw Error('PASSWORD_UNDEFINED');
	if (!isValidEmail(email)) throw Error('EMAIL_INVALID');
	if (password.length < 4 || password.length > 64) throw Error('PASSWORD_INVALID');

	return {
		email,
		password,
	}
}

export async function parse_message_request(request: Request): Promise<{recipient: string; message: string}> {
	// const form_data = await request.formData();
	// const recipient = form_data.get('recipient')?.toString().toLowerCase();
	// const message = form_data.get('message')?.toString() ?? undefined;
	const data = await request.json() as {recipient: string, message: string};
	const recipient = data.recipient.toLowerCase();
	const message = data.message;

	if (!recipient) throw Error('EMAIL_UNDEFINED');
	if (!message) throw Error('MESSAGE_UNDEFINED');
	if (!isValidEmail(recipient)) throw Error('EMAIL_INVALID');
	if (message.length > 64) throw Error('MESSAGE_INVALID');

	return {
		recipient,
		message,
	}
}

export async function send_message(recipient: string, message: string): Promise<Response> {
	console.log(`send to ${recipient}: ${message}`);
	return fetch(
		MESSAGES_API_URL + '/send',
		{
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				recipient,
				message,
			}),
		},
	);
}
