import { redirect } from "@remix-run/node";
import type { ActionFunctionArgs } from "@remix-run/node";

import prisma from "../db.server";
import { authenticate } from "../shopify.server";

export async function action({
  request,
}: ActionFunctionArgs) {
  const { admin, session } =
    await authenticate.admin(request);

  // Получаем активную подписку
  const response = await admin.graphql(`
    query {
      currentAppInstallation {
        activeSubscriptions {
          id
          name
          status
          lineItems {
            plan {
              pricingDetails {
                __typename
              }
            }
          }
        }
      }
    }
  `);

  const data = await response.json();

  const subscription =
    data.data.currentAppInstallation.activeSubscriptions?.[0];

  if (!subscription) {
    return redirect("/app");
  }

  // Отмена подписки
  const cancel = await admin.graphql(
    `
    mutation CancelSubscription($id: ID!) {
      appSubscriptionCancel(
        id: $id
        prorate: true
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
      },
    },
  );

  const cancelData =
    await cancel.json();

  if (
    cancelData.data.appSubscriptionCancel.userErrors.length
  ) {
    throw new Error(
      cancelData.data.appSubscriptionCancel.userErrors[0].message,
    );
  }

  await prisma.shopStats.update({
    where: {
      shop: session.shop,
    },
    data: {
      isPro: false,
    },
  });

  return redirect("/app");
}
