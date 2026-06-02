import type {
  LoaderFunctionArgs,
} from "react-router";

import {
  authenticate,
} from "../shopify.server";

export const loader = async ({
  request,
}: LoaderFunctionArgs) => {

  const { billing } =
    await authenticate.admin(request);

  const billingCheck =
    await billing.check({
      plans: ["pro"],
      isTest: true,
    });

  if (!billingCheck.hasActivePayment) {

    return billing.request({
      plan: "pro",
      isTest: true,
    });

  }

  return null;
};

export default function Pricing() {
  return null;
}
