
import { ServiceCard } from "../components/ServiceCard"; // Changed to relative path
import { useNavigate } from "react-router-dom";
import { Bot, Sprout } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  // This is your Feature List
  const features = [
    {
      title: "Crop Disease Detection",
      description: "Our flagship feature. Upload a photo of your crop leaf to instantly detect diseases and get treatment remedies.",
      // Image: A close up of a leaf
      image: "https://images.unsplash.com/photo-1615811361269-6c8731c7f526?auto=format&fit=crop&q=80&w=1000",
      tag: "Main Feature",
      route: "/detection" // Redirects to your existing detection page
    },
    {
      title: "Fertilizer Recommender",
      description: "Get precise fertilizer recommendations based on your soil's nitrogen, phosphorus, and potassium levels.",
      // Image: Hands holding soil/fertilizer
      image: "https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&q=80&w=1000",
      tag: "Soil Health",
      route: "/fertilizer" // You need to create this page later
    },
    {
      title: "Crop Recommender",
      description: "Advanced algorithms suggest the most profitable and suitable crops for your specific weather and soil conditions.",
      // Image: A lush green field
      image: "https://images.unsplash.com/photo-1625246333195-5840507993eb?auto=format&fit=crop&q=80&w=1000",
      tag: "Smart Planning",
      route: "/crop-recommend" // You need to create this page later
    },
    {
      title: "AI Assistant",
      description: "Have questions about farming? Chat with our smart AI assistant for instant agricultural advice and tips.",
      // Image: Futuristic farming/tech
      image: "https://images.unsplash.com/photo-1535378437327-b7128d63743b?auto=format&fit=crop&q=80&w=1000",
      tag: "24/7 Support",
      route: "/ai-assistant" // You need to create this page later
    }
  ];

  return (
    <div className="min-h-screen bg-[#1a1f2c] font-sans text-gray-100">
      {/* Navbar - Using the one we designed earlier */}

      {/* Hero / Main Content */}
      <main className="container mx-auto px-4 py-16">
        
        {/* Header Section */}
        <div className="text-center mb-16 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="inline-block">
            <span className="bg-[#4CAF50]/10 border border-[#4CAF50]/20 text-[#4CAF50] px-6 py-2 rounded-full font-semibold flex items-center gap-2 mx-auto w-fit transition-all hover:bg-[#4CAF50]/20">
              <Sprout className="h-4 w-4" />
              Smart Agriculture
            </span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold text-white mt-6 tracking-tight">
            Farming Meets <span className="text-[#4CAF50]">Future</span>
          </h2>
          
          <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Empowering farmers with AI-driven tools for disease detection, 
            soil analysis, and smart crop planning.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <ServiceCard
              key={index}
              title={feature.title}
              description={feature.description}
              image={feature.image}
              tag={feature.tag}
              onClick={() => navigate(feature.route)}
            />
          ))}
        </div>

        {/* Quick Stats / Footer Banner (Optional Visual flair) */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-gray-800 pt-10">
          <div className="text-center">
            <h4 className="text-3xl font-bold text-[#4CAF50]">98%</h4>
            <p className="text-sm text-gray-500">Accuracy Rate</p>
          </div>
          <div className="text-center">
            <h4 className="text-3xl font-bold text-[#4CAF50]">24/7</h4>
            <p className="text-sm text-gray-500">AI Availability</p>
          </div>
          <div className="text-center">
            <h4 className="text-3xl font-bold text-[#4CAF50]">15+</h4>
            <p className="text-sm text-gray-500">Diseases Detectable</p>
          </div>
          <div className="text-center">
            <h4 className="text-3xl font-bold text-[#4CAF50]">Free</h4>
            <p className="text-sm text-gray-500">For Farmers</p>
          </div>
        </div>

        {/* Floating Chat Button */}
        <button 
          onClick={() => navigate('/ai-assistant')}
          className="fixed bottom-8 right-8 bg-[#4CAF50] hover:bg-[#43a047] text-white p-4 rounded-full shadow-2xl transition-all hover:scale-110 z-50 group"
        >
          <Bot className="h-8 w-8" />
          <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white text-black px-3 py-1 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Ask AI Assistant
          </span>
        </button>

      </main>
    </div>
  );
};

export default Home;