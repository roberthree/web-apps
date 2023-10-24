import { initializeLucia } from './lucia.js';
import { io_page_html_string } from './io.js';

export interface Env {
	MESSAGES_AUTH_DB: D1Database;
	MESSAGES_DATA_DB: D1Database;
}

async function create_text_response(): Promise<Response> {
	return new Response(
		'this is text',
		{
			status: 200,
			headers: {
				'content-type': 'text/plain;charset=utf-8',
			}
		}
	);
}

async function create_html_response(): Promise<Response> {
	return new Response(
		'backend for <a href="https://svelte-lucia.pages.dev" target=”_blank”>Svelte/Lucia Auth</a>',
		{
			status: 200,
			headers: {
				'content-type': 'text/html;charset=utf-8',
			}
		}
	);
}

async function create_json_response(): Promise<Response> {
	return new Response(
		JSON.stringify({
			user: 'test',
			email: 'a@b.cd',
		}),
		{
			status: 200,
			headers: {
				'content-type': 'application/json;charset=utf-8',
			},
		}
	);
}

async function create_io_page(): Promise<Response> {
	return new Response(
		io_page_html_string(),
		{
			status: 200,
			headers: {
				'content-type': 'text/html;charset=utf-8',
			}
		}
	);
}

async function parse_username_password(request: Request): Promise<{username: string | undefined, password: string | undefined}> {
	console.log(request.headers.get('content-type'));
	switch(request.headers.get('content-type')) {
		case 'application/x-www-form-urlencoded':
			return request.formData().then(
				data => {
					return {
						username: data.get('username') ?? undefined,
						password: data.get('password') ?? undefined,
					}
				}
			);
		default:
			return await request.json();
	}
}

async function parse_recipient_message(request: Request): Promise<{recipient: string | undefined, message: string | undefined}> {
	console.log(request.headers.get('content-type'));
	switch(request.headers.get('content-type')) {
		case 'application/x-www-form-urlencoded':
			return request.formData().then(
				data => {
					return {
						recipient: data.get('recipient') ?? undefined,
						message: data.get('message') ?? undefined,
					}
				}
			);
		default:
			return await request.json();
	}
}

async function signup(
	request: Request,
	db_auth: D1Database,
): Promise<Response> {
	const data = await parse_username_password(request);
	console.log(data);
	if (typeof(data.username) !== 'string') throw new Error('USERNAME_UNDEFINED');
	if (typeof(data.password) !== 'string') throw new Error('PASSWORD_UNDEFINED');
	
	const auth = initializeLucia(db_auth);
	const user = await auth.createUser({
		key: {
			providerId: 'username',
			providerUserId: data.username,
			password: data.password,
		},
		attributes: {
			username: data.username,
		}
	});

	console.log('created user');
	console.log(`user.userId = ${user.userId}`);
	console.log(`user.username = ${user.username}`);
	console.log(await auth.getUser(user.userId));
	console.log(await auth.useKey('username', user.username, data.password));

	return new Response('SIGNUP', {status: 200});
}

async function remove(
	request: Request,
	db_auth: D1Database,
	db_data: D1Database,
): Promise<Response> {
	const data = await parse_username_password(request);
	console.log(data);
	if (typeof(data.username) !== 'string') throw new Error('USERNAME_UNDEFINED');
	if (typeof(data.password) !== 'string') throw new Error('PASSWORD_UNDEFINED');
	
	const auth = initializeLucia(db_auth);
	const key = await auth.useKey('username', data.username, data.password);
	const user = await auth.getUser(key.userId);

	console.log('all user keys');
	(await auth.getAllUserKeys(user.userId)).forEach(console.log);
	console.log('all user sessions');
	(await auth.getAllUserSessions(user.userId)).forEach(console.log);

	const db_data_result = await db_data.prepare(
		'DELETE FROM data_messages WHERE user_id = ?1'
	).bind(user.userId).run();
	console.assert(db_data_result.success, db_data_result);
	// console.log(db_data_result.meta);

	await auth.deleteUser(user.userId);

	console.log('removed user');
	console.log(`user.userId = ${user.userId}`);
	console.log(`user.username = ${user.username}`);

	return new Response('REMOVE', {status: 200});
}

async function access(
	request: Request,
	db_auth: D1Database,
	db_data: D1Database,
): Promise<Response> {
	const data = await parse_username_password(request);
	console.log(data);
	if (typeof(data.username) !== 'string') throw new Error('USERNAME_UNDEFINED');
	if (typeof(data.password) !== 'string') throw new Error('PASSWORD_UNDEFINED');
	
	const auth = initializeLucia(db_auth);
	const key = await auth.useKey('username', data.username, data.password);
	const user_id = key.userId;

	const db_data_result = await db_data.prepare(
		'SELECT * FROM data_messages WHERE user_id = ?1'
	).bind(user_id).run();
	console.assert(db_data_result.success, db_data_result);
	// console.log(db_data_result.meta);

	return new Response(
		JSON.stringify(db_data_result.results),
		{
			status: 200,
			headers: {
				'content-type': 'application/json;charset=utf-8',
			},
		}
	);
}

async function send(
	request: Request,
	db_auth: D1Database,
	db_data: D1Database,
): Promise<Response> {
	const data = await parse_recipient_message(request);
	console.log(data);
	if (typeof(data.recipient) !== 'string') throw new Error('RECIPIENT_UNDEFINED');
	if (typeof(data.message) !== 'string') throw new Error('MESSAGE_UNDEFINED');
	
	const auth = initializeLucia(db_auth);
	const key = await auth.getKey('username', data.recipient);
	console.log(key);

	const message_date = new Date().getTime();

	const db_result = await db_data.prepare(
		'INSERT INTO data_messages (user_id, message_date, message_data) VALUES (?1, ?2, ?3)'
	).bind(key.userId, message_date, data.message).run();
	console.assert(db_result.success, db_result);
	console.log(db_result.meta);

	return new Response('MESSAGE_SENT', {status: 200});
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		console.log(`origin = ${request.headers.get('origin')}`);
		console.log(`method = ${request.method}`);

		const url = new URL(request.url);
		console.log(url.toString());
		console.log(url.pathname);

		try {
			switch(request.method) {
				case 'GET':
					switch(url.pathname) {
						case '/text':
							return await create_text_response();
						case '/html':
							return await create_html_response();
						case '/json':
							return await create_json_response();
						case '/io':
							return await create_io_page();
						default:
							return new Response(null, {status: 404});
					}
				case 'POST':
					switch(url.pathname) {
						case '/signup':
							return await signup(
								request,
								env.MESSAGES_AUTH_DB,
							);
						case '/remove':
							return await remove(
								request,
								env.MESSAGES_AUTH_DB,
								env.MESSAGES_DATA_DB,
							);
						case '/access':
							return await access(
								request,
								env.MESSAGES_AUTH_DB,
								env.MESSAGES_DATA_DB,
							);
						case '/send':
							return await send(
								request,
								env.MESSAGES_AUTH_DB,
								env.MESSAGES_DATA_DB,
							);
						default:
							return new Response(null, {status: 404});
					}
				default:
					return new Response(null, {status: 400});
			}
		} catch (error: any) {
			const known_error_messages = [
				'AUTH_DUPLICATE_KEY_ID',
				'AUTH_INVALID_KEY_ID',
			]
			if (known_error_messages.includes(error.message)) {
				return new Response(error.message, {status: 400});
			} else {
				console.error(error.toString());
				return new Response(error.message, {status: 500});
			}
		}
	},
};
