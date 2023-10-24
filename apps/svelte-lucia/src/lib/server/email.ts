const valid_email_regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;

export function isValidEmail(email: string): Boolean {
	return valid_email_regex.test(email);
}

export function parseEmail(url: URL): string {
	const email = url.searchParams.get('email');
	console.log(typeof(email));
	console.log(email);

	if (typeof(email) !== 'string' || !isValidEmail(email)) {
		throw Error('EMAIL_INVALID')
	}

	return email.toLowerCase();
}
