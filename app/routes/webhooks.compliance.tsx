import type { ActionFunctionArgs } from "react-router";

export const action = async ({ request }: ActionFunctionArgs) => {
  const body = await request.text();
  console.log("Compliance webhook:", body);

  return new Response("OK");
};
