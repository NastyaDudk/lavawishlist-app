import { authenticate } from "../shopify.server";

export const loader = async ({ request }: any) => {
  const auth = await authenticate.admin(request);

  return Response.json({
    ok: true,
    hasBilling: !!auth.billing,
  });
};

export default function Pricing() {
  return null;
}
