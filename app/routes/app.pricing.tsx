import { redirect } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  const auth =
    await authenticate.admin(request);

  const confirmation =
    await auth.billing.request({
      plan: "pro",
      isTest: true,
    });

  throw redirect(
    confirmation.confirmationUrl,
  );
};

export default function Pricing() {
  return null;
}
