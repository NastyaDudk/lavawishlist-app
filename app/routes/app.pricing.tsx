import { authenticate } from "../shopify.server";

export const loader = async ({
  request,
}: {
  request: Request;
}) => {

  const { billing } =
    await authenticate.admin(request);

  return billing.request({
    plan: "pro",
    isTest: true,
  });

};

export default function Pricing() {
  return null;
}
