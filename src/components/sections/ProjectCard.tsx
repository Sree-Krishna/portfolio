import React from 'react';
import { Star, Github, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Project = {
  title: string;
  description: string;
  tech: string[];
  github?: string;
  demo?: string;
};

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  return (
    <div className="group rounded-2xl border-0 p-6 flex flex-col transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/20 bg-gradient-to-br from-primary/5 to-transparent backdrop-blur-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xl font-semibold text-foreground/90">{project.title}</h3>
        <Star className="w-5 h-5 text-yellow-400" />
      </div>

      <p className="text-muted-foreground mb-4 flex-grow">{project.description}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {project.tech.map((t) => (
          <span key={t} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">{t}</span>
        ))}
      </div>

      <div className="flex gap-3 mt-auto">
        <Button variant="outline" size="sm" className="flex-1 group/btn hover:scale-105 transition-transform">
          <Github className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
          Code
        </Button>
        <Button variant="outline" size="sm" className="flex-1 group/btn hover:scale-105 transition-transform">
          <ExternalLink className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
          Demo
        </Button>
      </div>
    </div>
  );
};

export default ProjectCard;
