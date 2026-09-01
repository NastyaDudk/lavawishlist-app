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

import { useLoaderData } from "react-router";
import { useEffect, useState } from "react";

import type { LoaderFunctionArgs } from "@remix-run/node";

import prisma from "../db.server";
import { authenticate } from "../shopify.server";


/* =========================================================
   LOADER
========================================================= */

export async function loader({
  request,
}: LoaderFunctionArgs) {

  const { admin, session } =
    await authenticate.admin(request);

  let subscription: {
    createdAt: string | null;
    currentPeriodEnd: string | null;
    trialDays: number;
  } | null = null;

  try {
    const response = await admin.graphql(
      `#graphql
        query CurrentAppSubscriptions {
          currentAppInstallation {
            activeSubscriptions {
              createdAt
              currentPeriodEnd
              trialDays
            }
          }
        }
      `
    );

    const data = await response.json();

    subscription =
      data?.data?.currentAppInstallation?.activeSubscriptions?.[0] ??
      null;

  } catch (error) {
    console.error(
      "Failed to load Shopify subscription:",
      error
    );
  }

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

  console.log(
    "🔥 TIMER DATA:",
    {
      isPro,
      proStartedAt:
        stats?.proStartedAt
          ? stats.proStartedAt.toISOString()
          : null,
    }
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

    proStartedAt:
      stats?.proStartedAt
        ? stats.proStartedAt.toISOString()
        : null,

    subscriptionCreatedAt:
      subscription?.createdAt ?? null,

    subscriptionCurrentPeriodEnd:
      subscription?.currentPeriodEnd ?? null,

    subscriptionTrialDays:
      subscription?.trialDays ?? 0,
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
    proStartedAt,
    subscriptionCreatedAt,
    subscriptionCurrentPeriodEnd,
    subscriptionTrialDays,
  } = useLoaderData<{
    shop: string;
    limitHits: number;
    isPro: boolean;
    cancellationScheduled: boolean;
    cancellationDate: string | null;
    proStartedAt: string | null;
    subscriptionCreatedAt: string | null;
    subscriptionCurrentPeriodEnd: string | null;
    subscriptionTrialDays: number;
  }>();

  /* =======================================================
     TIMER STATE
  ======================================================= */

  const [countdown, setCountdown] =
    useState("");

  const [isTrial, setIsTrial] =
    useState(false);


  /* =======================================================
     TIMER
     Uses Shopify's real subscription period end.
  ======================================================= */

  const formatTime = (
    milliseconds: number
  ) => {

    if (milliseconds <= 0) {
      return "0d 0h 0m 0s";
    }

    const totalSeconds =
      Math.floor(
        milliseconds / 1000
      );

    const days =
      Math.floor(
        totalSeconds / 86400
      );

    const hours =
      Math.floor(
        (totalSeconds % 86400) / 3600
      );

    const minutes =
      Math.floor(
        (totalSeconds % 3600) / 60
      );

    const seconds =
      totalSeconds % 60;

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };


  useEffect(() => {

    if (
      !isPro ||
      !subscriptionCreatedAt ||
      !subscriptionCurrentPeriodEnd
    ) {
      setCountdown("");
      setIsTrial(false);
      return;
    }

    const subscriptionStart =
      new Date(
        subscriptionCreatedAt
      ).getTime();

    const periodEnd =
      new Date(
        subscriptionCurrentPeriodEnd
      ).getTime();

    if (
      Number.isNaN(subscriptionStart) ||
      Number.isNaN(periodEnd)
    ) {
      setCountdown("");
      setIsTrial(false);
      return;
    }

    const trialDays =
      subscriptionTrialDays ?? 0;

    const trialEnd =
      subscriptionStart +
      trialDays *
        24 *
        60 *
        60 *
        1000;


    const updateTimer = () => {

      const now = Date.now();


      /*
       * ================================
       * FREE TRIAL
       * ================================
       */

      if (
        trialDays > 0 &&
        now < trialEnd
      ) {

        setIsTrial(true);

        setCountdown(
          formatTime(
            trialEnd - now
          )
        );

        return;
      }


      /*
       * ================================
       * CURRENT BILLING PERIOD
       * ================================
       *
       * Shopify supplies the real
       * currentPeriodEnd, so this works
       * for both monthly and yearly plans.
       */

      setIsTrial(false);

      setCountdown(
        formatTime(
          Math.max(
            0,
            periodEnd - now
          )
        )
      );

    };


    updateTimer();

    const interval =
      window.setInterval(
        updateTimer,
        1000
      );


    return () => {

      window.clearInterval(
        interval
      );

    };

  }, [
    isPro,
    subscriptionCreatedAt,
    subscriptionCurrentPeriodEnd,
    subscriptionTrialDays,
  ]);


  /* =======================================================
     SHOP NAME
  ======================================================= */

  const store =
    shop.replace(
      ".myshopify.com",
      ""
    );


  /* =======================================================
     BILLING LINKS
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


  /* =======================================================
     PAGE
  ======================================================= */

  return (

    <>

      <Page
        title="❤️‍🔥 Lava Wishlist"
      >

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

              <Text
                as="h2"
                variant="headingLg"
              >
                Plans
              </Text>


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


                    {/* =================================================
                        50 SAVES
                    ================================================= */}

                    <div className="free-info">

                      Free includes
                      20 saves/month

                    </div>


                    <Text
                      as="h2"
                      variant="heading2xl"
                    >
                      $0
                    </Text>


                    <BlockStack gap="200">

                      {[
                        "Up to 20 wishlist saves",
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


                        {/* =================================================
                            TIMER
                        ================================================= */}

                        <div className="subscription-notice">

                          <div className="subscription-notice-title">

                            {isTrial
                              ? "🔥 Free trial active"
                              : cancellationScheduled
                                ? "⚠️ Subscription cancellation scheduled"
                                : "💳 Pro subscription active"}

                          </div>


                         {isPro && proStartedAt ? (

                            <>

                              <div className="subscription-notice-label">

                                {isTrial
                                  ? "Your free trial ends in:"
                                  : cancellationScheduled
                                    ? "Your Pro access ends in:"
                                    : "Next payment in:"}

                              </div>


                              <div className="subscription-notice-countdown">

                                {countdown}

                              </div>


                              <div className="subscription-notice-text">

                                {isTrial
                                  ? "You won't be charged before the trial ends."
                                  : cancellationScheduled
                                    ? "Your Pro plan remains active until the end of the current billing period."
                                    : "Your next subscription payment will be charged after this period."}

                              </div>

                            </>

                          ) : (

                            <div className="subscription-notice-text">

                              Subscription information is being loaded...

                            </div>

                          )}

                        </div>


                        {/* =================================================
                            CANCELLATION
                        ================================================= */}

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
                              active{" "}

                              {formattedCancellationDate
                                ? `until ${formattedCancellationDate}.`
                                : "until the end of your current billing period."}

                              {" "}

                              You will not be charged
                              again after this period.

                            </Text>

                          </div>

                        ) : (

                          <BlockStack gap="200">

                            <div className="cancel-button-layer">

                              <a
                                href="#cancel-warning"
                                className="cancel-subscription-link"
                              >
                                Cancel subscription
                              </a>

                            </div>


                            <div
                              id="cancel-warning"
                              className="cancel-warning"
                              role="alert"
                            >

                            <div className="cancel-warning-title">
  Cancel your Pro subscription?
</div>

<div className="cancel-warning-text">
  We recommend cancelling when you no longer need
  the Pro plan, as switching to the Free Plan will
  take effect immediately.
</div>

<div className="cancel-warning-text">
  Your Pro access will end immediately after
  switching to the Free Plan.
</div>

<div className="cancel-warning-text">
  Any billing adjustments or credits are handled
  by Shopify according to its billing policy.
</div>

<div className="cancel-warning-text">
  After switching, your account will have the Free Plan
  limits, including{" "}
  <strong>
    20 wishlist saves per month.
  </strong>
</div>

                              <div className="cancel-warning-actions">

                                <a
                                  href="#plans"
                                  className="keep-pro-btn"
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

                          </BlockStack>

                        )}

                      </BlockStack>

                    ) : (

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
              backdrop-filter:
                blur(10px);
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


            .free-info {
              width: fit-content;
              padding: 8px 14px;
              border-radius: 999px;
              background: #eef4ff;
              color: #4f6ef7;
              font-size: 13px;
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
               START PRO
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
               CANCEL
            ================================================= */

            .cancel-button-layer {
              width: 100%;
            }


            .cancel-subscription-link {
              display: block;
              width: 100%;
              min-height: 28px;
              padding: 5px 0;
              border: none;
              color: #6b7280;
              background: transparent;
              font-size: 12px;
              font-weight: 400;
              text-align: center;
              text-decoration: underline;
              text-underline-offset: 3px;
              cursor: pointer;
              pointer-events: auto;
            }


            .cancel-subscription-link:hover {
              color: #374151;
            }


            .cancel-warning {
              display: none;
              position: relative;
              width: 100%;
              padding: 18px;
              box-sizing: border-box;
              border:
                1px solid #f0c36d;
              border-radius: 14px;
              background: #fff8e6;
              color: #333;
              box-shadow:
                0 4px 14px
                rgba(0,0,0,.06);
            }


            .cancel-warning:target {
              display: block;
            }


            .cancel-warning-title {
              padding-right: 30px;
              margin-bottom: 10px;
              color: #222;
              font-size: 16px;
              font-weight: 700;
              line-height: 1.3;
            }


            .cancel-warning-text {
              margin-bottom: 9px;
              color: #555;
              font-size: 13px;
              line-height: 1.5;
            }


            .cancel-warning-text:last-of-type {
              margin-bottom: 0;
            }


            .cancel-warning strong {
              color: #222;
            }


            .cancel-warning-actions {
              display: flex;
              gap: 10px;
              margin-top: 16px;
            }


            .keep-pro-btn,
            .confirm-cancel-btn {
              flex: 1;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 40px;
              padding: 9px 14px;
              box-sizing: border-box;
              border-radius: 9px;
              font-size: 13px;
              font-weight: 600;
              text-align: center;
              text-decoration: none;
              cursor: pointer;
            }


            .keep-pro-btn {
              border:
                1px solid #d7d7d7;
              background: white;
              color: #222;
            }


            .keep-pro-btn:hover {
              background: #f7f7f7;
            }


            .confirm-cancel-btn {
              border:
                1px solid #e0c98f;
              background: #f7e8bf;
              color: #5a461e;
            }


            .confirm-cancel-btn:hover {
              background: #efdca8;
              color: #4a3818;
            }


            /* =================================================
               CANCELLED
            ================================================= */

            .cancelled-note {
              padding: 14px;
              border-radius: 14px;
              background:
                rgba(22,163,74,.08);
              text-align: center;
            }


            /* =================================================
               TIMER
            ================================================= */

            .subscription-notice {
              width: 100%;
              box-sizing: border-box;
              padding: 18px;
              border-radius: 16px;
              background:
                linear-gradient(
                  135deg,
                  rgba(255,81,47,.10),
                  rgba(221,36,118,.10)
                );
              border:
                1px solid
                rgba(221,36,118,.18);
              text-align: center;
            }


            .subscription-notice-title {
              margin-bottom: 8px;
              color: #222;
              font-size: 15px;
              font-weight: 700;
            }


            .subscription-notice-label {
              color: #6b7280;
              font-size: 13px;
            }


            .subscription-notice-countdown {
              margin-top: 5px;
              color: #222;
              font-size: 24px;
              line-height: 1.3;
              font-weight: 700;
              font-variant-numeric:
                tabular-nums;
              letter-spacing: .3px;
            }


            .subscription-notice-text {
              margin-top: 6px;
              color: #6b7280;
              font-size: 12px;
              line-height: 1.45;
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


              .cancel-warning-actions {
                flex-direction:
                  column;
              }

            }

          `}</style>


        </BlockStack>

      </Page>

    </>

  );
}
