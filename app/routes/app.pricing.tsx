import {
  Page,
  Layout,
  Card,
  Text,
  Button,
  BlockStack,
  InlineStack,
  Badge,
  List,
} from "@shopify/polaris";

import { authenticate } from "../shopify.server";
import { useFetcher } from "react-router";

export const action = async ({ request }: { request: Request }) => {
  const { billing } = await authenticate.admin(request);

  const formData = await request.formData();
  const plan = formData.get("plan");

  if (plan === "monthly") {
    await billing.request({
      plan: "pro_monthly",
      isTest: true,
      returnUrl: `${process.env.SHOPIFY_APP_URL}/app/billing/return`,
    });
  }

  if (plan === "yearly") {
    await billing.request({
      plan: "pro_yearly",
      isTest: true,
      returnUrl: `${process.env.SHOPIFY_APP_URL}/app/billing/return`,
    });
  }

  return null;
};

export default function PricingPage() {
  const fetcher = useFetcher();

  return (
    <Page title="Choose your plan ❤️‍🔥">

      <div className="pricing-hero">

        <div className="hero-glow"></div>

        <Text as="h1" variant="heading2xl">
          ❤️‍🔥 Upgrade Lava Favorites
        </Text>

        <Text as="p" variant="bodyLg" tone="subdued">
          Turn more visitors into returning buyers with unlimited wishlist saves.
        </Text>

      </div>

      <Layout>

        {/* FREE */}
        <Layout.Section variant="oneThird">

          <Card>
            <BlockStack gap="500">

              <InlineStack align="space-between">
                <Text as="h2" variant="headingLg">
                  Free
                </Text>

                <Badge tone="info">
                  Starter
                </Badge>
              </InlineStack>

              <div>
                <Text as="h3" variant="heading2xl">
                  $0
                </Text>

                <Text as="p" tone="subdued">
                  forever
                </Text>
              </div>

              <List type="bullet">
                <List.Item>Up to 50 wishlist saves</List.Item>
                <List.Item>Theme App Embed</List.Item>
                <List.Item>Mobile support</List.Item>
                <List.Item>Beautiful lava heart UI</List.Item>
              </List>

              <Button fullWidth disabled>
                Current plan
              </Button>

            </BlockStack>
          </Card>

        </Layout.Section>

        {/* MONTHLY */}
        <Layout.Section variant="oneThird">

          <div className="plan-popular">

            <div className="popular-badge">
              MOST POPULAR
            </div>

            <Card>
              <BlockStack gap="500">

                <InlineStack align="space-between">
                  <Text as="h2" variant="headingLg">
                    Pro Monthly
                  </Text>

                  <Badge tone="success">
                    Unlimited
                  </Badge>
                </InlineStack>

                <div>
                  <InlineStack gap="100" blockAlign="end">

                    <Text as="h3" variant="heading2xl">
                      $9.99
                    </Text>

                    <Text as="p" tone="subdued">
                      / month
                    </Text>

                  </InlineStack>
                </div>

                <List type="bullet">
                  <List.Item>Unlimited wishlist saves</List.Item>
                  <List.Item>Priority support</List.Item>
                  <List.Item>Fast customer syncing</List.Item>
                  <List.Item>Works with all Shopify themes</List.Item>
                  <List.Item>Future premium features</List.Item>
                </List>

                <fetcher.Form method="post">

                  <input
                    type="hidden"
                    name="plan"
                    value="monthly"
                  />

                  <Button
                    submit
                    fullWidth
                    variant="primary"
                  >
                    Upgrade Monthly
                  </Button>

                </fetcher.Form>

              </BlockStack>
            </Card>

          </div>

        </Layout.Section>

        {/* YEARLY */}
        <Layout.Section variant="oneThird">

          <Card>
            <BlockStack gap="500">

              <InlineStack align="space-between">
                <Text as="h2" variant="headingLg">
                  Pro Yearly
                </Text>

                <Badge tone="attention">
                  Save 17%
                </Badge>
              </InlineStack>

              <div>

                <InlineStack gap="200" blockAlign="center">

                  <Text
                    as="span"
                    variant="bodyMd"
                    tone="subdued"
                  >
                    <span className="old-price">
                      $119.88
                    </span>
                  </Text>

                  <Text as="h3" variant="heading2xl">
                    $99
                  </Text>

                </InlineStack>

                <Text as="p" tone="subdued">
                  per year
                </Text>

              </div>

              <List type="bullet">
                <List.Item>Everything in Pro Monthly</List.Item>
                <List.Item>Unlimited wishlist saves</List.Item>
                <List.Item>Best value plan</List.Item>
                <List.Item>Priority future updates</List.Item>
                <List.Item>Lower yearly cost</List.Item>
              </List>

              <fetcher.Form method="post">

                <input
                  type="hidden"
                  name="plan"
                  value="yearly"
                />

                <Button
                  submit
                  fullWidth
                  variant="primary"
                >
                  Upgrade Yearly
                </Button>

              </fetcher.Form>

            </BlockStack>
          </Card>

        </Layout.Section>

      </Layout>

      <div className="pricing-footer">

        <Text as="p" tone="subdued">
          Secure Shopify billing. Cancel anytime.
        </Text>

      </div>

      <style>{`

        .pricing-hero {
          position:relative;
          overflow:hidden;
          padding:48px 32px;
          border-radius:28px;
          margin-bottom:28px;

          background:
            linear-gradient(
              135deg,
              #ff512f 0%,
              #dd2476 100%
            );

          color:white;
        }

        .hero-glow {
          position:absolute;
          inset:-100px;
          background:
            radial-gradient(
              circle,
              rgba(255,255,255,.18) 0%,
              transparent 70%
            );

          pointer-events:none;
        }

        .pricing-hero h1,
        .pricing-hero p {
          position:relative;
          z-index:2;
          color:white;
        }

        .plan-popular {
          position:relative;
        }

        .popular-badge {
          position:absolute;
          top:-12px;
          left:50%;
          transform:translateX(-50%);
          z-index:10;

          background:#111;
          color:white;

          padding:6px 14px;
          border-radius:999px;

          font-size:12px;
          font-weight:700;
          letter-spacing:.08em;
        }

        .old-price {
          text-decoration:line-through;
          opacity:.6;
        }

        .pricing-footer {
          margin-top:28px;
          text-align:center;
        }

        @media (max-width: 768px) {

          .pricing-hero {
            padding:32px 20px;
          }

        }

      `}</style>

    </Page>
  );
}
