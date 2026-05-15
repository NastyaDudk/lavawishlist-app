import { json } from "@remix-run/node";

export async function action() {

  console.log(
    "🔥 BILLING ROUTE HIT",
  );

  try {

    return json({
      success: true,

      confirmationUrl:
        "https://admin.shopify.com",
    });

  } catch (err) {

    console.error(err);

    return json(
      {
        success: false,
      },
      {
        status: 500,
      },
    );

  }

}
