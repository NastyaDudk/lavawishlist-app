import { json } from "@remix-run/node";

import { authenticate }
from "../shopify.server";

export async function action({
  request,
}: {
  request: Request;
}) {

  const { billing } =
    await authenticate.admin(request);

  const billingCheck =
    await billing.check({
      plans: ["pro"],
      isTest: true,
    });

  if (billingCheck.hasActivePayment) {

    return json({
      active: true,
    });

  }

const billingResponse =
  await billing.request({
    plan: "pro",
    isTest: true,
  }) as {
    confirmationUrl: string;
  };

  return json({
    confirmationUrl:
      billingResponse.confirmationUrl,
  });

}
