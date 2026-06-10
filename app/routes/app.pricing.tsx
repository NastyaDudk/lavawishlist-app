import { authenticate } from "../shopify.server";

export const loader = async (args: any) => {
  console.log("PRICING HIT");

  try {
    const auth = await authenticate.admin(args.request);

    console.log("AUTH OK");
    console.log(auth.session);

    return null;
  } catch (e) {
    console.error("AUTH ERROR");
    console.error(e);
    throw e;
  }
};

export default function Pricing() {
  return null;
}
