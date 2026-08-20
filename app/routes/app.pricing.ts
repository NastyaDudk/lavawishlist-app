import { redirect } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import type { LoaderFunctionArgs } from "@remix-run/node";

export async function loader({
  request,
}: LoaderFunctionArgs) {
  const { session } =
    await authenticate.admin(request);

  const store =
    session.shop.replace(
      ".myshopify.com",
      ""
    );

  return redirect(
    `https://admin.shopify.com/store/${store}/charges/wishlist-pro-36/pricing_plans`
  );
}
