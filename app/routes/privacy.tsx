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
    marginBottom: "24px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
    border: "1px solid #f4e2db",
  };

  const titleStyle = {
    fontSize: "clamp(24px, 3vw, 32px)",
    fontWeight: 700,
    marginTop: 0,
    marginBottom: "18px",
    color: "#222",
  };

  const textStyle = {
    fontSize: "clamp(17px, 2vw, 21px)",
    color: "#555",
    lineHeight: "1.8",
    marginBottom: "18px",
  };

  const listStyle = {
    fontSize: "clamp(17px, 2vw, 21px)",
    color: "#555",
    lineHeight: "1.9",
    paddingLeft: "28px",
    marginBottom: "20px",
  };

  const smallStyle = {
    fontSize: "15px",
    color: "#777",
    lineHeight: "1.7",
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

        {/* HERO */}
        <div style={hero}>
          <div style={{ fontSize: "56px", marginBottom: "14px" }}>
            🔒
          </div>

          <h1 style={heroTitle}>
            Privacy Policy
          </h1>

          <p style={heroText}>
            We respect your privacy and only process the information
            needed to provide and improve Lava Favorites.
          </p>
        </div>


        {/* INTRODUCTION */}
        <div style={card}>
          <h2 style={titleStyle}>
            1. Introduction
          </h2>

          <p style={textStyle}>
            Lava Favorites, also referred to as we, our, or us,
            provides wishlist functionality for Shopify stores.
          </p>

          <p style={textStyle}>
            This Privacy Policy explains what information we collect,
            how we use it, how long we retain it, and how merchants
            and their customers can contact us about privacy-related
            questions or requests.
          </p>

          <p style={textStyle}>
            By installing or using Lava Favorites, the merchant
            acknowledges that the app processes information as
            described in this Privacy Policy.
          </p>
        </div>


        {/* INFORMATION WE COLLECT */}
        <div style={card}>
          <h2 style={titleStyle}>
            2. Information We Collect
          </h2>

          <p style={textStyle}>
            We collect and process only the information reasonably
            necessary to operate Lava Favorites.
          </p>

          <p style={textStyle}>
            Depending on how the app is used, this may include:
          </p>

          <ul style={listStyle}>
            <li>
              Shopify store information required to identify and
              operate the installed app.
            </li>

            <li>
              Shopify authentication and session information required
              to securely provide the app to the merchant.
            </li>

            <li>
              Wishlist information, including the Shopify product
              handles saved by customers.
            </li>

            <li>
              Basic technical information and application logs used
              to operate, troubleshoot, secure, and improve the app.
            </li>

            <li>
              Subscription information necessary to determine whether
              the merchant is using the Free or Pro plan.
            </li>
          </ul>

          <p style={textStyle}>
            Lava Favorites does not require customers to provide
            passwords, payment card numbers, or checkout payment
            information to use the wishlist functionality.
          </p>
        </div>


        {/* CUSTOMER DATA */}
        <div style={card}>
          <h2 style={titleStyle}>
            3. Customer and Wishlist Data
          </h2>

          <p style={textStyle}>
            The main customer-related information processed by Lava
            Favorites is wishlist activity.
          </p>

          <p style={textStyle}>
            When a customer saves a product to a wishlist, the app may
            store the Shopify product handle associated with that
            wishlist item together with the store identifier and the
            time the item was created.
          </p>

          <p style={textStyle}>
            Lava Favorites does not use wishlist information for
            advertising, selling personal data, or building customer
            profiles unrelated to the wishlist functionality.
          </p>
        </div>


        {/* HOW WE USE DATA */}
        <div style={card}>
          <h2 style={titleStyle}>
            4. How We Use Information
          </h2>

          <p style={textStyle}>
            We use the information we process for the following
            purposes:
          </p>

          <ul style={listStyle}>
            <li>
              To provide wishlist functionality to Shopify stores.
            </li>

            <li>
              To save, retrieve, and manage wishlist products.
            </li>

            <li>
              To authenticate merchants and securely operate the app.
            </li>

            <li>
              To determine the merchant current app plan and
              provide the features associated with that plan.
            </li>

            <li>
              To monitor application performance and troubleshoot
              technical problems.
            </li>

            <li>
              To maintain the security and reliability of the service.
            </li>

            <li>
              To comply with applicable legal, regulatory, and
              Shopify platform requirements.
            </li>
          </ul>

          <p style={textStyle}>
            We do not use personal information for purposes unrelated
            to providing and operating Lava Favorites unless required
            or permitted by applicable law.
          </p>
        </div>


        {/* BILLING */}
        <div style={card}>
          <h2 style={titleStyle}>
            5. Subscriptions and Billing
          </h2>

          <p style={textStyle}>
            Lava Favorites offers a Free Plan and a Pro Plan.
            The Pro Plan includes a 3-day free trial.
          </p>

          <p style={textStyle}>
            Shopify hosts the app pricing and subscription approval
            experience and processes subscription charges according
            to the billing plan selected by the merchant.
          </p>

          <p style={textStyle}>
            Lava Favorites does not receive or store the merchant
            payment card details.
          </p>

          <p style={textStyle}>
            Subscription information may be processed by the app to
            determine the merchant current plan and enable or disable
            the corresponding app features.
          </p>

          <p style={textStyle}>
            Billing adjustments, credits, refunds, prorated charges,
            and other Shopify billing operations are handled through
            Shopify and are subject to Shopify applicable billing
            policies.
          </p>
        </div>


        {/* DATA SHARING */}
        <div style={card}>
          <h2 style={titleStyle}>
            6. How We Share Information
          </h2>

          <p style={textStyle}>
            We do not sell personal information.
          </p>

          <p style={textStyle}>
            We may disclose or provide access to information only when
            reasonably necessary to:
          </p>

          <ul style={listStyle}>
            <li>
              Provide and operate Lava Favorites.
            </li>

            <li>
              Use infrastructure and service providers required to
              host, store, secure, and operate the application.
            </li>

            <li>
              Comply with Shopify platform requirements.
            </li>

            <li>
              Comply with applicable laws, regulations, legal
              processes, or valid governmental requests.
            </li>

            <li>
              Protect the security, rights, or property of Lava
              Favorites, our merchants, or other users.
            </li>
          </ul>

          <p style={textStyle}>
            Service providers are expected to process information only
            for the purposes necessary to provide their services to
            us.
          </p>
        </div>


        {/* DATA RETENTION */}
        <div style={card}>
          <h2 style={titleStyle}>
            7. Data Retention
          </h2>

          <p style={textStyle}>
            We retain information only for as long as reasonably
            necessary to provide the app, maintain security, resolve
            disputes, comply with legal obligations, and satisfy
            Shopify platform requirements.
          </p>

          <p style={textStyle}>
            Wishlist information is retained while it is needed to
            provide the wishlist functionality and may be removed when
            it is no longer required.
          </p>

          <p style={textStyle}>
            Authentication, technical, and application records may be
            retained for the period necessary to securely operate and
            troubleshoot the service.
          </p>

          <p style={textStyle}>
            When information is no longer required, we take reasonable
            steps to delete or anonymize it, subject to applicable
            legal and operational requirements.
          </p>
        </div>


        {/* SECURITY */}
        <div style={card}>
          <h2 style={titleStyle}>
            8. Security
          </h2>

          <p style={textStyle}>
            We take reasonable technical and organizational measures
            to protect information against unauthorized access,
            disclosure, alteration, or destruction.
          </p>

          <p style={textStyle}>
            Access to application data is limited to what is reasonably
            necessary to operate and maintain the service.
          </p>

          <p style={textStyle}>
            Data transmitted between the app and its users is
            protected using industry-standard encrypted connections
            where supported.
          </p>
        </div>


        {/* DATA RIGHTS */}
        <div style={card}>
          <h2 style={titleStyle}>
            9. Privacy Rights and Requests
          </h2>

          <p style={textStyle}>
            Depending on applicable law, merchants and individuals may
            have rights regarding their personal information, including
            the right to request access to, correction of, or deletion
            of personal information.
          </p>

          <p style={textStyle}>
            If you have a privacy-related request concerning
            information processed by Lava Favorites, please contact us
            using the email address below.
          </p>

          <p style={textStyle}>
            We will review and respond to valid privacy requests within
            the timeframe required by applicable law.
          </p>
        </div>


        {/* SHOPIFY PRIVACY REQUESTS */}
        <div style={card}>
          <h2 style={titleStyle}>
            10. Shopify Privacy Requests
          </h2>

          <p style={textStyle}>
            Lava Favorites is designed to operate as a Shopify app and
            may receive privacy-related requests from Shopify in
            accordance with Shopify platform requirements.
          </p>

          <p style={textStyle}>
            Where applicable, we process such requests to delete,
            access, or otherwise manage information associated with
            merchants and their customers.
          </p>
        </div>


        {/* COOKIES / TRACKING */}
        <div style={card}>
          <h2 style={titleStyle}>
            11. Cookies and Tracking
          </h2>

          <p style={textStyle}>
            Lava Favorites does not use customer wishlist data for
            behavioral advertising or the sale of personal information.
          </p>

          <p style={textStyle}>
            Shopify and the app may use technical mechanisms required
            for authentication, security, application functionality,
            or maintaining a reliable session.
          </p>

          <p style={textStyle}>
            These technical mechanisms are used to provide the service
            and are not intended to create advertising profiles of
            customers.
          </p>
        </div>


        {/* CHILDREN */}
        <div style={card}>
          <h2 style={titleStyle}>
            12. Children&apos;s Privacy
          </h2>

          <p style={textStyle}>
            Lava Favorites is designed for Shopify merchants and
            ecommerce storefronts and is not directed specifically at
            children.
          </p>

          <p style={textStyle}>
            We do not knowingly request or collect information from
            children for the purpose of providing the app.
          </p>
        </div>


        {/* INTERNATIONAL DATA */}
        <div style={card}>
          <h2 style={titleStyle}>
            13. International Processing
          </h2>

          <p style={textStyle}>
            Information processed by Lava Favorites may be stored or
            processed in countries other than the country where the
            merchant or customer is located.
          </p>

          <p style={textStyle}>
            Where applicable, we take reasonable steps to ensure that
            international transfers and processing are conducted in
            accordance with applicable privacy and data protection
            requirements.
          </p>
        </div>


        {/* CHANGES */}
        <div style={card}>
          <h2 style={titleStyle}>
            14. Changes to This Privacy Policy
          </h2>

          <p style={textStyle}>
            We may update this Privacy Policy from time to time to
            reflect changes to Lava Favorites, our data practices,
            Shopify requirements, or applicable law.
          </p>

          <p style={textStyle}>
            When material changes are made, we will update this page
            and the effective date below.
          </p>

          <p style={smallStyle}>
            Last updated: September 2, 2026
          </p>
        </div>


        {/* CONTACT */}
        <div style={card}>
          <h2 style={titleStyle}>
            15. Contact Us
          </h2>

          <p style={textStyle}>
            If you have questions about this Privacy Policy, how Lava
            Favorites processes information, or wish to submit a
            privacy request, please contact us:
          </p>

          <p style={textStyle}>
            <strong>
              Email:
            </strong>{" "}
            <a
              href="mailto:support@lavawishlist.com"
              style={{
                color: "#ff5a2f",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              support@lavawishlist.com
            </a>
          </p>

          <p style={smallStyle}>
            We recommend including the Shopify store domain and a
            description of your request so that we can identify the
            relevant account and respond efficiently.
          </p>
        </div>

      </div>
    </div>
  );
}
