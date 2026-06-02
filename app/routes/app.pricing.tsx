import { authenticate } from "../shopify.server";

export const loader = async ({ request }: any) => {
  const { billing } =
    await authenticate.admin(request);

  await billing.request({
    plan: "pro",
    isTest: true,
  });

  return null;
};

export default function Pricing() {
  return null;
}
