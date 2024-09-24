import { CreateDapp } from "../createDapp/create-dapp";
import React, { useState } from "react";
import EditDapp from "../createDapp/edit-dapp";
import DeployDapp from "../createDapp/deploy-dapp";

export const Menu: React.FC = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [currentBlinkObject, setCurrentBlinkObject] = useState({});
  const [newIPFShash, setNewIPFShash] = useState("");

  const handleNextClick = () => {
    setCurrentSection((prevSection) => Math.min(prevSection + 1, sections.length - 1));
  };

  const sections = [
    <CreateDapp
      currentBlinkObject={currentBlinkObject}
      setCurrentBlinkObject={setCurrentBlinkObject}
      handleNextClick={handleNextClick}
    />,
    <EditDapp
      currentBlinkObject={currentBlinkObject}
      setCurrentBlinkObject={setCurrentBlinkObject}
      handleNextClick={handleNextClick}
      setNewIPFShash={setNewIPFShash}
      newIPFShash={newIPFShash}
    />,
    <DeployDapp
      currentBlinkObject={currentBlinkObject}
      setCurrentBlinkObject={setCurrentBlinkObject}
      handleNextClick={handleNextClick}
      newIPFShash={newIPFShash}
    />,
  ];

  return (
    <>
      <div className="flex justify-between items-center mx-auto px-4 mt-6">
        <div>
          <p className="text-5xl font-medium md:w-[90%]">Leverage existing templates to get started in minutes</p>
          <p className="text-base text-gray-400 max-w-md mt-4">
            Customize your dapp to taste. Only hit deploy when you're satisfied with the look and feel of your new
            Dapp!
          </p>
        </div>
        <img src="/public/icons/person.png" className="w-1/3 rounded-md" />
      </div>

      <div className="space-y-2 mt-2">
        {/* Render the current section based on the currentSection state */}
        {sections[currentSection]}
      </div>
    </>
  );
};
