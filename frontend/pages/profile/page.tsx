import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { CopyIcon } from "lucide-react";
import React from "react";

export const ProfilePage = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="relative inline-block">
        <Avatar>
          <AvatarImage className="w-16 h-16 rounded-full" src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <p className="absolute left-0 bottom-0 w-6 h-6 rounded-full bg-gray-700 text-white flex items-center justify-center text-xs">
          56
        </p>
      </div>

      <div>
        <p className="text-lg">User</p>
        <div className="flex space-x-2 items-center">
          <p className="text-sm">0x4729...6517</p>
          <CopyIcon size={14} />
        </div>
        <Button size={"sm"} variant={"outline"} className="rounded-3xl h-8 mt-2 text-black">
          Edit profile
        </Button>

        <p className="mt-4">No bio available</p>

        <div className="flex items-center space-x-1">
          <img src="/public/icons/car.svg" className="h-6 w-6" />
          <p className="my-8">
            Riding the terrains since <span className="text-gray-400">September 18th 2024</span>{" "}
          </p>
        </div>
      </div>

      <div className="flex flex-col md:grid md:grid-cols-2 gap-3 ">
        <Card className="bg-transparent text-white">
          <CardContent className="flex items-center space-x-4 mt-4">
            {/* Icon here */}
            <div className="">
              <img src="/public/icons/Bolt.svg" className="w-12 h-12 bg-white p-1 rounded-lg" />
            </div>
            <div className="flex-col">
              <p className="text-sm text-gray-400">Streak</p>
              <p>0 days</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-transparent text-white">
          <CardContent className="flex items-center space-x-4 mt-4">
            {/* Icon here */}
            <div className="">
              <img src="/public/icons/file.svg" className="w-12 h-12 bg-white p-1 rounded-lg" />
            </div>
            <div className="flex-col">
              <p className="text-sm text-gray-400">Modules Completed</p>
              <p>0 </p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-transparent text-white">
          <CardContent className="flex items-center space-x-4 mt-4">
            {/* Icon here */}
            <div className="">
              <img src="/public/icons/Student.svg" className="w-12 h-12 bg-white p-1 rounded-lg" />
            </div>
            <div className="flex-col">
              <p className="text-sm text-gray-400">User Level</p>
              <p>Drifter</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-transparent text-white">
          <CardContent className="flex items-center space-x-4 mt-4">
            {/* Icon here */}
            <div className="">
              <img src="/public/icons/Brain.svg" className="w-12 h-12 bg-white p-1 rounded-lg" />
            </div>
            <div className="flex-col">
              <p className="text-sm text-gray-400">Knowledge Score</p>
              <p>56</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="font-medium">
        <p className="mb-1 font-medium text-lg">Badges</p>
        <Card className="bg-transparent text-white">
          <CardContent className="flex flex-col gap-2 items-center justify-center py-20">
            <p className="font-semibold text-lg">Start riding through the modules</p>
            <p className="font-normal text-sm">Learn everything you need to thrive onchain!</p>
            <Button size={"sm"} className="bg-yellow-400 text-black rounded-full font-semibold ">
              Start learning
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
