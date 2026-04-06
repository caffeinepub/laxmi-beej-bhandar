import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "@tanstack/react-router";
import {
  BarChart3,
  ChevronRight,
  Clock,
  Leaf,
  Mail,
  MapPin,
  Package,
  Phone,
  Receipt,
  Shield,
  Sprout,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

const GREEN = "oklch(0.22 0.06 148)";
const TERRACOTTA = "oklch(0.52 0.15 33)";
const GOLD = "oklch(0.72 0.13 80)";
const CREAM = "oklch(0.94 0.035 85)";

const NAV_LINKS = ["Home", "About Us", "Features", "Pricing"];

const FEATURES = [
  {
    icon: <Users className="w-8 h-8" />,
    title: "Customer & Supplier Hub",
    desc: "Manage all customer and supplier records with complete transaction history and annual purchase tracking.",
  },
  {
    icon: <Package className="w-8 h-8" />,
    title: "Smart Inventory",
    desc: "Track stock in Bags, Packets, Kg, and Grams with reorder alerts and product image uploads.",
  },
  {
    icon: <Receipt className="w-8 h-8" />,
    title: "Automated Billing",
    desc: "Auto-generate professional bills with all customer details, line items, and payment tracking.",
  },
];

const KEY_FEATURES = [
  { icon: <BarChart3 className="w-7 h-7" />, title: "Sales Analytics" },
  { icon: <Sprout className="w-7 h-7" />, title: "Seed Catalog" },
  { icon: <Shield className="w-7 h-7" />, title: "Secure Login" },
  { icon: <Clock className="w-7 h-7" />, title: "Due Date Tracking" },
];

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [heroSlide, setHeroSlide] = useState(0);

  const year = new Date().getFullYear();

  return (
    <div className="min-h-screen font-body" style={{ background: CREAM }}>
      {/* ─── Navbar ─── */}
      <header
        className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 md:px-12 py-4"
        style={{ background: GREEN, borderBottom: `2px solid ${GOLD}` }}
      >
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/assets/generated/lbb-logo-transparent.dim_120x120.png"
            alt="LBB Logo"
            className="w-10 h-10 rounded-full object-cover"
          />
          <span
            className="font-display font-bold text-lg leading-tight"
            style={{ color: GOLD }}
          >
            Laxmi Beej Bhandar
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase().replace(/\s+/g, "-")}`}
              data-ocid="nav.link"
              className="text-sm font-medium transition-colors"
              style={{ color: "oklch(0.85 0.02 85)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = GOLD;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "oklch(0.85 0.02 85)";
              }}
            >
              {link}
            </a>
          ))}
        </nav>

        <Link to="/login" data-ocid="nav.primary_button">
          <Button
            className="text-sm font-semibold px-5 py-2 rounded-md"
            style={{ background: TERRACOTTA, color: "white", border: "none" }}
          >
            Login / Signup
          </Button>
        </Link>
      </header>

      {/* ─── Hero ─── */}
      <section
        className="relative flex items-center min-h-screen pt-20"
        style={{
          backgroundImage:
            "url('/assets/generated/hero-farm-field.dim_1920x900.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(31,59,42,0.88) 0%, rgba(31,59,42,0.55) 60%, transparent 100%)",
          }}
        />
        <div className="relative z-10 px-6 md:px-16 lg:px-24 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4"
              style={{
                background: "rgba(200,154,58,0.25)",
                color: GOLD,
                border: `1px solid ${GOLD}`,
              }}
            >
              <Leaf className="w-3 h-3" /> India's Trusted Seed Management
              System
            </div>
            <h1
              className="font-display font-bold leading-tight mb-4"
              style={{ fontSize: "clamp(36px, 5vw, 64px)", color: "white" }}
            >
              Laxmi Beej Bhandar
            </h1>
            <p
              className="text-lg mb-3"
              style={{ color: "oklch(0.88 0.03 85)" }}
            >
              Complete seed shop management — customers, suppliers,
            </p>
            <p
              className="text-lg mb-8"
              style={{ color: "oklch(0.88 0.03 85)" }}
            >
              inventory, billing & analytics — all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/signup" data-ocid="hero.primary_button">
                <Button
                  className="px-8 py-3 text-base font-semibold rounded-md"
                  style={{
                    background: TERRACOTTA,
                    color: "white",
                    border: "none",
                  }}
                >
                  Explore Your Dashboard
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
              <Link to="/login" data-ocid="hero.secondary_button">
                <Button
                  variant="outline"
                  className="px-8 py-3 text-base font-semibold rounded-md"
                  style={{
                    borderColor: GOLD,
                    color: GOLD,
                    background: "transparent",
                  }}
                >
                  Login
                </Button>
              </Link>
            </div>
            {/* Slider dots */}
            <div className="flex items-center gap-2 mt-6">
              {[0, 1, 2].map((i) => (
                <button
                  type="button"
                  key={`slide-dot-${i}`}
                  onClick={() => setHeroSlide(i)}
                  className="transition-all rounded-full"
                  style={{
                    width: heroSlide === i ? "24px" : "8px",
                    height: "8px",
                    background: heroSlide === i ? GOLD : "rgba(200,154,58,0.4)",
                  }}
                />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right floating stats */}
        <motion.div
          className="hidden lg:block absolute right-16 bottom-16 z-10"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
        >
          <div
            className="rounded-xl p-5 space-y-3"
            style={{
              background: "rgba(255,255,255,0.12)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(200,154,58,0.3)",
            }}
          >
            {[
              {
                label: "Annual Revenue",
                value: "₹10.9L",
                icon: <TrendingUp className="w-4 h-4" />,
              },
              {
                label: "Total Customers",
                value: "500+",
                icon: <Users className="w-4 h-4" />,
              },
              {
                label: "Seed Varieties",
                value: "20+",
                icon: <Sprout className="w-4 h-4" />,
              },
            ].map(({ label, value, icon }) => (
              <div key={label} className="flex items-center gap-3">
                <div
                  className="rounded-full p-1.5"
                  style={{ background: "rgba(200,154,58,0.2)", color: GOLD }}
                >
                  {icon}
                </div>
                <div>
                  <div
                    className="text-lg font-bold font-display"
                    style={{ color: "white" }}
                  >
                    {value}
                  </div>
                  <div
                    className="text-xs"
                    style={{ color: "oklch(0.78 0.02 85)" }}
                  >
                    {label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ─── Gold Divider ─── */}
      <div
        className="h-1"
        style={{
          background: `linear-gradient(to right, transparent, ${GOLD}, transparent)`,
        }}
      />

      {/* ─── Transform Section ─── */}
      <section
        className="py-20 px-6 md:px-12 corner-pattern relative"
        style={{ background: CREAM }}
      >
        <div className="relative z-10 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2
              className="font-display font-bold mb-3"
              style={{ fontSize: "clamp(28px, 3.5vw, 40px)", color: GREEN }}
            >
              Transform Your Seed Business
            </h2>
            <div
              className="w-16 h-1 mx-auto rounded-full"
              style={{ background: GOLD }}
            />
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
              >
                <div
                  className="bg-white rounded-xl p-6 shadow-card h-full flex flex-col"
                  style={{ border: "1px solid oklch(0.88 0.04 85)" }}
                >
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
                    style={{ background: "oklch(0.94 0.04 148)", color: GREEN }}
                  >
                    {f.icon}
                  </div>
                  <h3
                    className="font-display font-semibold text-lg mb-2"
                    style={{ color: GREEN }}
                  >
                    {f.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "oklch(0.45 0.02 148)" }}
                  >
                    {f.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Key Features Tiles ─── */}
      <section className="py-16 px-6 md:px-12" style={{ background: "white" }}>
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-display font-bold text-center mb-10"
            style={{ fontSize: "clamp(24px, 3vw, 36px)", color: GREEN }}
          >
            Key Features
          </motion.h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {KEY_FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <div
                  className="flex flex-col items-center text-center py-7 px-4 rounded-xl"
                  style={{
                    border: "2px solid oklch(0.65 0.12 33)",
                    background: "oklch(0.99 0.01 85)",
                  }}
                >
                  <div style={{ color: TERRACOTTA }} className="mb-3">
                    {f.icon}
                  </div>
                  <p
                    className="text-sm font-semibold font-display"
                    style={{ color: GREEN }}
                  >
                    {f.title}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Dashboard Preview + Metrics ─── */}
      <section className="py-20 px-6 md:px-12" style={{ background: CREAM }}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          {/* Dashboard Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div
              className="rounded-xl overflow-hidden shadow-elevated"
              style={{ border: `2px solid ${GOLD}` }}
            >
              <div
                className="px-5 py-3 flex items-center gap-2"
                style={{ background: GREEN }}
              >
                <BarChart3 className="w-5 h-5" style={{ color: GOLD }} />
                <span
                  className="text-sm font-semibold"
                  style={{ color: "white" }}
                >
                  Sales Performance Dashboard
                </span>
              </div>
              <div className="p-5 bg-white">
                {/* Mini chart bars */}
                <div className="flex items-end gap-1.5 h-28 mb-3">
                  {[40, 62, 48, 75, 55, 88, 65, 72, 90, 82, 68, 55].map(
                    (h, i) => (
                      <div
                        key={`bar-${i}-${h}`}
                        className="flex-1 rounded-t transition-all"
                        style={{
                          height: `${h}%`,
                          background:
                            i === 9 ? TERRACOTTA : "oklch(0.38 0.07 148)",
                        }}
                      />
                    ),
                  )}
                </div>
                <div
                  className="flex justify-between text-xs"
                  style={{ color: "oklch(0.55 0.02 85)" }}
                >
                  <span>Jan</span>
                  <span>Apr</span>
                  <span>Jul</span>
                  <span>Oct</span>
                  <span>Dec</span>
                </div>
                <div className="mt-3 pt-3 border-t grid grid-cols-3 gap-2 text-center">
                  {[
                    { label: "Total Sales", value: "₹10.9L" },
                    { label: "Profit", value: "₹3.27L" },
                    { label: "Customers", value: "127" },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <div
                        className="text-base font-bold font-display"
                        style={{ color: GREEN }}
                      >
                        {value}
                      </div>
                      <div
                        className="text-xs"
                        style={{ color: "oklch(0.55 0.02 85)" }}
                      >
                        {label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Financial Metrics */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            <h2
              className="font-display font-bold mb-6"
              style={{ fontSize: "clamp(24px, 3vw, 36px)", color: GREEN }}
            >
              Financial Metrics
            </h2>
            {[
              {
                label: "Total Revenue (2025)",
                value: "₹10,90,000",
                color: GREEN,
              },
              {
                label: "Net Profit (2025)",
                value: "₹3,27,000",
                color: "oklch(0.38 0.07 148)",
              },
              { label: "Stock Value", value: "₹8,45,000", color: TERRACOTTA },
            ].map(({ label, value, color }) => (
              <div
                key={label}
                className="flex items-center justify-between p-4 rounded-xl bg-white shadow-xs"
                style={{ border: "1px solid oklch(0.88 0.04 85)" }}
              >
                <div>
                  <p
                    className="text-xs"
                    style={{ color: "oklch(0.5 0.02 85)" }}
                  >
                    {label}
                  </p>
                  <p
                    className="text-2xl font-bold font-display mt-0.5"
                    style={{ color }}
                  >
                    {value}
                  </p>
                </div>
                <Star className="w-5 h-5" style={{ color: GOLD }} />
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── Customer & Supplier Hub ─── */}
      <section className="py-20 px-6 md:px-12" style={{ background: "white" }}>
        <div className="max-w-5xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display font-bold mb-3"
            style={{ fontSize: "clamp(24px, 3vw, 36px)", color: GREEN }}
          >
            Customer & Supplier Hub
          </motion.h2>
          <div
            className="w-16 h-1 mx-auto rounded-full mb-10"
            style={{ background: GOLD }}
          />
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "Customers",
                icon: "👨‍🌾",
                features: [
                  "Complete purchase history",
                  "Annual purchase totals",
                  "Auto-generated bills",
                  "Due date & payment tracking",
                  "Phone & address records",
                ],
              },
              {
                title: "Suppliers",
                icon: "🏭",
                features: [
                  "Supplier transaction records",
                  "Payment & due tracking",
                  "Seed procurement history",
                  "Company & contact details",
                  "Annual supply value",
                ],
              },
            ].map((card) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-xl p-6 text-left"
                style={{
                  border: "2px solid oklch(0.88 0.04 85)",
                  background: CREAM,
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{card.icon}</span>
                  <h3
                    className="font-display font-bold text-xl"
                    style={{ color: GREEN }}
                  >
                    {card.title}
                  </h3>
                </div>
                <ul className="space-y-2">
                  {card.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2 text-sm"
                      style={{ color: "oklch(0.35 0.03 148)" }}
                    >
                      <div
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ background: GOLD }}
                      />
                      {f}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer style={{ background: GREEN }}>
        {/* Gold strip */}
        <div className="h-0.5" style={{ background: GOLD }} />
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-14 grid md:grid-cols-3 gap-10">
          {/* Quick Links */}
          <div>
            <h4
              className="font-display font-bold text-base mb-4"
              style={{ color: GOLD }}
            >
              Quick Links
            </h4>
            <ul className="space-y-2">
              {["Home", "Features", "Dashboard", "Blog", "Contact"].map(
                (link) => (
                  <li key={link}>
                    <a
                      href={`#${link.toLowerCase().replace(/ /g, "-")}`}
                      className="text-sm transition-colors"
                      style={{ color: "oklch(0.78 0.02 85)" }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = GOLD;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "oklch(0.78 0.02 85)";
                      }}
                    >
                      {link}
                    </a>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4
              className="font-display font-bold text-base mb-4"
              style={{ color: GOLD }}
            >
              Contact Info
            </h4>
            <ul className="space-y-3">
              <li
                className="flex items-start gap-2 text-sm"
                style={{ color: "oklch(0.78 0.02 85)" }}
              >
                <MapPin
                  className="w-4 h-4 mt-0.5 shrink-0"
                  style={{ color: GOLD }}
                />
                Main Market, Krishi Nagar, Lucknow, UP - 226001
              </li>
              <li
                className="flex items-center gap-2 text-sm"
                style={{ color: "oklch(0.78 0.02 85)" }}
              >
                <Phone className="w-4 h-4 shrink-0" style={{ color: GOLD }} />
                +91 98765 43210
              </li>
              <li
                className="flex items-center gap-2 text-sm"
                style={{ color: "oklch(0.78 0.02 85)" }}
              >
                <Mail className="w-4 h-4 shrink-0" style={{ color: GOLD }} />
                info@laxmibeejonline.in
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4
              className="font-display font-bold text-base mb-4"
              style={{ color: GOLD }}
            >
              Newsletter
            </h4>
            <p
              className="text-sm mb-4"
              style={{ color: "oklch(0.78 0.02 85)" }}
            >
              Get seasonal crop tips and seed updates in your inbox.
            </p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                data-ocid="footer.input"
                className="flex-1 text-sm"
                style={{
                  background: "oklch(0.28 0.05 148)",
                  borderColor: "oklch(0.36 0.05 148)",
                  color: "white",
                }}
              />
              <Button
                data-ocid="footer.primary_button"
                onClick={() => setEmail("")}
                style={{
                  background: TERRACOTTA,
                  color: "white",
                  border: "none",
                }}
              >
                Signup
              </Button>
            </div>
            <div className="flex items-center gap-3 mt-4">
              {["🌐", "📘", "📸", "🐦"].map((icon) => (
                <button
                  type="button"
                  key={icon}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm transition-transform hover:scale-110"
                  style={{ background: "oklch(0.28 0.05 148)" }}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div
          className="py-3 px-6 text-center text-xs"
          style={{
            background: "oklch(0.42 0.07 33)",
            color: "oklch(0.85 0.03 85)",
          }}
        >
          © {year}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-white transition-colors"
          >
            caffeine.ai
          </a>
        </div>
      </footer>
    </div>
  );
}
