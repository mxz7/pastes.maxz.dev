import { S3_BUCKET } from "$env/static/private";
import { nanoid } from "$lib/nanoid.js";
import db from "$lib/server/db/index.js";
import { pastesTable } from "$lib/server/db/schema.js";
import s3 from "$lib/server/s3.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { error, json } from "@sveltejs/kit";

export const config = {
  runtime: "nodejs20.x",
};

export async function PUT({ request, getClientAddress }) {
  const body = await request.text();

  if (!body) {
    return error(404, { message: "Missing body" });
  }

  const id = nanoid();

  await s3.send(
    new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: `pastes/${id}`,
      Body: body,
      ContentType: "text/plain",
    }),
  );

  await db.insert(pastesTable).values({
    createdAt: Date.now(),
    id,
    size: Buffer.from(body).byteLength,
    createdByIp: getClientAddress(),
    createdByUserAgent: request.headers.get("user-agent"),
  });

  return json({
    id,
    url: `https://pastes.maxz.dev/${id}`,
    raw: `https://pastes.maxz.dev/${id}/raw`,
  });
}
