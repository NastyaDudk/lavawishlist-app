const PARTNER_API_VERSION = "2026-07";

const PARTNER_ORG_ID =
  process.env.SHOPIFY_PARTNER_ORG_ID;

const PARTNER_ACCESS_TOKEN =
  process.env.SHOPIFY_PARTNER_ACCESS_TOKEN;

const APP_ID =
  process.env.SHOPIFY_APP_ID;

export async function getPartnerSubscription(
  shopDomain: string,
) {
  if (
    !PARTNER_ORG_ID ||
    !PARTNER_ACCESS_TOKEN ||
    !APP_ID
  ) {
    throw new Error(
      "Partner API environment variables are missing",
    );
  }

  const shopResponse = await fetch(
    `https://partners.shopify.com/${PARTNER_ORG_ID}/api/${PARTNER_API_VERSION}/graphql.json`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token":
          PARTNER_ACCESS_TOKEN,
      },

      body: JSON.stringify({
        query: `
          query ActiveSubscription(
            $appId: ID!
            $shopId: ID!
          ) {
            activeSubscription(
              appId: $appId
              shopId: $shopId
            ) {
              billingPeriod
              cancelAtEndOfCycle
              trialEndsAt

              items {
                handle
                description

                price {
                  ... on FlatRatePrice {
                    amount
                    currency
                  }
                }
              }

              shop {
                id
                myshopifyDomain
              }
            }
          }
        `,

        variables: {
          appId: APP_ID,
          shopId: `gid://shopify/Shop/${shopDomain}`,
        },
      }),
    },
  );

  const result = await shopResponse.json();

  console.log(
    "PARTNER BILLING RESPONSE:",
    JSON.stringify(result, null, 2),
  );

  if (!shopResponse.ok) {
    throw new Error(
      `Partner API HTTP ${shopResponse.status}`,
    );
  }

  if (result.errors) {
    throw new Error(
      JSON.stringify(result.errors),
    );
  }

  return result.data?.activeSubscription ?? null;
}
