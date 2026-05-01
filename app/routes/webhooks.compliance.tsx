import type { ActionFunctionArgs } from "react-router";
import crypto from "crypto";

export const action = async ({ request }: ActionFunctionArgs) => {
  const body = await request.text();

  const hmacHeader = request.headers.get("x-shopify-hmac-sha256");

  const digest = crypto
    .createHmac("sha256", process.env.SHOPIFY_API_SECRET || "")
    .update(body, "utf8")
    .digest("base64");

  if (digest !== hmacHeader) {
    return new Response("Unauthorized", { status: 401 });
  }

  return new Response("OK", { status: 200 });
};
