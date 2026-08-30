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

  /*
   * =====================================================
   * GET EXISTING SHOP STATS
   * =====================================================
   */

  const existingStats =
    await prisma.shopStats.findUnique({
      where: {
        shop,
      },
      select: {
        proStartedAt: true,
        isPro: true,
      },
    });

  /*
   * =====================================================
   * PRO START DATE
   * =====================================================
   *
   * Save the date only when Pro becomes ACTIVE.
   *
   * If the date already exists, keep it.
   * This prevents every webhook from resetting
   * the trial countdown.
   */

 let proStartedAt: Date | null =
  existingStats?.proStartedAt ?? null;

  if (
    isPro &&
    !proStartedAt
  ) {

    proStartedAt = new Date();

    console.log(
      "🔥 NEW PRO SUBSCRIPTION"
    );

    console.log(
      "🔥 PRO STARTED AT:",
      proStartedAt
    );

  }

  /*
   * =====================================================
   * DATABASE UPDATE
   * =====================================================
   */

  await prisma.shopStats.upsert({

    where: {
      shop,
    },

    update: {

      shopId:
        payload.app_subscription
          .admin_graphql_api_shop_id,

      isPro,

      /*
       * Only write proStartedAt when we have
       * a real Pro activation date.
       */

      ...(proStartedAt
        ? {
            proStartedAt,
          }
        : {}),

    },

    create: {

      shop,

      shopId:
        payload.app_subscription
          .admin_graphql_api_shop_id,

      isPro,

      limitHits: 0,

      proStartedAt:
        isPro
          ? new Date()
          : null,

    },

  });

  console.log(
    "DATABASE UPDATED:",
    shop,
    "=> isPro:",
    isPro,
    "=> proStartedAt:",
    proStartedAt
  );

  return new Response(null, {
    status: 200,
  });
};
