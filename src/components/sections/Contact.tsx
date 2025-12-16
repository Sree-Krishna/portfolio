import React from 'react';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';

type ContactProps = {
  onSend?: () => void;
};

const Contact: React.FC<ContactProps> = ({ onSend }) => {
  return (
    <div className="container mx-auto max-w-4xl text-center">
      <h2 className="text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-red-600 bg-clip-text text-transparent">
        Let's Work Together
      </h2>
      <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
        Ready to bring your ideas to life? Let's discuss how we can create something amazing together.
      </p>
      <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
        <Button 
          size="lg" 
          className="bg-gradient-to-r from-blue-500 to-red-600 hover:from-blue-600 hover:to-red-700 transform transition-all duration-300 hover:scale-110 hover:shadow-2xl group px-8 py-4"
          onClick={onSend}
        >
          <Mail className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
          Send Message
        </Button>
        <Button 
          variant="outline" 
          size="lg" 
          className="border-gradient hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-red-600/10 transform transition-all duration-300 hover:scale-110 px-8 py-4"
        >
          Download Resume
        </Button>
      </div>
    </div>
  );
};

export default Contact;
