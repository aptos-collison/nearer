import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const Mint = () => {
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleMint = async () => {
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
    <div className="bg-white rounded-none p-4 w-full shadow-md mx-auto border-gray-400 h-[460px]">
      <img
        src="https://utfs.io/f/PKy8oE1GN2J3ovmAor45P1iTwAUWSgurlXmB0cxH485C3q2s"
        alt="Mint aptos"
        className="w-full h-auto max-h-32 object-contain mb-4"
      />
      <div className="border-2 border-gray-300 rounded-none p-3 flex flex-col ">
        <div className="mt-1">
          <Label className="text-gray-700">Token Name:</Label>
          <Input
            name="address"
            type="text"
            placeholder="Token Name"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="flex-1 bg-transparent  text-black rounded-none"
          />
        </div>
        <div className="mt-1">
          <Label className="text-gray-700">Token Symbol:</Label>
          <Input
            name="address"
            type="text"
            placeholder="Token Symbol"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="flex-1 bg-transparent  text-black rounded-none"
          />
        </div>
        {/* <div>
          <Label className="text-gray-700">Mint to:</Label>
          <Input
            name="address"
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="flex-1 bg-transparent  text-black rounded-none"
          />
        </div> */}
        <div className="mt-1">
          <Label className="text-gray-700">Quantity:</Label>
          <Input
            name="amount"
            type="number"
            placeholder="Quantity to mint"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="flex-1 bg-transparent  text-black rounded-none"
          />
        </div>

        <Button
          onClick={handleMint}
          disabled={loading}
          className={`mt-3 bg-teal-500 text-white font-bold py-3 rounded-sm w-full transition duration-300 ${loading ? "bg-gradient-to-r from-blue-400 to-pink-400 animate-pulse" : ""} ${success ? "bg-green-500" : ""}`}
        >
          {loading ? "Minting..." : success ? <span className="text-white text-2xl mr-2">✓</span> : "Mint Token"}
        </Button>
      </div>
    </div>
  );
};

export default Mint;
