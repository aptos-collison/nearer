import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const Payment = () => {
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePayment = async () => {
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
        alt="Payment aptos"
        className="w-full h-auto max-h-48 object-contain mb-4"
      />
      <div className="border-2 border-gray-300 rounded-none p-3 flex flex-col ">
        <div className="flex flex-col">
          <Label className="text-gray-700">Service Rendered:</Label>
          <select className="flex-1 bg-transparent p-2 border border-gray-300 outline-none mt-2 text-black">
            <option>Gig Payment</option>
            <option>Tip</option>
          </select>
        </div>
        <div className="mt-1">
          <Label className="text-gray-700">Amount to Send:</Label>
          <Input
            name="amount"
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="flex-1 bg-transparent  text-black rounded-none"
          />
        </div>

        <Button
          onClick={handlePayment}
          disabled={loading}
          className={`mt-3 bg-teal-500 text-white font-bold py-3 rounded-sm w-full transition duration-300 ${loading ? "bg-gradient-to-r from-blue-400 to-pink-400 animate-pulse" : ""} ${success ? "bg-green-500" : ""}`}
        >
          {loading ? "Paying..." : success ? <span className="text-white text-2xl mr-2">✓</span> : "Send Payment"}
        </Button>
      </div>
    </div>
  );
};

export default Payment;
