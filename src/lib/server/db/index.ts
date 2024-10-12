import { DB_TOKEN, DB_URL } from "$env/static/private";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

const client = createClient({ authToken: DB_TOKEN, url: DB_URL });

const db = drizzle(client);

export default db;
