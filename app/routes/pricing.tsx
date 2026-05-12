import {
  Page,
  Card,
  Text,
  Button,
  BlockStack,
} from "@shopify/polaris";



import { authenticate } from "../shopify.server";
import { useFetcher, redirect } from "react-router";


export const action = async ({ request }: { request: Request }) => {

  const { billing } = await authenticate.admin(request);

  await billing.request({
    plan: "Pro",
    isTest: true,
  });

  return redirect("/app");
};

export default function Pricing() {

  const fetcher = useFetcher();

  return (
    <Page title="Upgrade to Pro">

      <Card>
        <BlockStack gap="400">

          <Text as="h2" variant="headingLg">
            Free plan limit reached
          </Text>

          <Text as="p">
            Free plan includes up to 50 wishlist saves per month.
          </Text>

          <Text as="p">
            Upgrade to Pro for unlimited saves.
          </Text>

          <Text as="h3" variant="headingMd">
            $9.99 / month
          </Text>

          <fetcher.Form method="post">
            <Button submit variant="primary">
              Upgrade to Pro
            </Button>
          </fetcher.Form>

        </BlockStack>
      </Card>

    </Page>
  );
}
