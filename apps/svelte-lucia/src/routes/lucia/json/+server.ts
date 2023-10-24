/** @type {import('./$types').RequestHandler} */
export function GET({ }) {
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
