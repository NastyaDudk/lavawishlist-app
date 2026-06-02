import type { LoaderFunctionArgs } from "react-router";

import {
  authenticate,
} from "../shopify.server";

export const loader = async ({
  request,
}: LoaderFunctionArgs) => {

  const { billing } =
    await authenticate.admin(request);

  return billing.require({
    plans: ["pro"],
    isTest: true,

    onFailure: async () => {

      return billing.request({
        plan: "pro",
        isTest: true,
        returnUrl: "/app",
      });

    },
  });

};

export default function Pricing() {
  return null;
}
