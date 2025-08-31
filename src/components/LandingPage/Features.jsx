import { Card } from "@chakra-ui/react";
import { Zap, Palette, DollarSign, Clock, Users, BarChart3 } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "AI-Powered Staging",
    description: "Advanced AI algorithms instantly generate photorealistic staged interiors tailored to your property type and target market."
  },
  {
    icon: Palette,
    title: "Multiple Style Options",
    description: "Choose from dozens of interior design styles including modern, traditional, minimalist, and luxury to match buyer preferences."
  },
  {
    icon: Clock,
    title: "Instant Results",
    description: "Get professionally staged photos in less than 15 seconds. No waiting weeks for physical staging or photographer schedules."
  },
  {
    icon: DollarSign,
    title: "95% Cost Savings",
    description: "Virtual staging costs a fraction of traditional staging while delivering the same sales impact and buyer engagement."
  },
  // {
  //   icon: Users,
  //   title: "MLS Integration",
  //   description: "Seamlessly integrate with your MLS and marketing platforms. Bulk process multiple properties with one click."
  // },
  // {
  //   icon: BarChart3,
  //   title: "Performance Analytics",
  //   description: "Track which staging styles generate the most views, leads, and offers to optimize your marketing strategy."
  // }
];

const Features = () => {
  return (
    <section id="features" className="py-20 px-4 flex items-center justify-center" style={{ marginTop: '4rem' }}>
      <div className="container mx-auto">
        <div className="text-center mb-16 flex flex-col items-center justify-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontSize: '2rem', fontWeight: 'bold' }}>
            Everything You Need to Stage & Sell Faster
          </h2>
          {/* <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Professional-grade virtual staging powered by cutting-edge AI technology. 
            Trusted by over 10,000 real estate professionals worldwide.
          </p> */}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" style={{ marginTop: '2rem' }}>
          {features.map((feature, index) => (
            <Card.Root key={index} 
              // style={{ "&:hover": { shadow: 'lg', transition: 'all 0.3s ease' } }}
              >
              <Card.Body className="p-6">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed" style={{ fontSize: '1.2rem', color: '#6b7280' }}>{feature.description}</p>
              </Card.Body>
            </Card.Root>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;