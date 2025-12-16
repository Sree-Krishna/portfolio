import React from 'react';
import { Code, Brain } from 'lucide-react';

const SkillItem: React.FC<{ name: string; isDev?: boolean }> = ({ name, isDev = true }) => {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/30 to-red-500/30 flex items-center justify-center text-2xl shadow-md">
        {isDev ? <Code /> : <Brain />}
      </div>
      <span className="text-blue-100/90 text-sm font-medium">{name}</span>
    </div>
  );
};

export default SkillItem;
