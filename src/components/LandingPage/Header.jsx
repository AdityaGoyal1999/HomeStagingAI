import { Button } from "@chakra-ui/react";
import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom"

const Header = () => {
  const navigate = useNavigate()

  return (
    <header className="fixed inset-x-0 top-0 bg-background/95 backdrop-blur-md border-b border-border z-50 flex justify-center min-h-20 bg-white" style={{ borderRadius: '10px', margin: '10px', boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.1)' }}>
      <div className="container mx-auto px-4 py-4 flex justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-15 w-15 text-primary" />
          <span className="text-2xl font-bold text-primary">StageAI</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-foreground hover:text-primary transition-colors">Features</a>
          <a href="#pricing" className="text-foreground hover:text-primary transition-colors">Pricing</a>
          {/* <a href="#testimonials" className="text-foreground hover:text-primary transition-colors">Testimonials</a> */}
        </nav>
        
        <div className="flex items-center gap-4">
          <Button variant="hero" size="lg" onClick={() => navigate("/login")}>Sign In</Button>
          <Button variant="hero" size="lg" onClick={() => navigate("/login")}>Get Started</Button>
        </div>
      </div>
    </header>
  );
};

export default Header;