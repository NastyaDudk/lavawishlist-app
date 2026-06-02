import { redirect } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }: any) => {
  const { billing } =
    await authenticate.admin(request);

  try {
    const response = await billing.request({
      plan: "pro",
      isTest: true,
    } as never);

    return redirect(
      (response as any).confirmationUrl,
    );
  } catch (e) {
    console.error("BILLING ERROR:", e);

    return new Response(
      "Billing failed",
      { status: 500 },
    );
  }
};

export default function Pricing() {
  return null;
}
