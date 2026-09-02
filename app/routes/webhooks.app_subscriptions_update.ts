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

        trialUsed: true,

      },

    });


  /*
   * =====================================================
   * EXISTING VALUES
   * =====================================================
   */

  const wasPro =
    existingStats?.isPro ?? false;


  let proStartedAt =
    existingStats?.proStartedAt ?? null;


  let trialUsed =
    existingStats?.trialUsed ?? false;


  /*
   * =====================================================
   * NEW PRO SUBSCRIPTION
   * =====================================================
   *
   * We only start the trial when the shop changes
   * from NOT PRO → PRO and the trial has never
   * been used before.
   */

  if (
    isPro &&
    !wasPro
  ) {

    /*
     * FIRST EVER PRO ACTIVATION
     */

    if (!trialUsed) {

      /*
       * Use Shopify's subscription creation date
       * instead of the webhook processing time.
       */

      proStartedAt =
        subscription?.created_at
          ? new Date(
              subscription.created_at
            )
          : new Date();


      trialUsed =
        true;


      console.log(
        "🔥 NEW PRO SUBSCRIPTION"
      );


      console.log(
        "🔥 3-DAY TRIAL STARTED AT:",
        proStartedAt
      );

    }


    /*
     * RETURNING PRO CUSTOMER
     */

    else {

      console.log(
        "💳 PRO REACTIVATED"
      );


      console.log(
        "🚫 TRIAL ALREADY USED"
      );


      console.log(
        "🚫 NO NEW 3-DAY TRIAL"
      );

    }

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
        subscription
          ?.admin_graphql_api_shop_id
          ?? undefined,


      isPro,


      trialUsed,


      /*
       * Only update proStartedAt when
       * a new trial was actually started.
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
        subscription
          ?.admin_graphql_api_shop_id
          ?? null,


      isPro,


      limitHits: 0,


      cancellationScheduled:
        false,


      cancellationDate:
        null,


      /*
       * Use Shopify's subscription creation
       * date for the initial trial.
       */

      proStartedAt:
        isPro
          ? (
              subscription?.created_at
                ? new Date(
                    subscription.created_at
                  )
                : new Date()
            )
          : null,


      /*
       * A newly created active Pro subscription
       * has already used its one-time trial.
       */

      trialUsed:
        isPro,

    },

  });


  /*
   * =====================================================
   * FINAL STATE
   * =====================================================
   */

  console.log(
    "DATABASE UPDATED:",
    shop
  );


  console.log(
    "=> isPro:",
    isPro
  );


  console.log(
    "=> proStartedAt:",
    proStartedAt
  );


  console.log(
    "=> trialUsed:",
    trialUsed
  );


  return new Response(null, {
    status: 200,
  });

};
