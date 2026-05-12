import {
  Page,
  Card,
  Text,
  BlockStack,
  List,
} from "@shopify/polaris";
import { redirect } from "react-router";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }: { request: Request }) => {

  const { billing } = await authenticate.admin(request);

  const billingCheck = await billing.check({
    plans: ["pro"],
  });

  const isPro = billingCheck.hasActivePayment;

  // пока тест
  const saves = 55;

  if (!isPro && saves >= 50) {
    return redirect("/app/pricing");
  }

  return null;
};
export default function Index() {
  return (
    <Page title="❤️ Wishlist App">
      <BlockStack gap="500">

        {/* HERO */}
        <Card>
          <BlockStack gap="300">
            <Text as="h1" variant="headingXl">
              Turn visitors into buyers ❤️‍🔥
            </Text>

            <Text as="p" variant="bodyLg">
              Wishlist App helps customers save favorite products and return later to buy.
              Increase conversions, repeat visits, and customer engagement.
            </Text>
          </BlockStack>
        </Card>

        {/* BENEFITS */}
        <Card>
          <BlockStack gap="400">

            <Text as="h2" variant="headingLg">
              Why stores love Wishlist App
            </Text>

            <List type="bullet">
              <List.Item>Increase repeat purchases</List.Item>
              <List.Item>Recover shoppers who were not ready to buy</List.Item>
              <List.Item>Boost customer loyalty</List.Item>
              <List.Item>Beautiful lava heart design ❤️‍🔥</List.Item>
              <List.Item>Works instantly with your Shopify theme</List.Item>
            </List>

          </BlockStack>
        </Card>

        {/* HOW IT LOOKS */}
        <Card>
          <BlockStack gap="400">

            <Text as="h2" variant="headingLg">
              Beautiful inside your store
            </Text>

            <div className="grid">
              {[
                { src: "/images/header.png", label: "Animated lava heart" },
                { src: "/images/catalog.png", label: "Wishlist on collection pages" },
                { src: "/images/wishlist drawer.png", label: "Slide-out wishlist drawer" },
                { src: "/images/icon.png", label: "Clean modern icons" },
                { src: "/images/added.png", label: "Fast add to cart" },
                { src: "/images/header before.png", label: "Fits every theme" },
              ].map((img) => (
                <div key={img.src} className="card-preview">

                  <div className="img-box">
                    <img src={img.src} alt={img.label} />
                  </div>

                  <Text as="p" tone="subdued">
                    {img.label}
                  </Text>

                </div>
              ))}
            </div>

          </BlockStack>
        </Card>

        {/* VIDEO / GIF */}
        <Card>
          <BlockStack gap="400">

            <Text as="h2" variant="headingLg">
              See setup in seconds 🎬
            </Text>

            <div className="video-box">
              <img
                src="/images/setup.gif"
                alt="Wishlist setup tutorial"
              />
            </div>

            <Text as="p" tone="subdued">
              Open Theme Editor → App Embeds → Enable Wishlist → Save
            </Text>

          </BlockStack>
        </Card>

        {/* HOW TO ENABLE */}
        <Card>
          <BlockStack gap="400">

            <Text as="h2" variant="headingLg">
              Quick setup
            </Text>

            <List type="number">
              <List.Item>Open Shopify Theme Customize (Edit Theme)</List.Item>
              <List.Item>Enable Wishlist block (App embeds)</List.Item>
              <List.Item>Turn on your Wishlist</List.Item>
              <List.Item>Save</List.Item>
              <List.Item>Start converting more visitors</List.Item>
            </List>

            <Text as="p" tone="subdued">
              No coding required. Takes less than 1 minute.
            </Text>

          </BlockStack>
        </Card>

        {/* CTA */}
        <Card>
          <BlockStack gap="300">

            <Text as="h2" variant="headingLg">
              Ready to grow sales? 🔥
            </Text>

            <Text as="p" variant="bodyLg">
              Enable Wishlist App in your theme and let customers save products they love.
            </Text>

          </BlockStack>
        </Card>

        {/* STYLES */}
        <style>{`
          .grid {
            display:grid;
            grid-template-columns:1fr 1fr;
            gap:16px;
          }

          .card-preview {
            transition:all .25s ease;
          }

          .card-preview:hover {
            transform:scale(1.03);
          }

          .img-box {
            width:100%;
            height:180px;
            overflow:hidden;
            border-radius:12px;
            background:#f6f6f7;
          }

          .img-box img {
            width:100%;
            height:100%;
            object-fit:cover;
            object-position:right center;
            display:block;
          }

          .video-box {
            width:100%;
            border-radius:12px;
            overflow:hidden;
            background:#f6f6f7;
          }

          .video-box img {
            width:100%;
            display:block;
          }

          @media (max-width:768px) {
            .grid {
              grid-template-columns:1fr;
            }

            .img-box {
              height:220px;
            }
          }
        `}</style>

      </BlockStack>
    </Page>
  );
}
