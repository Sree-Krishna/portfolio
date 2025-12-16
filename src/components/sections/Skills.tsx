import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Code, Brain } from 'lucide-react';

type SkillsProps = {
  skills: { development: string[]; ml: string[] };
};

const Skills: React.FC<SkillsProps> = ({ skills }) => {
  return (
    <section id="skills" className="py-16 px-4 lg:px-8">
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-400 to-red-600 bg-clip-text text-transparent">Skills & Expertise</h2>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="group hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/20 border-0 bg-gradient-to-br from-blue-500/5 to-transparent backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-blue-500/10 rounded-lg mr-4 group-hover:bg-blue-500/20 transition-colors">
                  <Code className="w-8 h-8 text-blue-500 group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="text-2xl font-semibold">Software Development</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {skills.development.map((skill, index) => (
                  <span key={skill} className="px-4 py-2 bg-blue-500/10 text-blue-400 rounded-full text-sm border border-blue-500/20 hover:bg-blue-500/20 hover:scale-105 transition-all duration-300 cursor-pointer text-center" style={{ animationDelay: `${index * 100}ms` }}>
                    {skill}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:shadow-red-500/20 border-0 bg-gradient-to-br from-red-500/5 to-transparent backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-red-500/10 rounded-lg mr-4 group-hover:bg-red-500/20 transition-colors">
                  <Brain className="w-8 h-8 text-red-500 group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="text-2xl font-semibold">Machine Learning</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {skills.ml.map((skill, index) => (
                  <span key={skill} className="px-4 py-2 bg-red-500/10 text-red-400 rounded-full text-sm border border-red-500/20 hover:bg-red-500/20 hover:scale-105 transition-all duration-300 cursor-pointer text-center" style={{ animationDelay: `${index * 100}ms` }}>
                    {skill}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Skills;
