import { redirect } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }: any) => {
const { billing, session } = await authenticate.admin(request);

console.log("SESSION:", session);

  const response = await billing.request({
  plan: "pro",
  isTest: true,
  returnUrl: `https://${session.shop}/admin/apps`,
} as never);

  return redirect((response as any).confirmationUrl);
};

export default function Pricing() {
  return null;
}
