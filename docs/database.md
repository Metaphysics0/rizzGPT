## Databse 101

This app uses NeonDB (a serverless Postgres provider), with Drizzle as the ORM.

## DB Migrations / Adding new fields / modifying schemas etc

1. Whenever making a change to the schema defined in `src/lib/server/database/schema/index.ts`, we need to push the schema changes. simply run `bun db:push`, with your
