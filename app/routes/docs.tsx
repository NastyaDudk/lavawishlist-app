 export default function Docs() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        padding: "60px 24px",
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
            fontSize: "52px",
            fontWeight: "800",
            marginBottom: "20px",
          }}
        >
          Wishlist Pro Documentation
        </h1>

        <p
          style={{
            fontSize: "22px",
            lineHeight: "1.7",
            color: "#444",
            marginBottom: "40px",
          }}
        >
          Quick setup guide for merchants using Wishlist Pro.
        </p>

        <h2 style={{ fontSize: "34px", marginBottom: "18px" }}>
          Installation
        </h2>

        <div style={{ fontSize: "22px", lineHeight: "1.8", marginBottom: "50px" }}>
          Install app → Open Theme Editor → Enable App Embed → Save
        </div>

        <h2 style={{ fontSize: "34px", marginBottom: "18px" }}>
          Features
        </h2>

        <ul
          style={{
            fontSize: "22px",
            lineHeight: "2",
            paddingLeft: "24px",
            marginBottom: "50px",
          }}
        >
          <li>Header wishlist icon with live counter</li>
          <li>Animated lava heart fill effect</li>
          <li>Product page wishlist button</li>
          <li>Collection page hearts</li>
          <li>Wishlist drawer</li>
          <li>Add to cart directly from wishlist</li>
          <li>Remove saved items instantly</li>
          <li>Mobile responsive layout</li>
        </ul>

        <h2 style={{ fontSize: "34px", marginBottom: "18px" }}>
          Support
        </h2>

        <p style={{ fontSize: "22px", lineHeight: "1.8" }}>
          support@lavawishlist.com
        </p>
      </div>
    </div>
  );
}
