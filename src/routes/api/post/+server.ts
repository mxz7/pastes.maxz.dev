import { env } from "$env/dynamic/private";
import { nanoid } from "$lib/nanoid.js";
import db from "$lib/server/db/index.js";
import { purge } from "$lib/server/db/purge.js";
import { pastesTable } from "$lib/server/db/schema.js";
import s3 from "$lib/server/s3.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { error, json } from "@sveltejs/kit";
import { and, eq, gt } from "drizzle-orm";

export const config = {
  runtime: "nodejs20.x",
};

export async function PUT({ request, getClientAddress, url }) {
  if (parseInt(request.headers.get("Content-Length") || "0") > 100000000)
    return error(400, { message: "Body too large" });

  const params = url.searchParams;

  const length = parseInt(params.get("length") || "7");

  if (length > 50) return error(400, { message: "Length too large" });
  else if (length < 7) return error(400, { message: "Length too small" });

  const authHeader = request.headers.get("Authorization");

  if (!authHeader || authHeader !== `Bearer ${env.UNLIMITED_UPLOADS}`) {
    const check = await db
      .select({ size: pastesTable.size })
      .from(pastesTable)
      .where(
        and(
          eq(pastesTable.createdByIp, getClientAddress()),
          gt(pastesTable.createdAt, Date.now() - 2592000000),
        ),
      );

    const total = check.map((i) => i.size).reduce((a, b) => a + b);

    if (total > 10000000) return error(420, { message: "Too many uploads" });
  }

  const body = await request.text();

  if (!body) {
    return error(404, { message: "Missing body" });
  }

  const size = Buffer.from(body).byteLength;

  if (size > 100000000) return error(400, { message: "Body too large" });

  const id = nanoid(length);

  await s3.send(
    new PutObjectCommand({
      Bucket: env.S3_BUCKET,
      Key: `pastes/${id}`,
      Body: body,
      ContentType: "text/plain",
    }),
  );

  await db.insert(pastesTable).values({
    createdAt: Date.now(),
    id,
    size,
    createdByIp: getClientAddress(),
    createdByUserAgent: request.headers.get("user-agent"),
  });

  purge();

  return json({
    id,
    url: `https://pastes.maxz.dev/${id}`,
    raw: `https://pastes.maxz.dev/${id}/raw`,
  });
}
