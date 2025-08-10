import { Card } from "@chakra-ui/react";   
import stagedBedroom from "../../assets/staged-bedroom.jpg";
import stagedKitchen from "../../assets/staged-kitchen.jpg";
import stagedLivingRoom from "../../assets/staged-living-room.jpg";

const BeforeAfter = () => {
  return (
    <section className="py-20 px-4 bg-muted/50">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            See the Transformation
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Real properties transformed with StageAI. These listings received 3x more views 
            and sold 60% faster than unstaged properties.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card.Root className="overflow-hidden shadow-card hover:shadow-elegant transition-all duration-300">
            <Card.Body className="p-0">
              <img 
                src={stagedLivingRoom} 
                alt="Professionally staged living room with modern furniture and decor"
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Modern Living Room</h3>
                <p className="text-muted-foreground mb-4">
                  Transformed empty space into an inviting living area that buyers could envision themselves in.
                </p>
                <div className="flex justify-between text-sm">
                  <span className="text-green-600 font-medium">Sold in 12 days</span>
                  <span className="text-primary font-medium">+$15K over asking</span>
                </div>
              </div>
            </Card.Body>
          </Card.Root>
          
          <Card.Root className="overflow-hidden shadow-card hover:shadow-elegant transition-all duration-300">
            <Card.Body className="p-0">
              <img 
                src={stagedKitchen} 
                alt="Professionally staged kitchen with modern appliances and styling"
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Gourmet Kitchen</h3>
                <p className="text-muted-foreground mb-4">
                  Added warmth and functionality with strategic styling that highlighted premium features.
                </p>
                <div className="flex justify-between text-sm">
                  <span className="text-green-600 font-medium">Sold in 8 days</span>
                  <span className="text-primary font-medium">+$22K over asking</span>
                </div>
              </div>
            </Card.Body>
          </Card.Root>
          
          <Card.Root className="overflow-hidden shadow-card hover:shadow-elegant transition-all duration-300">
            <Card.Body className="p-0">
              <img 
                src={stagedBedroom} 
                alt="Professionally staged bedroom with elegant decor and lighting"
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Master Bedroom</h3>
                <p className="text-muted-foreground mb-4">
                  Created a serene retreat that showcased the room's potential as a peaceful sanctuary.
                </p>
                <div className="flex justify-between text-sm">
                  <span className="text-green-600 font-medium">Sold in 6 days</span>
                  <span className="text-primary font-medium">+$18K over asking</span>
                </div>
              </div>
            </Card.Body>
          </Card.Root>
        </div>
      </div>
    </section>
  );
};

export default BeforeAfter;