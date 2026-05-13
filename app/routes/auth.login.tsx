import { login } from "../shopify.server";

export const loader = async ({ request }: { request: Request }) => {
  await login(request);
  return null;
};
