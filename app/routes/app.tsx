import { Outlet }
  from "react-router";

import {
  authenticate,
} from "../shopify.server";

export async function loader({
  request,
}: {
  request: Request;
}) {

  const { billing } =
    await authenticate.admin(
      request,
    );

  await billing.require({

    plans: ["pro"],

    isTest: true,

    onFailure:
      async () =>
        billing.request({
          plan: "pro",
        }),

  });

  return null;
}

export default function App() {

  return <Outlet />;

}
