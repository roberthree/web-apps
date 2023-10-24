import { send_message, parse_message_request } from '$lib/server/email/utils.js';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	try {
		console.log('/email/send: POST');
		await parse_message_request(request).then(
			data => send_message(
				data.recipient,
				data.message,
			)
		);
	} catch (error: any) {
		const known_error_messages = [
			'EMAIL_UNDEFINED',
			'EMAIL_INVALID',
			'MESSAGE_UNDEFINED',
			'MESSAGE_INVALID',
		]
		if (known_error_messages.includes(error.message)) {
			return new Response(error.message, {status: 400});
		} else {
			console.error(error.toString());
			return new Response(error.message, {status: 500});
		}
	}
}