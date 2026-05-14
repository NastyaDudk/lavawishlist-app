import {
  shopifyApp,
  ApiVersion,
  BillingInterval,
} from "@shopify/shopify-app-react-router/server";

import prisma from "./db.server";
import { PrismaSessionStorage } from "@shopify/shopify-app-session-storage-prisma";


const sessionStorage = new PrismaSessionStorage(prisma);

export const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY!,
  apiSecretKey: process.env.SHOPIFY_API_SECRET!,
  scopes: (process.env.SCOPES || "").split(",").filter(Boolean),
  appUrl: process.env.SHOPIFY_APP_URL!,
  apiVersion: ApiVersion.April26,
  sessionStorage: sessionStorage as never,
  isEmbeddedApp: true,

billing: {
  pro_monthly: {
    lineItems: [
      {
        amount: 9.99,
        currencyCode: "USD",
        interval: BillingInterval.Every30Days,
      },
    ],
  },

  pro_yearly: {
    lineItems: [
      {
        amount: 99,
        currencyCode: "USD",
        interval: BillingInterval.Annual,
      },
    ],
  },
},
});

export const authenticate = shopify.authenticate;
