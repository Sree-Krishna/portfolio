import React from 'react';
import { Button } from '@/components/ui/button';
import { Github, Linkedin } from 'lucide-react';

const About: React.FC = () => {
	return (
		<div className="container mx-auto max-w-6xl">
			<h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-400 to-red-600 bg-clip-text text-transparent">
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
						<Button variant="outline" size="sm" className="hover:scale-110 transition-transform group">
							<Github className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
							GitHub
						</Button>
						<Button variant="outline" size="sm" className="hover:scale-110 transition-transform group">
							<Linkedin className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
							LinkedIn
						</Button>
					</div>
				</div>

				<div className="flex justify-center">
					<div className="relative group">
						<div className="w-64 h-64 bg-gradient-to-br from-blue-400 to-red-600 rounded-full flex items-center justify-center transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
							<div className="w-60 h-60 bg-background rounded-full flex items-center justify-center transform transition-all duration-500 group-hover:scale-95">
								<div className="text-6xl transform transition-all duration-500 group-hover:scale-110">👨‍💻</div>
							</div>
						</div>
						<div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-red-600/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500" />
					</div>
				</div>
			</div>
		</div>
	);
};

export default About;
