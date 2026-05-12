import logo from "../assets/logo.png";

const Footer = () => {
  const colors = {
    dogMatchBlue: "#7FBCC8",
    dogMatchPink: "#EFA6BA",
    darkText: "#2d3436",
  };

  return (
    <footer
      className="py-5 mt-auto"
      style={{
        backgroundColor: "#ffffff",
        borderTop: "1px solid #eee",
        fontFamily: "'Segoe UI', Roboto, sans-serif",
      }}
    >
      <div className="container">
        <div className="row g-4 align-items-start text-lg-start">

          {/* ── Colonna 1: Brand ── */}
          <div className="col-lg-5 col-12 text-center text-lg-start">
            <div className="mb-3 d-flex align-items-center justify-content-center justify-content-lg-start">
              <img
                src={logo}
                alt="logo"
                style={{ height: "45px", width: "auto" }}
              />
              <h2
                className="fw-black m-0"
                style={{
                  color: colors.dogMatchBlue,
                  letterSpacing: "-1px",
                  fontSize: "24px",
                }}
              >
                DOG
                <span style={{ color: colors.dogMatchPink }}>Match</span>
              </h2>
            </div>

            <p
              className="small mb-0 px-3 px-lg-0"
              style={{
                lineHeight: "1.6",
                color: colors.darkText,
                maxWidth: "300px",
                margin: "0 auto",
              }}
            >
              La community più vibrante per i nostri amici a quattro zampe.
              <span
                className="d-block mt-2"
                style={{ color: colors.dogMatchPink, fontWeight: "600" }}
              >
                <i className="bi bi-heart-fill me-1"></i>
                Connettiamo passioni, non solo pedigree.
              </span>
            </p>
          </div>

          {/* ── Colonna 2: Supporto ── */}
          <div className="col-lg-3 col-12 text-center text-lg-start">
            <h6
              className="fw-bold text-uppercase mb-4"
              style={{
                letterSpacing: "1px",
                color: colors.dogMatchBlue,
                fontSize: "13px",
              }}
            >
              Supporto
            </h6>
            <ul className="list-unstyled m-0 p-0">
              <li className="mb-3">
                <a href="#" className="footer-link">Sicurezza</a>
              </li>
              <li className="mb-3">
                <a href="#" className="footer-link">Privacy</a>
              </li>
              <li className="mb-3">
                <a href="#" className="footer-link">Contatti</a>
              </li>
            </ul>
          </div>

          {/* ── Colonna 3: Download ── */}
          <div className="col-lg-4 col-12">
            <div
              className="p-4 rounded-4"
              style={{ backgroundColor: "#f8f9fa" }}
            >
              <h6
                className="fw-bold text-center mb-3"
                style={{ fontSize: "14px" }}
              >
                Portaci sempre con te
              </h6>
              <div className="d-grid gap-2">
                <button
                  className="btn store-btn text-white border-0 shadow-sm"
                  style={{ backgroundColor: colors.dogMatchPink }}
                >
                  <i className="bi bi-apple fs-5 me-2"></i>
                  App Store
                </button>
                <button
                  className="btn store-btn text-white border-0 shadow-sm"
                  style={{ backgroundColor: colors.dogMatchBlue }}
                >
                  <i className="bi bi-play-fill fs-4 me-2"></i>
                  Google Play
                </button>
              </div>
            </div>
          </div>

        </div>

        <hr className="my-5 opacity-10" />

        {/* ── Bottom bar ── */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
          <p className="small mb-0 text-muted">
            © 2026 <b>DOGMatch</b> Social Network.
          </p>
          <div className="small px-3 py-1 rounded-pill border bg-white shadow-sm fw-medium">
            Creato con
            <i
              className="bi bi-heart-fill mx-1"
              style={{ color: colors.dogMatchPink }}
            ></i>
            <span style={{ color: colors.dogMatchBlue, fontWeight: "700" }}>
              PER I MIGLIORI AMICI
            </span>
          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
          .footer-link {
            text-decoration: none;
            color: #7FBCC8;
            font-weight: 500;
            font-size: 14px;
            transition: color 0.2s;
          }
          .footer-link:hover {
            color: #EFA6BA;
          }

          .store-btn {
            border-radius: 12px;
            padding: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
          }

          @media (max-width: 991px) {
            footer .col-12 {
              text-align: center;
            }
            footer .col-12 p {
              margin-left: auto;
              margin-right: auto;
            }
          }
          `,
        }}
      />
    </footer>
  );
};

export default Footer;
