import { redirect } from "@remix-run/node";

export const loader = async () => {
  return redirect("https://shopify.com");
};

export default function Pricing() {
  return null;
}
