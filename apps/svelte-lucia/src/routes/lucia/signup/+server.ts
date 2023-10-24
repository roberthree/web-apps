import { initializeLucia } from '$lib/server/lucia.js';
import { parseEmail } from '$lib/server/email.js';

async function signup(db: D1Database, url: URL): Promise<void> {
	const auth = initializeLucia(db);
	const user_email = parseEmail(url);
	const user = await auth.createUser({
		key: {
			providerId: 'email',
			providerUserId: user_email,
			password: null
		},
		attributes: {
			email: user_email
		}
	});
	console.log('created user');
	console.log('user.userId = ' + user.userId);
	console.log('user.email = ' + user.email);
	const db_user = await auth.getUser(user.userId);
	const db_key = await auth.getKey('email', user.email);
	console.log(db_user);
	console.log(db_key);
}

/** @type {import('./$types').RequestHandler} */
export async function GET({ url, platform }) {
	try {
		const db = platform?.env.LUCIA_DB as D1Database;
		await signup(db, url);
	} catch (error: any) {
		const known_error_messages = [
			'EMAIL_INVALID',
		]
		if (known_error_messages.includes(error.message)) {
			return new Response(error.message, {status: 400});
		} else {
			console.error(error.toString());
			return new Response(error.message, {status: 500});
		}
	}
	return new Response('SIGNUP', {status: 200});
}
