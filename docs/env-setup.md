## Env Setup

Setting up your environment and connecting all these services should take around 5-10 minutes.

1. Create a local postgres DB, and get your local DB running, add your connection string to `DATABASE_URL` and run `bun db:push`, to push the schema changes locally.
2. Create a Google OAuth Credential client + secret token, add them to `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
3. Create a Vercel blob storage, and add your key to `BLOB_READ_WRITE_TOKEN`
4. Get a Better Auth secret here: https://www.better-auth.com/docs/installation, and add it to `BETTER_AUTH_SECRET`
5. Create a backblaze b2 cloud storage bucket, and name it to `rizz-gpt`. Keep it private. See `storage.md` for more info.
6. Create a Gumroad account + a digital product.
