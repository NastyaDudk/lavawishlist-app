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
    await authenticate.admin(request);

  await billing.require({
    plans: ["pro"],
    isTest: true,
    onFailure: async () =>
      billing.request({
        plan: "pro",
        isTest: true,
        returnUrl: "/app",
      }),
  });

  return json({
    ok: true,
  });

}
