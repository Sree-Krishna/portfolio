import React from 'react';
import { Star, Github, ExternalLink } from 'lucide-react';
// Using anchors for Code/Demo to ensure they open the project's links directly

type Project = {
  title: string;
  description: string;
  tech: string[];
  github?: string;
  demo?: string;
};

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  return (
    <div className="group relative overflow-visible rounded-3xl border border-white/6 p-8 h-80 flex flex-col transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl bg-gradient-to-br from-white/5 via-sky-50/5 to-transparent backdrop-blur-md">
      {/* softer background lighting overlays */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute -top-6 -left-10 w-60 h-60 rounded-full bg-gradient-to-tr from-sky-300/30 to-transparent blur-3xl opacity-60" />
        <div className="absolute -bottom-8 -right-8 w-72 h-72 rounded-full bg-gradient-to-br from-rose-300/18 to-transparent blur-3xl opacity-45" />
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/3 to-transparent mix-blend-overlay" />
        {/* red-blue hover glow (fades in on group hover) */}
        <div className="absolute -inset-1 rounded-3xl blur-3xl opacity-0 group-hover:opacity-90 transition-opacity duration-300 pointer-events-none bg-gradient-to-r from-sky-400/35 via-transparent to-rose-400/35 mix-blend-screen" />
      </div>

      <div className="flex items-center justify-between mb-3 z-10">
        <h3 className="text-xl font-semibold text-foreground/95">{project.title}</h3>
        <Star className="w-5 h-5 text-amber-300" />
      </div>

      <p className="text-muted-foreground mb-4 flex-grow z-10">{project.description}</p>

      <div className="flex flex-wrap gap-2 mb-4 z-10">
        {project.tech.map((t) => (
          <span key={t} className="px-3 py-1 bg-white/6 text-foreground rounded-full text-xs font-medium">{t}</span>
        ))}
      </div>

      <div className="flex gap-3 mt-auto relative z-10">
        <a
          href={project.github || '#'}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${project.title} source on GitHub`}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm text-white bg-gradient-to-r from-sky-400 to-indigo-500 shadow-lg transition-transform transform hover:scale-105"
        >
          <ExternalLink className="w-4 h-4 mr-2 transition-transform group-hover:rotate-12" />
          <span>Code</span>
        </a>

        <a
          href={project.demo || '#'}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${project.title} demo`}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm text-slate-100 border border-white/10 bg-white/2 hover:bg-white/5 transition-transform transform hover:scale-105"
        >
          <ExternalLink className="w-4 h-4 mr-2 transition-transform group-hover:rotate-12" />
          <span>Demo</span>
        </a>
      </div>
    </div>
  );
};

export default ProjectCard;
