import { authenticate } from "../shopify.server";

export const loader = async ({ request }: any) => {
  try {
    console.log("STEP 1");

    const result =
      await authenticate.admin(request);

    console.log("STEP 2");

    return new Response("OK");
  } catch (e) {
    console.error("AUTH ERROR", e);

    return new Response("AUTH FAILED");
  }
};

export default function Pricing() {
  return null;
}
