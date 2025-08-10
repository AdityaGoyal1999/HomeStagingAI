import { Button } from "@chakra-ui/react";
import { ArrowRight } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-20 px-4 bg-gradient-hero flex items-center justify-center bg-red-100" style={{ marginTop: '4rem', marginBottom: '4rem' }}>
      <div className="container mx-auto text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-primary-foreground" style={{ fontSize: '2rem', fontWeight: 'bold' }}>
            Ready to Sell Faster?
          </h2>
          <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 leading-relaxed" style={{ fontSize: '1.2rem', color: '#6b7280' }}>
            Join 10,000+ real estate professionals who trust StageAI to close more deals. 
            Start your free trial today - no credit card required.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button variant="cta" size="xl" className="gap-2" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
              Start Free 14-Day Trial <ArrowRight className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="xl" className="bg-white/10 border-white/20 text-white hover:bg-white/20" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
              Schedule Demo
            </Button>
          </div>
          
          <div className="flex items-center justify-center gap-8 text-primary-foreground/80 text-sm" style={{ fontSize: '1.2rem', color: '#6b7280' }}>
            <span style={{ fontSize: '1.2rem', color: '#6b7280' }}>✓ No credit card required</span>
            <span style={{ fontSize: '1.2rem', color: '#6b7280' }}>✓ 30-day money back guarantee</span>
            <span style={{ fontSize: '1.2rem', color: '#6b7280' }}>✓ Cancel anytime</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;