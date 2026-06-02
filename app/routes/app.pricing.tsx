import { authenticate } from "../shopify.server";

export const loader = async ({ request }: any) => {
  const { billing } = await authenticate.admin(request);

  return billing.request({
    plan: {
      interval: "EVERY_30_DAYS",
      amount: 9.99,
      currencyCode: "USD",
      name: "Pro Plan",
    } as any,
    isTest: true,
  });
};

export default function Pricing() {
  return null;
}
