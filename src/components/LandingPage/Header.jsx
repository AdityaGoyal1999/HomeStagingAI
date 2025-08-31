import { Button, Text } from "@chakra-ui/react";
import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom"
import logo from "../../assets/logo.png";

const Header = () => {
  const navigate = useNavigate()

  return (
    <header className="fixed inset-x-0 top-0 bg-background/95 backdrop-blur-md border-b border-border z-50 flex justify-center min-h-20 bg-white" style={{ borderRadius: '10px', margin: '10px', boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.1)' }}>
      <div className="container mx-auto py-4 flex justify-between">
        <div className="flex items-center gap-2 overflow-hidden">
          
          <img 
                src={logo} 
                alt="StageAI Logo" 
                className="h-16 w-16 md:h-20 md:w-20 lg:h-24 lg:w-24"
                style={{
                  objectFit: 'cover',
                  objectPosition: 'center',
                  transform: 'scale(3)' 
                }}
              />
          <Text style={{ fontSize: '1.7rem', fontWeight: 'bold' }}>Home Staging AI</Text>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-foreground hover:text-primary transition-colors">Features</a>
          <a href="#pricing" className="text-foreground hover:text-primary transition-colors">Pricing</a>
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