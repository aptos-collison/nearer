import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "../ui/card";

export const Menu = () => {
  const navigate = useNavigate();

  const handleRookie = () => {
    navigate("/rookie");
  };
  const handleCompetitor = () => {
    navigate("/competitor");
  };
  const handleChampion = () => {
    navigate("/champion");
  };
  const handleLegend = () => {
    navigate("/legend");
  };
  return (
    <>
      <div className="flex justify-between items-center mx-auto px-4 mt-6">
        <div className="">
          <p className="text-6xl font-medium md:w-[90%]">
            Race through modules and terrains to level up your Aptos character
          </p>

          <div className="flex justify-start items-end space-x-2">
            <p className="text-base text-gray-400">Join the coolest crypto hangout on Aptos</p>
            <img src="/public/icons/driver2.png" className="h-16 w-16 cursor-pointer" />
          </div>
        </div>

        <img src="/public/icons/driver.png" className="w-1/3" />
      </div>

      <div className="space-y-2 mt-6">
        {/* Add svg icon here */}
        <div className="flex items-center space-x-2">
          <img src="/public/icons/location.svg" className="h-6 w-6 bg-white rounded-full p-1 " />
          <p> Racing Arenas </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Card onClick={handleRookie} className="bg-transparent text-white cursor-pointer">
            <CardHeader className="flex flex-col gap-2">
              <p className="px-2 py-1 bg-teal-200 font-semibold rounded-lg w-fit text-black">ROOKIE</p>
              <p>Aptos Colombia</p>
              <p>
                Start your journey in the Aptos ecosystem by setting up your wallet and navigating the Apt-terrains.
              </p>
            </CardHeader>
            <CardContent>
              <img src="/public/icons/4.jpeg" className="h-[400px] w-full rounded-md" />
            </CardContent>
          </Card>

          <Card onClick={handleCompetitor} className="bg-transparent text-white cursor-pointer">
            <CardHeader className="flex flex-col gap-2">
              <p className="px-2 py-1 bg-teal-200 font-semibold rounded-lg w-fit text-black">COMPETITOR</p>
              <p>Arena de Madrid</p>
              <p>Explore deeper waves in the ecosystem. Catch up on DeFi, NFTs, and various aspects of it.</p>
            </CardHeader>
            <CardContent>
              <img src="/public/icons/2.jpeg" className="h-[400px] w-full rounded-md" />
            </CardContent>
          </Card>

          <Card onClick={handleChampion} className="bg-transparent text-white cursor-pointer">
            <CardHeader className="flex flex-col gap-2">
              <p className="px-2 py-1 bg-teal-200 font-semibold rounded-lg w-fit text-black">CHAMPION</p>
              <p>Times Square, Manhattan</p>
              <p>Dive into advanced lessons on smart contracts and token standards in the Aptos ecosystem.</p>
            </CardHeader>
            <CardContent>
              <img src="/public/icons/3.jpeg" className="h-[400px] w-full rounded-md" />
            </CardContent>
          </Card>

          <Card onClick={handleLegend} className="bg-transparent text-white cursor-pointer">
            <CardHeader className="flex flex-col gap-2">
              <p className="px-2 py-1 bg-teal-200 font-semibold rounded-lg w-fit text-black">LEGEND</p>
              <p>Thailand Beaches</p>
              <p>Discover the intricacies of Aptos's governance and community engagement modules.</p>
            </CardHeader>
            <CardContent>
              <img src="/public/icons/5.jpeg" className="h-[400px] w-full rounded-md" />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};
