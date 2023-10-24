import { initializeLucia } from '$lib/server/lucia.js';
import { isWithinExpiration } from 'lucia/utils';

async function signin(db: D1Database, url: URL): Promise<string> {
	const method = url.searchParams.get('method');
	console.log('method = ' + method);

	if (method === 'pass_token') {
		const token = url.searchParams.get('token');
		console.log('token = ' + token);

		const user_pass_token_result = await db.prepare('SELECT * FROM auth_pass_token WHERE id = ?1').bind(token).all();
		console.assert(
			user_pass_token_result.success,
			user_pass_token_result,
		);
		console.log(user_pass_token_result.meta);
		console.assert(
			user_pass_token_result.results.length <= 1,
			user_pass_token_result,
		);
		if (user_pass_token_result.results.length == 0) {
			throw new Error('PASS_TOKEN_INVALID');
		}
		user_pass_token_result.results.forEach(console.log);

		const delete_result = await db.prepare('DELETE FROM auth_pass_token WHERE id = ?1').bind(token).run()
		console.assert(
			delete_result.success,
			delete_result,
		);
		console.log(delete_result.meta);
		console.log(delete_result.results);

		const user_pass_token = user_pass_token_result.results[0];
		console.log(user_pass_token);
		if (!isWithinExpiration(user_pass_token.expires as number)) {
			throw new Error('PASS_TOKEN_EXPIRED');
		}

		return user_pass_token.user_id as string;
	}

	throw new Error('METHOD_INVALID');
}

async function session_init(db: D1Database, user_id: string): Promise<Response> {
	const auth = initializeLucia(db);
	const user = await auth.getUser(user_id);
	console.log(user);
	const session = await auth.createSession({
		userId: user.userId,
		attributes: {},
	});
	const session_cookie = auth.createSessionCookie(session);
	console.log(session_cookie);
	// session_cookie.attributes.sameSite = 'none';
	// session_cookie.attributes.secure = true;
	// session_cookie.attributes.domain = 'lucia-auth.roberthree.workers.dev';
	console.log(session_cookie.attributes);
	return new Response(
		'USER_VERIFIED', {
		status: 301,
		headers: {
			'set-cookie': session_cookie.serialize(),
		},
	});
}

/** @type {import('./$types').RequestHandler} */
export async function GET({ url, platform }) {
	try {
		const db = platform?.env.LUCIA_DB as D1Database;
		const user_id = await signin(db, url);
		return await session_init(db, user_id);
	} catch (error: any) {
		const known_error_messages = [
			'EMAIL_INVALID',
			'METHOD_INVALID',
			'PASS_TOKEN_INVALID',
			'PASS_TOKEN_EXPIRED',
			'AUTH_INVALID_USER_ID',
		]
		if (known_error_messages.includes(error.message)) {
			return new Response(error.message, {status: 400});
		} else {
			console.error(error.toString());
			return new Response(error.message, {status: 500});
		}
	}
}
