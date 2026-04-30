import "@shopify/polaris/build/esm/styles.css";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import { AppProvider } from "@shopify/polaris";
import enTranslations from "@shopify/polaris/locales/en.json";

export function meta() {
  return [
    { title: "Lava Favorites Wishlist App" },
    {
      name: "description",
      content:
        "Let shoppers save products to a wishlist and return later to complete purchases with stylish lava heart icons.",
    },
  ];
}

export function links() {
  return [
    { rel: "icon", type: "image/png", href: "/lavaicon.png" },
  ];
}

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />

        <Meta />
        <Links />
      </head>

      <body>
        <AppProvider i18n={enTranslations}>
          <Outlet />
        </AppProvider>

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
