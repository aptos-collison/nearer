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

  const sectionTitles = ["Create Your First Aptos Blink", "Edit Your Dapp", "Deploy Your Dapp"];

  const sectionDescriptions = [
    "Leverage our available blink templates to get started creating your Aptos blink within minutes.",
    "Customize your Dapp to taste.",
    "Review your configurations and hit deploy when you’re ready!",
  ];

  return (
    <>
      <div className="mt-6">
        <div>
          <p className="text-3xl font-medium ">{sectionTitles[currentSection]}</p>
          <p className="text-base text-gray-400 mt-3">{sectionDescriptions[currentSection]}</p>
        </div>
      </div>

      <div className="space-y-2 mt-2">{sections[currentSection]}</div>
    </>
  );
};
