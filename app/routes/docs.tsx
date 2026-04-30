export default function Docs() {
  const card = {
    background: "#fff",
    borderRadius: "22px",
    padding: "34px",
    marginBottom: "24px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
    border: "1px solid #f4e2db",
  };

  const title = {
    fontSize: "clamp(42px,7vw,72px)",
    fontWeight: 800,
    margin: 0,
    lineHeight: "1.1",
  };

  const text = {
    fontSize: "clamp(18px,2.2vw,24px)",
    lineHeight: "1.8",
    color: "#555",
  };

  const section = {
    fontSize: "clamp(28px,4vw,40px)",
    fontWeight: 700,
    marginBottom: "16px",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg,#fff8f5 0%,#fff1eb 45%,#ffffff 100%)",
        padding: "70px 24px",
        fontFamily: "Inter, Arial, sans-serif",
        color: "#111",
      }}
    >
      <div style={{ maxWidth: "980px", margin: "0 auto" }}>
        <div
          style={{
            textAlign: "center",
            padding: "50px 30px",
            borderRadius: "28px",
            marginBottom: "34px",
            background:
              "linear-gradient(135deg,#ff6a00 0%,#ff3b5c 50%,#ff8a00 100%)",
            color: "#fff",
            boxShadow: "0 20px 50px rgba(255,90,40,.25)",
          }}
        >
          <div style={{ fontSize: "56px" }}>📘</div>

          <h1 style={title}>Lava Favorites Docs</h1>

          <p style={{ ...text, color: "#fff", marginTop: "18px" }}>
            Quick setup guide for merchants.
          </p>
        </div>

        <div style={card}>
          <h2 style={section}>Installation</h2>
          <p style={text}>
            Install app → Open Theme Editor → Enable App Embed → Save
          </p>
        </div>

        <div style={card}>
          <h2 style={section}>Features</h2>

          <ul style={{ ...text, paddingLeft: "24px", lineHeight: "2" }}>
            <li>Header wishlist icon</li>
            <li>Animated lava hearts</li>
            <li>Product page wishlist button</li>
            <li>Collection hearts</li>
            <li>Wishlist drawer</li>
            <li>Add to cart from wishlist</li>
            <li>Remove items instantly</li>
            <li>Mobile responsive</li>
          </ul>
        </div>

        <div style={card}>
          <h2 style={section}>Support</h2>
          <p style={text}>
            <strong style={{ color: "#ff5a2f" }}>
              support@lavawishlist.com
            </strong>
          </p>
        </div>
      </div>
    </div>
  );
}
