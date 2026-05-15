import type {
  LoaderFunctionArgs,
} from "react-router";

import {
  authenticate,
} from "../shopify.server";

export const loader = async ({
  request,
}: LoaderFunctionArgs) => {

  const { billing } =
    await authenticate.admin(request);

  await billing.require({
    plans: ["pro"],
    isTest: true,

    onFailure: async () =>
      billing.request({
        plan: "pro",
        isTest: true,
      }),
  });

  return null;
};

export default function Pricing() {
  return null;
}
