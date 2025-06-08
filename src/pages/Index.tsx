
import { useState, useEffect, useRef } from "react";
import { Menu, X, Github, Linkedin, Mail, ExternalLink, Code, Brain, Database, Star, ChevronDown, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Animated background particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      dx: number;
      dy: number;
      size: number;
      opacity: number;
    }> = [];

    // Create particles
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        dx: (Math.random() - 0.5) * 0.5,
        dy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, index) => {
        // Update position
        particle.x += particle.dx;
        particle.y += particle.dy;

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) particle.dx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.dy *= -1;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(59, 130, 246, ${particle.opacity})`;
        ctx.fill();

        // Connect nearby particles
        particles.slice(index + 1).forEach((otherParticle) => {
          const distance = Math.sqrt(
            Math.pow(particle.x - otherParticle.x, 2) +
            Math.pow(particle.y - otherParticle.y, 2)
          );

          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = `rgba(59, 130, 246, ${0.1 * (1 - distance / 100)})`;
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "about", "skills", "projects", "contact"];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  const skills = {
    development: ["React", "TypeScript", "Node.js", "Python", "AWS", "Docker"],
    ml: ["TensorFlow", "PyTorch", "Scikit-learn", "Pandas", "NumPy", "Jupyter"]
  };

  const projects = [
    {
      title: "AI-Powered Web Analytics",
      description: "Machine learning platform for real-time web analytics and user behavior prediction",
      tech: ["Python", "TensorFlow", "React", "AWS"],
      github: "#",
      demo: "#"
    },
    {
      title: "Smart Code Assistant",
      description: "VS Code extension using NLP to provide intelligent code suggestions and debugging",
      tech: ["TypeScript", "OpenAI API", "VS Code API"],
      github: "#",
      demo: "#"
    },
    {
      title: "Distributed Data Pipeline",
      description: "Scalable ETL pipeline for processing large datasets with real-time monitoring",
      tech: ["Python", "Apache Kafka", "Docker", "PostgreSQL"],
      github: "#",
      demo: "#"
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Animated Background Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0"
      />

      {/* Gradient Overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-transparent pointer-events-none z-0" />

      {/* Mouse follower effect */}
      <div
        className="fixed w-96 h-96 rounded-full pointer-events-none z-0 transition-all duration-300 ease-out"
        style={{
          background: `radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)`,
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
        }}
      />

      <div className="relative z-10">
        {/* Navigation */}
        <nav className="fixed top-0 w-full bg-background/70 backdrop-blur-xl border-b border-border/50 z-50 transition-all duration-300">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent animate-pulse">
                <Sparkles className="inline w-5 h-5 mr-2 text-blue-400" />
                Portfolio
              </div>
              
              {/* Desktop Menu */}
              <div className="hidden md:flex items-center space-x-8">
                {["Home", "About", "Skills", "Projects", "Contact"].map((item, index) => (
                  <button
                    key={item}
                    onClick={() => scrollToSection(item.toLowerCase())}
                    className={`text-sm font-medium transition-all duration-300 hover:text-primary hover:scale-110 relative group ${
                      activeSection === item.toLowerCase() ? "text-primary" : "text-muted-foreground"
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {item}
                    <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-600 transition-all duration-300 ${
                      activeSection === item.toLowerCase() ? "w-full" : "group-hover:w-full"
                    }`} />
                  </button>
                ))}
              </div>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden transform transition-transform duration-300 hover:scale-110"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
              <div className="md:hidden bg-background/90 backdrop-blur-xl border-t border-border/50 animate-fade-in">
                <div className="py-4 space-y-4">
                  {["Home", "About", "Skills", "Projects", "Contact"].map((item, index) => (
                    <button
                      key={item}
                      onClick={() => scrollToSection(item.toLowerCase())}
                      className="block w-full text-left px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-2"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Hero Section */}
        <section id="home" className="pt-20 pb-16 px-4 lg:px-8 min-h-screen flex items-center">
          <div className="container mx-auto text-center max-w-4xl">
            <div className="animate-fade-in">
              <div className="mb-8 relative">
                <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-blue-400/20 to-purple-600/20 rounded-full animate-pulse" />
                <h1 className="text-4xl md:text-7xl font-bold mb-6 relative">
                  <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent animate-gradient-x">
                    Software Developer
                  </span>
                  <br />
                  <span className="text-foreground">& ML Engineer</span>
                </h1>
              </div>
              
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed animate-fade-in" style={{ animationDelay: "200ms" }}>
                Crafting intelligent solutions at the intersection of software development and machine learning.
                <br />
                <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent font-semibold">
                  Building scalable applications powered by AI.
                </span>
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in" style={{ animationDelay: "400ms" }}>
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transform transition-all duration-300 hover:scale-110 hover:shadow-2xl group"
                  onClick={() => scrollToSection("projects")}
                >
                  View My Work
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-gradient hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-purple-600/10 transform transition-all duration-300 hover:scale-110"
                  onClick={() => scrollToSection("contact")}
                >
                  Get In Touch
                </Button>
              </div>
              
              <div className="mt-12 animate-bounce">
                <ChevronDown className="w-8 h-8 mx-auto text-muted-foreground" />
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-16 px-4 lg:px-8 bg-muted/20 backdrop-blur-sm">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              About Me
            </h2>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <p className="text-lg text-muted-foreground leading-relaxed transform transition-all duration-700 hover:text-foreground">
                  I'm a passionate developer who bridges the gap between traditional software engineering and 
                  cutting-edge machine learning. With expertise in both domains, I create intelligent applications 
                  that solve real-world problems.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed transform transition-all duration-700 hover:text-foreground">
                  My journey spans from building robust web applications to developing sophisticated ML models 
                  that power data-driven decisions. I thrive on turning complex algorithms into user-friendly solutions.
                </p>
                <div className="flex gap-4">
                  <Button variant="outline" size="sm" className="hover:scale-110 transition-transform duration-300 group">
                    <Github className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
                    GitHub
                  </Button>
                  <Button variant="outline" size="sm" className="hover:scale-110 transition-transform duration-300 group">
                    <Linkedin className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
                    LinkedIn
                  </Button>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="relative group">
                  <div className="w-64 h-64 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
                    <div className="w-60 h-60 bg-background rounded-full flex items-center justify-center transform transition-all duration-500 group-hover:scale-95">
                      <div className="text-6xl transform transition-all duration-500 group-hover:scale-110">👨‍💻</div>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="py-16 px-4 lg:px-8">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              Skills & Expertise
            </h2>
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
                      <span
                        key={skill}
                        className="px-4 py-2 bg-blue-500/10 text-blue-400 rounded-full text-sm border border-blue-500/20 hover:bg-blue-500/20 hover:scale-105 transition-all duration-300 cursor-pointer text-center"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="group hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20 border-0 bg-gradient-to-br from-purple-500/5 to-transparent backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="p-3 bg-purple-500/10 rounded-lg mr-4 group-hover:bg-purple-500/20 transition-colors">
                      <Brain className="w-8 h-8 text-purple-500 group-hover:scale-110 transition-transform" />
                    </div>
                    <h3 className="text-2xl font-semibold">Machine Learning</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {skills.ml.map((skill, index) => (
                      <span
                        key={skill}
                        className="px-4 py-2 bg-purple-500/10 text-purple-400 rounded-full text-sm border border-purple-500/20 hover:bg-purple-500/20 hover:scale-105 transition-all duration-300 cursor-pointer text-center"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-16 px-4 lg:px-8 bg-muted/20 backdrop-blur-sm">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              Featured Projects
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <Card 
                  key={index} 
                  className="group hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 border-0 bg-gradient-to-br from-primary/5 to-transparent backdrop-blur-sm cursor-pointer"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <CardContent className="p-6 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">{project.title}</h3>
                      <Star className="w-5 h-5 text-yellow-500 group-hover:scale-125 transition-transform" />
                    </div>
                    <p className="text-muted-foreground mb-6 leading-relaxed flex-grow group-hover:text-foreground transition-colors">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tech.map((tech, techIndex) => (
                        <span
                          key={tech}
                          className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs hover:bg-primary/20 transition-colors"
                          style={{ animationDelay: `${techIndex * 50}ms` }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-3 mt-auto">
                      <Button variant="outline" size="sm" className="flex-1 group/btn hover:scale-105 transition-transform">
                        <Github className="w-4 h-4 mr-2 group-hover/btn:rotate-12 transition-transform" />
                        Code
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 group/btn hover:scale-105 transition-transform">
                        <ExternalLink className="w-4 h-4 mr-2 group-hover/btn:rotate-12 transition-transform" />
                        Demo
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-16 px-4 lg:px-8">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              Let's Work Together
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              Ready to bring your ideas to life? Let's discuss how we can create something amazing together.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transform transition-all duration-300 hover:scale-110 hover:shadow-2xl group px-8 py-4"
              >
                <Mail className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                Send Message
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-gradient hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-purple-600/10 transform transition-all duration-300 hover:scale-110 px-8 py-4"
              >
                Download Resume
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-4 lg:px-8 border-t border-border/50 bg-muted/10 backdrop-blur-sm">
          <div className="container mx-auto text-center">
            <p className="text-muted-foreground mb-4">
              © 2024 Portfolio. Crafted with passion and precision.
            </p>
            <div className="flex justify-center space-x-6">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: "0.5s" }} />
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: "1s" }} />
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
