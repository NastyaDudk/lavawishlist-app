export default function FAQ() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #fff8f5 0%, #fff1eb 45%, #ffffff 100%)",
        padding: "70px 24px",
        fontFamily: "Inter, Arial, sans-serif",
        color: "#1a1a1a",
      }}
    >
      <div
        style={{
          maxWidth: "980px",
          margin: "0 auto",
        }}
      >
        {/* HERO */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "60px",
            padding: "50px 30px",
            borderRadius: "28px",
            background:
              "linear-gradient(135deg, #ff6a00 0%, #ff3b5c 50%, #ff8a00 100%)",
            color: "#ffffff",
            boxShadow: "0 20px 50px rgba(255,90,40,0.25)",
          }}
        >
          <div
            style={{
              fontSize: "56px",
              marginBottom: "14px",
            }}
          >
            ❤️‍🔥
          </div>

          <h1
            style={{
              fontSize: "clamp(42px, 7vw, 72px)",
              fontWeight: 800,
              lineHeight: "1.1",
              marginBottom: "18px",
              marginTop: 0,
            }}
          >
            Frequently Asked Questions
          </h1>

          <p
            style={{
              fontSize: "clamp(20px, 2.5vw, 28px)",
              lineHeight: "1.7",
              margin: 0,
              opacity: 0.95,
            }}
          >
            Everything merchants need to know about Lava Favorites.
          </p>
        </div>

        {/* FAQ CARDS */}
        <div style={card}>
          <h2 style={question}>How do I install Lava Favorites?</h2>
          <p style={answer}>
            Install the app → Open Theme Editor → Enable App Embed → Save.
          </p>
        </div>

        <div style={card}>
          <h2 style={question}>Does it work on mobile devices?</h2>
          <p style={answer}>
            Yes. Fully responsive and optimized for mobile, tablet, and desktop.
          </p>
        </div>

        <div style={card}>
          <h2 style={question}>Can customers add items to cart directly?</h2>
          <p style={answer}>
            Yes. Saved wishlist products can be added directly from the wishlist
            drawer.
          </p>
        </div>

        <div style={card}>
          <h2 style={question}>Will it match my Shopify theme?</h2>
          <p style={answer}>
            Yes. Lava Favorites is designed to blend smoothly with modern
            Shopify themes.
          </p>
        </div>

        <div style={card}>
          <h2 style={question}>Need help?</h2>
          <p style={answer}>
            Contact us anytime at{" "}
            <strong style={{ color: "#ff5a2f" }}>
              support@lavawishlist.com
            </strong>
          </p>
        </div>
      </div>
    </div>
  );
}

const card = {
  background: "#ffffff",
  borderRadius: "22px",
  padding: "34px",
  marginBottom: "24px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
  border: "1px solid #f4e2db",
};

const question = {
  fontSize: "clamp(26px, 4vw, 38px)",
  fontWeight: 700,
  lineHeight: "1.3",
  marginBottom: "12px",
  marginTop: 0,
};

const answer = {
  fontSize: "clamp(18px, 2.2vw, 24px)",
  color: "#555",
  lineHeight: "1.8",
  margin: 0,
};
