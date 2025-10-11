# RizzGPT 💅

A web app for generating responses for dating conversations, using modern web technologies.

## Core Features

The app is an AI wingman assistant to help users craft responses to send to a prospective partner they have met on any dating app platoform.
There are two main features (as of sept 27, 2025).

1. Allowing the users to upload their matches' bio, and to generate an engaging first message to send.
2. Allowing users to upload any text conversation, and to receive follow up texts to send.

## Tech 👨‍💻

- SvelteKit + TypeScript + Bun
- Tailwind (v4) + shadcn-svelte + Iconify + Google Fonts (Celebes & Valera)
- Paraglide js (internationalization + machine translations)
- Neon DB + Drizzle
- BetterAuth (Google OAuth + Email)
- Resend (for email auth verification)
- Gemini + Gemini Flash 2.5 lite (via `@google/genai` sdk)
- Vercel Deployment + Hosting
- Backblaze Cloud Storage (cheaper s3 alternative)
- PayPal + PayPal-JS SDK (processing payments + subscription products + Checkout)

## How to run the app

1. Make sure you have envs defined in `.env.example`. See `docs/env-setup.md` for more info.
2. cd into the project, `bun i` then `bun dev`

## Troubleshooting

- if you get a `failed to load config from /Users/ryan/Desktop/dev/rizzGPT/vite.config.ts` error when trying to run the dev server, simply try to `rm -rf node_modules`
