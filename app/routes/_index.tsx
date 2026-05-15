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

export default function Index() {

  return (

    <Page title="❤️‍🔥 Lava Wishlist">

      <BlockStack gap="500">

        {/* HERO */}

        <div className="hero-card">

          <div className="hero-overlay" />

          <BlockStack gap="500">

            <InlineStack
              align="space-between"
            >

             <div className="hero-badge">
  ❤️‍🔥 Shopify LavaWishlist App
</div>

              <div className="hero-pill">
                Free Plan Included
              </div>

            </InlineStack>

            <BlockStack gap="300">

              <Text
                as="h1"
                variant="heading2xl"
              >
                Turn visitors into loyal buyers
              </Text>

              <Text
                as="p"
                variant="bodyLg"
              >
                Beautiful wishlist experience
                for Shopify stores.
                Let customers save products
                they love and return later
                to buy.
              </Text>

            </BlockStack>

            <InlineStack gap="300">

              <Button
                variant="primary"
                disabled
              >
                App Installed ✓
              </Button>

            </InlineStack>

            <div className="hero-grid">

              <div className="hero-box">

                <Text
                  as="h3"
                  variant="headingLg"
                >
                  🤍
                </Text>

                <Text as="p">
                  Beautiful UI
                </Text>

              </div>

              <div className="hero-box">

                <Text
                  as="h3"
                  variant="headingLg"
                >
                  Shopify
                </Text>

                <Text as="p">
                  Theme compatible
                </Text>

              </div>

              <div className="hero-box">

                <Text
                  as="h3"
                  variant="headingLg"
                >
                  60 sec
                </Text>

                <Text as="p">
                  Setup time
                </Text>

              </div>

            </div>

          </BlockStack>

        </div>

        {/* PLANS */}

        <Card>

          <BlockStack gap="500">

            <InlineStack
              align="space-between"
            >

              <Text
                as="h2"
                variant="headingLg"
              >
                Plans
              </Text>

              <div className="free-info">
                Free includes
                50 saves/month
              </div>

            </InlineStack>

            <div className="plans-grid">

              {/* FREE */}

              <div className="plan-card free-plan current-plan">

                <div className="current-badge">
                  CURRENT PLAN
                </div>

                <BlockStack gap="400">

                  <div>

                    <InlineStack align="space-between">

                      <Text
                        as="h3"
                        variant="headingLg"
                      >
                        Free Plan
                      </Text>

                      <Badge tone="success">
                        Active
                      </Badge>

                    </InlineStack>

                    <Text
                      as="p"
                      tone="subdued"
                    >
                      Perfect for small stores
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

                  <div className="free-plan-note">

                    <Text as="p">
                      You&apos;re currently using
                      the free plan
                    </Text>

                  </div>

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

                  <Text
                    as="p"
                    tone="subdued"
                  >
                    Includes 3-day free trial
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

               <Link
  url="/app/pricing"
  removeUnderline
>

  <Button
    variant="primary"
    size="large"
    fullWidth
  >
    Start Free Trial
  </Button>

</Link>

<div className="pro-note">

  <Text
    as="p"
    tone="subdued"
  >
    3-day free trial included
  </Text>

</div>

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
                  src:
                    "/images/wishlist drawer.png",
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
                  src:
                    "/images/header before.png",
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

            <InlineStack
              align="space-between"
            >

              <Text
                as="h2"
                variant="headingLg"
              >
                Setup in under
                1 minute 🎬
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
              Theme Editor →
              App Embeds →
              Enable Lava Favorites →
              Save
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
                Open Shopify
                Theme Customize
              </List.Item>

              <List.Item>
                Enable Lava Favorites
                App Embed
              </List.Item>

              <List.Item>
                Save changes
              </List.Item>

              <List.Item>
                Customers can now
                save favorites ❤️
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
              Ready for unlimited
              wishlists? 🔥
            </Text>

            <Text
              as="p"
              variant="bodyLg"
            >
              Upgrade to Lava Favorites
              Pro anytime from Shopify billing.
            </Text>

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
.hero-badge {
  display: inline-flex;
  align-items: center;

  width: fit-content;

  padding: 12px 18px;

  border-radius: 999px;

  background: rgba(255,255,255,.18);

  color: white;

  font-size: 16px;
  font-weight: 700;

  backdrop-filter: blur(12px);

  box-shadow:
    0 4px 18px rgba(0,0,0,.12);
}

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

          .hero-overlay {
            position: absolute;
            inset: 0;

            pointer-events: none;

            background:
              radial-gradient(
                circle at top right,
                rgba(255,255,255,.16),
                transparent 40%
              );
          }

          .hero-card h1,
          .hero-card p {
            color: white;
            position: relative;
            z-index: 2;
          }

          .hero-pill {
            padding: 10px 16px;

            border-radius: 999px;

            background:
              rgba(255,255,255,.18);

            color: white;

            font-size: 13px;
            font-weight: 700;

            backdrop-filter: blur(10px);
          }

          .hero-grid {
            display: grid;

            grid-template-columns:
              repeat(3,1fr);

            gap: 18px;
          }

          .hero-box {
            padding: 22px;

            border-radius: 22px;

            background:
              rgba(255,255,255,.12);

            backdrop-filter: blur(12px);
          }

          .hero-box h3,
          .hero-box p {
            color: white;
          }

          .free-info {
            padding: 8px 14px;

            border-radius: 999px;

            background: #eef4ff;

            color: #4f6ef7;

            font-size: 13px;
            font-weight: 700;
          }

          .plans-grid {
            display: grid;

            grid-template-columns:
              1fr 1fr;

            gap: 24px;
          }

          .plan-card {
            position: relative;

            padding: 28px;

            border-radius: 22px;

            border:
              1px solid #e1e3e5;
          }

          .free-plan {
            background: #f6f6f7;
          }

          .current-plan {
            border: 2px solid #16a34a;

            background:
              linear-gradient(
                135deg,
                rgba(22,163,74,.06),
                rgba(22,163,74,.02)
              );
          }

          .current-badge {
            position: absolute;

            top: -12px;
            left: 20px;

            padding: 6px 12px;

            border-radius: 999px;

            background: #16a34a;

            color: white;

            font-size: 12px;
            font-weight: 700;
          }

          .free-plan-note {
            padding: 14px;

            border-radius: 14px;

            background:
              rgba(22,163,74,.08);

            text-align: center;
          }

          .pro-plan {
            background:
              linear-gradient(
                135deg,
                rgba(255,81,47,.08),
                rgba(221,36,118,.08)
              );

            border:
              2px solid #dd2476;
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

          .pro-note {
            text-align: center;
            opacity: .7;
          }

          .grid {
            display: grid;

            grid-template-columns:
              1fr 1fr;

            gap: 18px;
          }

          .card-preview {
            transition:
              transform .25s ease;
          }

          .card-preview:hover {
            transform:
              translateY(-4px);
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
            padding:
              12px 0 24px;
          }

          @media (
            max-width: 768px
          ) {

            .hero-card,
            .cta-card,
            .plan-card {
              padding: 28px;
            }

            .grid,
            .plans-grid,
            .hero-grid {
              grid-template-columns:
                1fr;
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
