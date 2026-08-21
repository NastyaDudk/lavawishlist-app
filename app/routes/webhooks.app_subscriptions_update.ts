import type { ActionFunctionArgs } from "@remix-run/node";
import prisma from "../db.server";
import { authenticate } from "../shopify.server";

export const action = async ({
  request,
}: ActionFunctionArgs) => {

  const { topic, shop, payload } =
    await authenticate.webhook(request);

  console.log("=================================");
  console.log("SUBSCRIPTION WEBHOOK");
  console.log("TOPIC:", topic);
  console.log("SHOP:", shop);
  console.log(
    "PAYLOAD:",
    JSON.stringify(payload, null, 2)
  );
  console.log("=================================");

 const subscription =
  payload?.app_subscription;

const status =
  subscription?.status;

const planHandle =
  subscription?.plan_handle;

const isPro =
  status === "ACTIVE" &&
  planHandle === "pro";

console.log(
  "SUBSCRIPTION STATUS:",
  status
);

console.log(
  "PLAN HANDLE:",
  planHandle
);

console.log(
  "CALCULATED isPro:",
  isPro
);

 await prisma.shopStats.upsert({
  where: {
    shop,
  },

  update: {
    shopId:
      payload.app_subscription
        .admin_graphql_api_shop_id,

    isPro,
  },

  create: {
    shop,

    shopId:
      payload.app_subscription
        .admin_graphql_api_shop_id,

    isPro,
    limitHits: 0,
  },
});

  console.log(
    "DATABASE UPDATED:",
    shop,
    "=> isPro:",
    isPro
  );

  return new Response(null, {
    status: 200,
  });
};
