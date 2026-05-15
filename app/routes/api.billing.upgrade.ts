import { json } from "@remix-run/node";

import { authenticate } from "../shopify.server";

export async function action({
  request,
}: {
  request: Request;
}) {

  try {

    const { billing } =
      await authenticate.admin(
        request,
      );

    await billing.require({
      plans: ["pro"],

      isTest: true,

      onFailure: async () => {

        return billing.request({
          plan: "pro",

          isTest: true,

          returnUrl:
            "https://admin.shopify.com",
        });

      },
    });

    return json({
      success: true,
    });

  } catch (err) {

    console.error(
      "BILLING ERROR:",
      err,
    );

    return json(
      {
        success: false,
      },
      {
        status: 500,
      },
    );

  }

}
