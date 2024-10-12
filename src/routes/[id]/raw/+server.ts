import db from "$lib/server/db";
import { pastesTable } from "$lib/server/db/schema";
import { error } from "@sveltejs/kit";
import { eq } from "drizzle-orm";

export async function GET({ params, setHeaders }) {
  setHeaders({ "cache-control": "max-age=86400" });

  const [data] = await db.select().from(pastesTable).where(eq(pastesTable.id, params.id));

  if (!data) return error(404);

  return new Response(await fetch(`https://cdn.maxz.dev/pastes/${data.id}`).then((r) => r.text()), {
    status: 200,
    headers: { "Content-Type": "text/plain" },
  });
}
