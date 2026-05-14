import {
  Page,
  Card,
  Text,
  Button,
  BlockStack,
  InlineStack,
  Badge,
  List,
} from "@shopify/polaris";

import { authenticate } from "../shopify.server";
import { useFetcher, redirect } from "react-router";

export const loader = async ({ request }: { request: Request }) => {

  const { billing } = await authenticate.admin(request);

  const billingCheck = await billing.check({
    plans: ["pro"],
  });

  if (billingCheck.hasActivePayment) {
    return redirect("/app/dashboard");
  }

  return null;
};

export const action = async ({ request }: { request: Request }) => {

  const { billing } = await authenticate.admin(request);

  await billing.request({
    plan: "pro",
    isTest: true,
    returnUrl: `${process.env.SHOPIFY_APP_URL}/app/billing/return`,
  });

  return null;
};

export default function PricingPage() {

  const fetcher = useFetcher();

  return (
    <Page title="Choose your plan ❤️‍🔥">

      {/* HERO */}
      <div className="pricing-hero">

        <div className="hero-glow"></div>

        <BlockStack gap="300">

          <Badge tone="warning">
            ❤️‍🔥 Lava Favorites
          </Badge>

          <Text as="h1" variant="heading2xl">
            Turn visitors into loyal buyers
          </Text>

          <Text as="p" variant="bodyLg">
            Increase repeat purchases with beautiful wishlists customers love using.
          </Text>

        </BlockStack>

      </div>

      {/* CARDS */}
      <div className="pricing-grid">

        {/* FREE */}
        <div className="pricing-card">

          <Card>

            <div className="card-inner">

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

                <div className="features">

                  <List type="bullet">
                    <List.Item>Up to 50 wishlist saves</List.Item>
                    <List.Item>Theme App Embed</List.Item>
                    <List.Item>Mobile support</List.Item>
                    <List.Item>Beautiful lava UI ❤️‍🔥</List.Item>
                    <List.Item>Works instantly</List.Item>
                  </List>

                </div>

                <Button fullWidth disabled>
                  Current Plan
                </Button>

              </BlockStack>

            </div>

          </Card>

        </div>

        {/* MONTHLY */}
        <div className="pricing-card popular-card">

          <div className="popular-badge">
            MOST POPULAR
          </div>

          <Card>

            <div className="card-inner">

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

                  <Text as="p" tone="subdued">
                    7-day free trial included
                  </Text>

                </div>

                <div className="features">

                  <List type="bullet">
                    <List.Item>Unlimited wishlist saves</List.Item>
                    <List.Item>Priority support</List.Item>
                    <List.Item>Fast syncing</List.Item>
                    <List.Item>Works with all themes</List.Item>
                    <List.Item>Premium future features</List.Item>
                  </List>

                </div>

                <fetcher.Form method="post">

                  <Button
                    submit
                    fullWidth
                    variant="primary"
                    size="large"
                  >
                    Upgrade Monthly
                  </Button>

                </fetcher.Form>

              </BlockStack>

            </div>

          </Card>

        </div>

        {/* YEARLY */}
        <div className="pricing-card">

          <Card>

            <div className="card-inner">

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

                    <span className="old-price">
                      $119.88
                    </span>

                    <Text as="h3" variant="heading2xl">
                      $99
                    </Text>

                  </InlineStack>

                  <Text as="p" tone="subdued">
                    billed yearly
                  </Text>

                </div>

                <div className="features">

                  <List type="bullet">
                    <List.Item>Everything in Pro Monthly</List.Item>
                    <List.Item>Unlimited wishlist saves</List.Item>
                    <List.Item>Best value plan</List.Item>
                    <List.Item>Priority future updates</List.Item>
                    <List.Item>Lower yearly cost</List.Item>
                  </List>

                </div>

                <fetcher.Form method="post">

                  <Button
                    submit
                    fullWidth
                    variant="primary"
                    size="large"
                  >
                    Upgrade Yearly
                  </Button>

                </fetcher.Form>

              </BlockStack>

            </div>

          </Card>

        </div>

      </div>

      {/* FOOTER */}
      <div className="pricing-footer">

        <Text as="p" tone="subdued">
          Secure Shopify billing. Cancel anytime.
        </Text>

      </div>

      {/* STYLES */}
      <style>{`

        .pricing-hero {
          position:relative;
          overflow:hidden;

          padding:52px 40px;
          border-radius:28px;

          margin-bottom:32px;

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
              rgba(255,255,255,.16) 0%,
              transparent 70%
            );

          pointer-events:none;
        }

        .pricing-hero h1,
        .pricing-hero p {
          color:white;
          position:relative;
          z-index:2;
        }

        .pricing-grid {
          display:grid;
          grid-template-columns:repeat(3,1fr);
          gap:20px;

          align-items:stretch;
        }

        .pricing-card {
          position:relative;
          height:100%;
        }

        .pricing-card .Polaris-Card {
          height:100%;
        }

        .card-inner {
          height:100%;

          display:flex;
          flex-direction:column;
        }

        .features {
          flex:1;
        }

        .popular-card {
          transform:scale(1.02);
        }

        .popular-badge {
          position:absolute;

          top:-12px;
          left:50%;

          transform:translateX(-50%);

          z-index:20;

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
          opacity:.55;

          font-size:16px;
        }

        .pricing-footer {
          margin-top:28px;
          text-align:center;
        }

        @media (max-width: 900px) {

          .pricing-grid {
            grid-template-columns:1fr;
          }

          .popular-card {
            transform:none;
          }

          .pricing-hero {
            padding:36px 24px;
          }

        }

      `}</style>

    </Page>
  );
}
