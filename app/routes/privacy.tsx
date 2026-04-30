export default function Privacy() {
  const hero = {
    textAlign: "center" as const,
    marginBottom: "36px",
    padding: "50px 30px",
    borderRadius: "28px",
    background:
      "linear-gradient(135deg, #ff6a00 0%, #ff3b5c 50%, #ff8a00 100%)",
    color: "#ffffff",
    boxShadow: "0 20px 50px rgba(255,90,40,0.25)",
  };

  const heroTitle = {
    fontSize: "clamp(42px, 7vw, 72px)",
    fontWeight: 800,
    lineHeight: "1.1",
    marginBottom: "18px",
    marginTop: 0,
  };

  const heroText = {
    fontSize: "clamp(20px, 2.5vw, 28px)",
    lineHeight: "1.7",
    margin: 0,
    opacity: 0.95,
  };

  const card = {
    background: "#ffffff",
    borderRadius: "22px",
    padding: "34px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
    border: "1px solid #f4e2db",
  };

  const textStyle = {
    fontSize: "clamp(18px, 2.2vw, 24px)",
    color: "#555",
    lineHeight: "1.8",
    marginBottom: "18px",
  };

  const listStyle = {
    fontSize: "clamp(18px, 2.2vw, 24px)",
    color: "#555",
    lineHeight: "2",
    paddingLeft: "24px",
    margin: 0,
  };

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
      <div style={{ maxWidth: "980px", margin: "0 auto" }}>
        <div style={hero}>
          <div style={{ fontSize: "56px", marginBottom: "14px" }}>🔒</div>

          <h1 style={heroTitle}>Privacy Policy</h1>

          <p style={heroText}>
            Your data is protected and only used to power Lava Favorites.
          </p>
        </div>

        <div style={card}>
          <p style={textStyle}>
            Lava Favorites respects merchant and customer privacy.
          </p>

          <p style={textStyle}>
            We only store information required for wishlist functionality:
          </p>

          <ul style={listStyle}>
            <li>Saved wishlist products</li>
            <li>Store preferences</li>
            <li>Anonymous technical logs</li>
          </ul>

          <p style={textStyle}>We never sell personal data.</p>

          <p style={textStyle}>
            Contact:{" "}
            <strong style={{ color: "#ff5a2f" }}>
              support@lavawishlist.com
            </strong>
          </p>
        </div>
      </div>
    </div>
  );
}
