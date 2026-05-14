import {
  Page,
  Card,
  Text,
  BlockStack,
  List,
  InlineStack,
  Badge,
  Button,
} from "@shopify/polaris";

import { redirect, Link } from "react-router";
import { authenticate } from "../shopify.server";

export const loader = async ({
  request,
}: {
  request: Request;
}) => {

  const { billing } =
    await authenticate.admin(request);

  const billingCheck =
    await billing.check({
      plans: ["pro"],
    });

  const isPro =
    billingCheck.hasActivePayment;

  // TEMP TEST LIMIT
  const saves = 55;

  if (!isPro && saves >= 50) {
    return redirect("/app/pricing");
  }

  return null;
};

export default function Index() {

  return (
    <Page title="❤️ Lava Favorites">

      <BlockStack gap="500">

        {/* HERO */}
        <div className="hero-card">

          <div className="hero-glow"></div>

          <BlockStack gap="400">

            <Badge tone="warning">
              ❤️‍🔥 Shopify Wishlist App
            </Badge>

            <Text as="h1" variant="heading2xl">
              Turn visitors into buyers
            </Text>

            <Text as="p" variant="bodyLg">
              Lava Favorites helps customers save
              products they love and return later
              to buy. Increase conversions,
              repeat visits, and customer loyalty.
            </Text>

            <InlineStack gap="300">

              <Link to="/app/pricing">
                <Button variant="primary">
                  Upgrade to Pro
                </Button>
              </Link>

              <Button disabled>
                Installed ✓
              </Button>

            </InlineStack>

          </BlockStack>

        </div>

        {/* BENEFITS */}
        <Card>

          <BlockStack gap="500">

            <InlineStack align="space-between">

              <Text as="h2" variant="headingLg">
                Why stores love Lava Favorites
              </Text>

              <Badge tone="success">
                Fast Setup
              </Badge>

            </InlineStack>

            <div className="benefits-grid">

              {[
                "Increase repeat purchases",
                "Recover undecided shoppers",
                "Boost customer loyalty",
                "Beautiful lava heart UI ❤️‍🔥",
                "Works with every Shopify theme",
                "Mobile optimized experience",
              ].map((item) => (

                <div
                  className="benefit-item"
                  key={item}
                >

                  <span className="benefit-icon">
                    🔥
                  </span>

                  <Text as="p">
                    {item}
                  </Text>

                </div>

              ))}

            </div>

          </BlockStack>

        </Card>

        {/* SCREENSHOTS */}
        <Card>

          <BlockStack gap="500">

            <Text as="h2" variant="headingLg">
              Beautiful inside your store
            </Text>

            <div className="grid">

              {[
                {
                  src: "/images/header.png",
                  label: "Animated lava heart",
                },
                {
                  src: "/images/catalog.png",
                  label: "Wishlist on collection pages",
                },
                {
                  src: "/images/wishlist drawer.png",
                  label: "Slide-out wishlist drawer",
                },
                {
                  src: "/images/icon.png",
                  label: "Clean modern icons",
                },
                {
                  src: "/images/added.png",
                  label: "Fast add to cart",
                },
                {
                  src: "/images/header before.png",
                  label: "Fits every theme",
                },
              ].map((img) => (

                <div
                  key={img.src}
                  className="card-preview"
                >

                  <div className="img-box">

                    <img
                src={img.src}
                      alt={img.label}
                    />

                  </div>

                  <Text
                    as="p"
                    tone="subdued"
                  >
                    {img.label}
                  </Text>

                </div>

              ))}

            </div>

          </BlockStack>

        </Card>

        {/* VIDEO */}
        <Card>

          <BlockStack gap="400">

            <InlineStack align="space-between">

              <Text as="h2" variant="headingLg">
                Setup in under 1 minute 🎬
              </Text>

              <Badge tone="attention">
                No Coding
              </Badge>

            </InlineStack>

            <div className="video-box">

              <img
                src="/images/setup.gif"
                alt="Wishlist setup tutorial"
              />

            </div>

            <Text as="p" tone="subdued">
              Theme Editor → App Embeds →
              Enable Lava Favorites → Save
            </Text>

          </BlockStack>

        </Card>

        {/* QUICK SETUP */}
        <Card>

          <BlockStack gap="500">

            <Text as="h2" variant="headingLg">
              Quick setup
            </Text>

            <List type="number">

              <List.Item>
                Open Shopify Theme Customize
              </List.Item>

              <List.Item>
                Enable Lava Favorites App Embed
              </List.Item>

              <List.Item>
                Save changes
              </List.Item>

              <List.Item>
                Customers can now save favorites ❤️
              </List.Item>

            </List>

            <div className="setup-banner">

              <Text as="p">
                ⚡ Average setup time:
                less than 60 seconds
              </Text>

            </div>

          </BlockStack>

        </Card>

        {/* CTA */}
        <div className="cta-card">

          <BlockStack gap="400">

            <Text
              as="h2"
              variant="heading2xl"
            >
              Ready to grow sales? 🔥
            </Text>

            <Text
              as="p"
              variant="bodyLg"
            >
              Let customers save products
              they love and return later
              to complete their purchase.
            </Text>

            <Link to="/app/pricing">

              <Button
                size="large"
                variant="primary"
              >
                View Pricing Plans
              </Button>

            </Link>

          </BlockStack>

        </div>

        {/* STYLES */}
        <style>{`

          .hero-card {
            position: relative;
            overflow: hidden;

            padding: 48px;
            border-radius: 28px;

            background:
              linear-gradient(
                135deg,
                #ff512f 0%,
                #dd2476 100%
              );

            color: white;
          }

          .hero-glow {
            position: absolute;
            inset: -100px;

            background:
              radial-gradient(
                circle,
                rgba(255,255,255,.18) 0%,
                transparent 70%
              );

            pointer-events: none;
          }

          .hero-card h1,
          .hero-card p {
            color: white;
            position: relative;
            z-index: 2;
          }

          .benefits-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
          }

          .benefit-item {
            display: flex;
            align-items: center;
            gap: 12px;

            padding: 16px;
            border-radius: 14px;

            background: #f6f6f7;
          }

          .benefit-icon {
            font-size: 20px;
          }

          .grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 18px;
          }

          .card-preview {
    transition: all .25s ease;
          }

          .card-preview:hover {
            transform: translateY(-4px);
          }

          .img-box {
            width: 100%;
            height: 220px;

            overflow: hidden;
            border-radius: 18px;

            background: #f6f6f7;
            margin-bottom: 10px;
          }

          .img-box img {
            width: 100%;
            height: 100%;

            object-fit: cover;
            object-position: center;

            display: block;
          }

          .video-box {
            overflow: hidden;
            border-radius: 18px;
            background: #f6f6f7;
          }

          .video-box img {
            width: 100%;
            display: block;
          }

          .setup-banner {
            padding: 16px;
            border-radius: 14px;

            background:
              linear-gradient(
                135deg,
                rgba(255,81,47,.08),
                rgba(221,36,118,.08)
              );
          }

          .cta-card {
            padding: 48px;
            border-radius: 28px;

            text-align: center;

            background:
              linear-gradient(
                135deg,
                #ff512f 0%,
                #dd2476 100%
              );

            color: white;
          }

          .cta-card h2,
          .cta-card p {
            color: white;
          }

          @media (max-width: 768px) {

            .hero-card,
            .cta-card {
              padding: 28px;
            }

            .grid,
            .benefits-grid {
              grid-template-columns: 1fr;
            }

            .img-box {
              height: 240px;
            }

          }

        `}</style>

      </BlockStack>

    </Page>
  );
}
