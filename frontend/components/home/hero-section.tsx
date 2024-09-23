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
        Learn, Earn and Turbo through possiblities on <span className="text-yellow-400">Aptos</span>{" "}
      </p>
      <p className="text-gray-400 font-medium">Your easy guide to all things onchain, one wave at a time</p>
      <Button
        onClick={handleGetStarted}
        size={"lg"}
        className="bg-yellow-400 rounded-full hover:bg-yellow-300 text-black"
      >
        Get Started
      </Button>

      {/* Todo; add image  */}
      <img src="/public/icons/landing.png" className="rounded-md mt-6 mb-1" />
    </div>
  );
};
