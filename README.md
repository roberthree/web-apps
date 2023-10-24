# Web Apps

This repository is used to explore and learn various web development concepts, frameworks and tools.
Each application (or project) is self-contained in a folder under [`apps/`](apps/).
Some applications may depend on other applications via web APIs.

Currently, each application is deployed on Cloudflare Pages/Workers using their [free tier program](https://www.cloudflare.com/plans/developer-platform/).

IMPORTANT: Each app should not be used with sensitive data, e.g. real passwords or personal information!

## Identity management

[Identity management](https://en.wikipedia.org/wiki/Identity_management) is an umbrella term for everything related to identification/authentication/authorization of users, including protocols and software solutions.
In general, identity management is a hyper-critical aspect of software development when sensitive data is involved.
Therefore, reinventing the wheel, should be avoided in production-ready software.
However, it is still beneficial to understand the underlying code of this subtopic of cybersecurity.

[`apps/svelte-lucia/`](apps/svelte-lucia/) explores the authentication library [Lucia](https://github.com/lucia-auth/lucia) using the beloved web framework [Svelte](https://github.com/sveltejs).
This app is deployed on [Cloudflare Pages](https://svelte-lucia.pages.dev/) and focuses on understanding the authentication and authorization process.

Identity management often involves a verfication step with your email, phone or another device.
Since free solutions for this step are complicated or require your own domain to avoid for example [email spoofing](https://en.wikipedia.org/wiki/Email_spoofing), [`apps/messages/`](apps/messages/) implements a simple HTTP API for receiving text messages based on [Lucia](https://github.com/lucia-auth/lucia) and [Cloudflare D1](https://developers.cloudflare.com/d1/).
This app focuses on three functions:\
(1) registering a user with a username and password\
(2) accessing text messages from a registered user using the username and password\
(3) sending text messages to a registered user

## Next topic

...

