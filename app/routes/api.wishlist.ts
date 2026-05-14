import { json } from "@remix-run/node";
import type { ActionFunctionArgs } from "@remix-run/node";

import prisma from "../db.server";
import { authenticate } from "../shopify.server";

/**
 * GET /api/wishlist
 * Returns wishlist items
 */
export async function loader({
  request,
}: ActionFunctionArgs) {

  const url = new URL(request.url);

  const health = url.searchParams.get("health");

  if (health === "1") {

    return new Response("ok", {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
      },
    });

  }

  const shop = url.searchParams.get("shop");

  if (!shop) {

    return json(
      { error: "No shop provided" },
      { status: 400 },
    );

  }

  const items =
    await prisma.wishlistItem.findMany({
      where: { shop },
    });

  return json(items);
}

/**
 * POST /api/wishlist
 * toggle / remove items
 */
export async function action({
  request,
}: ActionFunctionArgs) {

  const url = new URL(request.url);

  const shop = url.searchParams.get("shop");

  if (!shop) {

    return json(
      { error: "No shop provided" },
      { status: 400 },
    );

  }

  const body = await request.json();

  const {
    handle,
    actionType,
  } = body;

  if (!handle) {

    return json(
      { error: "No handle provided" },
      { status: 400 },
    );

  }

  /**
   * CHECK SHOPIFY PLAN
   */

  const { billing } =
    await authenticate.admin(request);

  const billingCheck =
    await billing.check({
      plans: ["pro"],
    });

  const isPro =
    billingCheck.hasActivePayment;

  /**
   * FREE PLAN LIMIT
   * max 50 wishlist items
   */

  if (!isPro && actionType === "toggle") {

    const count =
      await prisma.wishlistItem.count({
        where: { shop },
      });

    if (count >= 50) {

      return json(
        {
          error:
            "Free plan limit reached",
          upgrade: true,
        },
        { status: 403 },
      );

    }

  }

  /**
   * TOGGLE
   */

  if (actionType === "toggle") {

    const existing =
      await prisma.wishlistItem.findFirst({
        where: {
          handle,
          shop,
        },
      });

    if (existing) {

      await prisma.wishlistItem.delete({
        where: {
          id: existing.id,
        },
      });

    } else {

      await prisma.wishlistItem.create({
        data: {
          handle,
          shop,
        },
      });

    }

  }

  /**
   * REMOVE
   */

  if (actionType === "remove") {

    await prisma.wishlistItem.deleteMany({
      where: {
        handle,
        shop,
      },
    });

  }

  return json({ ok: true });
}
