import { redirect } from "react-router";

export async function loader({ request }: { request: Request }) {

  const url = new URL(request.url);

  const shop = url.searchParams.get("shop");

  if (!shop) {
    return redirect("/");
  }

  return redirect(`/auth?shop=${shop}`);
}

export default function AuthLogin() {
  return null;
}
