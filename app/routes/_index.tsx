import {
  Page,
  Card,
  Text,
  BlockStack,
  List,
  InlineStack,
  Badge,
  Button,
  Link,
} from "@shopify/polaris";

import { useState } from "react";

export default function Index() {

  const [loading, setLoading] =
    useState(false);

  /**
   * SHOPIFY BILLING
   */

  const openUpgrade = async () => {

    try {

      setLoading(true);

      const res = await fetch(
        "/api/billing/upgrade",
        {
          method: "POST",
        },
      );

      const data = await res.json();

      if (data?.confirmationUrl) {

        window.top!.location.href =
          data.confirmationUrl;

      }

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);

    }

  };

  return (

    <Page title="❤️ Lava Favorites">

      <BlockStack gap="500">

        {/* HERO */}

        <div className="hero-card">

          <div className="hero-glow" />

          <BlockStack gap="500">

            <Badge tone="warning">
              ❤️‍🔥 Shopify Wishlist App
            </Badge>

            <Text
              as="h1"
              variant="heading2xl"
            >
              Turn visitors into buyers
            </Text>

            <Text
              as="p"
              variant="bodyLg"
            >
              Lava Favorites helps customers
              save products they love and
              return later to buy.
              Increase conversions,
              repeat visits,
              and customer loyalty.
            </Text>

            <InlineStack gap="300">

              <Button
                variant="primary"
                disabled
              >
                App Installed ✓
              </Button>

              <Button
                variant="secondary"
                onClick={openUpgrade}
                loading={loading}
              >
                Upgrade to Pro
              </Button>

            </InlineStack>

          </BlockStack>

        </div>

        {/* PLANS */}

        <Card>

          <BlockStack gap="500">

            <InlineStack align="space-between">

              <Text
                as="h2"
                variant="headingLg"
              >
                Choose your plan
              </Text>

              <Badge tone="success">
                3 Day Free Trial
              </Badge>

            </InlineStack>

            <div className="plans-grid">

              {/* FREE */}

              <div className="plan-card free-plan">

                <BlockStack gap="400">

                  <div>

                    <Text
                      as="h3"
                      variant="headingLg"
                    >
                      Free Plan
                    </Text>

                    <Text
                      as="p"
                      tone="subdued"
                    >
                      Perfect for testing
                    </Text>

                  </div>

                  <Text
                    as="h2"
                    variant="heading2xl"
                  >
                    $0
                  </Text>

                  <BlockStack gap="200">

                    {[
                      "Up to 50 wishlist saves",
                      "Theme App Embed",
                      "Mobile optimized",
                      "Works with all Shopify themes",
                      "Basic wishlist functionality",
                    ].map((item) => (

                      <div
                        key={item}
                        className="feature-row"
                      >

                        <span>🔥</span>

                        <Text as="p">
                          {item}
                        </Text>

                      </div>

                    ))}

                  </BlockStack>

                </BlockStack>

              </div>

              {/* PRO */}

              <div className="plan-card pro-plan">

                <div className="popular-badge">
                  MOST POPULAR
                </div>

                <BlockStack gap="400">

                  <div>

                    <Text
                      as="h3"
                      variant="headingLg"
                    >
                      Pro Plan
                    </Text>

                    <Text
                      as="p"
                      tone="subdued"
                    >
                      For growing stores
                    </Text>

                  </div>

                  <Text
                    as="h2"
                    variant="heading2xl"
                  >
                    $9.99/mo
                  </Text>

                  <BlockStack gap="200">

                    {[
                      "Unlimited wishlist saves",
                      "Priority performance",
                      "Unlimited customer usage",
                      "Premium lava UI ❤️‍🔥",
                      "Fast add to cart",
                      "Future Pro updates included",
                      "Priority support",
                    ].map((item) => (

                      <div
                        key={item}
                        className="feature-row"
                      >

                        <span>🚀</span>

                        <Text as="p">
                          {item}
                        </Text>

                      </div>

                    ))}

                  </BlockStack>

                  <Button
                    variant="primary"
                    size="large"
                    onClick={openUpgrade}
                    loading={loading}
                  >
                    Upgrade to Pro
                  </Button>

                </BlockStack>

              </div>

            </div>

          </BlockStack>

        </Card>

        {/* SCREENSHOTS */}

        <Card>

          <BlockStack gap="500">

            <Text
              as="h2"
              variant="headingLg"
            >
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
                  label:
                    "Wishlist on collection pages",
                },
                {
                  src: "/images/wishlist drawer.png",
                  label:
                    "Slide-out wishlist drawer",
                },
                {
                  src: "/images/icon.png",
                  label:
                    "Clean modern icons",
                },
                {
                  src: "/images/added.png",
                  label:
                    "Fast add to cart",
                },
                {
                  src: "/images/header before.png",
                  label:
                    "Fits every theme",
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

              <Text
                as="h2"
                variant="headingLg"
              >
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

            <Text
              as="p"
              tone="subdued"
            >
              Theme Editor → App Embeds →
              Enable Lava Favorites → Save
            </Text>

          </BlockStack>

        </Card>

        {/* QUICK SETUP */}

        <Card>

          <BlockStack gap="500">

            <Text
              as="h2"
              variant="headingLg"
            >
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
              Ready for unlimited wishlists? 🔥
            </Text>

            <Text
              as="p"
              variant="bodyLg"
            >
              Upgrade to Lava Favorites Pro
              and unlock unlimited wishlist saves.
            </Text>

            <InlineStack align="center">

              <Button
                variant="primary"
                size="large"
                onClick={openUpgrade}
                loading={loading}
              >
                Upgrade to Pro — $9.99/mo
              </Button>

            </InlineStack>

          </BlockStack>

        </div>

        {/* FOOTER */}

        <div className="footer">

          <InlineStack
            gap="500"
            align="center"
          >

            <Link
              url="/privacy"
              removeUnderline
            >
              Privacy Policy
            </Link>

            <Link
              url="/faq"
              removeUnderline
            >
              FAQ
            </Link>

            <Link
              url="/docs"
              removeUnderline
            >
              Documentation
            </Link>

          </InlineStack>

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

          .plans-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 24px;
          }

          .plan-card {
            position: relative;

            padding: 28px;
            border-radius: 22px;

            border: 1px solid #e1e3e5;
          }

          .free-plan {
            background: #f6f6f7;
          }

          .pro-plan {
            background:
              linear-gradient(
                135deg,
                rgba(255,81,47,.08),
                rgba(221,36,118,.08)
              );

            border: 2px solid #dd2476;
          }

          .popular-badge {
            position: absolute;
            top: -12px;
            right: 20px;

            padding: 6px 12px;
            border-radius: 999px;

            background: #dd2476;
            color: white;

            font-size: 12px;
            font-weight: 700;
          }

          .feature-row {
            display: flex;
            align-items: center;
            gap: 10px;
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

          .footer {
            padding: 12px 0 24px;
          }

          .footer a {
            color: #6d7175;
            font-weight: 600;
            transition: all .2s ease;
          }

          .footer a:hover {
            color: #dd2476;
          }

          @media (max-width: 768px) {

            .hero-card,
            .cta-card,
            .plan-card {
              padding: 28px;
            }

            .grid,
            .plans-grid {
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
