import Header from "../components/LandingPage/Header";
import Hero from "../components/LandingPage/Hero";
import Features from "../components/LandingPage/Features";
import BeforeAfter from "../components/LandingPage/BeforeAfter";
import Pricing from "../components/LandingPage/Pricing";
import Testimonials from "../components/LandingPage/Testimonials";
import FAQ from "../components/LandingPage/FAQ";
import CTA from "../components/LandingPage/CTA";
import Footer from "../components/LandingPage/Footer"


export default function LandingPage() {
    return (
        <div className="min-h-screen min-w-screen bg-gray-100">
            <Header />
            <Hero />
            <Features />
            <BeforeAfter />
            <Pricing />
            <Testimonials />
            <FAQ />
            {/* <CTA /> */}
            <Footer />
        </div>
    );
}