import { initializeLucia } from '$lib/server/lucia.js';

async function revoke_session(db: D1Database, request: Request): Promise<Response> {
	const auth = initializeLucia(db);
	const auth_request = auth.handleRequest(request);
	const session = await auth_request.validate(); // or `authRequest.validateBearerToken()`

	if (!session) {
		return new Response(null, {status: 401});
	}

	await auth.invalidateSession(session.sessionId);

	const session_cookie = auth.createSessionCookie(null);
	console.log(session_cookie);
	console.log(session_cookie.attributes);

	const headers = new Headers();
	headers.set('Set-Cookie', session_cookie.serialize());
	return new Response(
		'SESSION_REVOKED', {
		status: 301,
		headers: headers,
	});
}

/** @type {import('./$types').RequestHandler} */
export async function GET({ request, platform }) {
	try {
		const db = platform?.env.LUCIA_DB as D1Database;
		return await revoke_session(db, request);
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
