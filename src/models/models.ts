import { pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { statusEnum } from "../config/types";

const users = pgTable("users", {
    id: serial("id").primaryKey(),
    email: text("email").notNull().unique(),
    hashed_password: text("hashed_password").notNull(),
    created_at: timestamp('created_at').defaultNow(),
});

const gadgets = pgTable("gadgets", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    status: varchar("status", { length: 50 }).$type<(typeof statusEnum)[number]>().notNull(),
    decommissioned_at: timestamp('updated_at').defaultNow(),
});

export { users, gadgets }
