import db from "$lib/server/db/index.js";
import { purge } from "$lib/server/db/purge.js";
import { pastesTable } from "$lib/server/db/schema.js";
import { error } from "console";
import { eq } from "drizzle-orm";

export async function load({ params, setHeaders, fetch }) {
  setHeaders({ "cache-control": "public, max-age=3600, must-revalidate" });

  const [data] = await db.select().from(pastesTable).where(eq(pastesTable.id, params.id));

  if (!data) return error(404);

  if (data.createdAt < Date.now() - 7776000000) {
    purge();

    return error(404);
  }

  return {
    content: fetch(`https://cdn.maxz.dev/pastes/${data.id}`).then((r) => r.text()),
    createdAt: data.createdAt,
    size: data.size,
  };
}
