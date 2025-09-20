# RizzGPT

A web app for generating responses for dating conversations, showcasing modern web technologies

## Tech 👨‍💻

- SvelteKit + Bun
- Tailwind + shadcn
- Neon DB Serverless + Drizzle
- BetterAuth (Sign in with google + email)
- Resend
- Gemini Flash 2.0
- Vercel + Vercel Blob Storage

## How to run the app

1. Make sure you have envs for all the envs defined in `.env.example`.
2. Create a local postgres DB, and get your local DB running, and run `bun db:push`, to push the schema changes locally.
3. Generate the Better Auth secret here: https://www.better-auth.com/docs/installation, and add it to `BETTER_AUTH_SECRET`
4. cd into the project, `bun i` then `bun dev`

## Patterns:

- Using SvelteKit Server Sent Events for processing the conversation response.
- Protecting routes in the `hooks.server.ts`, basically checking if there is a user session, if not redirecting to `/sign-in`.
- No UI design framework, simply pure tailwind. Added shadcn-svelte just for their tooltip + more components in the future.
- Using iconify icons & custom google font served locally

## TODO:

- Improve the main form. Update to be a form action, rather than js fetch
