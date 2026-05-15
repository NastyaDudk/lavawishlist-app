import { json, redirect } from "@remix-run/node";

import { authenticate } from "../shopify.server";

export async function action({
  request,
}: {
  request: Request;
}) {

  const { billing } =
    await authenticate.admin(
      request,
    );

  await billing.request({
    plan: "pro",
    isTest: true,

    returnUrl:
      "https://app.lavawish.com/app",
  });

  return redirect("/app");

}

export async function loader() {

  return json({
    ok: true,
  });

}
