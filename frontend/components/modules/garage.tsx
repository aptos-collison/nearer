import React, { useState } from "react";
import { Card, CardContent, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "@/components/ui/button"; // Import the Button component
import { useNavigate } from "react-router-dom";

export const Garage = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (inputValue.trim()) {
      navigate("/garage", { state: { message: inputValue } });
      setInputValue(""); // Clear the input after sending
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSend(); // Call handleSend on Enter key press
    }
  };

  return (
    <Card
      className="bg-transparent text-white py-4 mt-10"
    >
      <div className="flex items-center space-x-1 justify-start ml-5">
        <CardTitle>Got a crypto question? Take a quick stop at the garage and refuel!</CardTitle>
        <img src="/public/icons/racing-car.svg" className="h-12 w-12" />
      </div>
      <CardContent className="flex items-center">
        <Input
          placeholder="How can i get started on Aptos?"
          className="bg-transparent flex-grow"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <Button
          onClick={handleSend}
          className="ml-2 bg-yellow-300 hover:bg-yellow-100 text-black font-medium rounded-md py-2 px-5"
        >
          Send
        </Button>
      </CardContent>
    </Card>
  );
};
