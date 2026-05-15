export default [

  {
    path: "/auth/*",
    file: "routes/auth.$.tsx",
  },

  {
    path: "/",
    file: "routes/_index.tsx",
  },

  {
    path: "/app",
    file: "routes/app.tsx",
  },

  {
    path: "/app/pricing",
    file: "routes/app.pricing.tsx",
  },

  {
    path: "/app/dashboard",
    file: "routes/app.dashboard.tsx",
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
    path: "/robots.txt",
    file: "routes/robots[.]txt.ts",
  },


  {
    path: "/webhooks/compliance",
    file: "routes/webhooks.compliance.tsx",
  },
  {
    path: "/webhooks/app/uninstalled",
    file: "routes/webhooks.app.uninstalled.tsx",
  },
  {
    path: "/webhooks/app/scopes_update",
    file: "routes/webhooks.app.scopes_update.tsx",
  },
  {
    path: "/webhooks/customers/data_request",
    file: "routes/webhooks.customers.data_request.tsx",
  },
  {
    path: "/webhooks/customers/redact",
    file: "routes/webhooks.customers.redact.tsx",
  },
  {
    path: "/webhooks/shop/redact",
    file: "routes/webhooks.shop.redact.tsx",
  },
];
