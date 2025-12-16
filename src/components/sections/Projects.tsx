import React from 'react';
import ProjectCard from './ProjectCard';

type Project = {
  title: string;
  description: string;
  tech: string[];
  github?: string;
  demo?: string;
};

const Projects: React.FC<{ projects: Project[] }> = ({ projects }) => {
  return (
    <section id="projects" className="py-16 px-4 lg:px-8 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-400 to-red-600 bg-clip-text text-transparent">Featured Projects</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((p, idx) => (
            <div key={idx} style={{ animationDelay: `${idx * 120}ms` }} className="animate-fade-in">
              <ProjectCard project={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
