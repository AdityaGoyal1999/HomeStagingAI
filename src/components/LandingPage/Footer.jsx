import { Sparkles } from "lucide-react";
import logo from "../../assets/logo.png";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-16 px-4 flex items-center justify-center" style={{ marginTop: '4rem', paddingBottom: '4rem' }}>
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <img src={logo} 
                alt="StageAI Logo" 
                className="h-16 w-16 md:h-20 md:w-20 lg:h-24 lg:w-24" 
                style={{
                  objectFit: 'cover',
                  objectPosition: 'center',
                  transform: 'scale(3)' 
                }}
              />
              <span className="text-2xl font-bold" style={{ fontSize: '1rem', fontWeight: 'bold' }}>Home Staging AI</span>
            </div>
            <p className="text-background/80 mb-4 max-w-md">
              Transform empty properties into dream homes with AI-powered virtual staging. 
              Sell faster, earn more, and delight your clients.
            </p>
            {/* <div className="flex gap-4">
              <a href="#" className="text-background/60 hover:text-background transition-colors">
                LinkedIn
              </a>
              <a href="#" className="text-background/60 hover:text-background transition-colors">
                Twitter
              </a>
              <a href="#" className="text-background/60 hover:text-background transition-colors">
                Facebook
              </a>
            </div> */}
          </div>
          
          <div>
            {/* <h3 className="mb-4" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Product</h3> */}
            {/* <ul className="space-y-2 text-background/80">
              <li><a href="#" className="hover:text-background transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-background transition-colors">API</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Integrations</a></li>
            </ul> */}
          </div>
          
          <div>
            <h3 className="mb-4" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Support</h3>
            <ul className="space-y-2 text-background/80">
              {/* <li><a href="mailto:adityagoyaldoon@gmail.com" className="hover:text-background transition-colors">Help Center</a></li> */}
              <li><a href="mailto:adityagoyaldoon@gmail.com" className="hover:text-background transition-colors">Contact Us</a></li>
              {/* <li><a href="#" className="hover:text-background transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Terms of Service</a></li> */}
            </ul>
          </div>
        </div>
        
        <div className="border-t border-background/20 pt-8 flex flex-col md:flex-row justify-center items-center" style={{ marginTop: '2rem' }}>
          <p className="text-background/60 text-sm">
            © 2025 StageAI. All rights reserved.
          </p>
          <p className="text-background/60 text-sm">
            Made with ❤️ for real estate professionals
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;