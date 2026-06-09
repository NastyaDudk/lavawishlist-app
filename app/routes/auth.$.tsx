import type { LoaderFunctionArgs } from "react-router";
import { shopify } from "../shopify.server";

export const loader = async ({
  request,
}: LoaderFunctionArgs) => {

  const url = new URL(request.url);

  console.log("AUTH URL:");
  console.log(url.toString());

  console.log("SHOP:");
  console.log(url.searchParams.get("shop"));

  return await shopify.login(request);
};

export default function Auth() {
  return null;
}
