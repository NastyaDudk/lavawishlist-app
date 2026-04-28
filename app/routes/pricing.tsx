import {
  Page,
  Layout,
  Card,
  Text,
  Button,
  BlockStack,
  InlineStack,
  Badge,
} from "@shopify/polaris";
import { useNavigate } from "@remix-run/react";

export default function PricingPage() {
  const navigate = useNavigate();

  return (
    <Page title="Choose your plan">
      <Layout>
        <Layout.Section>
          <InlineStack gap="400" align="center" blockAlign="start">

            {/* FREE */}
            <Card>
              <BlockStack gap="300">
                <InlineStack align="space-between">
                  <Text variant="headingLg" as="h2">
                    Free
                  </Text>
                  <Badge>Starter</Badge>
                </InlineStack>

                <Text variant="heading2xl" as="p">
                  $0
                </Text>

                <Text as="p">Perfect for new stores</Text>

                <BlockStack gap="100">
                  <Text as="p">✓ Unlimited wishlist items</Text>
                  <Text as="p">✓ Basic button</Text>
                  <Text as="p">✓ Standard support</Text>
                </BlockStack>

                <Button fullWidth>
                  Current plan
                </Button>
              </BlockStack>
            </Card>

            {/* GROWTH */}
            <Card>
              <BlockStack gap="300">
                <InlineStack align="space-between">
                  <Text variant="headingLg" as="h2">
                    Growth
                  </Text>
                  <Badge tone="success">Popular</Badge>
                </InlineStack>

                <Text variant="heading2xl" as="p">
                  $9.99/mo
                </Text>

                <Text as="p">For growing brands</Text>

                <BlockStack gap="100">
                  <Text as="p">✓ Everything in Free</Text>
                  <Text as="p">✓ Email reminders</Text>
                  <Text as="p">✓ Analytics dashboard</Text>
                  <Text as="p">✓ Priority support</Text>
                </BlockStack>

                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => navigate("/app/billing")}
                >
                  Upgrade now
                </Button>
              </BlockStack>
            </Card>

            {/* PRO */}
            <Card>
              <BlockStack gap="300">
                <InlineStack align="space-between">
                  <Text variant="headingLg" as="h2">
                    Pro
                  </Text>
                  <Badge tone="attention">Advanced</Badge>
                </InlineStack>

                <Text variant="heading2xl" as="p">
                  $29/mo
                </Text>

                <Text as="p">For serious stores</Text>

                <BlockStack gap="100">
                  <Text as="p">✓ Everything in Growth</Text>
                  <Text as="p">✓ Klaviyo integration</Text>
                  <Text as="p">✓ Price-drop alerts</Text>
                  <Text as="p">✓ Back in stock alerts</Text>
                  <Text as="p">✓ VIP support</Text>
                </BlockStack>

                <Button
                  fullWidth
                  onClick={() => navigate("/app/billing")}
                >
                  Upgrade to Pro
                </Button>
              </BlockStack>
            </Card>

          </InlineStack>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
