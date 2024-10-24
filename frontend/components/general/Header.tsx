import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CustomConnectButton } from "./ConnectButton";

const announcement = [
  "We appreciate you exploring our beta! Your feedback helps us grow and improve.",
  "🎉 Join our developer program and earn rewards!",
  "✨ Built on Aurora - Fast, Secure, and Scalable",
  "🚀 Experience the future of decentralized applications",
].join("       •      "); // Joins messages with bullet points

export function Header() {
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleHome = () => {
    navigate("/");
  };

  const openDialog = () => {
    setDialogOpen(true);
  };

  return (
    <>
      <div className="w-full bg-green-100 p-1 overflow-hidden relative">
        <style>
          {`
            @keyframes slide {
              0% {
                transform: translateX(100%);
              }
              100% {
                transform: translateX(-100%);
              }
            }

            .sliding-text {
              animation: slide 120s linear infinite;
              white-space: nowrap;
              position: absolute;
              width: max-content;
              margin-left: 20px; /* Adjust as needed */
              margin-right: 20px; /* Adjust as needed */
            }
          

            /* Optional: Pause animation on hover */
            .announcement-container:hover .sliding-text,
            .announcement-container:hover .sliding-text-2 {
              animation-play-state: paused;
            }
          `}
        </style>
        <div className="announcement-container h-6 relative">
          <p className="sliding-text text-sm text-black">
            {announcement.repeat(2)} {/* Repeat to ensure continuous flow */}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between px-4 py-2 max-w-screen-xl mx-auto w-full flex-wrap lg:px-20 mt-2">
        <h3 onClick={handleHome} className="text-xl font-bold cursor-pointer text-white">
          Nearer
        </h3>

        <div className="flex items-center space-x-2">
          <Button
            onClick={() => openDialog()}
            className="rounded-xl font-semibold text-base px-6 bg-transparent hover:bg-green-100/10"
          >
            🏗️ {""}Developers
          </Button>
          <CustomConnectButton />
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="h-fit">
          <DialogHeader>
            <DialogTitle>Build On Nearer Program</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center">
            <img src="/icons/dev.jpeg" className="rounded" alt="Developers at Work" />

            <div className="text-sm space-y-1 mt-3">
              <p>
                We're excited to announce that Nearer is now open for a select group of developers to create innovative
                applications! This is your chance to build across categories like finance, public goods, and e-commerce.
              </p>
              <p>
                As one of our first builders, you'll gain early access to our resources and exclusive benefits. Plus,
                you can earn rewards for your contributions as you shape our platform's future!
              </p>
              <p>Join us in this limited opportunity and make a meaningful impact!</p>
            </div>

            <Button className="mx-auto mt-3">
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLScmnU6m7vPL-10-YX3x3dQEbSOQqkOV0rSCuFA0abZPZMAb0g/viewform?usp=pp_url"
                target="_blank"
                rel="noopener noreferrer"
              >
                Sign Up as a Developer
              </a>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
