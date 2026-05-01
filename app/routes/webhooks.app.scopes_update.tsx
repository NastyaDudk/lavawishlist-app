import type { ActionFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";
import db from "../db.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { payload, session, shop } = await authenticate.webhook(request);

  console.log(`Scopes updated for ${shop}`);

  const currentScopes = (payload.current as string[]) || [];

  if (session) {
    await db.session.update({
      where: {
        id: session.id,
      },
      data: {
        scope: currentScopes.join(","),
      },
    });
  }

  return new Response("OK", { status: 200 });
};
