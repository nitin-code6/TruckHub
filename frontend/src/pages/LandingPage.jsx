import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import heroBg from "../assets/your-truck-bg.png";
import subHeroBg from "../assets/hero-truck.jpeg";

/* ================= MOTION PRESETS ================= */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const stagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.15 }
  }
};

const hoverLift = {
  whileHover: {
    y: -6,
    boxShadow: "0 20px 40px rgba(0,0,0,0.12)"
  }
};

export default function LandingPage() {
  return (
    <main className="w-full bg-[#f6f8fb] overflow-x-hidden">



      {/* ================= HERO ================= */}
      <section
        className="min-h-screen flex items-center"
        style={{ backgroundImage: `url(${heroBg})`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <motion.div variants={stagger} initial="hidden" animate="show" className="max-w-6xl mx-auto px-6 text-center">
          <motion.h1 variants={fadeUp} className="text-5xl md:text-6xl font-bold leading-tight">
            <span className="text-[#6EA8FE]">Track</span> and{" "}
            <span className="text-[#6EA8FE]">manage</span> your <br /> shipments with ease
          </motion.h1>

          <motion.p variants={fadeUp} className="mt-6 text-black/60 max-w-2xl mx-auto">
            TruckHub intelligently optimizes warehouse shipments, truck utilization, and delivery outcomes.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-10 flex justify-center gap-4">
            <Link to="/register" className="bg-black text-white px-8 py-4 rounded-xl">Get Started</Link>
            <Link to="/demo" className="border px-8 py-4 rounded-xl">View Demo</Link>
          </motion.div>

          <motion.div variants={stagger} className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-6">
            <Stat value="2.5x" label="Faster Matching" />
            <Stat value="20%" label="Cost Reduction" />
            <Stat value="90%" label="Utilization" />
            <Stat value="CO₂↓" label="Lower Emissions" />
          </motion.div>
        </motion.div>
      </section>

      {/* ================= WHY CHOOSE US ================= */}
      <motion.section variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="py-22 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">

          <div>
            <p className="text-sm text-[#6EA8FE] font-medium mb-3">WHY CHOOSE US</p>
            <h2 className="text-4xl font-semibold mb-6">
              Your Trusted Partner for <br /> Effortless Global Shipping
            </h2>
            <p className="text-black/60 mb-10 max-w-xl">
              From booking to delivery, we simplify every step of the shipping process.
            </p>

            <div className="space-y-6">
              <Feature title="Seamless Process" desc="Book, track, and manage shipments with just a few clicks." />
              <Feature title="Dedicated Team" desc="Our logistics experts ensure smooth handling from pickup to delivery." />
              <Feature title="24/7 Customer Support" desc="Get real-time updates and assistance whenever you need it." />
            </div>
          </div>

          <div className="relative flex justify-center md:justify-end">
            <div className="relative w-full max-w-[420px] h-[420px] sm:h-[480px] md:h-[620px] rounded-[28px] overflow-hidden">
              <img src={subHeroBg} alt="Shipping" className="w-full h-full object-cover" />
            </div>

            <div className="hidden md:block absolute bottom-14 right-[320px] bg-white rounded-2xl shadow-xl p-6 w-80">
              <p className="text-sm font-medium text-black/70 mb-2">Deliveries in Progress</p>
              <div className="flex items-center gap-2 mb-4">
                <p className="text-3xl font-semibold">82</p>
                <span className="text-[#6EA8FE] text-sm font-medium">+14%</span>
              </div>

              <div className="flex items-end gap-3 h-24">
                <div className="w-4 h-6 bg-[#1f2937] rounded-full" />
                <div className="w-4 h-9 bg-[#1f2937] rounded-full" />
                <div className="w-4 h-14 bg-[#1f2937] rounded-full" />
                <div className="w-4 h-10 bg-[#6EA8FE] rounded-full" />
                <div className="w-4 h-20 bg-[#6EA8FE] rounded-full" />
                <div className="w-4 h-7 bg-[#1f2937] rounded-full" />
                <div className="w-4 h-12 bg-[#6EA8FE] rounded-full" />
                <div className="w-4 h-16 bg-[#6EA8FE] rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ================= STREAMLINED SHIPPING (FIXED ALIGNMENT) ================= */}
      <section className="py-32 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">

          <h2 className="text-4xl md:text-5xl font-semibold mb-6">
            Streamlined Shipping <br /> Through End-to-End Global Logistics
          </h2>

          <p className="text-black/60 max-w-2xl mx-auto mb-12">
            TruckHub simplifies the entire supply chain — from pickup to global delivery.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-20">
            <FeaturePill text="Simplify your logistics with easy booking" />
            <FeaturePill text="End-to-end support for every shipment" />
            <FeaturePill text="Reliable & transparent at every stage" />
          </div>

          <div className="relative max-w-5xl mx-auto h-[260px] hidden md:block">
            <svg viewBox="0 0 1000 260" className="absolute inset-0 w-full h-full">
              <path
                d="M80 190 C 350 40, 650 40, 920 190"
                stroke="#CBD5E1"
                strokeWidth="3"
                strokeDasharray="6 6"
                fill="none"
              />
            </svg>

            <TimelineNode style={{ left: "8%", top: "120px" }} title="Pickup from Guangzhou" value="2 Packages, 16 Nov" />
            <TimelineNode style={{ left: "50%", top: "60px", transform: "translateX(-50%)" }} title="Transit to Jogja" value="2 Packages, 18 Nov" active />
            <TimelineNode style={{ right: "8%", top: "120px" }} title="Arrived at Dublin" value="2 Packages, 19 Nov" />
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
{/* ================= FOOTER (UPDATED) ================= */}
<footer className="bg-[#0b1220] text-gray-300">
  <div className="max-w-7xl mx-auto px-6 py-16 grid gap-10 sm:grid-cols-2 md:grid-cols-4">

    {/* BRAND */}
    <div>
      <h4 className="text-white text-lg font-semibold mb-3">
        TruckHub
      </h4>
      <p className="text-sm text-gray-400 leading-relaxed">
        Smart logistics platform for optimized shipments, better truck
        utilization, and lower carbon emissions.
      </p>
    </div>

    {/* PRODUCT */}
    <div>
      <h5 className="text-white font-medium mb-4">Product</h5>
      <ul className="space-y-2 text-sm">
        <li className="hover:text-white transition">Optimization</li>
        <li className="hover:text-white transition">Tracking</li>
        <li className="hover:text-white transition">Analytics</li>
      </ul>
    </div>

    {/* COMPANY */}
    <div>
      <h5 className="text-white font-medium mb-4">Company</h5>
      <ul className="space-y-2 text-sm">
        <li className="hover:text-white transition">About</li>
        <li className="hover:text-white transition">Careers</li>
        <li className="hover:text-white transition">Contact</li>
      </ul>
    </div>

    {/* LEGAL */}
    <div>
      <h5 className="text-white font-medium mb-4">Legal</h5>
      <ul className="space-y-2 text-sm">
        <li className="hover:text-white transition">Privacy Policy</li>
        <li className="hover:text-white transition">Terms & Conditions</li>
      </ul>
    </div>
  </div>

  {/* BOTTOM BAR */}
  <div className="border-t border-white/10 py-4 text-center text-sm text-gray-400">
    © {new Date().getFullYear()} SHIPMENT. All rights reserved.
  </div>
</footer>

    </main>
  );
}

/* ================= COMPONENTS ================= */

const Stat = ({ value, label }) => (
  <motion.div variants={fadeUp} {...hoverLift} className="bg-white rounded-xl p-6 border">
    <p className="text-3xl font-semibold">{value}</p>
    <p className="text-black/50 text-sm">{label}</p>
  </motion.div>
);

const Feature = ({ title, desc }) => (
  <motion.div variants={fadeUp} {...hoverLift} className="flex gap-4">
    <div className="w-10 h-10 rounded-lg bg-[#e6f0ff] flex items-center justify-center text-[#2563eb] font-semibold">✓</div>
    <div>
      <h4 className="font-medium">{title}</h4>
      <p className="text-black/60 text-sm">{desc}</p>
    </div>
  </motion.div>
);

const FeaturePill = ({ text }) => (
  <div className="flex items-center gap-2 px-5 py-3 border rounded-full text-sm text-black/70">
    <span className="text-green-500">✓</span>{text}
  </div>
);

const TimelineNode = ({ title, value, active, style }) => (
  <div className="absolute flex flex-col items-center text-center w-[220px]" style={style}>
    <div className={`w-20 h-20 rounded-full mb-6 ${active ? "bg-[#6EA8FE]" : "bg-[#0b1220]"}`} />
    <p className="text-black/60">{title}</p>
    <p className="font-semibold">{value}</p>
  </div>
);

const FooterCol = ({ title, items }) => (
  <div>
    <h5 className="text-white font-medium mb-3">{title}</h5>
    <ul className="space-y-2 text-sm">
      {items.map(i => <li key={i}>{i}</li>)}
    </ul>
  </div>
);