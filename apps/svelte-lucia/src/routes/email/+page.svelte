<h1>Message Service</h1>

<script lang="ts">
	let log = '';
	let log_text = '';
	
	let email = '';
	let password = '';

	let recipient = '';
	let message = '';

	let restricted_data = {};

	function println(text: string): void {
		const time = new Date().toISOString();
		log += `[${time}] ${text}\n`;
	}

	function print_log_text(): void {
		println(log_text);
	}

	async function signup(): Promise<void> {
		fetch(
			'/email/signup',
			{
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					email,
					password,
				}),
			},
		).then(response => response.text()).then(println);
	}

	async function remove(): Promise<void> {
		fetch(
			'/email/remove',
			{
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					email,
					password,
				}),
			},
		).then(response => response.text()).then(println);
	}

	async function access(): Promise<void> {
		fetch(
			'/email/access',
			{
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					email,
					password,
				}),
			},
		).then(
			response => response.status === 200 ? response.json() : {}
		).then(
			data => restricted_data = data
		);
	}

	async function send(): Promise<void> {
		fetch(
			'/email/send',
			{
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					recipient,
					message,
				}),
			},
		).then(response => response.text()).then(println);
	}
</script>

<div>
	<input bind:value={log_text} placeholder="enter log message" />
	<button on:click={print_log_text}>Log {log_text || 'message'}</button>
</div>

<div>
	<input bind:value={email} placeholder="enter your email" />
	<input bind:value={password} placeholder="enter your password" />
	<button on:click={signup}>Signup with {email || 'your email'} using {password} as your password</button>
	<button on:click={remove}>Remove {email || 'your email'} using {password} as your password</button>
	<button on:click={access}>Access your messages from {email || 'your email'} using {password} as your password</button>
</div>

<div>
	<h2>Messages for {email || 'your email'}</h2>
	<p>{JSON.stringify(restricted_data)}</p>
</div>

<div>
	<input bind:value={recipient} placeholder="enter the recipient" />
	<input bind:value={message} placeholder="enter your message" />
	<button on:click={send}>Send message {message} to {recipient || 'your recipient'}</button>
</div>

<div>
	<textarea bind:value={log} rows="10" cols="50" disabled/>
</div>

