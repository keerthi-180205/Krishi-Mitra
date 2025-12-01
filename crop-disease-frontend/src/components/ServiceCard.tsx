import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ServiceCardProps {
  title: string;
  description: string;
  image: string;
  tag: string;
  onClick?: () => void;
}

export const ServiceCard = ({ title, description, image, tag, onClick }: ServiceCardProps) => {
  return (
    <div 
      onClick={onClick}
      className="group relative overflow-hidden rounded-xl bg-[#242b3d] border border-gray-800 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl cursor-pointer"
    >
      {/* Image Container */}
      <div className="h-48 w-full overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#242b3d] to-transparent opacity-60" />
      </div>

      {/* Content Container */}
      <div className="p-6 relative">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-[#4CAF50] group-hover:text-white transition-colors">
            {title}
          </h3>
          {/* Tag */}
          <span className="rounded-full bg-[#4CAF50]/20 px-3 py-1 text-xs font-medium text-[#4CAF50] border border-[#4CAF50]/30">
            {tag}
          </span>
        </div>
        
        <p className="mb-6 text-sm text-gray-400 leading-relaxed line-clamp-3">
          {description}
        </p>

        {/* Footer: Action Button */}
        <div className="flex items-center justify-end mt-auto">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-[#4CAF50] hover:text-white hover:bg-[#4CAF50] gap-2 group/btn"
          >
            Try Now
            <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};