import { initializeLucia } from '$lib/server/lucia.js';
import { parseEmail } from '$lib/server/email.js';
import { send_message } from '$lib/server/email/utils.js';
import { generateRandomString } from 'lucia/utils';

async function generate_user_pass_token(db: D1Database, user_id: string, length: number, expires: number): Promise<string> {
	const token = generateRandomString(length);
	const result = await db.prepare(
		'INSERT INTO auth_pass_token (id, user_id, expires) VALUES (?1, ?2, ?3)'
	).bind(
		token,
		user_id,
		new Date().getTime() + expires,
	).run();
	console.assert(result.success, result);
	console.log(result.meta);
	return token
}

async function signin(db: D1Database, url: URL): Promise<Response> {
	const user_email = parseEmail(url);
	const auth = initializeLucia(db);
	const user_key = await auth.getKey('email', user_email);
	const user = await auth.getUser(user_key.userId);
	console.log(JSON.stringify(user));

	const method = url.searchParams.get('method');
	console.log(`method = ${method}`);

	if (method === 'pass_token') {
		const EXPIRES_IN = 1000 * 60; // 1 minute
		const token = await generate_user_pass_token(db, user.userId, 8, EXPIRES_IN)
		console.log(`token = ${token}`)
		return send_message(
			user.email,
			url.origin + '/verify?method=pass_token&token=' + token
		);
	}

	throw new Error('METHOD_INVALID');
}

/** @type {import('./$types').RequestHandler} */
export async function GET({ url, platform }) {
	try {
		const db = platform?.env.LUCIA_DB as D1Database;
		return await signin(db, url);
	} catch (error: any) {
		const known_error_messages = [
			'EMAIL_INVALID',
			'METHOD_INVALID',
		]
		if (known_error_messages.includes(error.message)) {
			return new Response(error.message, {status: 400});
		} else {
			console.error(error.toString());
			return new Response(error.message, {status: 500});
		}
	}
}
