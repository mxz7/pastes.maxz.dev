import { env } from "$env/dynamic/private";
import { nanoid } from "$lib/nanoid.js";
import db from "$lib/server/db/index.js";
import { purge } from "$lib/server/db/purge.js";
import { pastesTable } from "$lib/server/db/schema.js";
import s3 from "$lib/server/s3.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { error, json } from "@sveltejs/kit";

export const config = {
  runtime: "nodejs20.x",
};

export async function PUT({ request, getClientAddress }) {
  if (parseInt(request.headers.get("Content-Length") || "0") > 100000000)
    return error(400, { message: "Body too large" });

  const body = await request.text();

  if (!body) {
    return error(404, { message: "Missing body" });
  }

  const size = Buffer.from(body).byteLength;

  if (size > 100000000) return error(400, { message: "Body too large" });

  const id = nanoid();

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
