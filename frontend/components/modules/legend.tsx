import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { Card, CardContent } from "../ui/card";

export const Legend = () => {
  return (
    <div>
      <div className="flex justify-between items-center ">
        <div className="space-y-1 w-96">
          <p className="font-semibold text-2xl">Thailand Beaches</p>
          <p className="text-base text-gray-400">
          Discover the intricacies of Aptos's governance and community engagement modules.
          </p>
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

      <Card className="bg-[url('/icons/module-bg.jpeg')] bg-cover bg-center h-[85vh] w-full mt-8 text-white bg-opacity-10 flex items-center justify-center">
        <CardContent className="flex flex-col items-center justify-center h-full text-center p-10">
          <h2 className="text-3xl font-bold mb-4">Coming Soon!</h2>
          <p className="text-lg text-gray-400 mb-6">
            We're cooking up something special in this module. Stay tuned for updates!
          </p>
          <p className="text-sm text-gray-300"></p>
        </CardContent>
      </Card>
    </div>
  );
};
