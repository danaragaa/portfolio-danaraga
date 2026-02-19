"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics";
import { projects } from "../data/projects";

export default function Projects() {
  return (
    <motion.section
      id="projects"
      className="section"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <h2>Projects</h2>
      <div className="project-grid">
        {projects.map((project, index) => (
          <motion.article
            key={project.title}
            className="card"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -6 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: index * 0.08, duration: 0.35, ease: "easeOut" }}
          >
            <div className="project-media">
              <Image
                src={project.image}
                alt={project.imageAlt}
                width={1200}
                height={720}
                sizes="(max-width: 768px) 92vw, (max-width: 1200px) 44vw, 520px"
              />
            </div>
            <div className="project-head">
              <h3>
                <Link
                  href={`/projects/${project.slug}`}
                  className="project-title-link"
                  onClick={() => trackEvent("project_case_study_open", { project: project.title })}
                >
                  {project.title}
                </Link>
              </h3>
              <span className="project-period">{project.period}</span>
            </div>
            <p className="project-role">{project.role}</p>
            <p className="muted">{project.description}</p>
            <p className="project-impact">{project.impact}</p>
            <div className="tags">
              {project.tech.map((item) => (
                <motion.span
                  key={item}
                  className="tag"
                  whileHover={{ y: -1, scale: 1.04 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                >
                  {item}
                </motion.span>
              ))}
            </div>
            <div className="links project-actions">
              <Link
                href={`/projects/${project.slug}`}
                className="project-link"
                onClick={() => trackEvent("project_case_study_open", { project: project.title })}
              >
                Case Study
              </Link>
              {project.liveUrl && (
                <motion.a
                  href={project.liveUrl}
                  className="project-link"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => trackEvent("project_live_click", { project: project.title })}
                  whileHover={{ x: 2 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                >
                  Live Demo
                </motion.a>
              )}
              {project.repoUrl && (
                <motion.a
                  href={project.repoUrl}
                  className="project-link"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => trackEvent("project_repo_click", { project: project.title })}
                  whileHover={{ x: 2 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                >
                  Source Code
                </motion.a>
              )}
            </div>
          </motion.article>
        ))}
      </div>
    </motion.section>
  );
}