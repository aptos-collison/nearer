import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const Marketplace = () => {
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleNFT = async () => {
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
    <div className="bg-orange-50 rounded-none w-full shadow-md mx-auto border-black border-2 h-[460px] font-vt323 overflow-y-auto">
      <div className="h-6 bg-orange-500 w-full flex justify-between px-2">
        <p className="text-base font-semibold text-black">NFT Marketplace Template</p>
        <img src="https://utfs.io/f/PKy8oE1GN2J3JMeRo2HVozIYU8DFRWmkp7SC4bh16KiGHZfv" alt="Logo" />
      </div>

      <div className="p-4 ">
        <div className="grid grid-cols-2 gap-2">
          <img
            src="https://utfs.io/f/PKy8oE1GN2J3ImEUxfLevETDAcJq1nugYV4XWR2yULbo7PO9"
            alt="NFT aptos"
            className="w-full h-32 object-cover rounded-sm"
          />
          <img
            src="https://utfs.io/f/PKy8oE1GN2J3KOWGsVvRh3M9zZEHBsUJXb2rmgqjVN7dGF0A"
            alt="NFT aptos"
            className="w-full h-32 object-cover rounded-sm"
          />
          <img
            src="https://utfs.io/f/PKy8oE1GN2J34Ea4iszOtmS4gyWw60ueoFxcn1br78fIZYvJ"
            alt="NFT aptos"
            className="w-full h-32 object-cover rounded-sm"
          />
          <img
            src="https://utfs.io/f/PKy8oE1GN2J3SBvM9TJRHgldbCZqO68FamQULKyreIx24zPN"
            alt="NFT aptos"
            className="w-full h-32 object-cover rounded-sm"
          />
        </div>

        <div className="rounded-none py-2 flex flex-col">
          <div className="mt-1">
            <Label className="text-black text-lg">Quantity:</Label>
            <Input
              name="amount"
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="flex-1 bg-transparent text-black rounded-none"
            />
          </div>

          <button
            onClick={handleNFT}
            disabled={loading}
            className={`mt-3 text-black text-xl font-bold py-1 rounded-sm w-full border border-black transition duration-300 ${loading ? "bg-gradient-to-r from-orange-300 to-orange-50 animate-pulse" : ""} ${success ? "bg-orange-500" : ""}`}
          >
            {loading ? (
              "Purchasing..."
            ) : success ? (
              <span className="text-white text-2xl mr-2">✓ Coming Soon</span>
            ) : (
              "Purchase NFT"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
