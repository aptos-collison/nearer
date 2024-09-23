import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getGroqChatCompletion } from "@/utils/groq";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

type Message = {
  sender: 'user' | 'ai';
  content: string;
};

export const GaragePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const hasInitialMessageProcessed = useRef(false);

  useEffect(() => {
    const initialMessage = location.state?.message || "";
    if (initialMessage && !hasInitialMessageProcessed.current) {
      handleInitialMessage(initialMessage);
      hasInitialMessageProcessed.current = true; 
    }
  }, [location.state]);

  const handleInitialMessage = async (msg: string) => {
    setMessages((prev) => [...prev, { sender: 'user', content: msg }]);
    
    // Get the AI response for the initial message
    const response = await getGroqChatCompletion(msg);
    const aiMessage = response.choices[0]?.message?.content || "No response received.";
    
    setMessages((prev) => [...prev, { sender: 'ai', content: aiMessage }]);
  };

  const handleSend = async () => {
    if (!message.trim()) return;

    setMessages((prev) => [...prev, { sender: 'user', content: message }]);
    
    // Get the AI response for the current message
    const response = await getGroqChatCompletion(message);
    const aiMessage = response.choices[0]?.message?.content || "No response received.";
    
    setMessages((prev) => [...prev, { sender: 'ai', content: aiMessage }]);
    setMessage("");
  };

  const handleNavigate = () => {
    navigate(-1);
  };

  return (
    <div className="h-[88vh]">
      <div onClick={handleNavigate} className="flex items-center space-x-2 cursor-pointer">
        <img src="/public/icons/back.svg" className="w-6 h-6 bg-white" />
        <p> Quick Stop</p>
        <img src="/public/icons/racing-car.svg" className="w-12 h-12" />
      </div>

      <p className="mb-2">
        Explore the web3 ecosystem and find resources that you need. Ask follow-up questions to dive deeper.
      </p>
      <Separator />

      {/* Chat Area */}
      <div className="flex flex-col w-full my-4 flex-grow h-[70%] overflow-y-auto">
        {messages.map((msg, index) => (
          <div key={index} className={`flex justify-${msg.sender === 'user' ? 'end' : 'start'} w-full mb-3`}>
            <div className={`flex items-start space-x-2 ${msg.sender === 'user' ? 'bg-yellow-200' : 'bg-primary'} p-2 rounded-lg shadow`}>
              <img src={`/public/icons/${msg.sender === 'user' ? 'profile' : 'AI'}.svg`} className="h-6 w-6" />
              <p className={msg.sender === 'user' ? 'text-black' : 'text-white'}>
                {msg.content}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Chat Input Area */}
      <Separator />
      <div className="flex items-center w-full mt-4">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 border rounded-2xl p-2 border-gray-300 bg-transparent"
        />
        <Button
          onClick={handleSend}
          className="ml-2 bg-yellow-200 hover:bg-yellow-100 text-black rounded-full py-2 px-5"
        >
          <img src="/public/icons/Race.svg" className="h-6 w-6" />
          <p> Dive In</p>
        </Button>
      </div>
    </div>
  );
};
