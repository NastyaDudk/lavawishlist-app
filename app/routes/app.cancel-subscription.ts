import type { ActionFunctionArgs } from "@remix-run/node";

import prisma from "../db.server";
import { authenticate } from "../shopify.server";

export async function action({
  request,
}: ActionFunctionArgs) {

  /*
   * =====================================
   * 1. Only POST is allowed
   * =====================================
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
      }
    );
  }


  /*
   * =====================================
   * 2. Authenticate Shopify Admin request
   * =====================================
   *
   * ONLY Shopify Admin API is used.
   * No Partner API.
   */

  const { admin, session } =
    await authenticate.admin(request);

  const shop = session.shop;

  console.log(
    "CANCEL SUBSCRIPTION SHOP:",
    shop
  );


  /*
   * =====================================
   * 3. Check our database
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


  /*
   * =====================================
   * 4. Get active subscription
   * =====================================
   *
   * Shopify Admin GraphQL API.
   */

  const subscriptionResponse =
    await admin.graphql(
      `#graphql
        query GetActiveSubscription {
          currentAppInstallation {
            activeSubscriptions {
              id
              name
              status
              createdAt
              currentPeriodEnd
              trialDays
            }
          }
        }
      `
    );


  /*
   * =====================================
   * 5. Parse Shopify response
   * =====================================
   */

  const subscriptionData =
    await subscriptionResponse.json();

  console.log(
    "ACTIVE SUBSCRIPTION:",
    JSON.stringify(
      subscriptionData,
      null,
      2
    )
  );


  /*
   * =====================================
   * 6. Extract active subscriptions
   * =====================================
   *
   * We intentionally do NOT access
   * subscriptionData.errors because
   * the Shopify Admin API response type
   * does not expose that property.
   */

  const activeSubscriptions =
    subscriptionData?.data
      ?.currentAppInstallation
      ?.activeSubscriptions ?? [];


  /*
   * =====================================
   * 7. No active subscription
   * =====================================
   */

  if (
    activeSubscriptions.length === 0
  ) {

    console.log(
      "NO ACTIVE SUBSCRIPTION FOUND"
    );

    await prisma.shopStats.update({
      where: {
        shop,
      },

      data: {
        isPro: false,

        cancellationScheduled:
          false,

        cancellationDate:
          null,
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
      }
    );
  }


  /*
   * =====================================
   * 8. Find Pro subscription
   * =====================================
   */

  const subscription =
    activeSubscriptions.find(
      (item: {
        id: string;
        name: string;
        status: string;
      }) =>
        item.name?.toLowerCase() ===
          "pro" &&
        item.status === "ACTIVE"
    );


  /*
   * =====================================
   * 9. Pro subscription not found
   * =====================================
   */

  if (!subscription) {

    console.error(
      "ACTIVE PRO SUBSCRIPTION NOT FOUND:",
      activeSubscriptions
    );

    return new Response(
      JSON.stringify({
        error:
          "Active Pro subscription not found.",
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


  console.log(
    "PRO SUBSCRIPTION ID:",
    subscription.id
  );

  console.log(
    "CURRENT PERIOD END:",
    subscription.currentPeriodEnd
  );


  /*
   * =====================================
   * 10. Cancel subscription
   * =====================================
   *
   * prorate: false
   *
   * IMPORTANT:
   *
   * The merchant does NOT receive
   * a prorated refund.
   *
   * The subscription is cancelled
   * for future billing.
   */

  const cancelResponse =
    await admin.graphql(
      `#graphql
        mutation AppSubscriptionCancel(
          $id: ID!
          $prorate: Boolean
        ) {
          appSubscriptionCancel(
            id: $id
            prorate: $prorate
          ) {
            appSubscription {
              id
              status
            }

            userErrors {
              field
              message
            }
          }
        }
      `,
      {
        variables: {
          id: subscription.id,

          prorate: false,
        },
      }
    );


  /*
   * =====================================
   * 11. Parse cancellation response
   * =====================================
   */

  const cancelData =
    await cancelResponse.json();

  console.log(
    "CANCEL RESPONSE:",
    JSON.stringify(
      cancelData,
      null,
      2
    )
  );


  /*
   * =====================================
   * 12. Shopify user errors
   * =====================================
   */

  const cancelPayload =
    cancelData?.data
      ?.appSubscriptionCancel;

  const userErrors =
    cancelPayload
      ?.userErrors ?? [];


  if (
    userErrors.length > 0
  ) {

    console.error(
      "CANCEL USER ERRORS:",
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
   * 13. Get cancellation date
   * =====================================
   *
   * currentPeriodEnd is the end of
   * the currently paid/trial period.
   */

  const cancellationDate =
    subscription.currentPeriodEnd ??
    null;


  /*
   * =====================================
   * 14. Update our database
   * =====================================
   *
   * IMPORTANT:
   *
   * isPro remains TRUE.
   *
   * The merchant keeps Pro access
   * until the current period ends.
   *
   * cancellationScheduled = true
   *
   * cancellationDate = period end
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
              cancellationDate
            )
          : null,
    },
  });


  /*
   * =====================================
   * 15. Log successful cancellation
   * =====================================
   */

  console.log(
    "SUBSCRIPTION CANCELLATION SCHEDULED:",
    {
      shop,

      subscriptionId:
        subscription.id,

      cancellationDate,
    }
  );


  /*
   * =====================================
   * 16. Return success
   * =====================================
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
    }
  );
}
