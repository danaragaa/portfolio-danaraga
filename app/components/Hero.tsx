"use client";

import { motion } from "framer-motion";
import { trackEvent } from "@/lib/analytics";

export default function Hero() {
  return (
    <motion.section
      id="home"
      className="section hero"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <motion.p className="eyebrow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1, duration: 0.3 }}>
        Full-Stack Developer
      </motion.p>
      <motion.h1 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12, duration: 0.4 }}>
        Membangun produk digital yang cepat, rapi, dan user-friendly.
      </motion.h1>
      <motion.p className="muted" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18, duration: 0.4 }}>
        Saya membantu mengubah ide menjadi pengalaman web modern dengan performa
        tinggi.
      </motion.p>
      <motion.div className="hero-actions" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24, duration: 0.4 }}>
        <motion.a
          className="btn btn-primary"
          href="#projects"
          onClick={() => trackEvent("hero_primary_cta_click", { target: "projects" })}
          whileHover={{ y: -2, scale: 1.02 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          Lihat Project
        </motion.a>
        <motion.a
          className="btn btn-ghost"
          href="#contact"
          onClick={() => trackEvent("hero_secondary_cta_click", { target: "contact" })}
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          Hubungi Saya
        </motion.a>
      </motion.div>
      <motion.div
        className="hero-quick-actions"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.35 }}
      >
        <a
          href="mailto:danaragaa@gmail.com"
          onClick={() => trackEvent("hero_quick_email_click", { channel: "email" })}
        >
          Email langsung
        </a>
        <span aria-hidden="true">•</span>
        <a
          href="https://linkedin.com/in/username"
          target="_blank"
          rel="noreferrer"
          onClick={() => trackEvent("hero_quick_linkedin_click", { channel: "linkedin" })}
        >
          LinkedIn
        </a>
      </motion.div>
    </motion.section>
  );
}