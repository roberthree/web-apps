/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
	const trusted_frontend = 'https://svelte-lucia.pages.dev';
	return new Response(
		`Backend for <a href="${trusted_frontend}" target=”_blank”>Svelte/Lucia Auth</a>`,
		{
			status: 200,
			headers: {
				'content-type': 'text/html;charset=utf-8',
			}
		}
	);
}
