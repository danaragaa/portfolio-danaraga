"use client";

import { AnimatePresence, motion, type Variants } from "framer-motion";
import { Arizonia } from "next/font/google";
import { useEffect, useRef, useState } from "react";
import { FaBars, FaGithub, FaInstagram, FaLinkedin, FaTimes } from "react-icons/fa";
import { trackEvent } from "@/lib/analytics";

const navItems = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

const socialLinks = [
  { label: "GitHub", href: "https://github.com/danaragaa", icon: FaGithub, platform: "github" },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/dana-raga7",
    icon: FaLinkedin,
    platform: "linkedin",
  },
  {
    label: "Instagram",
    href: "https://instagram.com/username/danaragaa",
    icon: FaInstagram,
    platform: "instagram",
  },
];

const arizonia = Arizonia({
  weight: "400",
  subsets: ["latin"],
});

const mobileMenuVariants: Variants = {
  hidden: { opacity: 0, x: 26 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.24, ease: "easeOut", when: "beforeChildren", staggerChildren: 0.05 },
  },
  exit: { opacity: 0, x: 26, transition: { duration: 0.18, ease: "easeIn" } },
};

const mobileItemVariants: Variants = {
  hidden: { opacity: 0, x: 12 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.2, ease: "easeOut" } },
};

const desktopNavVariants: Variants = {
  hidden: { opacity: 0, y: -6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut", staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const desktopNavItemVariants: Variants = {
  hidden: { opacity: 0, y: -4 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.22, ease: "easeOut" } },
};

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const mobileMenuRef = useRef<HTMLElement | null>(null);

  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    const sections = navItems
      .map((item) => document.querySelector<HTMLElement>(item.href))
      .filter((section): section is HTMLElement => Boolean(section));

    if (sections.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visibleEntries.length > 0) {
          setActiveSection(visibleEntries[0].target.id);
        }
      },
      {
        rootMargin: "-20% 0px -60% 0px",
        threshold: [0.25, 0.5, 0.75],
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isMenuOpen || !mobileMenuRef.current) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    const menuEl = mobileMenuRef.current;
    const focusable = Array.from(
      menuEl.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    );

    focusable[0]?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
        return;
      }

      if (event.key !== "Tab" || focusable.length === 0) {
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen]);

  return (
    <motion.header
      className="navbar"
      initial={{ opacity: 0, filter: "blur(8px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <div className="container navbar-inner">
        <motion.a
          href="#home"
          className={`brand ${arizonia.className}`}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05, ease: "easeOut" }}
        >
          Dana Raga
        </motion.a>
        <button
          type="button"
          className="menu-toggle"
          aria-label={isMenuOpen ? "Tutup menu" : "Buka menu"}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
        <nav className="nav-wrap">
          <motion.ul
            className="nav-list"
            variants={desktopNavVariants}
            initial="hidden"
            animate="visible"
          >
            {navItems.map((item) => (
              <motion.li key={item.href} variants={desktopNavItemVariants}>
                <a
                  href={item.href}
                  className={`nav-link ${activeSection === item.href.slice(1) ? "nav-link-active" : ""}`}
                  aria-current={activeSection === item.href.slice(1) ? "page" : undefined}
                >
                  {item.label}
                </a>
              </motion.li>
            ))}
          </motion.ul>
          <a
            href="#contact"
            className="nav-cta"
            aria-label="Hire me, buka section contact"
            onClick={() => trackEvent("navbar_hire_me_click", { source: "desktop" })}
          >
            Hire Me
          </a>
          <div className="social-links nav-social" aria-label="Social links">
            {socialLinks.map((item) => {
              const Icon = item.icon;

              return (
                <a
                  key={item.label}
                  href={item.href}
                  className="social-icon"
                  data-platform={item.platform}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={item.label}
                  onClick={() => trackEvent("navbar_social_click", { source: "desktop", platform: item.label })}
                >
                  <Icon />
                </a>
              );
            })}
          </div>
        </nav>
      </div>
      <AnimatePresence>
        {isMenuOpen && (
          <motion.nav
            id="mobile-menu"
            className="mobile-menu"
            ref={mobileMenuRef}
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <a
              href="#contact"
              className="mobile-cta"
              onClick={() => {
                trackEvent("navbar_hire_me_click", { source: "mobile" });
                closeMenu();
              }}
            >
              Hire Me
            </a>
            <motion.ul className="mobile-nav-list">
              {navItems.map((item) => (
                <motion.li key={item.href} variants={mobileItemVariants}>
                  <a
                    href={item.href}
                    className={activeSection === item.href.slice(1) ? "mobile-nav-active" : ""}
                    aria-current={activeSection === item.href.slice(1) ? "page" : undefined}
                    onClick={() => {
                      trackEvent("navbar_menu_click", { source: "mobile", target: item.label });
                      closeMenu();
                    }}
                  >
                    {item.label}
                  </a>
                </motion.li>
              ))}
            </motion.ul>
            <motion.div
              className="social-links mobile-social"
              aria-label="Social links"
              variants={mobileItemVariants}
            >
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
                    onClick={() => {
                      trackEvent("navbar_social_click", { source: "mobile", platform: item.label });
                      closeMenu();
                    }}
                  >
                    <Icon />
                  </a>
                );
              })}
            </motion.div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}