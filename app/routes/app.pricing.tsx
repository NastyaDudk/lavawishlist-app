import { json } from "@remix-run/node";

export const loader = async () => {
  return json({
    ok: true,
  });
};

export default function Pricing() {
  return null;
}
