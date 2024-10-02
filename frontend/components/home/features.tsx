import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

export const Features = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/modules");
  };

  return (
    <>
      <div className="bg-black p-6">
        <p className="text-center text-gray-100 text-4xl font-semibold w-2/4 mx-auto mt-6">Discover Key Use Cases for APT-Links</p>
        <div className="grid grid-cols-2 gap-3 mt-6">
          <Card className="bg-transparent text-gray-500 border-gray-800 border-2 rounded-none">
            <CardHeader>
              <CardTitle className="text-gray-200">Bridging Assets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-1 items-center mb-3">
                <img src="/icons/dollar.svg" className="h-12 w-12 bg-[#89e219] p-2 rounded-sm" />
                <img src="/icons/double-arrow.svg" className="h-10 w-10 bg-gray-100 " />
                <img src="/icons/euro.svg" className="h-12 w-12 bg-[#89e219] p-2 rounded-sm " />
              </div>

              <p>
                Create bridges to enable assets transfer across different networks, simplifying cross-chain
                transactions.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-transparent text-gray-500 border-gray-800 border-2 rounded-none">
            <CardHeader>
              <CardTitle className="text-gray-200">Token Transfers</CardTitle>
            </CardHeader>
            <CardContent>
              <img src="/icons/token.svg" className="h-12 w-12 bg-[#89e219] p-2 rounded-sm  ml-1 mb-3" />
              Create dapps enabling token transfer between wallets, enhancing your trading and investment experience.
            </CardContent>
          </Card>
          <Card className="bg-transparent text-gray-500 border-gray-800 border-2 rounded-none">
            <CardHeader>
              <CardTitle className="text-gray-200">Simple Swaps</CardTitle>
            </CardHeader>
            <CardContent>
              <img src="/icons/swap.svg" className="h-12 w-12 bg-[#89e219] p-2 rounded-sm  ml-1 mb-3" />
              Create dapps to swap tokens on any platform with minimal fees for a convenient trading experience.
            </CardContent>
          </Card>
          <Card className="bg-transparent text-gray-500 border-gray-800 border-2 rounded-none">
            <CardHeader>
              <CardTitle className="text-gray-200">Faucets for Developers</CardTitle>
            </CardHeader>
            <CardContent>
              <img src="/icons/faucet.svg" className="h-12 w-12 bg-[#89e219] p-2 rounded-sm  ml-1 mb-3" />
              Build and share faucet dapps to enable developers access your protocol's test tokens across any web platform.
            </CardContent>
          </Card>
          <Card className="bg-transparent text-gray-500 border-gray-800 border-2 rounded-none">
            <CardHeader>
              <CardTitle className="text-gray-200">Easy Donations</CardTitle>
            </CardHeader>
            <CardContent>
              <img src="/icons/donation.svg" className="h-12 w-12 bg-[#89e219] p-2 rounded-sm  ml-1 mb-3" />
              Create dapps to support your favorite projects and causes with secure, simple donation options leveraging APT Link.
            </CardContent>
          </Card>
          <Card className="bg-transparent text-gray-500 border-gray-800 border-2 rounded-none">
            <CardHeader>
              <CardTitle className="text-gray-200">Social Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <img src="/icons/payment.svg" className="h-12 w-12 bg-[#89e219] p-2 rounded-sm  ml-1 mb-3" />
               Create payment dapps to send and receive payments effortlessly through on platforms, making transactions feel as easy as
              chatting.
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="mt-6 py-8 mb-6 bg-gradient-to-b from-[#89e219] to-[#58cc02]">
        <CardContent className="flex flex-col gap-3 items-center">
          <p className="text-5xl font-bold">Create . Deploy . Share</p>
          <p className="font-medium text-gray-900">Explore the endless possibilities with APT-link 🔗🚀</p>
          <Button onClick={handleGetStarted} size={"lg"} className="rounded-full">
            Get Started Now
          </Button>
        </CardContent>
      </Card>
    </>
  );
};
