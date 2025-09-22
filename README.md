# RizzGPT

A web app for generating responses for dating conversations, using modern web technologies.

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

## TODO:

- A clearly defined pro subscription tier, redirect to gumroad product page.
- Improve the main form. Update to be a form action, rather than js fetch
