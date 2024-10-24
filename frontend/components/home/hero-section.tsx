import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const HeroSection = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/modules");
  };

  return (
    <div className="flex flex-col gap-4 items-center mt-12">
      <p className="md:text-6xl text-3xl text-center font-semibold text-gray-50">
        
        <div className="flex space-x-0 items-center justify-center mt-2">
        <p className="text-center max-w-4xl font-semibold text-white">
            Run
          </p>
          <img src="/icons/aurora.svg" className="w-24 h-24" />
          <p className="text-center max-w-4xl font-semibold text- #5DEB5A">
            Aurora
          </p>
        </div>{" "}
        dApps on any web environment
      </p>
      <p className="text-gray-400 font-medium max-w-2xl mx-auto text-center">
        Access Aurora dApps across Web2 and Web3 environments. Easily create and share Nearer links on platforms like X,
        YouTube, and Reddit to unlock the future of Blockchain 🌟.
      </p>

      <Button
        onClick={handleGetStarted}
        size={"lg"}
        className="bg-[#5DEB5A] rounded-full hover:bg-[#5DEB5A] text-black font-semibold px-12 py-2"
      >
        Get Started
      </Button>

      {/* Todo; add image  */}
      <img src="/icons/bg.png" className="rounded-md mt-10 mb-1" />
    </div>
  );
};
