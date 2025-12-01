import { Sprout, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";

export const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Logged out successfully");
      navigate("/auth"); // Redirect to login page
    } catch (error) {
      toast.error("Error logging out");
    }
  };

  return (
    <nav className="w-full bg-[#4CAF50] px-6 py-4 flex items-center justify-between shadow-lg">
      {/* Logo & Title - Click to go Home */}
      <div 
        className="flex items-center gap-3 cursor-pointer" 
        onClick={() => navigate("/")}
      >
        <div className="bg-white p-2 rounded-full">
          <Sprout className="h-6 w-6 text-[#4CAF50]" />
        </div>
        <h1 className="text-white text-2xl font-bold tracking-wide">
          Welcome to Krishi-Mitra
        </h1>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        
        {/* We removed the broken Calendar/Search buttons for now. 
            You can add them back when you build those features. */}

        {/* Feedback Button - Optional placeholder */}
        <Button className="bg-[#FDD835] text-black hover:bg-[#FBC02D] font-semibold rounded-full hidden sm:flex">
          Feedback
        </Button>

        {/* Logout Button - NOW WORKING */}
        <Button 
          variant="destructive" 
          className="rounded-full bg-red-500 hover:bg-red-600"
          onClick={handleLogout}
        >
          Logout
        </Button>

        {/* Theme Toggle */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-white bg-black/20 hover:bg-black/40 rounded-full"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </div>
    </nav>
  );
};