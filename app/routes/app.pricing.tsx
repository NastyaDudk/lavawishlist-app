import { redirect } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  const { billing } = await authenticate.admin(request);

  await billing.require({
    plans: ["pro Plan"],
    isTest: true,
    onFailure: async () =>
      billing.request({
        plan: "pro Plan",
        isTest: true,
      }),
  });

  return redirect("/app");
};

export default function Pricing() {
  return null;
}
