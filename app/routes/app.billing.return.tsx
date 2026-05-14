import { redirect } from "react-router";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }: { request: Request }) => {

  const { billing } = await authenticate.admin(request);

  const billingCheck = await billing.check({
    plans: ["pro"],
  });

  if (billingCheck.hasActivePayment) {
    return redirect("/app/dashboard");
  }

  return redirect("/");
};

export default function BillingReturn() {
  return null;
}
