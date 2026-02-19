"use client";

import { motion } from "framer-motion";
import { FaGithub, FaLinkedin } from "react-icons/fa";

const socialLinks = [
  { label: "GitHub", href: "https://github.com/danaragaa", icon: FaGithub, platform: "github" },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/dana-raga7",
    icon: FaLinkedin,
    platform: "linkedin",
  },
];

export default function Footer() {
  return (
    <motion.footer
      className="footer"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.8 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="container footer-inner">
        <p>© {new Date().getFullYear()} Danaraga. All rights reserved.</p>
        <div className="social-links footer-social" aria-label="Social links">
          {socialLinks.map((item) => {
            const Icon = item.icon;

            return (
              <a
                key={item.label}
                href={item.href}
                data-platform={item.platform}
                target="_blank"
                rel="noreferrer"
                aria-label={item.label}
              >
                <Icon />
              </a>
            );
          })}
        </div>
      </div>
    </motion.footer>
  );
}