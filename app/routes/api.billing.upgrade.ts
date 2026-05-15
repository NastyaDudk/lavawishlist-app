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

  if (!billingCheck.hasActivePayment) {

    await billing.require({
      plans: ["pro"],
      isTest: true,

      onFailure: async (
        error,
      ) => {

        throw error;

      },
    });

  }

  return json({
    ok: true,
  });

}
