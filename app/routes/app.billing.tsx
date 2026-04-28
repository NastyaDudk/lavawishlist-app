/* eslint-disable @typescript-eslint/no-explicit-any */

import { redirect } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const admin: any = await authenticate.admin(request);

  await admin.billing.require({
    plans: ["Growth"] as any,
    isTest: true,
    onFailure: async () =>
      admin.billing.request({
        plan: "Growth" as any,
        isTest: true,
      }),
  });

  return redirect("/app");
}

export default function BillingPage() {
  return null;
}
