import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Payment from "../templates/payment";

export function Header() {
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogComponent, setDialogComponent] = useState<JSX.Element | null>(null);

  const handleHome = () => {
    navigate("/");
  };

  const openDialog = (component: JSX.Element) => {
    setDialogComponent(component);
    setDialogOpen(true);
  };

  return (
    <>
      <div className="w-full bg-blue-50 p-1">
        <p className="text-sm text-center text-black">
          We appreciate you exploring our beta! Your feedback helps us grow and improve.
        </p>
      </div>

      <div className="flex items-center justify-between px-4 py-2 max-w-screen-xl mx-auto w-full flex-wrap lg:px-20 mt-2">
        <h3 onClick={handleHome} className="text-xl font-bold cursor-pointer text-white">
          BaseRL
        </h3>

        <div className="flex items-center space-x-2">
          <Button
            onClick={() => openDialog(<Payment />)}
            className="rounded-xl font-semibold text-base px-6 bg-transparent"
          >
           🏗️ {''}Developer Program
          </Button>
          <ConnectButton />
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="h-fit ">
          <DialogHeader>
            <DialogTitle>Build On BaseRL Program</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center">
            <img src="/icons/dev.jpeg" className="rounded" alt="Developers at Work" />

            <div className="text-sm space-y-1 mt-3">
              <p>
                We’re excited to announce that BaseRL is now open for a select group of developers to create innovative
                applications! This is your chance to build across categories like finance, public goods, and e-commerce.
              </p>
              <p>
                As one of our first builders, you'll gain early access to our resources and exclusive benefits. Plus,
                you can earn rewards for your contributions as you shape our platform’s future!
              </p>
              <p>Join us in this limited opportunity and make a meaningful impact!</p>
            </div>

            <Button className="mx-auto mt-3">
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLScAdCnBwVaToxA49ieVWVmUcueokiy1e3ljvhsd651VfrpKUg/viewform?usp=pp_url"
                target="_blank"
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
