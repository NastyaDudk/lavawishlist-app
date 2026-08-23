import React from "react";

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

import {
  useLoaderData,
  useFetcher,
} from "react-router";

import type { LoaderFunctionArgs } from "@remix-run/node";

import prisma from "../db.server";
import { authenticate } from "../shopify.server";

export async function loader({
  request,
}: LoaderFunctionArgs) {

  const { session } =
    await authenticate.admin(request);

  const stats =
    await prisma.shopStats.findUnique({
      where: {
        shop: session.shop,
      },
    });

  const isPro =
    stats?.isPro ?? false;

  console.log(
    "SHOP:",
    session.shop
  );

  console.log(
    "SHOP STATS:",
    stats
  );

  console.log(
    "IS PRO:",
    isPro
  );

 return {
  shop: session.shop,
  limitHits: stats?.limitHits ?? 0,
  isPro,

  cancellationScheduled:
    stats?.cancellationScheduled ?? false,

  cancellationDate:
    stats?.cancellationDate
      ? stats.cancellationDate.toISOString()
      : null,
};
}


export default function Index() {

  const {
    shop,
    limitHits,
    isPro,
    cancellationScheduled,
    cancellationDate,
  } = useLoaderData<{
    shop: string;
    limitHits: number;
    isPro: boolean;
    cancellationScheduled: boolean;
    cancellationDate: string | null;
  }>();

  const fetcher = useFetcher<{
    success?: boolean;
    cancellationScheduled?: boolean;
    cancellationDate?: string | null;
    error?: string;
  }>();

  const [showCancelModal, setShowCancelModal] =
    React.useState(false);

  const cancelling =
    fetcher.state === "submitting";

  React.useEffect(() => {
    if (
      fetcher.state === "idle" &&
      fetcher.data?.success &&
      fetcher.data?.cancellationScheduled
    ) {
      setShowCancelModal(false);
      window.location.reload();
    }

    if (
      fetcher.state === "idle" &&
      fetcher.data?.error
    ) {
      console.error(
        "Cancellation error:",
        fetcher.data.error
      );

      alert(fetcher.data.error);
    }
  }, [fetcher.state, fetcher.data]);

  const store =
    shop.replace(
      ".myshopify.com",
      ""
    );


  const formattedCancellationDate =
    cancellationDate
      ? new Date(
          cancellationDate
        ).toLocaleDateString(
          "en-US",
          {
            year: "numeric",
            month: "long",
            day: "numeric",
          }
        )
      : null;


  function cancelSubscription() {
    fetcher.submit(
      {},
      {
        method: "post",
        action: "/app/cancel-subscription",
      }
    );
  }



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

                {isPro
                  ? "Pro Plan Active"
                  : "Free Plan Included"}

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

              <div
                className={
                  `plan-card free-plan ${
                    !isPro
                      ? "current-plan"
                      : ""
                  }`
                }
              >

                {!isPro && (

                  <div className="current-badge">
                    CURRENT PLAN
                  </div>

                )}


                <BlockStack gap="400">


                  <div>

                    <InlineStack
                      align="space-between"
                    >

                      <Text
                        as="h3"
                        variant="headingLg"
                      >
                        Free Plan
                      </Text>


                      <Badge
                        tone={
                          isPro
                            ? "critical"
                            : "success"
                        }
                      >

                        {!isPro
                          ? "Active"
                          : "Inactive"}

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

                        <span>
                          🔥
                        </span>

                        <Text as="p">
                          {item}
                        </Text>

                      </div>

                    ))}

                  </BlockStack>


                  {!isPro && (

                    <div className="free-plan-note">

                      <Text as="p">
                        You are currently using the free plan
                      </Text>


                      <Text
                        as="p"
                        tone="subdued"
                      >
                        Limit reached {limitHits} times
                      </Text>

                    </div>

                  )}

                </BlockStack>

              </div>


              {/* PRO */}

              <div
                className={
                  `plan-card pro-plan ${
                    isPro
                      ? "current-plan"
                      : ""
                  }`
                }
              >

                {isPro ? (

                  <div className="current-badge">
                    CURRENT PLAN
                  </div>

                ) : (

                  <div className="popular-badge">
                    MOST POPULAR
                  </div>

                )}


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

                        <span>
                          🚀
                        </span>

                        <Text as="p">
                          {item}
                        </Text>

                      </div>

                    ))}

                  </BlockStack>


                  {!isPro ? (

                    <a
                      href={
                        `https://admin.shopify.com/store/${store}/charges/wishlist-pro-36/plans/pro?interval=EVERY_30_DAYS`
                      }
                      target="_top"
                      style={{
                        display: "block",
                        width: "100%",
                        textAlign: "center",
                        padding: "10px",
                        background: "#111",
                        color: "white",
                        borderRadius: "10px",
                        textDecoration: "none",
                        fontWeight: 600,
                      }}
                    >
                      Start Free Trial
                    </a>

                  ) : (

                    <BlockStack gap="300">


                      <Button
                        variant="primary"
                        disabled
                        fullWidth
                      >
                        Pro Active ✓
                      </Button>


                      {cancellationScheduled ? (

                        <div className="cancelled-note">

                          <Text as="p">
                            Subscription cancelled
                          </Text>


                          <Text
                            as="p"
                            tone="subdued"
                          >

                            Your Pro plan remains active
                            {formattedCancellationDate
                              ? ` until ${formattedCancellationDate}.`
                              : " until the end of your current billing period."
                            }

                            {" "}

                            We couldn&apos;t cancel your subscription.

                          </Text>

                        </div>

                      ) : (

                        <button
                          type="button"
                          className="cancel-subscription-link"
                          onClick={() =>
                            setShowCancelModal(true)
                          }
                        >
                          Cancel subscription
                        </button>

                      )}

                    </BlockStack>

                  )}


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


        {/* CANCEL MODAL */}

        {showCancelModal && (

          <div className="cancel-modal-overlay">

            <div className="cancel-modal">


              <button
                type="button"
                className="cancel-modal-close"
                onClick={() =>
                  setShowCancelModal(false)
                }
              >
                ×
              </button>


              <h2>
                Cancel your Pro subscription?
              </h2>


              <p>
                Your current Pro subscription
                is already paid for, so your
                current payment will not be refunded.
              </p>


              <p>
                You will keep all Pro features
                until the end of your current
                billing period.
              </p>


              <p>
                You won&apos;t be charged again after
                that. Once your current period
                ends, your account will automatically
                switch to the Free Plan with a
                limit of 3 wishlist saves per month.
              </p>


              <div className="cancel-modal-actions">


                <button
                  type="button"
                  className="keep-pro-btn"
                  onClick={() =>
                    setShowCancelModal(false)
                  }
                >
                  Keep Pro
                </button>


                <button
                  type="button"
                  className="confirm-cancel-btn"
                  disabled={cancelling}
                  onClick={cancelSubscription}
                >
                  {cancelling
                    ? "Cancelling..."
                    : "Continue to Free Plan"}
                </button>

              </div>

            </div>

          </div>

        )}


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

            object-fit: contain;
            object-position: center;

            display: block;

            background: #f6f6f7;
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


          /* CANCEL SUBSCRIPTION LINK */

          .cancel-subscription-link {
            display: block;

            width: 100%;

            padding: 5px 0;

            border: none;

            background: transparent;

            color: #6b7280;

            font-size: 12px;
            font-weight: 400;

            text-align: center;

            cursor: pointer;

            text-decoration: underline;

            text-underline-offset: 3px;
          }


          .cancel-subscription-link:hover {
            color: #374151;
          }


          /* CANCELLED STATE */

          .cancelled-note {
            padding: 14px;

            border-radius: 14px;

            background:
              rgba(22,163,74,.08);

            text-align: center;
          }


          /* MODAL */

          .cancel-modal-overlay {
            position: fixed;

            inset: 0;

            z-index: 99999;

            display: flex;

            align-items: center;
            justify-content: center;

            padding: 20px;

            background:
              rgba(0,0,0,.45);

            backdrop-filter:
              blur(4px);
          }


          .cancel-modal {
            position: relative;

            width: 100%;

            max-width: 480px;

            padding: 32px;

            border-radius: 20px;

            background: white;

            box-shadow:
              0 20px 60px rgba(0,0,0,.2);
          }


          .cancel-modal h2 {
            margin:
              0 0 18px;

            font-size: 24px;

            line-height: 1.2;
          }


          .cancel-modal p {
            margin:
              0 0 14px;

            color: #555;

            font-size: 14px;

            line-height: 1.55;
          }


          .cancel-modal-close {
            position: absolute;

            top: 12px;
            right: 12px;

            width: 32px;
            height: 32px;

            border: none;

            border-radius: 50%;

            background: #f3f3f3;

            font-size: 22px;

            cursor: pointer;
          }


          .cancel-modal-actions {
            display: flex;

            gap: 10px;

            margin-top: 26px;
          }


          .keep-pro-btn,
          .confirm-cancel-btn {
            flex: 1;

            padding: 11px 16px;

            border-radius: 9px;

            font-size: 14px;

            font-weight: 600;

            cursor: pointer;
          }


          .keep-pro-btn {
            border:
              1px solid #ddd;

            background: white;

            color: #222;
          }


          .confirm-cancel-btn {
            border: none;

            background: #f1f1f1;

            color: #555;
          }


          .confirm-cancel-btn:hover {
            background: #e5e5e5;
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

            .cancel-modal-actions {
              flex-direction: column;
            }

          }

        `}</style>

      </BlockStack>

    </Page>

  );

}
