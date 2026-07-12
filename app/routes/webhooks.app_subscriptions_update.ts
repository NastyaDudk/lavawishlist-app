import type { ActionFunctionArgs } from "@remix-run/node";

import prisma from "../db.server";
import { authenticate } from "../shopify.server";

export async function action({
  request,
}: ActionFunctionArgs) {

  const { topic, shop, payload } =
    await authenticate.webhook(request);

  console.log(topic);
  console.log(shop);
  console.log(payload);

  const subscription =
    payload.app_subscription;

  const active =
    subscription?.status === "ACTIVE";

  await prisma.shopStats.upsert({
    where: {
      shop,
    },

    update: {
      isPro: active,
    },

    create: {
      shop,
      isPro: active,
    },
  });

  return new Response();
}
