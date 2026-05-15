import { json } from "@remix-run/node";

import {
  authenticate,
} from "../shopify.server";

export async function action({
  request,
}: {
  request: Request;
}) {

  const { billing } =
    await authenticate.admin(
      request,
    );

 const response =
  await billing.request({
    plan: "pro",
    isTest: true,

    returnUrl:
      "https://app.lavawish.com/app",
  }) as {
    confirmationUrl: string;
  };

  return json({
    confirmationUrl:
      response.confirmationUrl,
  });

}

export async function loader() {

  return json({
    ok: true,
  });

}
