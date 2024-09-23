import React from "react";
import { Progress } from "@/components/ui/progress";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "../ui/button";

const questions = [
  {
    question: "Hey there! what brings you to Aptos Track today?",
    options: [
      "Just curious about Aptos",
      "Wanna explore Aptos",
      "I'm a Pro, bring it on!",
    ],
    type: "multiple",
  },
  {
    question: "How familiar are you with Aptos and other blockchain solutions, on a scale of 1-5?",
    options: ["1", "2", "3", "4", "5"],
    type: "scale",
  },
  {
    question: "Which of the following is true about Aptos?",
    options: [
      "It uses ..",
      "It's EVM compatible",
      "Smart contracts are written with solidity",
      "It has its own native token called Aptos",
    ],
    type: "multiple",
  },
  {
    question: "Okay, we found your spot to start racing. Ready to dive in?",
    options: [
      "Hell yeah!",
      "I'd like to start easier",
      "I'm up for a bigger challenge",
    ],
    type: "multiple",
  },
];

export const Onboarding = () => {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [selectedOption, setSelectedOption] = React.useState<number | null>(null); // Allow number or null
  const progress = ((currentStep + 1) / questions.length) * 100;

  const handleNext = () => {
    if (selectedOption !== null) {
      setCurrentStep(currentStep + 1);
      setSelectedOption(null); // Reset selected option for next question
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <Progress value={progress} className="w-full text-teal-400" />

      <p>{questions[currentStep].question}</p>

      <div className={`grid ${questions[currentStep].type === "scale" ? "grid-cols-5" : "grid-cols-1"} gap-3`}>
        {questions[currentStep].options.map((option, index) => (
          <Card 
            key={index} 
            className={`cursor-pointer ${selectedOption === index ? "bg-teal-50" : "bg-white"}`}
            onClick={() => setSelectedOption(index)}
          >
            <CardHeader>
              <CardTitle>{option}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      <div className="flex justify-end">
        <Button 
          className="w-24 rounded-full bg-teal-500 text-lg font-medium" 
          onClick={handleNext}
          disabled={selectedOption === null} // Disable if no option is selected
        >
          Next
        </Button>
      </div>
    </div>
  );
};
