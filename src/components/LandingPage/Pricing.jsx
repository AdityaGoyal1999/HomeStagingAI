import { Card, Button } from "@chakra-ui/react";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "$29",
    period: "/month",
    description: "Perfect for individual agents",
    features: [
      "10 staged photos per month",
      "5 design styles",
      "HD quality exports",
      "Email support",
      "Basic analytics"
    ],
    cta: "Start Free Trial",
    popular: false
  },
  {
    name: "Professional",
    price: "$79",
    period: "/month",
    description: "For growing real estate teams",
    features: [
      "50 staged photos per month",
      "20+ design styles",
      "4K quality exports",
      "Priority support",
      "Advanced analytics",
      "MLS integration",
      "Team collaboration"
    ],
    cta: "Get Started",
    popular: true
  },
  {
    name: "Enterprise",
    price: "$199",
    period: "/month",
    description: "For large brokerages",
    features: [
      "Unlimited staged photos",
      "All design styles",
      "8K quality exports",
      "Dedicated account manager",
      "Custom analytics dashboard",
      "API access",
      "White-label options",
      "Custom training"
    ],
    cta: "Start Free Trial",
    popular: false
  }
];

const Pricing = () => {
  return (
    <section id="pricing" className="py-20 px-4 flex items-center justify-center" style={{ marginTop: '4rem' }}>
      <div className="container mx-auto flex flex-col items-center justify-center">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontSize: '2rem', fontWeight: 'bold' }}>
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose the plan that fits your business. All plans include a 14-day free trial. 
            No setup fees, no hidden costs.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto" style={{ marginTop: '2rem' }}>
          {plans.map((plan, index) => (
            <Card.Root 
              key={index} 
              className={`relative shadow-card hover:shadow-elegant transition-all duration-300 ${
                plan.popular ? 'border-primary border-2 scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-cta text-secondary-foreground px-4 py-2 rounded-full text-sm font-semibold" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                    Most Popular
                  </span>
                </div>
              )}
              
              <Card.Header className="text-center pb-8" style={{ borderRadius: '10px', boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.1)' }} >
                <Card.Title className="text-2xl mb-2" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{plan.name}</Card.Title>
                <div className="mb-2">
                  <span className="text-4xl font-bold" style={{ fontSize: '2rem', fontWeight: 'bold' }}>{plan.price}</span>
                  <span className="text-muted-foreground" style={{ fontSize: '1.2rem', color: '#6b7280' }}>{plan.period}</span>
                </div>
                <p className="text-muted-foreground">{plan.description}</p>
              </Card.Header>
              
              <Card.Body>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  variant="outline"
                  className="w-full" 
                  size="lg"
                  style={{ fontSize: '1rem', fontWeight: 'bold', marginTop: '1rem' }}
                >
                  {plan.cta}
                </Button>
              </Card.Body>
            </Card.Root>
          ))}
        </div>
        
        <div className="text-center mt-16" style={{ marginTop: '2rem' }}>
          <p className="text-muted-foreground mb-4" style={{ fontSize: '1.2rem', color: '#6b7280' }}>
            All plans include our 30-day money-back guarantee
          </p>
          <p className="text-sm text-muted-foreground" style={{ fontSize: '1.2rem', color: '#6b7280' }}>
            Need a custom solution? <a href="#" className="text-primary hover:underline" style={{ fontSize: '1.2rem', color: '#6b7280' }}>Contact our sales team</a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;