import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const Swap = () => {
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSwap = async () => {
    setLoading(true);
    setSuccess(false);

    // Simulating the bridging process
    await new Promise((resolve) => setTimeout(resolve, 5000));

    setLoading(false);
    setSuccess(true);

    setTimeout(() => {
      setSuccess(false);
      setAmount("");
    }, 3000);
  };

  return (
    <div>
      <p className="text-lg font-medium text-gray-400 ">Swap Template</p>
      <div className="bg-white rounded-none p-4 w-full shadow-md mx-auto border-gray-400 h-[460px]">
        <img
          src="https://utfs.io/f/PKy8oE1GN2J3ovmAor45P1iTwAUWSgurlXmB0cxH485C3q2s"
          alt="Swap aptos"
          className="w-full h-auto max-h-48 object-contain mb-4"
        />
        <div className=" py-2 px-1 flex flex-col mt-2">
          <div className="flex space-x-2 mt-2">
            <div className="flex flex-col w-full">
              <Label className="text-gray-700 mb-1">From:</Label>
              <div className="flex items-center border border-gray-300 rounded-none p-2 ">
                <img
                  src="https://utfs.io/f/PKy8oE1GN2J3ovmAor45P1iTwAUWSgurlXmB0cxH485C3q2s"
                  alt="APTOS"
                  className="w-5 h-5 mr-2"
                />
                <select className="flex-1 bg-transparent p-2 border border-gray-300 outline-none  text-black ">
                  <option>APTO</option>
                  <option>xDAI</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col w-full">
              <Label className="text-gray-700 mb-1">To:</Label>
              <div className="flex items-center border border-gray-300 rounded-none p-2 ">
                <img
                  src="https://utfs.io/f/PKy8oE1GN2J3ovmAor45P1iTwAUWSgurlXmB0cxH485C3q2s"
                  alt="APTOS"
                  className="w-5 h-5 mr-2"
                />
                <select className="flex-1 bg-transparent p-2 border border-gray-300 outline-none text-black">
                  <option>xDAI</option>
                  <option>APTO</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mt-1">
            <Label className="text-gray-700">Amount:</Label>
            <Input
              name="amount"
              type="number"
              placeholder="Enter Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="flex-1 bg-transparent  text-black rounded-none"
            />
          </div>

          <Button
            onClick={handleSwap}
            disabled={loading}
            className={`mt-3 bg-teal-500 text-white font-bold py-3 rounded-sm w-full transition duration-300 ${loading ? "bg-gradient-to-r from-blue-400 to-pink-400 animate-pulse" : ""} ${success ? "bg-green-500" : ""}`}
          >
            {loading ? "Swapping..." : success ? <span className="text-white text-2xl mr-2">✓</span> : "Swap Token"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Swap;
