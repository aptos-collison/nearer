import { Button } from "@/components/ui/button";
import { Table, TableCaption, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import React from "react";

export const LeaderboardPage = () => {
  return (
    <div className="flex flex-col gap-3 w-full">
      <div>
        <p className="text-xl">Leaderboard</p>
        <p className="text-base text-gray-400">Compete with friends to top the charts</p>
      </div>

      <div className="flex space-x-2 items-center my-4">
        <Button
          size={"sm"}
          variant={"ghost"}
          className="bg-teal-200 active:bg-teal-100 text-black rounded-full h-7"
        >
          Last week
        </Button>
        <Button size={"sm"} variant={"ghost"} className="hover:bg-teal-200 active:bg-teal-100 rounded-full h-7">
          All time
        </Button>
      </div>

      <div className="space-y-3">
        <p>Your Ranking</p>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px] text-gray-300">Rank</TableHead>
              <TableHead className="text-gray-300">User</TableHead>
              <TableHead className="text-right text-gray-300">Knowledge Score</TableHead>
              <TableHead className="text-right text-gray-300">Streak</TableHead>
              <TableHead className="text-right text-gray-300">$Turbos</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">#2</TableCell>
              <TableCell>
                <Avatar>
                  <AvatarImage className="w-8 h-8 rounded-full" src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell className="text-right ">90</TableCell>
              <TableCell className="text-right flex items-center justify-end space-x-1">
                {" "}
                <img src="/public/icons/Fire.svg" className="w-6 h-6" /> <p className="mt-1">8</p>{" "}
              </TableCell>
              <TableCell className="text-right ">
                <div className="flex items-center justify-end space-x-1">
                  <img src="/public/icons/car.svg" className="w-6 h-6" /> <p className="mt-1">18</p>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px] text-gray-300">Rank</TableHead>
              <TableHead className="text-gray-300">User</TableHead>
              <TableHead className="text-right text-gray-300">Knowledge Score</TableHead>
              <TableHead className="text-right text-gray-300">Streak</TableHead>
              <TableHead className="text-right text-gray-300">$Turbos</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">#1</TableCell>
              <TableCell>
                {" "}
                <Avatar>
                  <AvatarImage className="w-8 h-8 rounded-full" src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell className="text-right">95</TableCell>
              <TableCell className="text-right flex items-center justify-end space-x-1">
                {" "}
                <img src="/public/icons/Fire.svg" className="w-6 h-6" /> <p className="mt-1">2</p>{" "}
              </TableCell>
              <TableCell className="text-right">
              <div className="flex items-center justify-end space-x-1">
                  <img src="/public/icons/car.svg" className="w-6 h-6" /> <p className="mt-1">80</p>
                </div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">#2</TableCell>
              <TableCell>
                <Avatar>
                  <AvatarImage className="w-8 h-8 rounded-full" src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell className="text-right">90</TableCell>
              <TableCell className="text-right flex items-center justify-end space-x-1">
                {" "}
                <img src="/public/icons/Fire.svg" className="w-6 h-6" /> <p className="mt-1">6</p>{" "}
              </TableCell>
              <TableCell className="text-right">
              <div className="flex items-center justify-end space-x-1">
                  <img src="/public/icons/car.svg" className="w-6 h-6" /> <p className="mt-1">40</p>
                </div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">#3</TableCell>
              <TableCell>
                <Avatar>
                  <AvatarImage className="w-8 h-8 rounded-full" src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell className="text-right">85</TableCell>
              <TableCell className="text-right flex items-center justify-end space-x-1">
                {" "}
                <img src="/public/icons/Fire.svg" className="w-6 h-6" /> <p className="mt-1">0</p>{" "}
              </TableCell>
              <TableCell className="text-right">
              <div className="flex items-center justify-end space-x-1">
                  <img src="/public/icons/car.svg" className="w-6 h-6" /> <p className="mt-1">30</p>
                </div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">#4</TableCell>
              <TableCell>
                <Avatar>
                  <AvatarImage className="w-8 h-8 rounded-full" src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell className="text-right">85</TableCell>
              <TableCell className="text-right flex items-center justify-end space-x-1">
                {" "}
                <img src="/public/icons/Fire.svg" className="w-6 h-6" /> <p className="mt-1">0</p>{" "}
              </TableCell>
              <TableCell className="text-right">
              <div className="flex items-center justify-end space-x-1">
                  <img src="/public/icons/car.svg" className="w-6 h-6" /> <p className="mt-1">45</p>
                </div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">#5</TableCell>
              <TableCell>
                <Avatar>
                  <AvatarImage className="w-8 h-8 rounded-full" src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell className="text-right">85</TableCell>
              <TableCell className="text-right flex items-center justify-end space-x-1">
                {" "}
                <img src="/public/icons/Fire.svg" className="w-6 h-6" /> <p className="mt-1">0</p>{" "}
              </TableCell>
              <TableCell className="text-right">
              <div className="flex items-center justify-end space-x-1">
                  <img src="/public/icons/car.svg" className="w-6 h-6" /> <p className="mt-1">100</p>
                </div>
              </TableCell>
            </TableRow>
            {/* Add more rows as needed */}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
