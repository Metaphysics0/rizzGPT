import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey(),
  kindeId: text("kinde_id").unique().notNull(),
  email: text("email").notNull(),
  givenName: text("given_name"),
  familyName: text("family_name"),
  picture: text("picture"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
