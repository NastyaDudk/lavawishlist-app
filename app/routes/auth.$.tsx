import type { LoaderFunctionArgs } from "react-router";
import { shopify } from "../shopify.server";

export const loader = async ({
  request,
}: LoaderFunctionArgs) => {
  return await shopify.login(request);
};

export default function Auth() {
  return null;
}
