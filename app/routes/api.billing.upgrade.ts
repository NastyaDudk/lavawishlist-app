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

  return null;

}
