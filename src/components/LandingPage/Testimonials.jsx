import { Card } from "@chakra-ui/react";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Top Producing Agent",
    company: "Coldwell Banker",
    content: "StageAI has completely transformed my listing presentations. My properties now sell 65% faster and for an average of $20K more. The ROI is incredible.",
    rating: 5,
    avatar: "SJ"
  },
  {
    name: "Michael Chen",
    role: "Real Estate Broker",
    company: "Century 21",
    content: "The quality is indistinguishable from physical staging but at a fraction of the cost. My team has staged over 200 properties this year with amazing results.",
    rating: 5,
    avatar: "MC"
  },
  {
    name: "Jessica Martinez",
    role: "Luxury Home Specialist",
    company: "Sotheby's International",
    content: "For high-end properties, presentation is everything. StageAI delivers luxury staging that matches the caliber of our $2M+ listings.",
    rating: 5,
    avatar: "JM"
  },
  {
    name: "David Thompson",
    role: "Team Leader",
    company: "RE/MAX",
    content: "We've increased our listing conversion rate by 40% since implementing StageAI. Our sellers love seeing their empty homes transformed instantly.",
    rating: 5,
    avatar: "DT"
  },
  {
    name: "Amanda Foster",
    role: "Investment Property Specialist",
    company: "Keller Williams",
    content: "Perfect for flip properties and rentals. I can stage multiple units in minutes instead of days. Game-changer for my business.",
    rating: 5,
    avatar: "AF"
  },
  {
    name: "Robert Kim",
    role: "Commercial Agent",
    company: "CBRE",
    content: "Even for commercial spaces, StageAI helps potential buyers visualize the potential. Our office listings now move 50% faster.",
    rating: 5,
    avatar: "RK"
  }
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-20 px-4 bg-muted/50 flex items-center justify-center" style={{ marginTop: '4rem' }}>
      <div className="container mx-auto flex flex-col items-center justify-center">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontSize: '2rem', fontWeight: 'bold' }}>
            Trusted by 10,000+ Real Estate Professionals
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto" style={{ fontSize: '1.2rem', color: '#6b7280' }}>
            Join thousands of agents and brokers who are closing more deals and earning higher 
            commissions with AI-powered virtual staging.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" style={{ marginTop: '2rem' }}>
          {testimonials.map((testimonial, index) => (
            <Card.Root key={index} className="shadow-card hover:shadow-elegant transition-all duration-300">
              <Card.Body className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                
                <p className="text-muted-foreground mb-6 leading-relaxed" style={{ fontSize: '1.2rem', color: '#6b7280', marginTop: '1rem' }}>
                  "{testimonial.content}"
                </p>
                
                <div className="flex items-center gap-3" style={{ marginTop: '1rem' }}>
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-semibold text-sm">{testimonial.avatar}</span>
                  </div>
                  <div>
                    <div className="font-semibold" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role} • {testimonial.company}
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card.Root>
          ))}
        </div>
        
        <div className="text-center mt-16" style={{ marginTop: '2rem' }}>
          <div className="flex items-center justify-center gap-8 text-muted-foreground">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary" style={{ fontSize: '2rem', fontWeight: 'bold' }}>4.9/5</div>
              <div className="text-sm" style={{ fontSize: '1.2rem', color: '#6b7280' }}>Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary" style={{ fontSize: '2rem', fontWeight: 'bold' }}>10,000+</div>
              <div className="text-sm" style={{ fontSize: '1.2rem', color: '#6b7280' }}>Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary" style={{ fontSize: '2rem', fontWeight: 'bold' }}>500K+</div>
              <div className="text-sm" style={{ fontSize: '1.2rem', color: '#6b7280' }}>Properties Staged</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;