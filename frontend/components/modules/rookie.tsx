import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Progress } from "../ui/progress";

export const Rookie = () => {
  return (
    <div>
      <div className="flex justify-between items-center ">
        <div className="space-y-1 w-96">
          <p className="font-semibold text-2xl">Aptos Colombia</p>
          <p className="text-base text-gray-400">Start your journey in the Aptos ecosystem by setting up your wallet and navigating the Apt-terrains.</p>
          <Button>
            {" "}
            <Share2 className="mr-2 " /> Share
          </Button>
        </div>

        <div className="space-y-1">
          <div className="rounded-full border-[6px] border-gray-600 h-24 w-24 flex justify-center items-center">
            <p>0%</p>
          </div>

          <p className="font-semibold">Module Progress</p>
          <p className="text-base text-gray-400">We're calculating the progress of your module here</p>
        </div>
      </div>

      <Card className="bg-[url('/icons/module-bg.jpeg')] bg-cover bg-center h-[85vh] w-full mt-8 text-white bg-opacity-10">
  <CardContent className="grid grid-cols-2 gap-10 items-center justify-center p-10">
    
    {/* Level 1 */}
    <div className="flex flex-col gap-3 cursor-pointer">
      <p className="px-2 py-1 bg-yellow-200 font-semibold rounded-lg w-fit text-black">Level 1</p>
      <p className="text-xl font-semibold">Getting Started with Aptos</p>
      <p className="text-sm text-gray-300">
        Learn the basics of blockchain technology and how Aptos fits into the ecosystem. Set up your wallet and familiarize yourself with its features.
      </p>
      <div>
        <Progress className="h-4" value={0} />
        <p className="text-sm mt-1 ml-1">0% Completed</p>
      </div>
      <div className="space-y-0 w-fit bg-gray-200 rounded-md p-2 text-black">
        <div className="flex space-x-2 items-center">
          <img src="/icons/car.svg" className="h-6 w-6" />
          <p className="text-sm font-semibold">
            0 Points <span className="text-xs text-gray-600">out of 250</span>
          </p>
        </div>
      </div>
    </div>

    {/* Level 2 */}
    <div className="flex flex-col gap-3 cursor-pointer ml-6">
      <p className="px-2 py-1 bg-yellow-200 font-semibold rounded-lg w-fit text-black">Level 2</p>
      <p className="text-xl font-semibold">Understanding Smart Contracts</p>
      <p className="text-sm text-gray-300">
        Discover what smart contracts are and how they work on the Aptos platform. Learn to create simple contracts using Aptos tools.
      </p>
      <div>
        <Progress className="h-4" value={0} />
        <p className="text-sm mt-1 ml-1">0% Completed</p>
      </div>
      <div className="space-y-0 w-fit bg-gray-200 rounded-md p-2 text-black">
        <div className="flex space-x-2 items-center">
          <img src="/icons/car.svg" className="h-6 w-6" />
          <p className="text-sm font-semibold">
            0 Points <span className="text-xs text-gray-600">out of 250</span>
          </p>
        </div>
      </div>
    </div>

    {/* Level 3 */}
    <div className="flex flex-col gap-3 cursor-pointer mt-4">
      <p className="px-2 py-1 bg-yellow-200 font-semibold rounded-lg w-fit text-black">Level 3</p>
      <p className="text-xl font-semibold">Exploring Aptos Ecosystem</p>
      <p className="text-sm text-gray-300">
        Dive into the various components of the Aptos ecosystem, including dApps and services. Understand their roles and how they interact.
      </p>
      <div>
        <Progress className="h-4" value={0} />
        <p className="text-sm mt-1 ml-1">0% Completed</p>
      </div>
      <div className="space-y-0 w-fit bg-gray-200 rounded-md p-2 text-black">
        <div className="flex space-x-2 items-center">
          <img src="/icons/car.svg" className="h-6 w-6" />
          <p className="text-sm font-semibold">
            0 Points <span className="text-xs text-gray-600">out of 250</span>
          </p>
        </div>
      </div>
    </div>

    {/* Level 4 */}
    <div className="flex flex-col gap-3 cursor-pointer mt-4 ml-6">
      <p className="px-2 py-1 bg-yellow-200 font-semibold rounded-lg w-fit text-black">Level 4</p>
      <p className="text-xl font-semibold">Participating in the Aptos Community</p>
      <p className="text-sm text-gray-300">
        Engage with the Aptos community. Learn how to participate in forums, contribute to discussions, and stay updated with news and events.
      </p>
      <div>
        <Progress className="h-4" value={0} />
        <p className="text-sm mt-1 ml-1">0% Completed</p>
      </div>
      <div className="space-y-0 w-fit bg-gray-200 rounded-md p-2 text-black">
        <div className="flex space-x-2 items-center">
          <img src="/icons/car.svg" className="h-6 w-6" />
          <p className="text-sm font-semibold">
            0 Points <span className="text-xs text-gray-600">out of 250</span>
          </p>
        </div>
      </div>
    </div>
  </CardContent>
</Card>

    </div>
  );
};
