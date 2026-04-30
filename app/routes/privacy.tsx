export default function Privacy() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#fff",
        padding: "40px 20px",
        fontFamily: "Inter, Arial, sans-serif",
        color: "#111",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            fontSize: "clamp(34px,6vw,58px)",
            lineHeight: "1.1",
            marginBottom: "20px",
            fontWeight: 800,
          }}
        >
          Privacy Policy
        </h1>

        <p style={txt}>
          Wishlist Pro respects merchant and customer privacy.
        </p>

        <p style={txt}>
          We only store data required for wishlist functionality:
        </p>

        <ul style={list}>
          <li>Saved wishlist products</li>
          <li>Store settings</li>
          <li>Anonymous technical logs</li>
        </ul>

        <p style={txt}>We never sell personal data.</p>

        <p style={txt}>
          Contact: support@lavawishlist.com
        </p>
      </div>
    </div>
  );
}

const txt = {
  fontSize: "clamp(18px,2.4vw,24px)",
  lineHeight: "1.8",
  marginBottom: "20px",
};

const list = {
  fontSize: "clamp(18px,2.4vw,24px)",
  lineHeight: "2",
  paddingLeft: "24px",
  marginBottom: "24px",
};
