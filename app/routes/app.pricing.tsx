import { json, redirect } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }: { request: Request }) => {
  try {
    const { billing } = await authenticate.admin(request);

    const confirmation = await billing.request({
      plan: "pro",
      isTest: true,
    });

    console.log("CONFIRMATION:");
    console.log(confirmation);

    throw redirect(confirmation.confirmationUrl);
  } catch (e) {
    console.error("BILLING ERROR:");
    console.error(e);

    return json({
      error: String(e),
    });
  }
};

export default function Pricing() {
  return null;
}
