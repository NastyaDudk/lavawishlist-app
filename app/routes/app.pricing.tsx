import { redirect } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }: any) => {
  const { billing } =
    await authenticate.admin(request);

  await billing.require({
    plans: ["pro"],
    onFailure: async () => {
      return billing.request({
        plan: "pro",
        isTest: true,
      } as never);
    },
  });

  return redirect("/app");
};

export default function Pricing() {
  return null;
}
