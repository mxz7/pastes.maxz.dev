import db from "$lib/server/db/index.js";
import { pastesTable } from "$lib/server/db/schema.js";
import { error } from "console";
import { eq } from "drizzle-orm";

export async function load({ params, setHeaders, fetch }) {
  setHeaders({ "cache-control": "max-age=86400" });

  const [data] = await db.select().from(pastesTable).where(eq(pastesTable.id, params.id));

  if (!data) return error(404);

  return {
    content: await fetch(`https://cdn.maxz.dev/pastes/${data.id}`).then((r) => r.text()),
    createdAt: data.createdAt,
    size: data.size,
  };
}
