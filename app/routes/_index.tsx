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
} from "react-router";

import type { LoaderFunctionArgs } from "@remix-run/node";

import prisma from "../db.server";
import { authenticate } from "../shopify.server";


/* =========================================================
   LOADER
========================================================= */

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

    limitHits:
      stats?.limitHits ?? 0,

    isPro,

    cancellationScheduled:
      stats?.cancellationScheduled ?? false,

    cancellationDate:
      stats?.cancellationDate
        ? stats.cancellationDate.toISOString()
        : null,
  };
}


/* =========================================================
   INDEX
========================================================= */

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


  /* =======================================================
     CANCEL MODAL STATE
  ======================================================= */

  const [
    showCancelModal,
    setShowCancelModal,
  ] = React.useState(false);


  /* =======================================================
     STORE NAME
  ======================================================= */

  const store =
    shop.replace(
      ".myshopify.com",
      ""
    );


  /* =======================================================
     SHOPIFY BILLING URL
  ======================================================= */

  const freePlanUrl =
    `https://admin.shopify.com/store/${store}/charges/wishlist-pro-36/plans/free?interval=EVERY_30_DAYS`;


  const proPlanUrl =
    `https://admin.shopify.com/store/${store}/charges/wishlist-pro-36/plans/pro?interval=EVERY_30_DAYS`;


  /* =======================================================
     CANCELLATION DATE
  ======================================================= */

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


  return (

    <Page title="❤️‍🔥 Lava Wishlist">

      <BlockStack gap="500">


        {/* =================================================
            HERO
        ================================================= */}

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


        {/* =================================================
            PLANS
        ================================================= */}

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
                3 saves/month
              </div>

            </InlineStack>


            <div className="plans-grid">


              {/* =================================================
                  FREE PLAN
              ================================================= */}

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
                      "Up to 3 wishlist saves",
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


              {/* =================================================
                  PRO PLAN
              ================================================= */}

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


                  {/* =================================================
                      PRO ACTIVE
                  ================================================= */}

                  {isPro ? (

                    <BlockStack gap="300">


                      <Button
                        variant="primary"
                        disabled
                        fullWidth
                      >
                        Pro Active ✓
                      </Button>


                      {/* =============================================
                          ALREADY SWITCHED / CANCELLATION SCHEDULED
                      ============================================= */}

                      {cancellationScheduled ? (

                        <div className="cancelled-note">

                          <Text as="p">
                            Subscription cancelled
                          </Text>


                          <Text
                            as="p"
                            tone="subdued"
                          >

                            Your Pro plan remains
                            active

                            {formattedCancellationDate
                              ? ` until ${formattedCancellationDate}.`
                              : " until the end of your current billing period."
                            }

                            {" "}

                            You will not be charged
                            again after this period.

                          </Text>

                        </div>

                      ) : (

                        /* =============================================
                           CANCEL SUBSCRIPTION LINK
                        ============================================= */

                        <a
                          href="#cancel-subscription"
                          className="cancel-subscription-link"
                          onClick={(event) => {

                            event.preventDefault();

                            console.log(
                              "CANCEL LINK CLICKED"
                            );

                            setShowCancelModal(
                              true
                            );

                          }}
                        >
                          Cancel subscription
                        </a>

                      )}

                    </BlockStack>

                  ) : (

                    /* =================================================
                       START PRO
                    ================================================= */

                    <a
                      href={proPlanUrl}
                      target="_top"
                      className="start-pro-link"
                    >
                      Start Free Trial
                    </a>

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


        {/* =================================================
            SCREENSHOTS
        ================================================= */}

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
                  label:
                    "Animated lava heart",
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


        {/* =================================================
            VIDEO
        ================================================= */}

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


        {/* =================================================
            QUICK SETUP
        ================================================= */}

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


        {/* =================================================
            CTA
        ================================================= */}

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


        {/* =================================================
            FOOTER
        ================================================= */}

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


        {/* =================================================
            CANCEL CONFIRMATION MODAL
        ================================================= */}

        {showCancelModal && (

          <div className="cancel-modal-overlay">

            <div className="cancel-modal">


              {/* =============================================
                  CLOSE
              ============================================= */}

              <a
                href="#close"
                className="cancel-modal-close"
                onClick={(event) => {

                  event.preventDefault();

                  setShowCancelModal(
                    false
                  );

                }}
                aria-label="Close"
              >
                ×
              </a>


              {/* =============================================
                  TITLE
              ============================================= */}

              <h2>
                Cancel your Pro subscription?
              </h2>


              {/* =============================================
                  WARNING
              ============================================= */}

              <p>

                We recommend cancelling at least{" "}

                <strong>
                  1 day before your next
                  billing date.
                </strong>

              </p>


              <p>

                By switching to the Free Plan,
                your Pro access will end
                immediately.

                <strong>
                  {" "}
                  No refund will be issued
                  for the current billing period.
                </strong>

              </p>


              <p>

                After switching, your account
                will have the Free Plan limits,
                including

                <strong>
                  {" "}
                  3 wishlist saves per month.
                </strong>

              </p>


              <p>
                Are you sure you want to
                continue?
              </p>


              {/* =============================================
                  ACTIONS
              ============================================= */}

              <div className="cancel-modal-actions">


                <a
                  href="#keep-pro"
                  className="keep-pro-btn"
                  onClick={(event) => {

                    event.preventDefault();

                    setShowCancelModal(
                      false
                    );

                  }}
                >
                  Keep Pro
                </a>


                <a
                  href={freePlanUrl}
                  target="_top"
                  className="confirm-cancel-btn"
                >
                  Continue to Free Plan
                </a>


              </div>

            </div>

          </div>

        )}


        {/* =================================================
            STYLES
        ================================================= */}

        <style>{`

          /* =================================================
             HERO
          ================================================= */

          .hero-badge {
            display: inline-flex;

            align-items: center;

            width: fit-content;

            padding: 12px 18px;

            border-radius: 999px;

            background:
              rgba(255,255,255,.18);

            color: white;

            font-size: 16px;

            font-weight: 700;

            backdrop-filter:
              blur(12px);

            box-shadow:
              0 4px 18px
              rgba(0,0,0,.12);
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
            position: relative;

            z-index: 2;

            color: white;
          }


          .hero-pill {
            padding: 10px 16px;

            border-radius: 999px;

            background:
              rgba(255,255,255,.18);

            color: white;

            font-size: 13px;

            font-weight: 700;

            backdrop-filter:
              blur(10px);
          }


          .hero-grid {
            display: grid;

            grid-template-columns:
              repeat(3, 1fr);

            gap: 18px;
          }


          .hero-box {
            padding: 22px;

            border-radius: 22px;

            background:
              rgba(255,255,255,.12);

            backdrop-filter:
              blur(12px);
          }


          .hero-box h3,
          .hero-box p {
            color: white;
          }


          /* =================================================
             PLANS
          ================================================= */

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
            border:
              2px solid #16a34a;

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


          /* =================================================
             PRO LINK
          ================================================= */

          .start-pro-link {
            display: block;

            width: 100%;

            padding: 10px;

            box-sizing: border-box;

            border-radius: 10px;

            background: #111;

            color: white;

            text-align: center;

            text-decoration: none;

            font-weight: 600;
          }


          .start-pro-link:hover {
            background: #222;
          }


          /* =================================================
             SCREENSHOTS
          ================================================= */

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


          /* =================================================
             VIDEO
          ================================================= */

          .video-box {
            overflow: hidden;

            border-radius: 18px;

            background: #f6f6f7;
          }


          .video-box img {
            width: 100%;

            display: block;
          }


          /* =================================================
             SETUP
          ================================================= */

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


          /* =================================================
             CTA
          ================================================= */

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


          /* =================================================
             FOOTER
          ================================================= */

          .footer {
            padding:
              12px 0 24px;
          }


          /* =================================================
             CANCEL LINK
          ================================================= */

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

            text-decoration:
              underline;

            text-underline-offset:
              3px;

            cursor: pointer;
          }


          .cancel-subscription-link:hover {
            color: #374151;
          }


          /* =================================================
             CANCELLED STATE
          ================================================= */

          .cancelled-note {
            padding: 14px;

            border-radius: 14px;

            background:
              rgba(22,163,74,.08);

            text-align: center;
          }


          /* =================================================
             MODAL OVERLAY
          ================================================= */

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


          /* =================================================
             MODAL
          ================================================= */

          .cancel-modal {
            position: relative;

            width: 100%;

            max-width: 480px;

            padding: 32px;

            box-sizing: border-box;

            border-radius: 20px;

            background: white;

            box-shadow:
              0 20px 60px
              rgba(0,0,0,.2);
          }


          .cancel-modal h2 {
            margin:
              0 0 18px;

            padding-right: 30px;

            color: #222;

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


          .cancel-modal strong {
            color: #222;
          }


          /* =================================================
             CLOSE LINK
          ================================================= */

          .cancel-modal-close {
            position: absolute;

            top: 12px;

            right: 12px;

            width: 32px;

            height: 32px;

            display: flex;

            align-items: center;

            justify-content: center;

            border-radius: 50%;

            background: #f3f3f3;

            color: #222;

            font-size: 22px;

            line-height: 1;

            text-decoration: none;
          }


          .cancel-modal-close:hover {
            background: #e8e8e8;
          }


          /* =================================================
             MODAL ACTIONS
          ================================================= */

          .cancel-modal-actions {
            display: flex;

            gap: 10px;

            margin-top: 26px;
          }


          .keep-pro-btn,
          .confirm-cancel-btn {
            flex: 1;

            display: flex;

            align-items: center;

            justify-content: center;

            min-height: 42px;

            padding:
              10px 16px;

            box-sizing: border-box;

            border-radius: 9px;

            font-size: 14px;

            font-weight: 600;

            text-align: center;

            text-decoration: none;

            cursor: pointer;
          }


          .keep-pro-btn {
            border:
              1px solid #ddd;

            background: white;

            color: #222;
          }


          .keep-pro-btn:hover {
            background: #f7f7f7;
          }


          .confirm-cancel-btn {
            border: none;

            background: #f1f1f1;

            color: #555;
          }


          .confirm-cancel-btn:hover {
            background: #e5e5e5;

            color: #333;
          }


          /* =================================================
             MOBILE
          ================================================= */

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


            .cancel-modal {
              padding: 26px;
            }


            .cancel-modal-actions {
              flex-direction:
                column;
            }

          }

        `}</style>

      </BlockStack>

    </Page>

  );
}
