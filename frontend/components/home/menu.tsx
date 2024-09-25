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

  const sectionTitles = ["Create Your Dapp", "Edit Your Dapp", "Deploy Your Dapp"];

  const sectionDescriptions = [
    "Leverage existing templates to get started in minutes.",
    "Customize your Dapp to taste.",
    "Review your configurations and hit deploy when you’re ready!",
  ];

  const sectionImages = ["/public/icons/person.png", "/public/icons/edit-dapp.png", "/public/icons/deploy-dapp.png"];

  return (
    <>
      <div className="flex justify-between items-center mx-auto px-4 mt-6">
        <div>
          <p className="text-5xl font-medium md:w-[90%]">{sectionTitles[currentSection]}</p>
          <p className="text-base text-gray-400 max-w-md mt-4">{sectionDescriptions[currentSection]}</p>
        </div>
        <img src={sectionImages[currentSection]} className="w-1/3 rounded-md" alt="Current Section Image" />
      </div>

      <div className="space-y-2 mt-2">{sections[currentSection]}</div>
    </>
  );
};
