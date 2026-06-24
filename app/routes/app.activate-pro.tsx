import { redirect } from "@remix-run/node";

import prisma from "../db.server";
import { authenticate } from "../shopify.server";

export async function loader({ request }) {
  const { session } =
    await authenticate.admin(request);

  await prisma.shopStats.upsert({
    where: {
      shop: session.shop,
    },

    update: {
      isPro: true,
    },

    create: {
      shop: session.shop,
      isPro: true,
    },
  });

  return redirect("/app");
}
