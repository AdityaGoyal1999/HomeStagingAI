import {
    Accordion
  } from "@chakra-ui/react";
  
  const faqs = [
    {
      question: "How does AI virtual staging work?",
      answer: "Our AI analyzes your empty room photos and uses advanced machine learning to place realistic furniture, decor, and styling that matches the space's dimensions, lighting, and architectural features. The result is photorealistic staging that looks like professional interior design."
    },
    {
      question: "How long does it take to get staged photos?",
      answer: "Most staging requests are completed within 5 minutes. For complex properties or custom styling requests, it may take up to 24 hours. Our AI processes photos instantly, so you'll typically have your staged images ready to use immediately."
    },
    {
      question: "What file formats do you accept and provide?",
      answer: "We accept JPG, PNG, and HEIC files. We provide high-resolution JPG files suitable for MLS listings, print marketing, and online advertising. Professional and Enterprise plans include 4K and 8K resolution options."
    },
    {
      question: "Can I choose different design styles?",
      answer: "Yes! We offer 20+ design styles including modern, traditional, contemporary, minimalist, luxury, bohemian, and more. You can specify your preferred style for each room, and our AI will stage accordingly."
    },
    {
      question: "Is virtual staging legal and ethical?",
      answer: "Yes, virtual staging is widely accepted in real estate when properly disclosed. We recommend adding a disclaimer that photos contain virtual staging. This is standard practice and helps buyers understand that furniture is digitally added."
    },
    {
      question: "What's your refund policy?",
      answer: "We offer a 30-day money-back guarantee on all plans. If you're not completely satisfied with our service, contact us for a full refund. We also offer a 14-day free trial so you can test our service risk-free."
    },
    {
      question: "Do you offer team or brokerage discounts?",
      answer: "Yes! We offer volume discounts for teams of 5+ agents and custom enterprise solutions for large brokerages. Contact our sales team to discuss pricing for your specific needs and get a personalized quote."
    },
    {
      question: "Can I integrate with my existing MLS or marketing tools?",
      answer: "Our Professional and Enterprise plans include API access and direct integrations with popular MLS systems, marketing platforms, and CRM tools. We can also develop custom integrations for large brokerages."
    }
  ];
  
  const FAQ = () => {
    return (
      <section className="py-20 px-4 flex items-center justify-center" style={{ marginTop: '4rem' }}>
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontSize: '2rem', fontWeight: 'bold' }}>
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-muted-foreground" style={{ fontSize: '1.2rem', color: '#6b7280' }}>
              Everything you need to know about AI virtual staging
            </p>
          </div>
          
          <Accordion.Root type="single" collapsible className="space-y-4" style={{ marginTop: '2rem' }}>
            {faqs.map((faq, index) => (
              <Accordion.Item 
                key={index} 
                value={`item-${index}`}
                className="border border-border rounded-lg px-6"
              >
                <Accordion.ItemTrigger className="text-left hover:no-underline">
                  <span className="font-semibold" style={{ fontSize: '1.2rem', fontWeight: 'semibold' }}>{faq.question}</span>
                </Accordion.ItemTrigger>
                <Accordion.ItemContent className="text-muted-foreground leading-relaxed pb-4" style={{ fontSize: '1.2rem', color: '#6b7280' }}>
                  {faq.answer}
                </Accordion.ItemContent>
              </Accordion.Item>
            ))}
          </Accordion.Root>
          
          {/* <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4" style={{ fontSize: '1.2rem', color: '#6b7280' }}>
              Still have questions?
            </p>
            <p className="text-sm text-muted-foreground" style={{ fontSize: '1.2rem', color: '#6b7280' }}>
              Contact our support team at{" "}
              <a href="mailto:support@stageai.com" className="text-primary hover:underline" style={{ fontSize: '1.2rem', color: '#6b7280' }}>
                support@stageai.com
              </a>{" "}
              or schedule a demo call
            </p>
          </div> */}
        </div>
      </section>
    );
  };
  
  export default FAQ;