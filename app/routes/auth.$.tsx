import type { LoaderFunctionArgs } from "react-router";

export const loader = async ({
  request,
}: LoaderFunctionArgs) => {
  console.log("AUTH ROUTE HIT");

  return new Response("AUTH ROUTE WORKS");
};

export default function Auth() {
  return null;
}
