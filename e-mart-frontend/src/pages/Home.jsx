import { Link } from "react-router-dom";
import {
  IoArrowForward,
  IoCheckmarkCircle,
  IoLeafOutline,
  IoStorefrontOutline,
  IoShieldCheckmarkOutline,
  IoPhonePortraitOutline,
} from "react-icons/io5";
import Button from "../components/common/Button";

const Home = () => {
  const features = [
    {
      icon: <IoLeafOutline size={28} />,
      title: "For Farmers",
      description:
        "List your products, manage orders, and receive secure payments directly.",
      color: "from-green-500 to-emerald-600",
      bg: "bg-green-50",
      border: "border-green-100",
    },
    {
      icon: <IoStorefrontOutline size={28} />,
      title: "For Buyers",
      description:
        "Access fresh local rice directly from farmers at fair prices.",
      color: "from-amber-500 to-orange-500",
      bg: "bg-amber-50",
      border: "border-amber-100",
    },
    {
      icon: <IoShieldCheckmarkOutline size={28} />,
      title: "Secure Payments",
      description:
        "Escrow-based payment system ensures safe transactions for all.",
      color: "from-blue-500 to-indigo-600",
      bg: "bg-blue-50",
      border: "border-blue-100",
    },
    {
      icon: <IoPhonePortraitOutline size={28} />,
      title: "Mobile Friendly",
      description:
        "Optimized for low-bandwidth and mobile devices across Ghana.",
      color: "from-purple-500 to-violet-600",
      bg: "bg-purple-50",
      border: "border-purple-100",
    },
  ];

  const benefits = [
    "Direct farmer-to-buyer connection",
    "Fair pricing for all parties",
    "Secure escrow payment system",
    "Real-time order tracking",
    "Mobile money integration",
    "Low data consumption",
  ];

  const stats = [
    { value: "500+", label: "Farmers" },
    { value: "2,000+", label: "Buyers" },
    { value: "₵1M+", label: "Transactions" },
    { value: "10", label: "Regions" },
  ];

  return (
    <div
      className="min-h-screen bg-white"
      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Fraunces:ital,wght@0,700;0,900;1,700&display=swap');
        
        .hero-grain {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
        }
        
        .card-lift {
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .card-lift:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px -12px rgba(0,0,0,0.12);
        }

        .btn-shine {
          position: relative;
          overflow: hidden;
        }
        .btn-shine::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -75%;
          width: 50%;
          height: 200%;
          background: rgba(255,255,255,0.2);
          transform: skewX(-20deg);
          transition: left 0.5s ease;
        }
        .btn-shine:hover::after {
          left: 125%;
        }

        .tag-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(22, 163, 74, 0.1);
          color: #15803d;
          padding: 6px 14px;
          border-radius: 999px;
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          border: 1px solid rgba(22, 163, 74, 0.2);
        }

        .hero-title {
          font-family: 'Fraunces', Georgia, serif;
          line-height: 1.05;
          letter-spacing: -0.02em;
        }

        .gradient-text {
          background: linear-gradient(135deg, #15803d 0%, #16a34a 40%, #ca8a04 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .stat-card {
          border-radius: 16px;
          padding: 24px 20px;
          text-align: center;
          background: white;
          border: 1px solid #f0fdf4;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
        }

        .divider-leaf {
          display: flex;
          align-items: center;
          gap: 16px;
          margin: 0 auto 48px;
          max-width: 200px;
        }
        .divider-leaf::before,
        .divider-leaf::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #d4d4d4;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        .float-anim { animation: float 4s ease-in-out infinite; }

        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-slide { animation: fadeSlideUp 0.6s ease forwards; }
        .fade-slide-1 { animation-delay: 0.1s; opacity: 0; }
        .fade-slide-2 { animation-delay: 0.25s; opacity: 0; }
        .fade-slide-3 { animation-delay: 0.4s; opacity: 0; }
        .fade-slide-4 { animation-delay: 0.55s; opacity: 0; }
      `}</style>

      {/* Navigation */}
      <header
        style={{
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid #f0f0f0",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div
          style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              height: "68px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  background: "linear-gradient(135deg, #16a34a, #15803d)",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <IoLeafOutline size={18} color="white" />
              </div>
              <span
                style={{
                  fontFamily: "Fraunces, serif",
                  fontSize: "1.4rem",
                  fontWeight: 900,
                  color: "#15803d",
                  letterSpacing: "-0.02em",
                }}
              >
                E-MART
              </span>
            </div>
            <nav style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <Link
                to="/login"
                style={{
                  padding: "8px 20px",
                  borderRadius: "8px",
                  color: "#525252",
                  fontWeight: 500,
                  fontSize: "0.95rem",
                  textDecoration: "none",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => (e.target.style.background = "#f5f5f5")}
                onMouseLeave={(e) =>
                  (e.target.style.background = "transparent")
                }
              >
                Sign In
              </Link>
              <Link to="/signup">
                <button
                  className="btn-shine"
                  style={{
                    padding: "10px 24px",
                    borderRadius: "10px",
                    background: "linear-gradient(135deg, #16a34a, #15803d)",
                    color: "white",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  Get Started <IoArrowForward size={16} />
                </button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section
        className="hero-grain"
        style={{
          background:
            "linear-gradient(160deg, #f0fdf4 0%, #fefce8 60%, #fff7ed 100%)",
          padding: "100px 24px 80px",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: "absolute",
            top: "-80px",
            right: "-80px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(22,163,74,0.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-60px",
            left: "-60px",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(202,138,4,0.07) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            textAlign: "center",
            position: "relative",
          }}
        >
          <div
            className="fade-slide fade-slide-1"
            style={{ marginBottom: "24px" }}
          >
            <span className="tag-pill">
              <IoLeafOutline size={14} /> Ghana's #1 Rice Marketplace
            </span>
          </div>

          <h1
            className="hero-title fade-slide fade-slide-2"
            style={{
              fontSize: "clamp(2.8rem, 7vw, 5.5rem)",
              color: "#171717",
              marginBottom: "24px",
            }}
          >
            Connecting Rice <span className="gradient-text">Farmers</span> to
            Markets
          </h1>

          <p
            className="fade-slide fade-slide-3"
            style={{
              fontSize: "1.2rem",
              color: "#525252",
              maxWidth: "560px",
              margin: "0 auto 40px",
              lineHeight: 1.7,
            }}
          >
            Buy fresh local rice directly from farmers or sell your harvest —
            securely, simply, and at fair prices.
          </p>

          <div
            className="fade-slide fade-slide-4"
            style={{
              display: "flex",
              gap: "14px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link to="/signup">
              <button
                className="btn-shine"
                style={{
                  padding: "14px 32px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #16a34a, #15803d)",
                  color: "white",
                  fontWeight: 600,
                  fontSize: "1.05rem",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  boxShadow: "0 8px 24px rgba(22,163,74,0.3)",
                }}
              >
                Start Selling <IoArrowForward size={18} />
              </button>
            </Link>
            <Link to="/signup">
              <button
                style={{
                  padding: "14px 32px",
                  borderRadius: "12px",
                  background: "white",
                  color: "#15803d",
                  fontWeight: 600,
                  fontSize: "1.05rem",
                  border: "2px solid #16a34a",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#f0fdf4";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "white";
                }}
              >
                Start Buying
              </button>
            </Link>
          </div>
        </div>

        {/* Stats row */}
        <div
          style={{
            maxWidth: "800px",
            margin: "72px auto 0",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "16px",
          }}
        >
          {stats.map((stat, i) => (
            <div key={i} className="stat-card">
              <div
                style={{
                  fontFamily: "Fraunces, serif",
                  fontSize: "2rem",
                  fontWeight: 900,
                  color: "#15803d",
                  lineHeight: 1,
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: "0.82rem",
                  color: "#737373",
                  marginTop: "6px",
                  fontWeight: 500,
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "100px 24px", background: "white" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <div className="divider-leaf">
              <IoLeafOutline color="#16a34a" size={20} />
            </div>
            <h2
              style={{
                fontFamily: "Fraunces, serif",
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 900,
                color: "#171717",
                marginBottom: "14px",
                letterSpacing: "-0.02em",
              }}
            >
              Why Choose E-MART?
            </h2>
            <p style={{ color: "#737373", fontSize: "1.05rem" }}>
              Built specifically for Ghana's rice market
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "24px",
            }}
          >
            {features.map((feature, index) => (
              <div
                key={index}
                className={`card-lift ${feature.bg} ${feature.border}`}
                style={{
                  borderRadius: "20px",
                  padding: "32px",
                  border: "1px solid",
                  borderColor: "inherit",
                }}
              >
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "14px",
                    background: `linear-gradient(135deg, ${feature.color.replace("from-", "").replace(" to-", ", ")})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    marginBottom: "20px",
                    backgroundImage: `linear-gradient(135deg, var(--tw-gradient-stops))`,
                  }}
                >
                  <div
                    style={{
                      background: `linear-gradient(135deg, ${index === 0 ? "#22c55e, #15803d" : index === 1 ? "#f59e0b, #ea580c" : index === 2 ? "#3b82f6, #4338ca" : "#a855f7, #7c3aed"})`,
                      width: "100%",
                      height: "100%",
                      borderRadius: "14px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                    }}
                  >
                    {feature.icon}
                  </div>
                </div>
                <h3
                  style={{
                    fontSize: "1.15rem",
                    fontWeight: 700,
                    color: "#171717",
                    marginBottom: "10px",
                  }}
                >
                  {feature.title}
                </h3>
                <p
                  style={{
                    color: "#525252",
                    lineHeight: 1.65,
                    fontSize: "0.95rem",
                  }}
                >
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section style={{ padding: "100px 24px", background: "#fafafa" }}>
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "80px",
            alignItems: "center",
          }}
        >
          <div>
            <span
              className="tag-pill"
              style={{ marginBottom: "24px", display: "inline-flex" }}
            >
              Platform Benefits
            </span>
            <h2
              style={{
                fontFamily: "Fraunces, serif",
                fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
                fontWeight: 900,
                color: "#171717",
                marginBottom: "32px",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
              }}
            >
              Everything You Need
              <br />
              in One Platform
            </h2>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: "14px",
              }}
            >
              {benefits.map((benefit, index) => (
                <li
                  key={index}
                  style={{ display: "flex", alignItems: "center", gap: "12px" }}
                >
                  <div
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      background: "#f0fdf4",
                      border: "1.5px solid #16a34a",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <IoCheckmarkCircle color="#16a34a" size={16} />
                  </div>
                  <span
                    style={{
                      color: "#404040",
                      fontSize: "1rem",
                      fontWeight: 500,
                    }}
                  >
                    {benefit}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div style={{ position: "relative" }}>
            <div
              className="float-anim"
              style={{
                background: "linear-gradient(145deg, #f0fdf4, #dcfce7)",
                borderRadius: "28px",
                padding: "48px 40px",
                textAlign: "center",
                border: "1px solid #bbf7d0",
                boxShadow: "0 20px 60px rgba(22,163,74,0.12)",
              }}
            >
              <div style={{ fontSize: "5rem", marginBottom: "20px" }}>🌾</div>
              <h3
                style={{
                  fontFamily: "Fraunces, serif",
                  fontSize: "1.6rem",
                  fontWeight: 900,
                  color: "#171717",
                  marginBottom: "12px",
                }}
              >
                Join Hundreds of Farmers & Buyers
              </h3>
              <p
                style={{
                  color: "#525252",
                  marginBottom: "28px",
                  lineHeight: 1.6,
                }}
              >
                Be part of Ghana's growing digital agriculture marketplace
              </p>
              <Link to="/signup">
                <button
                  className="btn-shine"
                  style={{
                    padding: "14px 32px",
                    borderRadius: "12px",
                    background: "linear-gradient(135deg, #16a34a, #15803d)",
                    color: "white",
                    fontWeight: 600,
                    fontSize: "1rem",
                    border: "none",
                    cursor: "pointer",
                    boxShadow: "0 6px 20px rgba(22,163,74,0.25)",
                    width: "100%",
                  }}
                >
                  Create Free Account
                </button>
              </Link>
            </div>
            {/* Decorative badge */}
            <div
              style={{
                position: "absolute",
                top: "-16px",
                right: "-16px",
                background: "#ca8a04",
                color: "white",
                borderRadius: "12px",
                padding: "8px 16px",
                fontSize: "0.8rem",
                fontWeight: 700,
                boxShadow: "0 4px 12px rgba(202,138,4,0.3)",
              }}
            >
              100% Free to Join
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          padding: "100px 24px",
          background:
            "linear-gradient(135deg, #15803d 0%, #166534 50%, #14532d 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            maxWidth: "700px",
            margin: "0 auto",
            textAlign: "center",
            position: "relative",
          }}
        >
          <h2
            style={{
              fontFamily: "Fraunces, serif",
              fontSize: "clamp(2rem, 4vw, 3.2rem)",
              fontWeight: 900,
              color: "white",
              marginBottom: "16px",
              letterSpacing: "-0.02em",
            }}
          >
            Ready to Get Started?
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,0.75)",
              fontSize: "1.1rem",
              marginBottom: "40px",
              lineHeight: 1.7,
            }}
          >
            Join E-MART today and transform how you buy or sell rice across
            Ghana.
          </p>
          <Link to="/signup">
            <button
              style={{
                padding: "16px 40px",
                borderRadius: "12px",
                background: "white",
                color: "#15803d",
                fontWeight: 700,
                fontSize: "1.05rem",
                border: "none",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
                transition: "transform 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "translateY(-2px)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "translateY(0)")
              }
            >
              Sign Up Now — It's Free <IoArrowForward size={18} />
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: "#0a0a0a", padding: "40px 24px" }}>
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                width: "28px",
                height: "28px",
                background: "linear-gradient(135deg, #16a34a, #15803d)",
                borderRadius: "7px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IoLeafOutline size={15} color="white" />
            </div>
            <span
              style={{
                fontFamily: "Fraunces, serif",
                fontSize: "1.2rem",
                fontWeight: 900,
                color: "white",
              }}
            >
              E-MART
            </span>
          </div>
          <p style={{ color: "#525252", fontSize: "0.85rem" }}>
            © {new Date().getFullYear()} E-MART. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: "24px" }}>
            {["Privacy", "Terms", "Contact"].map((item) => (
              <a
                key={item}
                href="#"
                style={{
                  color: "#525252",
                  fontSize: "0.85rem",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.target.style.color = "#16a34a")}
                onMouseLeave={(e) => (e.target.style.color = "#525252")}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
