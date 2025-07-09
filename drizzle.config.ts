import { type Config } from "drizzle-kit";

export default {
  schema: "./src/lib/server/database/schema/*",
  out: "./src/lib/server/database/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config; 