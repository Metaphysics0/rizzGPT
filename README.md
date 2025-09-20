# RizzGPT

A web app for generating responses for dating conversations, using modern web technologies.

## Tech 👨‍💻

- SvelteKit + TypeScript + Bun
- Tailwind v4 + shadcn-svelte + Iconify icons
- Neon DB + Drizzle
- BetterAuth (Google OAuth + Email)
- Resend
- Gemini Flash 2.0
- Vercel + Vercel Blob Storage

## How to run the app

1. Make sure you have envs defined in `.env.example`. See Env Setup section for more info.
2. cd into the project, `bun i` then `bun dev`

## Env Setup

Setting up your environment and connecting all these services should take around 5-10 minutes.

1. Create a local postgres DB, and get your local DB running, add your connection string to `DATABASE_URL` and run `bun db:push`, to push the schema changes locally.
2. Create a Google OAuth Credential client + secret token, add them to `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
3. Create a Vercel blob storage, and add your key to `BLOB_READ_WRITE_TOKEN`
4. Gete a Better Auth secret here: https://www.better-auth.com/docs/installation, and add it to `BETTER_AUTH_SECRET`

## Patterns:

- Using SvelteKit Server Sent Events for processing the conversation response.
- Protecting routes in the `hooks.server.ts`, basically checking if there is a user session, if not redirecting to `/sign-in`.
- No UI design framework, simply pure tailwind. Added shadcn-svelte just for their tooltip + more components in the future.
- Using iconify icons & custom google font served locally

## TODO:

- Improve the main form. Update to be a form action, rather than js fetch
