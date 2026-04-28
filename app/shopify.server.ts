import "@shopify/shopify-app-react-router/adapters/node";

import {
  shopifyApp,
  ApiVersion,
  BillingInterval,
} from "@shopify/shopify-app-react-router/server";

import prisma from "./db.server";
import { PrismaSessionStorage } from "@shopify/shopify-app-session-storage-prisma";

const sessionStorage = new PrismaSessionStorage(prisma) as any;

export const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY!,
  apiSecretKey: process.env.SHOPIFY_API_SECRET!,
  scopes: process.env.SCOPES!.split(","),
  appUrl: process.env.SHOPIFY_APP_URL!,
  apiVersion: ApiVersion.January25,
  sessionStorage,
  isEmbeddedApp: true,

billing: {
  Growth: {
    amount: 9.99,
    currencyCode: "USD",
    interval: "EVERY_30_DAYS" as any,
  },
},
});

export const authenticate = shopify.authenticate;
