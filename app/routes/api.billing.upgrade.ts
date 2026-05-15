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

  if (!billingCheck.hasActivePayment) {

    await billing.request({
      plan: "pro",
      isTest: true,
    });

  }

  return new Response();
}
