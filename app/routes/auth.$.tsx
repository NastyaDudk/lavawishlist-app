import type { LoaderFunctionArgs } from "react-router";
import { shopify } from "../shopify.server";

export const loader = async ({
  request,
}: LoaderFunctionArgs) => {
  await shopify.login(request);

  return null;
};

export default function Auth() {
  return null;
}
