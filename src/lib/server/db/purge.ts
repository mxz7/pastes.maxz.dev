import { env } from "$env/dynamic/private";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { eq, lt } from "drizzle-orm";
import db from ".";
import s3 from "../s3";
import { pastesTable } from "./schema";

export async function purge() {
  const expired = await db
    .select({ id: pastesTable.id })
    .from(pastesTable)
    .where(lt(pastesTable.createdAt, Date.now() - 7776000000));

  for (const expiredItem of expired) {
    await s3.send(
      new DeleteObjectCommand({
        Bucket: env.S3_BUCKET,
        Key: `pastes/${expiredItem.id}`,
      }),
    );
    await db.delete(pastesTable).where(eq(pastesTable.id, expiredItem.id));
  }
}
