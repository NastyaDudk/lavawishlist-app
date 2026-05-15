export function loader() {

  return new Response(
`User-agent: *
Allow: /`,
    {
      headers: {
        "Content-Type": "text/plain",
      },
    },
  );

}
