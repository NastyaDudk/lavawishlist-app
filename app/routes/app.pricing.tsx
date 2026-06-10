import { authenticate } from "../shopify.server";
import type { LoaderFunctionArgs } from "react-router";

export const loader = async (
  { request }: LoaderFunctionArgs
) => {

  const auth =
    await authenticate.admin(request);

  console.log("AUTH OK");

  console.dir(auth.billing, {
    depth: null,
  });

  return null;
};

export default function Pricing() {
  return <div>pricing page</div>;
}
