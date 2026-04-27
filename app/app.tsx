import { Outlet } from "react-router";
import { AppProvider } from "@shopify/shopify-app-react-router/react";

export default function App() {
  return (
    <AppProvider embedded apiKey="test">
      <Outlet />
    </AppProvider>
  );
}
