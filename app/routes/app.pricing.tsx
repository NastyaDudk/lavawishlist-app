import { authenticate } from "../shopify.server";

export const loader = async ({ request }: any) => {
  console.log("PRICING ROUTE HIT");

  await authenticate.admin(request);

  console.log("AUTH RESULT OK");

  return new Response("OK");
};

export default function Pricing() {
  return null;
}
