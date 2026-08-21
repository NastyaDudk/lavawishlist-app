import type { LoaderFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";

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

  return Response.redirect(
    `https://admin.shopify.com/store/${store}/apps/wishlist-pro-36`
  );
}
