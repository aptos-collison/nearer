import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { Card, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import React from "react";

const questions = [
  {
    question: "Hey there! What brings you to Aptos Track today?",
    options: ["Just curious about Aptos", "Wanna explore Aptos", "I'm a Pro, bring it on!"],
    type: "multiple",
  },
  {
    question: "How familiar are you with Aptos and other blockchain solutions, on a scale of 1-5?",
    options: ["1", "2", "3", "4", "5"],
    type: "scale",
  },
  {
    question:
      "Aptos uses a unique programming language called Move for smart contracts. This enables safer and more efficient contract development.",
    type: "text",
  },
  {
    question: "Which of the following is true about Aptos?",
    options: [
      "It uses a unique consensus mechanism",
      "It's EVM compatible",
      "Smart contracts are written with Solidity",
      "It has its own native token called Aptos",
    ],
    type: "multiple",
  },
  {
    question: "Here’s an overview of the Aptos ecosystem:",
    type: "image",
    imageUrl: "/public/icons/madrid.jpeg",
  },
  {
    question: "Okay, we found your spot to start racing. Ready to dive in?",
    options: ["Hell yeah!", "I'd like to start easier", "I'm up for a bigger challenge"],
    type: "multiple",
  },
];

export const Level = () => {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [selectedOption, setSelectedOption] = React.useState<number | null>(null);
  const progress = ((currentStep + 1) / questions.length) * 100;

  const handleNext = () => {
    if (selectedOption !== null || questions[currentStep].type !== "multiple") {
      setCurrentStep(currentStep + 1);
      setSelectedOption(null);
    }
  };

  const currentQuestion = questions[currentStep];

  const radius = 50;
  const strokeWidth = 6;
  const normalizedRadius = radius - strokeWidth * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div>
      <div className="flex justify-between items-center mt-6">
        <div className="space-y-2 w-96">
          <p className="font-semibold text-2xl">Getting Started with Aptos</p>
          <p className="text-base text-gray-400">
            Learn the basics of blockchain technology and how Aptos fits into the ecosystem. Set up your wallet and
            familiarize yourself with its features.
          </p>
          <Button>
            <Share2 className="mr-2" /> Share
          </Button>
        </div>

        <div className="space-y-3">
          <div className="relative h-24 w-24">
            <svg height={radius * 2} width={radius * 2}>
              <circle
                stroke="gray"
                fill="transparent"
                strokeWidth={strokeWidth}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
              />
              <circle
                stroke="teal"
                fill="transparent"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
                style={{ transition: "stroke-dashoffset 0.5s ease-in-out" }}
              />
            </svg>
            <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-lg text-white">
              {Math.round(progress)}%
            </p>
          </div>

          <div className="space-y-1">
            <p className="font-semibold">Level Progress</p>
            <p className="text-base text-gray-400">We're calculating your level progress here</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-5 mt-6">
        <p className="mt-6 text-lg font-medium">{currentQuestion?.question}</p>

        {currentQuestion?.type === "multiple" && (
          <div className="grid grid-cols-1 gap-3">
            {currentQuestion.options?.map((option, index) => (
              <Card
                key={index}
                className={`cursor-pointer ${selectedOption === index ? "bg-teal-100" : "bg-white"}`}
                onClick={() => setSelectedOption(index)}
              >
                <CardHeader>
                  <CardTitle>{option}</CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}

        {currentQuestion?.type === "scale" && (
          <div className="grid grid-cols-5 gap-3">
            {currentQuestion.options?.map((option, index) => (
              <Card
                key={index}
                className={`cursor-pointer ${selectedOption === index ? "bg-teal-100" : "bg-white"}`}
                onClick={() => setSelectedOption(index)}
              >
                <CardHeader>
                  <CardTitle>{option}</CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}

        {currentQuestion?.type === "text" && <p className="text-sm text-gray-300">{currentQuestion.question}</p>}

        {currentQuestion?.type === "image" && (
          <div className="flex flex-col items-center">
            <img src={currentQuestion.imageUrl} alt="Aptos Ecosystem" className="mb-4 h-96 w-full rounded-md" />
            <p className="text-sm text-gray-300">{currentQuestion.question}</p>
          </div>
        )}

        <Progress value={progress} className="h-3 w-full text-teal-400" />

        <div className="flex justify-end">
          <Button
            className="w-24 rounded-full bg-teal-500 text-lg font-medium"
            onClick={handleNext}
            disabled={currentQuestion?.type === "multiple" && selectedOption === null}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};
