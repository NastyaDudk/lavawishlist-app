export default [
  {
    path: "/",
    file: "routes/_index.tsx",
  },
  {
    path: "/privacy",
    file: "routes/privacy.tsx",
  },
  {
    path: "/faq",
    file: "routes/faq.tsx",
  },
  {
    path: "/docs",
    file: "routes/docs.tsx",
  },
  {
    path: "/api/wishlist",
    file: "routes/api.wishlist.ts",
  },
{
  path: "/api/webhooks/app/uninstalled",
  file: "routes/api/webhooks.app.uninstalled.tsx",
},
{
  path: "/api/webhooks/app/scopes_update",
  file: "routes/api/webhooks.app.scopes_update.tsx",
},
{
  path: "/api/webhooks/customers/data_request",
  file: "routes/api/webhooks.customers.data_request.tsx",
},
{
  path: "/api/webhooks/customers/redact",
  file: "routes/api/webhooks.customers.redact.tsx",
},
{
  path: "/api/webhooks/shop/redact",
  file: "routes/api/webhooks.shop.redact.tsx",
},
];
