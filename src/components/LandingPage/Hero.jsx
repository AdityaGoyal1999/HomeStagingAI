import { Button } from "@chakra-ui/react";
import { ArrowRight, Play } from "lucide-react";
import heroImage from "../../assets/hero-staging-comparison.jpg";

const Hero = () => {
  return (
    <section className="pt-32 pb-20 px-4 bg-gray-100 flex items-center justify-center" style={{ paddingTop: '10rem' }}>
      <div className="container mx-auto text-center flex flex-col items-center justify-center mt-14">
        <div className="max-w-4xl mx-auto mb-12">
          <h1 className="mb-6" style={{ fontWeight: 'bold', fontSize: '4rem', color: '#1e40af' }}>
            Transform Empty Houses Into Dream Homes with AI
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed" style={{ fontSize: '1.5rem', color: '#6b7280' }}>
            Sell properties 73% faster with AI-powered virtual staging. 
            Professional interior design in minutes, not weeks.
          </p>
          
          {/* <div className="flex flex-col gap-4 justify-center mb-12">
            <Button variant="hero" size="xl" className="gap-2">
              Start Free Trial <ArrowRight className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="xl" className="gap-2">
              <Play className="h-5 w-5" /> Watch Demo
            </Button>
          </div> */}
        </div>
        
        <div className="max-w-6xl mx-auto" style={{ marginTop: '2rem' }}>
          <img 
            src={heroImage} 
            alt="Before and after home staging comparison showing transformation from empty room to beautifully staged space"
            className="w-full rounded-2xl shadow-lg"
          />
        </div>
        
        <div className="grid grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto" style={{ marginTop: '2rem' }}>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2" style={{ fontSize: '2rem', fontWeight: 'bold' }}>73%</div>
            <div className="text-gray-600" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Faster Sales</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2" style={{ fontSize: '2rem', fontWeight: 'bold' }}>$2.3K</div>
            <div className="text-gray-600" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Average Price Increase</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2" style={{ fontSize: '2rem', fontWeight: 'bold' }}>5 min</div>
            <div className="text-gray-600" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Setup Time</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;