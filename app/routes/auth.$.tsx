import type { LoaderFunctionArgs } from "react-router";
import { shopify } from "../shopify.server";

export const loader = async ({
  request,
}: LoaderFunctionArgs) => {
  const result = await shopify.login(request);

  return Response.json(result);
};

export default function Auth() {
  return null;
}
