/** @type {import('./$types').RequestHandler} */
export function GET({ url }) {
	return new Response('this is a test at' + url.toString(), {status: 200});
}
