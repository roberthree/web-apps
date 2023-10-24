<h1>SvelteKit + Lucia</h1>

<script lang="ts">
	let log = '';
	let log_text = '';
	let email = '';
	let token = '';

	let restricted_data = {};

	function println(text: string): void {
		const time = new Date().toISOString();
		log += `[${time}] ${text}\n`;
	}

	function print_log_text(): void {
		println(log_text);
	}

	async function signup(): Promise<void> {
		const request = new Request(`/lucia/signup?email=${email}`);
		fetch(request).then(response => response.text()).then(println);
	}

	async function signin(): Promise<void> {
		const request = new Request(`/lucia/signin?method=pass_token&email=${email}`);
		fetch(request).then(response => response.text()).then(println);
	}

	async function verify(): Promise<void> {
		const request = new Request(`/lucia/verify?method=pass_token&token=${token}`);
		fetch(request).then(response => response.text()).then(println);
	}

	async function signout(): Promise<void> {
		const request = new Request(`/lucia/signout`);
		fetch(request);
	}

	async function access(): Promise<void> {
		const request = new Request(`/lucia/restricted`);
		fetch(request).then(
			response => response.status === 200 ? response.json() : {}
		).then(
			data => restricted_data = data
		);
	}
</script>

<div>
	<input bind:value={log_text} placeholder="enter log message" />
	<button on:click={print_log_text}>Log {log_text || 'message'}</button>
</div>

<div>
	<input bind:value={email} placeholder="enter your email" />
	<button on:click={signup}>Signup with {email || 'your email'}</button>
	<button on:click={signin}>Signin with {email || 'your email'}</button>
</div>

<div>
	<input bind:value={token} placeholder="enter your token" />
	<button on:click={verify}>Verify with {token || 'your token'}</button>
</div>

<div>
	<button on:click={signout}>Signout</button>
</div>

<div>
	<button on:click={access}>Access restricted data</button>
	<p>{JSON.stringify(restricted_data)}</p>
</div>

<div>
	<textarea bind:value={log} rows="10" cols="50" disabled/>
</div>

