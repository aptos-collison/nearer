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
        <p className="text-center text-4xl font-semibold w-2/4 mx-auto mt-6">Discover Key Use Cases for APT-Links</p>
        <div className="grid grid-cols-2 gap-3 mt-6">
          <Card className="bg-transparent text-gray-400 border-gray-800 border-2 rounded-none">
            <CardHeader>
              <CardTitle className="text-white">Bridging Assets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-1 items-center mb-3">
                <img src="/public/icons/dollar.svg" className="h-12 w-12 bg-teal-200 p-2 rounded-sm" />
                <img src="/public/icons/double-arrow.svg" className="h-10 w-10 bg-gray-100 " />
                <img src="/public/icons/euro.svg" className="h-12 w-12 bg-teal-200 p-2 rounded-sm " />
              </div>

              <p>Effortlessly bridge assets across different networks, simplifying cross-chain transactions.</p>
            </CardContent>
          </Card>
          <Card className="bg-transparent text-gray-400 border-gray-800 border-2 rounded-none">
            <CardHeader>
              <CardTitle className="text-white">Token Transfers</CardTitle>
            </CardHeader>
            <CardContent>
            <img src="/public/icons/token.svg" className="h-12 w-12 bg-teal-200 p-2 rounded-sm  ml-1 mb-3" /> 
              Easily transfer tokens between wallets, enhancing your trading and investment experience.
            </CardContent>
          </Card>
          <Card className="bg-transparent text-gray-400 border-gray-800 border-2 rounded-none">
            <CardHeader>
              <CardTitle className="text-white">Simple Swaps</CardTitle>
            </CardHeader>
            <CardContent>
            <img src="/public/icons/swap.svg" className="h-12 w-12 bg-teal-200 p-2 rounded-sm  ml-1 mb-3"  />
              Swap tokens directly on our platform with minimal fees for a convenient trading experience.
            </CardContent>
          </Card>
          <Card className="bg-transparent text-gray-400 border-gray-800 border-2 rounded-none">
            <CardHeader>
              <CardTitle className="text-white">Faucets for New Users</CardTitle>
            </CardHeader>
            <CardContent>
            <img src="/public/icons/faucet.svg"className="h-12 w-12 bg-teal-200 p-2 rounded-sm  ml-1 mb-3" />
              Start your crypto journey with our faucets, providing free tokens to help you learn the ropes.
            </CardContent>
          </Card>
          <Card className="bg-transparent text-gray-400 border-gray-800 border-2 rounded-none">
            <CardHeader>
              <CardTitle className="text-white">Easy Donations</CardTitle>
            </CardHeader>
            <CardContent>
            <img src="/public/icons/donation.svg" className="h-12 w-12 bg-teal-200 p-2 rounded-sm  ml-1 mb-3" />
              Support your favorite projects and causes with secure, simple donation options using APT Link.
            </CardContent>
          </Card>
          <Card className="bg-transparent text-gray-400 border-gray-800 border-2 rounded-none">
            <CardHeader>
              <CardTitle className="text-white">Social Payments</CardTitle>
            </CardHeader>
            <CardContent>
            <img src="/public/icons/payment.svg" className="h-12 w-12 bg-teal-200 p-2 rounded-sm  ml-1 mb-3" />
              Send and receive payments effortlessly through social platforms, making transactions feel as easy as
              chatting.
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="mt-6 py-8 mb-6 bg-gradient-to-b from-teal-100 to-white">
        <CardContent className="flex flex-col gap-3 items-center">
          <p className="text-4xl font-bold">From start to Dapp within minutes!</p>
          <p className="font-medium text-gray-600">Explore the endless possibilities with APT-link 🚀</p>
          <Button onClick={handleGetStarted} size={"lg"} className="rounded-full">
            Get Started Now
          </Button>
        </CardContent>
      </Card>
    </>
  );
};
