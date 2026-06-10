import { redirect } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }: any) => {
  console.log("PRICING HIT");

  const auth =
    await authenticate.admin(request);

  console.log("AUTH OK");

  const result =
    await auth.billing.request({
      plan: "pro",
      isTest: true,
    });

  console.log("BILLING RESULT");
  console.log(result);

  throw redirect(
    result.confirmationUrl,
  );
};

export default function Pricing() {
  return null;
}
