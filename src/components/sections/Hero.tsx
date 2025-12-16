import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronDown } from 'lucide-react';

type HeroProps = {
  onViewProjects: () => void;
  onContact: () => void;
  neonBlue: string;
  neonRed: string;
};

const Hero: React.FC<HeroProps> = ({ onViewProjects, onContact, neonBlue, neonRed }) => {
  return (
    <div className="container mx-auto text-center max-w-4xl">
      <div>
        <div className="mb-8 relative">
          <div className="absolute inset-0 blur-3xl" style={{ background: `linear-gradient(90deg, ${neonBlue}44, ${neonRed}44)` }} />
          <h1 className="text-4xl md:text-7xl font-bold mb-6 relative">
            <span style={{
              background: `linear-gradient(90deg, ${neonBlue}, ${neonRed})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Sree Krishna Suresh
            </span>
            <br />
            <span style={{ color: neonRed }}>ML Engineer</span>
          </h1>
        </div>

        <p className="text-xl md:text-2xl mb-8 leading-relaxed" style={{ color: neonBlue }}>
          Crafting intelligent solutions at the intersection of software development and machine learning.
          <br />
          <span style={{ color: neonRed }}>
            Building scalable applications powered by AI.
          </span>
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            size="lg"
            style={{
              background: `linear-gradient(90deg, ${neonBlue}, ${neonRed})`,
              color: '#fff',
              boxShadow: `0 0 16px ${neonBlue}, 0 0 8px ${neonRed}`
            }}
            onClick={onViewProjects}
          >
            View My Work
            <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Button>

          <Button
            variant="outline"
            size="lg"
            style={{
              border: `2px solid ${neonRed}`,
              color: neonRed,
              boxShadow: `0 0 8px ${neonRed}`
            }}
            onClick={onContact}
          >
            Get In Touch
          </Button>
        </div>

        <div className="mt-12">
          <ChevronDown className="w-8 h-8 mx-auto" style={{ color: neonBlue, filter: `drop-shadow(0 0 8px ${neonBlue})` }} />
        </div>
      </div>
    </div>
  );
};

export default Hero;
