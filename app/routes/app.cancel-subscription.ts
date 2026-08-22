import type { ActionFunctionArgs } from "@remix-run/node";

import prisma from "../db.server";
import { authenticate } from "../shopify.server";

const PARTNER_API_VERSION = "2026-07";

type GraphQLError = {
  message?: string;
};

type PartnerResponse = {
  data?: {
    activeSubscription?: {
      shop?: {
        id?: string;
        myshopifyDomain?: string;
      };
      billingPeriod?: string;
      cancelAtEndOfCycle?: boolean;
      trialEndsAt?: string | null;
      currentBillingCycle?: {
        startTime?: string;
        endTime?: string;
      } | null;
    } | null;

    appSubscriptionCancel?: {
      appSubscription?: {
        cancelAtEndOfCycle?: boolean;
        cancelledAt?: string | null;
        billingPeriod?: string;
        currentBillingCycle?: {
          startTime?: string;
          endTime?: string;
        } | null;
        trialEndsAt?: string | null;
      } | null;

      userErrors?: Array<{
        field?: string[] | null;
        message?: string;
      }>;
    };
  };

  errors?: GraphQLError[];
};

/*
 * =====================================================
 * PARTNER API HELPER
 * =====================================================
 */

async function partnerGraphQL(
  orgId: string,
  accessToken: string,
  query: string,
  variables: Record<string, unknown>,
): Promise<PartnerResponse> {
  const response = await fetch(
    `https://partners.shopify.com/${orgId}/api/${PARTNER_API_VERSION}/graphql.json`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": accessToken,
      },

      body: JSON.stringify({
        query,
        variables,
      }),
    },
  );

  const result =
    (await response.json()) as PartnerResponse;

  console.log(
    "PARTNER API RESPONSE:",
    JSON.stringify(result, null, 2),
  );

  if (!response.ok) {
    throw new Error(
      `Partner API request failed: ${response.status}`,
    );
  }

  if (result.errors && result.errors.length > 0) {
    throw new Error(
      result.errors
        .map(
          (error) =>
            error.message ??
            "Unknown GraphQL error",
        )
        .join(", "),
    );
  }

  return result;
}

/*
 * =====================================================
 * ACTION
 * =====================================================
 */

export async function action({
  request,
}: ActionFunctionArgs) {
  /*
   * ===================================================
   * 1. ONLY POST
   * ===================================================
   */

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
      },
    );
  }

  try {
    /*
     * =================================================
     * 2. AUTHENTICATE SHOPIFY ADMIN REQUEST
     * =================================================
     */

    const { session } =
      await authenticate.admin(request);

    const shop = session.shop;

    console.log(
      "======================================",
    );
    console.log(
      "CANCEL SUBSCRIPTION REQUEST",
    );
    console.log("SHOP:", shop);
    console.log(
      "======================================",
    );

    /*
     * =================================================
     * 3. GET SHOP FROM DATABASE
     * =================================================
     */

    const stats =
      await prisma.shopStats.findUnique({
        where: {
          shop,
        },
      });

    console.log(
      "SHOP STATS:",
      stats,
    );

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
        },
      );
    }

    /*
     * =================================================
     * 4. SHOP ID
     * =================================================
     */

    const shopId: string =
      stats.shopId ?? "";

    console.log(
      "SHOP ID:",
      shopId,
    );

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
        },
      );
    }

    /*
     * =================================================
     * 5. PARTNER API CREDENTIALS
     * =================================================
     */

    const orgId: string =
      process.env.SHOPIFY_PARTNER_ORG_ID ?? "";

    const partnerAccessToken: string =
      process.env.SHOPIFY_PARTNER_ACCESS_TOKEN ?? "";

    const appId: string =
      process.env.SHOPIFY_APP_ID ?? "";

    if (!orgId) {
      return new Response(
        JSON.stringify({
          error:
            "SHOPIFY_PARTNER_ORG_ID is missing.",
        }),
        {
          status: 500,
          headers: {
            "Content-Type":
              "application/json",
          },
        },
      );
    }

    if (!partnerAccessToken) {
      return new Response(
        JSON.stringify({
          error:
            "SHOPIFY_PARTNER_ACCESS_TOKEN is missing.",
        }),
        {
          status: 500,
          headers: {
            "Content-Type":
              "application/json",
          },
        },
      );
    }

    if (!appId) {
      return new Response(
        JSON.stringify({
          error:
            "SHOPIFY_APP_ID is missing.",
        }),
        {
          status: 500,
          headers: {
            "Content-Type":
              "application/json",
          },
        },
      );
    }

    /*
     * =================================================
     * 6. GET ACTIVE SUBSCRIPTION
     * =================================================
     */

    console.log(
      "GETTING ACTIVE SUBSCRIPTION...",
    );

    const subscriptionResult =
      await partnerGraphQL(
        orgId,
        partnerAccessToken,
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
            }
          }
        `,
        {
          appId,
          shopId,
        },
      );

    const subscription =
      subscriptionResult.data
        ?.activeSubscription ?? null;

    console.log(
      "ACTIVE SUBSCRIPTION:",
      JSON.stringify(
        subscription,
        null,
        2,
      ),
    );

    /*
     * =================================================
     * 7. NO ACTIVE SUBSCRIPTION
     * =================================================
     */

    if (!subscription) {
      console.log(
        "NO ACTIVE SUBSCRIPTION FOUND",
      );

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
          message:
            "No active subscription found.",
        }),
        {
          status: 200,
          headers: {
            "Content-Type":
              "application/json",
          },
        },
      );
    }

    /*
     * =================================================
     * 8. ALREADY SCHEDULED
     * =================================================
     */

    if (
      subscription.cancelAtEndOfCycle
    ) {
      const cancellationDate =
        subscription
          .currentBillingCycle
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
              ? new Date(
                  cancellationDate,
                )
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
        },
      );
    }

    /*
     * =================================================
     * 9. CANCEL SUBSCRIPTION
     * =================================================
     *
     * deferCancellation = true
     *
     * Pro remains active until the end
     * of the current billing cycle.
     */

    console.log(
      "CANCELLING SUBSCRIPTION...",
    );

    const cancelResult =
      await partnerGraphQL(
        orgId,
        partnerAccessToken,
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
          shopId,
          deferCancellation: true,
          prorate: false,
          skipFinalUsageCharge: false,
        },
      );

    console.log(
      "CANCEL RESULT:",
      JSON.stringify(
        cancelResult,
        null,
        2,
      ),
    );

    /*
     * =================================================
     * 10. CANCEL PAYLOAD
     * =================================================
     */

    const cancelPayload =
      cancelResult.data
        ?.appSubscriptionCancel;

    const userErrors =
      cancelPayload?.userErrors ?? [];

    /*
     * =================================================
     * 11. SHOPIFY ERRORS
     * =================================================
     */

    if (userErrors.length > 0) {
      console.error(
        "PARTNER API USER ERRORS:",
        userErrors,
      );

      return new Response(
        JSON.stringify({
          error:
            userErrors
              .map(
                (error) =>
                  error.message ??
                  "Unknown Shopify error",
              )
              .join(", "),
        }),
        {
          status: 400,
          headers: {
            "Content-Type":
              "application/json",
          },
        },
      );
    }

    /*
     * =================================================
     * 12. CHECK RESULT
     * =================================================
     */

    const cancelledSubscription =
      cancelPayload
        ?.appSubscription ?? null;

    if (
      !cancelledSubscription
    ) {
      return new Response(
        JSON.stringify({
          error:
            "Shopify did not return the cancelled subscription.",
        }),
        {
          status: 500,
          headers: {
            "Content-Type":
              "application/json",
          },
        },
      );
    }

    /*
     * =================================================
     * 13. CHECK DEFERRED CANCELLATION
     * =================================================
     */

    if (
      !cancelledSubscription
        .cancelAtEndOfCycle
    ) {
      return new Response(
        JSON.stringify({
          error:
            "Shopify did not schedule the subscription cancellation.",
        }),
        {
          status: 500,
          headers: {
            "Content-Type":
              "application/json",
          },
        },
      );
    }

    /*
     * =================================================
     * 14. CANCELLATION DATE
     * =================================================
     */

    const cancellationDate =
      cancelledSubscription
        .currentBillingCycle
        ?.endTime ??
      subscription
        .currentBillingCycle
        ?.endTime ??
      null;

    console.log(
      "CANCELLATION DATE:",
      cancellationDate,
    );

    /*
     * =================================================
     * 15. UPDATE DATABASE
     * =================================================
     */

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
            ? new Date(
                cancellationDate,
              )
            : null,
      },
    });

    console.log(
      "DATABASE UPDATED:",
      {
        shop,
        shopId,
        isPro: true,
        cancellationScheduled:
          true,
        cancellationDate,
      },
    );

    /*
     * =================================================
     * 16. SUCCESS
     * =================================================
     */

    return new Response(
      JSON.stringify({
        success: true,

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
      },
    );
  } catch (error) {
    /*
     * =================================================
     * 17. UNEXPECTED ERROR
     * =================================================
     */

    console.error(
      "CANCEL SUBSCRIPTION ERROR:",
      error,
    );

    return new Response(
      JSON.stringify({
        error:
          error instanceof Error
            ? error.message
            : "Unknown cancellation error.",
      }),
      {
        status: 500,

        headers: {
          "Content-Type":
            "application/json",
        },
      },
    );
  }
}
