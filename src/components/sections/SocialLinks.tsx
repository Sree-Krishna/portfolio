import React from 'react';
import { Github, Linkedin } from 'lucide-react';

const SocialLinks: React.FC = () => {
  return (
    <div className="flex gap-3 items-center">
      <a className="text-blue-400 hover:bg-blue-400/10 p-2 rounded-md" href="#">GitHub</a>
      <a className="text-blue-400 hover:bg-blue-400/10 p-2 rounded-md" href="#">LinkedIn</a>
    </div>
  );
};

export default SocialLinks;
