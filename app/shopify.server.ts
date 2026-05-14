import {
  shopifyApp,
  ApiVersion,
} from "@shopify/shopify-app-react-router/server";

import prisma from "./db.server";

import { PrismaSessionStorage }
from "@shopify/shopify-app-session-storage-prisma";

const sessionStorage =
  new PrismaSessionStorage(prisma);

export const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY!,
  apiSecretKey:
    process.env.SHOPIFY_API_SECRET!,

  scopes: (process.env.SCOPES || "")
    .split(",")
    .filter(Boolean),

  appUrl:
    process.env.SHOPIFY_APP_URL!,

  apiVersion: ApiVersion.April26,

  sessionStorage:
    sessionStorage as never,

  isEmbeddedApp: true,
});

export const authenticate =
  shopify.authenticate;
