import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export async function loader({ request }) {
  const { session } =
    await authenticate.admin(request);

  const store =
    session.shop.replace(
      ".myshopify.com",
      ""
    );

  return json({
    url:
      `https://admin.shopify.com/store/${store}/charges/wishlist-pro-36/pricing_plans`,
  });
}
