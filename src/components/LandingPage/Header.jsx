import { Button } from "@chakra-ui/react";
import { Sparkles } from "lucide-react";

const Header = () => {
  return (
    <header className="fixed top-0 w-full bg-background/95 backdrop-blur-md border-b border-border z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold text-primary">StageAI</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-foreground hover:text-primary transition-colors">Features</a>
          <a href="#pricing" className="text-foreground hover:text-primary transition-colors">Pricing</a>
          <a href="#testimonials" className="text-foreground hover:text-primary transition-colors">Testimonials</a>
        </nav>
        
        <div className="flex items-center gap-4">
          <Button variant="ghost">Sign In</Button>
          <Button variant="hero" size="lg">Get Started</Button>
        </div>
      </div>
    </header>
  );
};

export default Header;