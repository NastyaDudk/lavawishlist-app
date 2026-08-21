import type { ActionFunctionArgs } from "@remix-run/node";

import prisma from "../db.server";
import { authenticate } from "../shopify.server";

const PARTNER_API_VERSION = "2026-07";

export async function action({
  request,
}: ActionFunctionArgs) {

  if (request.method !== "POST") {
    return new Response(
      JSON.stringify({
        error: "Method not allowed",
      }),
      {
        status: 405,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  /*
   * =====================================
   * 1. Authenticate Shopify Admin request
   * =====================================
   *
   * This is ONLY used to verify that the
   * request comes from the current merchant.
   *
   * We DO NOT use Admin API for billing.
   */

  const { session } =
    await authenticate.admin(request);

  const shop = session.shop;

  console.log(
    "CANCEL SUBSCRIPTION SHOP:",
    shop
  );


  /*
   * =====================================
   * 2. Get shop ID from our database
   * =====================================
   */

  const stats =
    await prisma.shopStats.findUnique({
      where: {
        shop,
      },
    });

  if (!stats) {
    return new Response(
      JSON.stringify({
        error:
          "Shop statistics not found.",
      }),
      {
        status: 404,
        headers: {
          "Content-Type":
            "application/json",
        },
      }
    );
  }

  const shopId = stats.shopId;

  if (!shopId) {
    return new Response(
      JSON.stringify({
        error:
          "Shop ID is missing. Please reinstall the app or wait for the subscription webhook.",
      }),
      {
        status: 400,
        headers: {
          "Content-Type":
            "application/json",
        },
      }
    );
  }


  /*
   * =====================================
   * 3. Partner API environment
   * =====================================
   */

  const orgId =
    process.env.SHOPIFY_PARTNER_ORG_ID;

  const accessToken =
  process.env.SHOPIFY_PARTNER_ACCESS_TOKEN;

if (!accessToken) {
  throw new Error(
    "SHOPIFY_PARTNER_ACCESS_TOKEN is missing"
  );
}

const partnerAccessToken: string =
  accessToken;

  const appId =
    process.env.SHOPIFY_APP_ID;


  if (!orgId) {
    throw new Error(
      "SHOPIFY_PARTNER_ORG_ID is missing"
    );
  }

  if (!accessToken) {
    throw new Error(
      "SHOPIFY_PARTNER_ACCESS_TOKEN is missing"
    );
  }

  if (!appId) {
    throw new Error(
      "SHOPIFY_APP_ID is missing"
    );
  }


  /*
   * =====================================
   * 4. Partner API helper
   * =====================================
   */

  async function partnerGraphQL(
    query: string,
    variables: Record<string, unknown>
  ) {

    const response = await fetch(
      `https://partners.shopify.com/${orgId}/api/${PARTNER_API_VERSION}/graphql.json`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",

          "X-Shopify-Access-Token":
          partnerAccessToken,
        },

        body: JSON.stringify({
          query,
          variables,
        }),
      }
    );

    const result =
      await response.json();

    console.log(
      "PARTNER API RESPONSE:",
      JSON.stringify(
        result,
        null,
        2
      )
    );

    if (!response.ok) {
      throw new Error(
        `Partner API request failed: ${response.status}`
      );
    }

    if (result.errors?.length) {
      throw new Error(
        result.errors
          .map(
            (error: {
              message: string;
            }) => error.message
          )
          .join(", ")
      );
    }

    return result;
  }


  /*
   * =====================================
   * 5. Get current subscription
   * =====================================
   */

  const subscriptionResult =
    await partnerGraphQL(
      `
        query ActiveSubscription(
          $appId: ID!
          $shopId: ID!
        ) {

          activeSubscription(
            appId: $appId
            shopId: $shopId
          ) {

            shop {
              id
              myshopifyDomain
            }

            billingPeriod

            cancelAtEndOfCycle

            trialEndsAt

            currentBillingCycle {
              startTime
              endTime
            }

            items {
              handle
              description

              price {
                __typename

                ... on FlatRatePrice {
                  amount
                  currency
                }
              }
            }
          }
        }
      `,
      {
        appId,
        shopId,
      }
    );


  const subscription =
    subscriptionResult
      ?.data
      ?.activeSubscription;


  /*
   * =====================================
   * 6. No active subscription
   * =====================================
   */

  if (!subscription) {

    await prisma.shopStats.update({
      where: {
        shop,
      },

      data: {
        isPro: false,
        cancellationScheduled: false,
        cancellationDate: null,
      },
    });

    return new Response(
      JSON.stringify({
        success: true,
        alreadyFree: true,
      }),
      {
        status: 200,
        headers: {
          "Content-Type":
            "application/json",
        },
      }
    );
  }


  /*
   * =====================================
   * 7. Already scheduled for cancellation
   * =====================================
   */

  if (
    subscription.cancelAtEndOfCycle
  ) {

    const cancellationDate =
      subscription
        ?.currentBillingCycle
        ?.endTime ?? null;

    await prisma.shopStats.update({
      where: {
        shop,
      },

      data: {
        isPro: true,

        cancellationScheduled:
          true,

        cancellationDate:
          cancellationDate
            ? new Date(cancellationDate)
            : null,
      },
    });

    return new Response(
      JSON.stringify({
        success: true,

        alreadyScheduled: true,

        cancellationDate,
      }),
      {
        status: 200,
        headers: {
          "Content-Type":
            "application/json",
        },
      }
    );
  }


  /*
   * =====================================
   * 8. Cancel subscription
   *
   * IMPORTANT:
   *
   * deferCancellation = true
   *
   * means:
   *
   * - subscription stays active
   * - Pro stays active
   * - current billing period continues
   * - next renewal is cancelled
   *
   * prorate = false
   *
   * means:
   *
   * - no refund for unused time
   * - customer keeps access until
   *   the end of the paid period
   */

  const cancelResult =
    await partnerGraphQL(
      `
        mutation CancelAppSubscription(
          $appId: ID!
          $deferCancellation: Boolean!
          $prorate: Boolean!
          $shopId: ID!
          $skipFinalUsageCharge: Boolean!
        ) {

          appSubscriptionCancel(
            appId: $appId
            deferCancellation: $deferCancellation
            prorate: $prorate
            shopId: $shopId
            skipFinalUsageCharge: $skipFinalUsageCharge
          ) {

            appSubscription {
              cancelAtEndOfCycle
              cancelledAt

              billingPeriod

              currentBillingCycle {
                startTime
                endTime
              }

              trialEndsAt
            }

            userErrors {
              field
              message
            }
          }
        }
      `,
      {
        appId,

        deferCancellation:
          true,

        prorate:
          false,

        shopId,

        skipFinalUsageCharge:
          false,
      }
    );


  /*
   * =====================================
   * 9. Shopify user errors
   * =====================================
   */

  const cancelData =
    cancelResult
      ?.data
      ?.appSubscriptionCancel;


  const userErrors =
    cancelData
      ?.userErrors ?? [];


  if (userErrors.length > 0) {

    console.error(
      "PARTNER CANCEL USER ERRORS:",
      userErrors
    );

    return new Response(
      JSON.stringify({
        error:
          userErrors
            .map(
              (error: {
                message: string;
              }) =>
                error.message
            )
            .join(", "),
      }),
      {
        status: 400,

        headers: {
          "Content-Type":
            "application/json",
        },
      }
    );
  }


  /*
   * =====================================
   * 10. Get cancellation date
   * =====================================
   */

  const cancellationDate =
    cancelData
      ?.appSubscription
      ?.currentBillingCycle
      ?.endTime ?? null;


  /*
   * =====================================
   * 11. Update our database
   *
   * IMPORTANT:
   *
   * isPro stays TRUE.
   *
   * The merchant is still Pro until
   * the paid billing period ends.
   * =====================================
   */

  await prisma.shopStats.update({
    where: {
      shop,
    },

    data: {

      isPro:
        true,

      cancellationScheduled:
        true,

      cancellationDate:
        cancellationDate
          ? new Date(
              cancellationDate
            )
          : null,
    },
  });


  console.log(
    "SUBSCRIPTION CANCELLATION SCHEDULED:",
    {
      shop,
      shopId,
      cancellationDate,
    }
  );


  /*
   * =====================================
   * 12. Return success
   * =====================================
   */

  return new Response(
    JSON.stringify({

      success:
        true,

      cancellationScheduled:
        true,

      cancellationDate,

      message:
        "Your subscription has been cancelled. Pro access will remain active until the end of your current billing period.",
    }),
    {
      status: 200,

      headers: {
        "Content-Type":
          "application/json",
      },
    }
  );
}
