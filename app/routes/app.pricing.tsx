import { redirect } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }: any) => {
  const { billing } =
    await authenticate.admin(request);

  const response = await billing.request({
    plan: "pro",
    isTest: true,
  });

  return redirect(response.confirmationUrl);
};

export default function Pricing() {
  return null;
}
