import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Navigation from '@/components/sections/Navigation';
import ParticleCanvas from '@/components/sections/ParticleCanvas';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Skills from '@/components/sections/Skills';
import Projects from '@/components/sections/Projects';
import Contact from '@/components/sections/Contact';
import Footer from '@/components/sections/Footer';
import JobChatWidget from '@/components/chat/JobChatWidget';
import { getRelevanceFromJD, PortfolioProject, PortfolioSkills } from '@/lib/relevance';

const neonBlue = '#3b82f6';
const neonRed = '#ef4444';

const Index: React.FC = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => setMousePosition({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'skills', 'projects', 'contact'];
      const current = sections.find(section => {
        const el = document.getElementById(section);
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        return rect.top <= 100 && rect.bottom >= 100;
      });
      if (current) setActiveSection(current);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const baseSkills: PortfolioSkills = {
    development: ['React', 'TypeScript', 'Node.js', 'Python', 'AWS', 'Docker'],
    ml: ['TensorFlow', 'PyTorch', 'Scikit-learn', 'Pandas', 'NumPy', 'Jupyter'],
  };

  const baseProjects: PortfolioProject[] = [
    { title: 'Crop Yield Prediction', description: 'Crop yield prediction using remote sensing data and a thorough statistical study about crop production', tech: ['Python', 'TensorFlow', 'React', 'AWS'], github: 'https://github.com/Sree-Krishna/Crop-Yield-Prediction-Using-Remote-Sensing-Data', demo: 'https://sites.google.com/view/crop-yield-analysis-prediction/home' },
    { title: 'Diebetic Retinopathy Classification', description: 'Classified the images based on severity', tech: ['TypeScript', 'OpenAI API', 'VS Code API'], github: 'https://github.com/Sree-Krishna/Diabetic-Blindness-Detection', demo: '#' },
    { title: 'Image Caption Generation', description: 'Generate descriptive captions for images using state-of-the-art deep learning techniques', tech: ['Python', 'Apache Kafka', 'Docker', 'PostgreSQL'], github: 'https://github.com/Sree-Krishna/Image-Caption-Generation-AI', demo: '#' },
    { title: 'Microsoft Conversational Agent', description: 'Information retrevial based on BM25 model', tech: ['Python', 'Apache Kafka', 'Docker', 'PostgreSQL'], github: 'https://github.com/Sree-Krishna/Microsoft-Conversational-Agent', demo: '#' },
    { title: 'Policy Recommendation System', description: 'Generate agriculture policy based on remote sensing data, textual data and statistical data', tech: ['Python', 'Apache Kafka', 'Docker', 'PostgreSQL'], github: 'https://github.com/Sree-Krishna/Policy_Recommendation', demo: 'https://policyrecommendation-cloudera.streamlit.app/' },
    { title: 'Auto Suggest Next Word', description: 'Generate the next word given a sentence', tech: ['Python', 'Apache Kafka', 'Docker', 'PostgreSQL'], github: 'https://github.com/Sree-Krishna/Autosuggest-Next-Word-Custom-GPT', demo: '#' },
  ];

  const [relevantSkills, setRelevantSkills] = useState<PortfolioSkills>(baseSkills);
  const [relevantProjects, setRelevantProjects] = useState<PortfolioProject[]>(baseProjects);

  // Parallax transforms
  const { scrollY } = useScroll();
  const heroTranslate = useTransform(scrollY, [0, 400], [0, -100]);
  const aboutTranslate = useTransform(scrollY, [400, 800], [0, -100]);
  const skillsTranslate = useTransform(scrollY, [800, 1200], [0, -100]);
  const projectsTranslate = useTransform(scrollY, [1200, 1600], [0, -100]);
  const contactTranslate = useTransform(scrollY, [1600, 2000], [0, -100]);

  const handleJDSubmit = async (jdText: string) => {
    const result = await getRelevanceFromJD(jdText, baseSkills, baseProjects);
    setRelevantSkills(result.skills);
    setRelevantProjects(result.projects);
    const sourceLabel = result.source === 'ai' ? 'AI (Gemini)' : 'Keyword fallback';
    return { message: `${result.explanation ?? 'Updated sections for relevance.'} • Source: ${sourceLabel}` };
  };

  return (
    <div className="min-h-screen text-foreground relative overflow-x-hidden" style={{ background: '#030305' }}>
      <ParticleCanvas />

      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute bottom-6 right-6 w-1/3 h-1/3 bg-gradient-to-tr from-red-500/10 via-blue-500/04 to-transparent blur-2xl opacity-22 animate-aurora2" />
        <svg className="absolute left-8 top-20 w-48 h-48 transform rotate-6 opacity-50 animate-float-slow" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="p1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0.9" />
            </linearGradient>
          </defs>
          <polygon points="10,10 90,25 90,75 10,90" fill="url(#p1)" opacity="0.05" />
          <polygon points="10,10 50,5 90,25 50,45" fill="#000" opacity="0.03" />
        </svg>
        <svg className="absolute right-20 top-40 w-60 h-60 transform -rotate-12 opacity-40 animate-float-slower" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="p2" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.9" />
            </linearGradient>
          </defs>
          <rect x="10" y="15" width="80" height="70" rx="8" fill="url(#p2)" opacity="0.04" />
          <rect x="20" y="25" width="60" height="50" rx="6" fill="#000" opacity="0.02" />
        </svg>
        <svg className="absolute left-1/2 top-6 w-40 h-40 -translate-x-1/2 transform rotate-3 opacity-40 animate-float" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="p3" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0.9" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="40" fill="url(#p3)" opacity="0.04" />
          <circle cx="50" cy="50" r="28" fill="#000" opacity="0.01" />
        </svg>
      </div>

      <div className="fixed w-96 h-96 rounded-full pointer-events-none z-0 transition-all duration-300 ease-out" style={{
        background: `radial-gradient(circle, ${neonBlue}33 0%, transparent 70%)`,
        left: mousePosition.x - 192,
        top: mousePosition.y - 192,
      }} />

      <div className="relative z-10">
        <motion.div initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: 'easeOut' }}>
          <Navigation activeSection={activeSection} onNavigate={(id: string) => scrollToSection(id)} />
        </motion.div>

        <motion.section id="home" style={{ y: heroTranslate } as any} className="pt-20 pb-16 px-4 lg:px-8 min-h-screen flex items-center">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, ease: 'easeOut' }} className="w-full">
            <Hero onViewProjects={() => scrollToSection('projects')} onContact={() => scrollToSection('contact')} neonBlue={neonBlue} neonRed={neonRed} />
          </motion.div>
        </motion.section>

        <motion.section id="about" style={{ y: aboutTranslate } as any} className="py-16 px-4 lg:px-8 bg-background/80 backdrop-blur-sm">
          <About />
        </motion.section>

        <motion.section id="skills" style={{ y: skillsTranslate } as any} className="py-16 px-4 lg:px-8">
          <Skills skills={relevantSkills} />
        </motion.section>

        <motion.section id="projects" style={{ y: projectsTranslate } as any} className="py-16 px-4 lg:px-8 bg-background/80 backdrop-blur-sm">
          <Projects projects={relevantProjects} />
        </motion.section>

        <motion.section id="contact" style={{ y: contactTranslate } as any} className="py-16 px-4 lg:px-8">
          <Contact onSend={() => scrollToSection('contact')} />
        </motion.section>

        <Footer neonBlue={neonBlue} />
      </div>

      <JobChatWidget onSubmit={handleJDSubmit} />
    </div>
  );
};

export default Index;
 
