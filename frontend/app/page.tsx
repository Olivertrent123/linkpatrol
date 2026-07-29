"use client";
import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [hoveredBtn, setHoveredBtn] = useState("");

  const PAYSTACK_LINK = "https://paystack.shop/pay/9wj0qo7lsm";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");
    setSuccess(false);
    try {
      await fetch("https://linkpatrol.onrender.com/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, site_url: url }),
      });
      const scanRes = await fetch("https://linkpatrol.onrender.com/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, url }),
      });
      const data = await scanRes.json();
      setSuccess(true);
      setStatus(`Scan complete — ${data.broken_count} broken link(s) found across ${data.total_links} links checked. Full report sent to ${email}.`);
    } catch {
      setStatus("Could not connect to the server. Please try again.");
    }
    setLoading(false);
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main style={{ background: "#ffffff", minHeight: "100vh", color: "#1a1a2e", fontFamily: "Inter, system-ui, -apple-system, sans-serif" }}>

      {/* Nav */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 80px", height: "72px", borderBottom: "1px solid #e8e8e8", background: "#fff", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="7" fill="#16a34a"/>
            <path d="M8 14l4 4 8-8" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span style={{ fontWeight: 700, fontSize: "18px", color: "#1a1a2e", letterSpacing: "-0.3px" }}>LinkPatrol</span>
        </div>
        <div style={{ display: "flex", gap: "36px", alignItems: "center" }}>
          {[
            { label: "Features", id: "features" },
            { label: "How It Works", id: "how-it-works" },
            { label: "Pricing", id: "pricing" },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              style={{ color: hoveredBtn === `nav-${item.id}` ? "#16a34a" : "#4b5563", fontSize: "14px", fontWeight: 500, background: "none", border: "none", cursor: "pointer", padding: "4px 0", transition: "color 0.15s" }}
              onMouseEnter={() => setHoveredBtn(`nav-${item.id}`)}
              onMouseLeave={() => setHoveredBtn("")}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => scrollTo("signup")}
            style={{ background: hoveredBtn === "nav-cta" ? "#15803d" : "#16a34a", color: "#fff", padding: "9px 22px", borderRadius: "7px", fontSize: "14px", fontWeight: 600, border: "none", cursor: "pointer", transition: "background 0.15s" }}
            onMouseEnter={() => setHoveredBtn("nav-cta")}
            onMouseLeave={() => setHoveredBtn("")}
          >
            Get Started Free →
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center", padding: "90px 80px", maxWidth: "1200px", margin: "0 auto" }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "100px", padding: "5px 14px", marginBottom: "24px" }}>
            <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#16a34a" }} />
            <span style={{ fontSize: "12px", color: "#15803d", fontWeight: 600 }}>Automated weekly scanning — no setup needed</span>
          </div>
          <h1 style={{ fontSize: "48px", fontWeight: 800, lineHeight: 1.15, letterSpacing: "-1.5px", marginBottom: "18px", color: "#111827" }}>
            Stop losing customers<br />to broken links.
          </h1>
          <p style={{ fontSize: "17px", color: "#6b7280", lineHeight: 1.75, marginBottom: "36px", maxWidth: "430px" }}>
            LinkPatrol scans your entire website every week and sends you a clear report of every broken link and missing image — automatically, with no maintenance required.
          </p>
          <form id="signup" onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "400px" }}>
            <input
              type="url"
              placeholder="https://yourwebsite.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              style={{ padding: "13px 16px", borderRadius: "8px", background: "#f9fafb", border: "1.5px solid #e5e7eb", color: "#111827", fontSize: "15px", outline: "none", width: "100%", boxSizing: "border-box" as const }}
            />
            <input
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ padding: "13px 16px", borderRadius: "8px", background: "#f9fafb", border: "1.5px solid #e5e7eb", color: "#111827", fontSize: "15px", outline: "none", width: "100%", boxSizing: "border-box" as const }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{ padding: "14px", borderRadius: "8px", background: loading ? "#86efac" : hoveredBtn === "hero-cta" ? "#15803d" : "#16a34a", color: "#fff", fontSize: "15px", fontWeight: 700, border: "none", cursor: loading ? "not-allowed" : "pointer", transition: "all 0.2s", width: "100%" }}
              onMouseEnter={() => setHoveredBtn("hero-cta")}
              onMouseLeave={() => setHoveredBtn("")}
            >
              {loading ? "Scanning your site..." : "Start My Free Scan — No Card Needed →"}
            </button>
            <p style={{ fontSize: "12px", color: "#9ca3af", margin: 0 }}>Free forever on the Starter plan. Unsubscribe anytime.</p>
          </form>
          {status && (
            <div style={{ marginTop: "16px", padding: "13px 16px", borderRadius: "8px", background: success ? "#f0fdf4" : "#fef2f2", border: `1px solid ${success ? "#bbf7d0" : "#fecaca"}`, fontSize: "14px", color: success ? "#15803d" : "#dc2626", maxWidth: "400px" }}>
              {status}
            </div>
          )}
        </div>

        {/* Scan report mockup */}
        <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "16px", padding: "28px", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
            <span style={{ fontWeight: 700, fontSize: "14px", color: "#111827" }}>Weekly Scan Report</span>
            <span style={{ background: "#f0fdf4", color: "#15803d", fontSize: "11px", fontWeight: 600, padding: "3px 10px", borderRadius: "100px", border: "1px solid #bbf7d0" }}>Live</span>
          </div>
          <div style={{ background: "#fff", borderRadius: "10px", border: "1px solid #e5e7eb", overflow: "hidden", marginBottom: "16px" }}>
            {[
              { url: "/products/shoes", status: 200, ok: true },
              { url: "/about-us", status: 200, ok: true },
              { url: "/old-sale-page", status: 404, ok: false },
              { url: "/contact", status: 200, ok: true },
              { url: "/img/banner2.jpg", status: 500, ok: false },
              { url: "/blog/top-picks", status: 200, ok: true },
              { url: "/promo/winter", status: 404, ok: false },
            ].map((item, i, arr) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 16px", borderBottom: i < arr.length - 1 ? "1px solid #f3f4f6" : "none", background: item.ok ? "#fff" : "#fff9f9" }}>
                <span style={{ fontSize: "12px", fontWeight: 700, color: item.ok ? "#16a34a" : "#dc2626", minWidth: "32px", fontFamily: "monospace" }}>{item.status}</span>
                <span style={{ fontSize: "13px", color: item.ok ? "#374151" : "#dc2626", flex: 1 }}>{item.url}</span>
                {!item.ok && <span style={{ background: "#fef2f2", color: "#dc2626", fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "4px", border: "1px solid #fecaca" }}>BROKEN</span>}
              </div>
            ))}
          </div>
          <div style={{ background: "#f0fdf4", borderRadius: "8px", padding: "12px 16px", display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "16px" }}>✅</span>
            <div>
              <p style={{ margin: 0, fontSize: "13px", fontWeight: 600, color: "#15803d" }}>Scan complete — 3 broken links found</p>
              <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#16a34a" }}>Report delivered to your inbox</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted by bar */}
      <div style={{ background: "#f9fafb", borderTop: "1px solid #e5e7eb", borderBottom: "1px solid #e5e7eb", padding: "20px 80px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", alignItems: "center", gap: "48px", justifyContent: "center" }}>
          <span style={{ fontSize: "13px", color: "#9ca3af", fontWeight: 500, whiteSpace: "nowrap" }}>Trusted by teams at</span>
          {["Shopify Stores", "WooCommerce", "Marketing Agencies", "SaaS Companies", "Bloggers"].map(item => (
            <span key={item} style={{ fontSize: "13px", color: "#6b7280", fontWeight: 600 }}>{item}</span>
          ))}
        </div>
      </div>

      {/* Stats */}
      <section style={{ padding: "70px 80px", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1px", background: "#e5e7eb", borderRadius: "12px", overflow: "hidden" }}>
          {[
            { number: "93%", label: "of broken links go unnoticed for weeks" },
            { number: "67%", label: "of users leave a site after hitting a broken page" },
            { number: "$0", label: "to start — no card, no contract, no catch" },
          ].map((s, i) => (
            <div key={i} style={{ background: "#fff", padding: "40px", textAlign: "center" }}>
              <p style={{ fontSize: "40px", fontWeight: 800, color: "#16a34a", margin: "0 0 8px", letterSpacing: "-1px" }}>{s.number}</p>
              <p style={{ fontSize: "14px", color: "#6b7280", margin: 0, lineHeight: 1.5 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" style={{ padding: "70px 80px", background: "#f9fafb", borderTop: "1px solid #e5e7eb", borderBottom: "1px solid #e5e7eb" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <p style={{ fontSize: "12px", color: "#16a34a", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "10px" }}>How It Works</p>
          <h2 style={{ fontSize: "34px", fontWeight: 800, letterSpacing: "-1px", marginBottom: "48px", color: "#111827" }}>Set up in 30 seconds. Reports every week, forever.</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "32px" }}>
            {[
              { step: "01", title: "Enter your website URL", desc: "Paste your website address and email into the form. Works with any website — Shopify, WordPress, or fully custom built." },
              { step: "02", title: "We scan every link and image", desc: "LinkPatrol crawls every page, checks every link and image source, and flags anything that returns an error." },
              { step: "03", title: "Receive your report by email", desc: "A clean, readable report lands in your inbox showing exactly which links are broken, what error they returned, and where they appear." },
            ].map((s) => (
              <div key={s.step} style={{ background: "#fff", borderRadius: "12px", border: "1px solid #e5e7eb", padding: "32px" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "18px" }}>
                  <span style={{ fontSize: "13px", fontWeight: 800, color: "#16a34a" }}>{s.step}</span>
                </div>
                <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "10px", color: "#111827" }}>{s.title}</h3>
                <p style={{ fontSize: "14px", color: "#6b7280", lineHeight: 1.65, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ padding: "70px 80px", maxWidth: "1200px", margin: "0 auto" }}>
        <p style={{ fontSize: "12px", color: "#16a34a", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "10px" }}>Features</p>
        <h2 style={{ fontSize: "34px", fontWeight: 800, letterSpacing: "-1px", marginBottom: "48px", color: "#111827" }}>Everything you need to keep your site healthy.</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
          {[
            { icon: "⚡", title: "Concurrent scanning", desc: "Checks all your links simultaneously — not one by one. Results in seconds, not minutes." },
            { icon: "📧", title: "Weekly email reports", desc: "A clean, actionable report delivered to your inbox every week. No dashboard to log into." },
            { icon: "🖼️", title: "Links and images", desc: "Checks every anchor link and every image source on your page. Nothing slips through." },
            { icon: "📈", title: "SEO protection", desc: "Search engines penalise sites with broken links. Fix them before they damage your rankings." },
            { icon: "🔒", title: "No tracking, no ads", desc: "Your data is never shared or sold. We scan your site to help you, and nothing else." },
            { icon: "🛠️", title: "Zero maintenance", desc: "Register once and forget about it. Reports arrive in your inbox automatically every week." },
          ].map((f) => (
            <div key={f.title} style={{ borderRadius: "12px", border: "1px solid #e5e7eb", padding: "28px", background: "#fff" }}>
              <div style={{ fontSize: "26px", marginBottom: "14px" }}>{f.icon}</div>
              <h3 style={{ fontSize: "15px", fontWeight: 700, marginBottom: "8px", color: "#111827" }}>{f.title}</h3>
              <p style={{ fontSize: "14px", color: "#6b7280", lineHeight: 1.65, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ padding: "70px 80px", background: "#f9fafb", borderTop: "1px solid #e5e7eb" }}>
        <div style={{ maxWidth: "860px", margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: "12px", color: "#16a34a", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "10px" }}>Pricing</p>
          <h2 style={{ fontSize: "34px", fontWeight: 800, letterSpacing: "-1px", marginBottom: "12px", color: "#111827" }}>Pay nothing until you need more.</h2>
          <p style={{ color: "#6b7280", fontSize: "16px", marginBottom: "48px", maxWidth: "480px", margin: "0 auto 48px" }}>
            The Starter plan is free forever — no credit card, no time limit, no catch. Upgrade only when your business grows.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", textAlign: "left" }}>
            {[
              {
                plan: "Starter",
                badge: null,
                price: "$0",
                period: "Free forever — no card required",
                desc: "Perfect for small websites and solo business owners who want peace of mind without any cost.",
                features: [
                  "1 website monitored",
                  "Automated weekly scan",
                  "Email report every Monday",
                  "Up to 500 links checked per scan",
                ],
                cta: "Start for Free",
                ctaId: "starter-cta",
                highlight: false,
                ctaAction: () => scrollTo("signup"),
              },
              {
                plan: "Pro",
                badge: "Most Popular",
                price: "$19",
                period: "per month — cancel anytime",
                desc: "Built for growing businesses, agencies, and teams managing multiple websites.",
                features: [
                  "5 websites monitored",
                  "Automated daily scan",
                  "Email and Slack alerts",
                  "Unlimited links per scan",
                ],
                cta: "Start Pro — $19/month",
                ctaId: "pro-cta",
                highlight: true,
                ctaAction: () => window.open(PAYSTACK_LINK, "_blank"),
              },
            ].map((p) => (
              <div key={p.plan} style={{ background: p.highlight ? "#16a34a" : "#fff", border: `1.5px solid ${p.highlight ? "#16a34a" : "#e5e7eb"}`, borderRadius: "14px", padding: "36px", position: "relative" }}>
                {p.badge && (
                  <div style={{ position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)", background: "#111827", color: "#fff", fontSize: "11px", fontWeight: 700, padding: "4px 14px", borderRadius: "100px", whiteSpace: "nowrap" }}>
                    {p.badge}
                  </div>
                )}
                <p style={{ fontSize: "13px", fontWeight: 600, color: p.highlight ? "#bbf7d0" : "#6b7280", marginBottom: "8px", marginTop: 0 }}>{p.plan}</p>
                <p style={{ fontSize: "42px", fontWeight: 800, letterSpacing: "-2px", margin: "0 0 4px", color: p.highlight ? "#fff" : "#111827" }}>{p.price}</p>
                <p style={{ fontSize: "13px", color: p.highlight ? "#bbf7d0" : "#9ca3af", marginBottom: "12px", marginTop: 0 }}>{p.period}</p>
                <p style={{ fontSize: "14px", color: p.highlight ? "#dcfce7" : "#6b7280", marginBottom: "24px", lineHeight: 1.6 }}>{p.desc}</p>
                <div style={{ borderTop: `1px solid ${p.highlight ? "#15803d" : "#f3f4f6"}`, paddingTop: "20px", marginBottom: "24px" }}>
                  {p.features.map((f) => (
                    <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: "12px" }}>
                      <span style={{ color: p.highlight ? "#bbf7d0" : "#16a34a", fontWeight: 700, fontSize: "14px", marginTop: "1px" }}>✓</span>
                      <span style={{ fontSize: "14px", color: p.highlight ? "#f0fdf4" : "#374151", lineHeight: 1.4 }}>{f}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={p.ctaAction}
                  style={{ width: "100%", padding: "13px", borderRadius: "8px", background: hoveredBtn === p.ctaId ? (p.highlight ? "#f0fdf4" : "#15803d") : (p.highlight ? "#fff" : "#16a34a"), color: p.highlight ? "#16a34a" : "#fff", fontSize: "14px", fontWeight: 700, border: "none", cursor: "pointer", transition: "all 0.2s" }}
                  onMouseEnter={() => setHoveredBtn(p.ctaId)}
                  onMouseLeave={() => setHoveredBtn("")}
                >
                  {p.cta}
                </button>
              </div>
            ))}
          </div>
          <p style={{ fontSize: "13px", color: "#9ca3af", marginTop: "24px" }}>
            No setup fees. No hidden charges. Cancel your Pro plan anytime — your data is always yours.
          </p>
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{ padding: "70px 80px", maxWidth: "1200px", margin: "0 auto", textAlign: "center" }}>
        <div style={{ background: "#f0fdf4", borderRadius: "16px", border: "1px solid #bbf7d0", padding: "60px 40px" }}>
          <h2 style={{ fontSize: "34px", fontWeight: 800, letterSpacing: "-1px", marginBottom: "14px", color: "#111827" }}>Your site has broken links right now.</h2>
          <p style={{ color: "#6b7280", fontSize: "16px", marginBottom: "28px" }}>Most businesses don't find out until a customer complains or Google penalises them. Don't wait.</p>
          <button
            onClick={() => scrollTo("signup")}
            style={{ background: hoveredBtn === "bottom-cta" ? "#15803d" : "#16a34a", color: "#fff", padding: "14px 32px", borderRadius: "8px", fontSize: "15px", fontWeight: 700, border: "none", cursor: "pointer", transition: "background 0.2s", display: "inline-block" }}
            onMouseEnter={() => setHoveredBtn("bottom-cta")}
            onMouseLeave={() => setHoveredBtn("")}
          >
            Run My First Free Scan →
          </button>
          <p style={{ fontSize: "13px", color: "#6b7280", marginTop: "14px" }}>Takes 30 seconds to set up. First report in your inbox within the hour.</p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid #e5e7eb", padding: "28px 80px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fff" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="7" fill="#16a34a"/>
            <path d="M8 14l4 4 8-8" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span style={{ fontWeight: 700, fontSize: "15px", color: "#111827" }}>LinkPatrol</span>
        </div>
        <span style={{ fontSize: "13px", color: "#9ca3af" }}>© 2026 LinkPatrol. All rights reserved.</span>
        <div style={{ display: "flex", gap: "24px" }}>
          {["Privacy Policy", "Terms of Use", "Contact"].map(item => (
            <a key={item} href="#" style={{ fontSize: "13px", color: hoveredBtn === item ? "#16a34a" : "#6b7280", textDecoration: "none", transition: "color 0.15s" }}
              onMouseEnter={() => setHoveredBtn(item)}
              onMouseLeave={() => setHoveredBtn("")}
            >{item}</a>
          ))}
        </div>
      </footer>

    </main>
  );
}