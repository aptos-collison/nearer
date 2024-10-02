import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const HeroSection = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/modules");
  };

  return (
    <div className="flex flex-col gap-3 items-center mt-12">
      <p className="md:text-6xl text-3xl text-center font-semibold">
        Run <span className="text-[#58cc02]">Aptos</span> Dapps on any web environment
      </p>
      <p className="text-gray-800 font-medium max-w-2xl mx-auto text-center">
        Access Aptos dApps across Web2 and Web3 environments. Easily create and share APT-links on platforms like X,
        YouTube, and Reddit to unlock webAPTOS 🌟.
      </p>

      <Button onClick={handleGetStarted} size={"lg"} className="bg-[#58cc02] rounded-full hover:bg-[#89e219] text-white font-semibold ">
        Get Started
      </Button>

      {/* Todo; add image  */}
      <img src="/icons/bg.png" className="rounded-md mt-6 mb-1" />
    </div>
  );
};
