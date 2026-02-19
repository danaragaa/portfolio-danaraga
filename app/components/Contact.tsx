"use client";

import { motion } from "framer-motion";
import { FormEvent, useState } from "react";
import { trackEvent } from "@/lib/analytics";

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusType, setStatusType] = useState<"idle" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [formStartedAt, setFormStartedAt] = useState(() => Date.now());

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (isSubmitting) {
      return;
    }

    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();
    const website = String(formData.get("website") ?? "").trim();

    if (!name || !email || !message) {
      setStatusType("error");
      setStatusMessage("Silakan lengkapi nama, email, dan pesan terlebih dahulu.");
      return;
    }

    try {
      setIsSubmitting(true);
      setStatusType("idle");
      setStatusMessage("Mengirim pesan...");

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, message, website, formStartedAt }),
      });

      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        trackEvent("contact_submit_failed", { reason: result.message ?? "unknown" });
        throw new Error(result.message ?? "Gagal mengirim pesan.");
      }

      trackEvent("contact_submit_success", { channel: "form" });
      setStatusType("success");
      setStatusMessage(`Terima kasih ${name}, pesanmu berhasil dikirim. Saya akan segera merespons.`);
      form.reset();
      setFormStartedAt(Date.now());
    } catch (error) {
      trackEvent("contact_submit_failed", {
        reason: error instanceof Error ? error.message : "unknown",
      });
      setStatusType("error");
      setStatusMessage(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat mengirim pesan. Silakan coba lagi.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.section
      id="contact"
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
        Contact
      </motion.h2>
      <motion.p
        className="muted"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.4, delay: 0.12, ease: "easeOut" }}
      >
        Tertarik bekerja sama? Isi form singkat ini atau kirim email ke{" "}
        <motion.a
          href="mailto:danaragaa@gmail.com"
          whileHover={{ y: -1 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
        >
          danaragaa@gmail.com
        </motion.a>
        .
      </motion.p>
      <motion.form
        className="contact-form"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.4, delay: 0.18, ease: "easeOut" }}
        aria-busy={isSubmitting}
        onSubmit={handleSubmit}
      >
        <label htmlFor="contact-name">Nama</label>
        <input id="contact-name" name="name" type="text" placeholder="Nama kamu" maxLength={80} required />

        <label htmlFor="contact-email">Email</label>
        <input id="contact-email" name="email" type="email" placeholder="kamu@email.com" required />

        <label htmlFor="contact-message">Pesan</label>
        <textarea
          id="contact-message"
          name="message"
          rows={4}
          placeholder="Ceritakan kebutuhan project kamu..."
          maxLength={1200}
          required
        />

        <div className="hp-field" aria-hidden="true">
          <label htmlFor="contact-website">Website</label>
          <input
            id="contact-website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            defaultValue=""
          />
        </div>

        <input type="hidden" name="formStartedAt" value={formStartedAt} readOnly />

        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? "Mengirim..." : "Kirim Pesan"}
        </button>
        {statusMessage && (
          <p
            className={`form-status ${statusType === "error" ? "form-status-error" : ""}`}
            role={statusType === "error" ? "alert" : "status"}
            aria-live={statusType === "error" ? "assertive" : "polite"}
            aria-atomic="true"
          >
            {statusMessage}
          </p>
        )}
      </motion.form>
    </motion.section>
  );
}