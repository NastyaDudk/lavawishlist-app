import { redirect } from "@remix-run/node";

import { authenticate }
  from "../shopify.server";

export async function loader({
  request,
}: {
  request: Request;
}) {

  const { billing } =
    await authenticate.admin(
      request,
    );

  const billingCheck =
    await billing.require({
      plans: ["pro"],
      isTest: true,
      onFailure: async () => {

        return billing.request({
          plan: "pro",
          isTest: true,

          returnUrl:
            "https://app.lavawish.com/app",
        });

      },
    });

  console.log(
    "BILLING CHECK:",
    billingCheck,
  );

  return redirect("/app");
}
