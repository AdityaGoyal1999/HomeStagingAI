import { Button } from "@chakra-ui/react";
import { ArrowRight, Play } from "lucide-react";
import heroImage from "../../assets/hero-staging-comparison.jpg";

const Hero = () => {
  return (
    <section className="pt-32 pb-20 px-4 bg-gradient-feature">
      <div className="container mx-auto text-center">
        <div className="max-w-4xl mx-auto mb-12">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent leading-tight">
            Transform Empty Houses Into Dream Homes with AI
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
            Sell properties 73% faster with AI-powered virtual staging. 
            Professional interior design in minutes, not weeks.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button variant="hero" size="xl" className="gap-2">
              Start Free Trial <ArrowRight className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="xl" className="gap-2">
              <Play className="h-5 w-5" /> Watch Demo
            </Button>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto">
          <img 
            src={heroImage} 
            alt="Before and after home staging comparison showing transformation from empty room to beautifully staged space"
            className="w-full rounded-2xl shadow-elegant"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">73%</div>
            <div className="text-muted-foreground">Faster Sales</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">$2.3K</div>
            <div className="text-muted-foreground">Average Price Increase</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">5 min</div>
            <div className="text-muted-foreground">Setup Time</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;