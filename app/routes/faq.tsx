export default function FAQ() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        padding: "60px 24px",
        fontFamily: "Inter, Arial, sans-serif",
        color: "#111111",
      }}
    >
      <div
        style={{
          maxWidth: "980px",
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            fontSize: "clamp(42px, 7vw, 72px)",
            fontWeight: 800,
            lineHeight: "1.1",
            marginBottom: "24px",
          }}
        >
          Frequently Asked Questions
        </h1>

        <p
          style={{
            fontSize: "clamp(20px, 2.5vw, 28px)",
            color: "#555",
            lineHeight: "1.7",
            marginBottom: "50px",
          }}
        >
          Everything merchants need to know about Wishlist Pro.
        </p>

        <div style={{ marginBottom: "42px" }}>
          <h2 style={question}>How do I install Wishlist Pro?</h2>
          <p style={answer}>
            Install the app → Open Theme Editor → Enable App Embed → Save.
          </p>
        </div>

        <div style={{ marginBottom: "42px" }}>
          <h2 style={question}>Does it work on mobile devices?</h2>
          <p style={answer}>
            Yes. Wishlist Pro is fully responsive and optimized for mobile,
            tablet, and desktop.
          </p>
        </div>

        <div style={{ marginBottom: "42px" }}>
          <h2 style={question}>Can customers add items to cart directly?</h2>
          <p style={answer}>
            Yes. Customers can add saved wishlist products directly to cart
            from the wishlist drawer.
          </p>
        </div>

        <div style={{ marginBottom: "42px" }}>
          <h2 style={question}>Will it match my Shopify theme?</h2>
          <p style={answer}>
            Yes. Wishlist Pro is designed to work smoothly with modern Shopify
            themes.
          </p>
        </div>

        <div style={{ marginBottom: "42px" }}>
          <h2 style={question}>Need help?</h2>
          <p style={answer}>
            Contact our support team anytime at{" "}
            <strong>support@lavawishlist.com</strong>
          </p>
        </div>
      </div>
    </div>
  );
}

const question = {
  fontSize: "clamp(28px, 4vw, 40px)",
  fontWeight: 700,
  lineHeight: "1.3",
  marginBottom: "12px",
};

const answer = {
  fontSize: "clamp(18px, 2.2vw, 24px)",
  color: "#444",
  lineHeight: "1.8",
};
