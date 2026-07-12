import { redirect } from "@remix-run/node";
import type { ActionFunctionArgs } from "@remix-run/node";

import { authenticate } from "../shopify.server";

export async function action({
  request,
}: ActionFunctionArgs) {
  const { session } =
    await authenticate.admin(request);

  const store = session.shop.replace(
    ".myshopify.com",
    "",
  );

  return redirect(
    `https://admin.shopify.com/store/${store}/charges/wishlist-pro-36/plans/free?interval=EVERY_30_DAYS`,
  );
}
