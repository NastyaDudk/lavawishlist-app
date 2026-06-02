import type {
  LoaderFunctionArgs,
} from "react-router";

import {
  redirect,
} from "@remix-run/node";

import {
  authenticate,
} from "../shopify.server";

export const loader = async ({
  request,
}: LoaderFunctionArgs) => {

  const { billing } =
    await authenticate.admin(request);

  /**
   * CHECK ACTIVE SUBSCRIPTION
   */

  const billingCheck =
    await billing.check({
      plans: ["pro"],
      isTest: true,
    });

  /**
   * IF ACTIVE
   */

  if (
    billingCheck.hasActivePayment
  ) {

    return redirect(
      "/app/dashboard",
    );

  }

  const confirmationUrl =
    await billing.request({
      plan: "pro",
      isTest: true,
    });

  return redirect(
    confirmationUrl,
  );

};

export default function Pricing() {
  return null;
}
