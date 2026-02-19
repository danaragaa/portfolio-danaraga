import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getNextProject, getProjectBySlug, getRelatedProjects, projects } from "@/app/data/projects";
import TrackedProjectLink from "@/app/components/TrackedProjectLink";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: `${project.title} Case Study`,
    description: project.description,
  };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const nextProject = getNextProject(project.slug);
  const relatedProjects = getRelatedProjects(project.slug, 2);

  return (
    <main className="container project-detail-page">
      <Link href="/#projects" className="project-back-link">
        ← Kembali ke Projects
      </Link>

      <section className="project-hero-card">
        <div className="project-hero-media">
          <Image
            src={project.image}
            alt={project.imageAlt}
            width={1200}
            height={720}
            priority
            unoptimized
            sizes="(max-width: 768px) 92vw, 1000px"
          />
        </div>
        <div className="project-hero-content">
          <p className="project-detail-period">{project.period}</p>
          <h1>{project.title}</h1>
          <p className="project-role">{project.role}</p>
          <p className="muted">{project.description}</p>
          <div className="tags project-detail-tags">
            {project.tech.map((item) => (
              <span key={item} className="tag">
                {item}
              </span>
            ))}
          </div>
          <div className="links">
            {project.liveUrl && (
              <a href={project.liveUrl} className="project-link" target="_blank" rel="noreferrer">
                Live Demo
              </a>
            )}
            {project.repoUrl && (
              <a href={project.repoUrl} className="project-link" target="_blank" rel="noreferrer">
                Source Code
              </a>
            )}
          </div>
        </div>
      </section>

      <section className="project-case-grid">
        <article className="project-case-card">
          <h2>Overview</h2>
          <p className="muted">{project.overview}</p>
        </article>

        <article className="project-case-card">
          <h2>Challenge</h2>
          <p className="muted">{project.challenge}</p>
        </article>

        <article className="project-case-card">
          <h2>Solution</h2>
          <p className="muted">{project.solution}</p>
        </article>

        <article className="project-case-card">
          <h2>Outcome</h2>
          <ul className="project-outcome-list">
            {project.outcome.map((item) => (
              <li key={item} className="muted">
                {item}
              </li>
            ))}
          </ul>
        </article>
      </section>

      {relatedProjects.length > 0 && (
        <section className="project-related-section">
          <h2>Related Projects</h2>
          <div className="project-related-grid">
            {relatedProjects.map((item) => (
              <article key={item.slug} className="project-related-card">
                <TrackedProjectLink
                  href={`/projects/${item.slug}`}
                  className="project-related-link"
                  eventName="project_related_click"
                  payload={{ from_project: project.slug, to_project: item.slug, section: "related_projects" }}
                >
                  <h3>{item.title}</h3>
                  <p className="muted">{item.description}</p>
                  <span className="project-related-meta">{item.role}</span>
                </TrackedProjectLink>
              </article>
            ))}
          </div>
        </section>
      )}

      {nextProject && (
        <section className="next-project-card">
          <p className="state-eyebrow">Next Project</p>
          <h2>{nextProject.title}</h2>
          <p className="muted">{nextProject.description}</p>
          <TrackedProjectLink
            href={`/projects/${nextProject.slug}`}
            className="project-link"
            eventName="project_next_click"
            payload={{ from_project: project.slug, to_project: nextProject.slug, section: "next_project" }}
          >
            Lihat Case Study Selanjutnya
          </TrackedProjectLink>
        </section>
      )}
    </main>
  );
}
