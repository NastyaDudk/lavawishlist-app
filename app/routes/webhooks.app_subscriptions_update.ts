import type { ActionFunctionArgs } from "@remix-run/node";

import prisma from "../db.server";
import { authenticate } from "../shopify.server";

export const action = async ({
  request,
}: ActionFunctionArgs) => {

  const { topic, shop, payload } =
    await authenticate.webhook(request);

  console.log("Webhook:", topic);
  console.log(payload);

  const subscription =
    payload.app_subscription;

  const isPro =
    subscription?.status === "ACTIVE";

  await prisma.shopStats.upsert({
    where: {
      shop,
    },
    update: {
      isPro,
    },
    create: {
      shop,
      isPro,
      limitHits: 0,
    },
  });

  return new Response();
};
