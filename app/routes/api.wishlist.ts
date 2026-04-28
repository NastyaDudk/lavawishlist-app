import { json } from "@remix-run/node";
import type { ActionFunctionArgs } from "@remix-run/node";
import prisma from "../db.server";

/**
 * GET /api/wishlist
 * Возвращает список wishlist для магазина
 */
export async function loader({ request }: ActionFunctionArgs) {
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
    return json({ error: "No shop provided" }, { status: 400 });
  }

  const items = await prisma.wishlistItem.findMany({
    where: { shop },
  });

  return json(items);
}

/**
 * POST /api/wishlist
 * toggle / remove items
 */
export async function action({ request }: ActionFunctionArgs) {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");

  if (!shop) {
    return json({ error: "No shop provided" }, { status: 400 });
  }

  const body = await request.json();
  const { handle, actionType } = body;

  if (!handle) {
    return json({ error: "No handle provided" }, { status: 400 });
  }

  if (actionType === "toggle") {
    const existing = await prisma.wishlistItem.findFirst({
      where: {
        handle,
        shop,
      },
    });

    if (existing) {
      await prisma.wishlistItem.delete({
        where: { id: existing.id },
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
