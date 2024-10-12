import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const pastesTable = sqliteTable("pastes", {
  id: text("id").primaryKey(),
  createdAt: integer("created_at").notNull(),
  size: integer("size").notNull(),
  createdByIp: text("created_by_ip").notNull(),
  createdByUserAgent: text("created_by_user_agent"),
});
