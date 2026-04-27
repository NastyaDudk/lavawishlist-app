import {
  Page,
  Card,
  Text,
  Button,
  BlockStack,
} from "@shopify/polaris";

export default function AppPage() {
  return (
    <Page title="Wishlist App">
      <BlockStack gap="400">

        <Card>
          <BlockStack gap="200">
            <Text variant="headingMd" as="h2">
              Welcome 👋
            </Text>

            <Text as="p">
              Your wishlist app is ready to use.
            </Text>

            <Button variant="primary">
              Create first wishlist
            </Button>
          </BlockStack>
        </Card>

        <Card>
          <BlockStack gap="200">
            <Text variant="headingMd" as="h2">
              Status
            </Text>

            <Text as="p">
              No wishlist items yet.
            </Text>
          </BlockStack>
        </Card>

      </BlockStack>
    </Page>
  );
}
