import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }: { request: Request }) => {
  const auth = await authenticate.admin(request);

  return json({
    shop: auth.session.shop,
    sessionId: auth.session.id,
  });
};

export default function Pricing() {
  return null;
}
