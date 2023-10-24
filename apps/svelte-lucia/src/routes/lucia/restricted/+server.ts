import { initializeLucia } from '$lib/server/lucia.js';

async function get_user_pass_tokens(db: D1Database, user_id: string): Promise<Record<string, unknown>[]> {
	const result = await db.prepare('SELECT * FROM auth_pass_token WHERE user_id = ?1').bind(user_id).all();
	console.assert(result.success, result);
	console.log(result.meta);
	result.results.forEach(console.log);
	return result.results
}

/** @type {import('./$types').RequestHandler} */
export async function GET({ cookies, request, platform }) {
	try {
		const db = platform?.env.LUCIA_DB as D1Database;
		console.log(cookies);
		const auth = initializeLucia(db);
		const auth_request = auth.handleRequest(request);
		const session = await auth_request.validate(); // or `authRequest.validateBearerToken()`

		if (!session) {
			return new Response(null, {status: 401});
		}

		console.log(typeof(session));
		console.log(session);
		const user = session.user;
		const user_data = {
			user_id: user.userId,
			user_email: user.email,
			user_pass_tokens: await get_user_pass_tokens(db, user.userId),
		}

		return new Response(
			JSON.stringify(user_data),
			{
				status: 200,
				headers: {
					'content-type': 'application/json;charset=utf-8',
				},
			}
		);
	} catch (error: any) {
		const known_error_messages = [
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
