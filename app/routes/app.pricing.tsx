import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  console.log("PRICING HIT");

  try {
    const auth =
      await authenticate.admin(request);

    console.log("AUTH OK");
    console.log(auth.session);

    const confirmation =
      await auth.billing.request({
        plan: "pro",
        isTest: true,
      });

    console.log("BILLING RESPONSE");
    console.dir(confirmation, {
      depth: null,
    });

    return null;
  } catch (e) {
    console.log("FULL BILLING ERROR");

    console.dir(e, {
      depth: null,
    });

    throw e;
  }
};

export default function Pricing() {
  return null;
}
