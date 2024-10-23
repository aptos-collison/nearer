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
    />,
    <DeployDapp
      currentBlinkObject={currentBlinkObject}
      setCurrentBlinkObject={setCurrentBlinkObject}
      handleNextClick={handleNextClick}
      newIPFShash={newIPFShash}
    />,
  ];

  const sectionTitles = [
    "Create Your First Nearer", 
    "Edit Your Nearer", 
    "Your Nearer Is Ready 🎉"
];

const sectionDescriptions = [
    "Leverage our available templates to get started creating your Nearer within minutes. Explore a variety of customizable options designed to help you launch your project effortlessly, regardless of your skill level.",
    
    "Customize your Nearer to taste. Adjust the color, text, or image to align with your vision. With a user-friendly interface and powerful tools at your disposal, making your Nearer truly unique has never been easier.",
    
    "Hurray! 🎉 Your Nearer has been successfully deployed! 🚀 You can access it via the links below. Your Nearer is now live for the world to see! 🌍 Don’t forget to share your creation!"
];


  return (
    <>
      <div className="mt-6">
        <div>
          <p className="text-3xl text-gray-100 font-semibold ">{sectionTitles[currentSection]}</p>
          <p className="text-base text-gray-500 mt-3">{sectionDescriptions[currentSection]}</p>
        </div>
      </div>

      <div className="space-y-2 mt-2">{sections[currentSection]}</div>
    </>
  );
};
