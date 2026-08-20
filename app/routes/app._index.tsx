import { redirect } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export const loader = async ({
  request,
}: {
  request: Request;
}) => {
  await authenticate.admin(request);

  return redirect("/app/dashboard");
};

export default function AppIndex() {
  return null;
}
