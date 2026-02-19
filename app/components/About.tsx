"use client";

import { motion } from "framer-motion";

const highlights = [
  {
    value: "3+",
    label: "Tahun pengalaman",
    detail: "Membangun aplikasi web dari MVP hingga production.",
  },
  {
    value: "20+",
    label: "Project selesai",
    detail: "Landing page, dashboard, dan sistem internal bisnis.",
  },
  {
    value: "95%",
    label: "On-time delivery",
    detail: "Fokus pada kualitas rilis dan komunikasi progres.",
  },
];

export default function About() {
  return (
    <motion.section
      id="about"
      className="section"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <motion.h2
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.35, delay: 0.05, ease: "easeOut" }}
      >
        Tentang Saya
      </motion.h2>
      <motion.p
        className="muted"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.4, delay: 0.12, ease: "easeOut" }}
      >
        Saya fokus pada pengembangan web menggunakan React dan Next.js dengan
        pendekatan clean code, aksesibilitas, dan performa.
      </motion.p>

      <motion.div
        className="about-highlights"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.4, delay: 0.18, ease: "easeOut" }}
      >
        {highlights.map((item) => (
          <article key={item.label} className="highlight-card">
            <p className="highlight-value">{item.value}</p>
            <h3>{item.label}</h3>
            <p className="muted">{item.detail}</p>
          </article>
        ))}
      </motion.div>
    </motion.section>
  );
}