import { log } from "$lib/server/logger";
import { redirect } from "@sveltejs/kit";

export function handleError({ event, error, message, status }) {
  const errorId = crypto.randomUUID();
  event.locals.error = error?.toString() || undefined;
  event.locals.errorStackTrace = (error as Error)?.stack || undefined;
  event.locals.errorId = errorId;

  log(status, event);

  return { message: message || "an unexpected error occured", errorId: errorId };
}

export async function handle({ event, resolve }) {
  event.locals.startTimer = performance.now();

  if (event.url.hostname === "pastes-maxz-dev.fly.dev")
    return redirect(303, `https://pastes.maxz.dev${event.url.pathname}`);

  const res = await resolve(event);

  log(res.status, event);

  return res;
}
