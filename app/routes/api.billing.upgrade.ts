import { redirect }
  from "@remix-run/node";

import { authenticate }
  from "../shopify.server";

export async function action({
  request,
}: {
  request: Request;
}) {

  const { billing } =
    await authenticate.admin(
      request,
    );

  const url =
    new URL(request.url);

  const response: unknown =
    await billing.request({
      plan: "pro",

      isTest: true,

      returnUrl:
        `${url.origin}/app`,
    });

  const confirmationUrl =
    (
      response as {
        confirmationUrl: string;
      }
    ).confirmationUrl;

  return redirect(
    confirmationUrl,
  );

}
