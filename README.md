# RizzGPT

A web app for generating responses for dating conversations, using modern web technologies.

## Core

The app is an AI wingman assistant to help users craft responses to send to a prospective partner they have met on any dating app platoform.
There are two main features (as of sept 27, 2025).

1. Allowing the users to upload their matches' bio, and to generate an engaging first message to send.
2. Allowing users to upload any text conversation, and to receive follow up texts to send.

## Tech 👨‍💻

- SvelteKit + TypeScript + Bun
- Tailwind v4 + shadcn-svelte + Iconify icons
- Neon DB + Drizzle
- BetterAuth (Google OAuth + Email)
- Resend (for sending sign up email verification)
- Gemini + Gemini Flash 2.0 (`@google/genai` sdk)
- Vercel Deployment
- Backblaze Object Storage (cheaper s3 / vercel blob alternative)
- Gumroad (processing payments + pro subscription tier)

## How to run the app

1. Make sure you have envs defined in `.env.example`. See docs/env-setup.md for more info.
2. cd into the project, `bun i` then `bun dev`

## Troubleshooting

- if you get a `failed to load config from /Users/ryan/Desktop/dev/rizzGPT/vite.config.ts` error, try rm -rf node_modules

## TODO:

1. Localization! Add language selector + init project in user's device language.
   a. Look at: [js-lingui](https://github.com/lingui/js-lingui),
2. AI Profile Optimizer page (pro only)

- E2E Gumroad subscription flow
- Refactoring the DB to have a relationship of user.subscriptions, instead of the code duplcation for user & { subscription: Subscription }
- Capacitor mobile app
