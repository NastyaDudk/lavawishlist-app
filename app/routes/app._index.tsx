import {
  redirect,
} from "@remix-run/node";

import {
  authenticate,
} from "../shopify.server";

export const loader = async ({
  request,
}: {
  request: Request;
}) => {

  const { billing } =
    await authenticate.admin(
      request,
    );

  const billingCheck =
    await billing.check({
      plans: ["pro"],
    });

  /**
   * NO ACTIVE PLAN
   * → SEND TO PRICING
   */

  if (
    !billingCheck.hasActivePayment
  ) {

    return redirect(
      "/app/pricing",
    );

  }

  /**
   * ACTIVE PLAN
   * → SEND TO DASHBOARD
   */

  return redirect(
    "/app/dashboard",
  );

};

export default function AppIndex() {
  return null;
}
