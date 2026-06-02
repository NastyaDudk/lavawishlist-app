import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }: any) => {
  try {
    const { billing } =
      await authenticate.admin(request);

    const response =
      await billing.request({
        plan: "pro",
        isTest: true,
      } as never);

    return json({
      success: true,
      confirmationUrl:
        (response as any)
          .confirmationUrl,
    });
  } catch (error: any) {
    console.error(
      "SHOPIFY BILLING ERROR:",
      error,
    );

    return json({
      success: false,
      error:
        error?.message ||
        "Unknown error",
    });
  }
};

export default function Pricing() {
  return null;
}
