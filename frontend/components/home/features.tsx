
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

export const Features = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/modules");
  };
  
  return (
    <div className=" bg-black p-6 ">
      <p className="text-center text-3xl font-semibold w-2/4 mx-auto mt-6">
        Making onchain onboarding feel less esoteric, simplier and fun
      </p>
      <div className="grid grid-cols-2 gap-3 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Ride the Asphalt of knowledge</CardTitle>
          </CardHeader>
          <CardContent>
            Interactive races and modules tailored to your level and skills. No matter where you are in your crypto
            voyage, there's always new terrains to explore
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Earn Whilst You Learn</CardTitle>
          </CardHeader>
          <CardContent>
            Earn $TURBO, our virtual platform token and collect NFT badges as you progress. Use them for exclusive perks
            and opportunities later in the Aptos ecosystem.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Navigate With Ease</CardTitle>
          </CardHeader>
          <CardContent>
            Explore an interactive map of the Aptos ecosystem. Discover new projects, protocols and opportunities as you{" "}
            <span className="text-yellow-400 font-medium">Ride</span> through your learning adventure. You're always
            early when you're with TurboGo.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Knowledge Score</CardTitle>
          </CardHeader>
          <CardContent>
            Level up your knowledge and build your onchain reputation. Watch your knowledge score rise as you master new
            skills and concepts.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Join the Crew</CardTitle>
          </CardHeader>
          <CardContent>
            Race to the top of our leaderboard. Invite friends to boost your rewards and build your network.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Onchain Profile</CardTitle>
          </CardHeader>
          <CardContent>
            Your unique profile that you can share and showcase your achievements, badges and expertise to the world.
          </CardContent>
        </Card>
      </div>

      <Card className="mt-16 py-6 mb-6 bg-gradient-to-b from-yellow-400 to-white">
        <CardContent className="flex flex-col gap-3 items-center">
          <p className="text-5xl font-bold">
            It's time to <span className="">Revv</span> onchain{" "}
          </p>
          <p className="font-semibold">Unlock the possibilities of Aptos</p>
          <Button onClick={handleGetStarted} size={"lg"} className=" rounded-full">
            Launch App
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
