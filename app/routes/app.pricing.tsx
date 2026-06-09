import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }: { request: Request }) => {
  console.log("PRICING ROUTE HIT");

  try {
    const auth = await authenticate.admin(request);

    console.log("AUTH OK");
    console.log(auth.session);

    return json({ ok: true });
  } catch (e) {
    console.log("AUTH FAILED");
    console.log(e);

    throw e;
  }
};

export default function Pricing() {
  return null;
}
