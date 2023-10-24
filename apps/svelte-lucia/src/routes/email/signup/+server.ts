import { MESSAGES_API_URL, parse_password_request } from '$lib/server/email/utils.js';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	try {
		console.log('/email/signup: POST')
		const data = await parse_password_request(request);
		return await fetch(new Request(
			MESSAGES_API_URL + '/signup',
			{
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					username: data.email,
					password: data.password,
				}),
			},
		));
	} catch (error: any) {
		const known_error_messages = [
			'EMAIL_UNDEFINED',
			'EMAIL_INVALID',
			'PASSWORD_UNDEFINED',
			'PASSWORD_INVALID',
		]
		if (known_error_messages.includes(error.message)) {
			return new Response(error.message, {status: 400});
		} else {
			console.error(error.toString());
			return new Response(error.message, {status: 500});
		}
	}
}
