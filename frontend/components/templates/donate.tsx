import React, { useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useQueryClient } from "@tanstack/react-query";
import { Input } from "../ui/input";
import { Label } from "@radix-ui/react-dropdown-menu";
import { toast } from "../ui/use-toast";
import { transferAPT } from "@/entry-functions/transferAPT";
import { aptosClient } from "@/utils/aptosClient";

const Donate: React.FC = () => {
  const { account, signAndSubmitTransaction } = useWallet();
  const queryClient = useQueryClient();
  const [donationAmount, setDonationAmount] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const predefinedAmounts: number[] = [10, 50, 100];
  const recipientAddress = "0xf9424969a5cfeb4639c4c75c2cd0ca62620ec624f4f28d76c4881a1e567d753f"; // Replace with actual recipient address

  const handlePredefinedDonation = (amount: number): void => {
    setDonationAmount(amount.toString());
    handleDonation(amount);
  };

  const handleDonation = async (amount: number): Promise<void> => {
    if (!account) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please connect your wallet first.",
      });
      return;
    }

    setLoading(true);
    setSuccess(false);

    try {
      const committedTransaction = await signAndSubmitTransaction(
        transferAPT({
          to: recipientAddress,
          amount: Math.floor(amount * Math.pow(10, 8)), // Convert to Octas (8 decimal places)
        }),
      );

      await checkTransactionStatus(committedTransaction.hash);
    } catch (error: any) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Donation Failed",
        description: error.message || "An error occurred during the donation",
      });
      setLoading(false);
    }
  };

  const checkTransactionStatus = async (hash: string): Promise<void> => {
    try {
      const transaction = await aptosClient().waitForTransaction({
        transactionHash: hash,
      });

      if (transaction.success) {
        setLoading(false);
        setSuccess(true);
        queryClient.invalidateQueries();
        toast({
          title: "Success",
          description: `Donation successful! Transaction hash: ${hash}`,
        });
        setTimeout(() => {
          setSuccess(false);
          setDonationAmount("");
        }, 3000);
      } else {
        throw new Error("Transaction failed");
      }
    } catch (error) {
      console.error("Error checking transaction status:", error);
      setLoading(false);
      toast({
        variant: "destructive",
        title: "Transaction Failed",
        description: "The donation transaction failed to process.",
      });
    }
  };

  const handleClick = (): void => {
    const amount = parseFloat(donationAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid Amount",
        description: "Please enter a valid donation amount.",
      });
      return;
    }
    handleDonation(amount);
  };

  return (
    <div className="relative bg-white rounded-md border-2 border-black w-full max-w-md shadow-md h-[460px] font-vt323 overflow-y-auto">
      <div className="p-4">
        <img
          src="https://utfs.io/f/PKy8oE1GN2J3NcDS9MmqTwZLGavY36FuE8XmyPAoRIOJCQBK"
          alt="Background Image"
          className="w-full h-auto max-h-44 rounded-sm mb-2"
        />
        <div className=" py-2 px-1 flex flex-col gap-2">
          <Label className="text-black text-lg">Donate to cause:</Label>
          <div className="flex items-center border border-gray-300 rounded-none p-2">
            <img
              src="https://utfs.io/f/PKy8oE1GN2J3ovmAor45P1iTwAUWSgurlXmB0cxH485C3q2s"
              alt="APTOS"
              className="w-5 h-5 mr-2"
            />
            <Input
              name="donationAmount"
              type="number"
              value={donationAmount}
              onChange={(e) => setDonationAmount(e.target.value)}
              placeholder="Enter amount"
              className="flex-1 bg-transparent focus:outline-none placeholder:text-sm rounded-none text-gray-800"
            />
          </div>
          <button
            onClick={handleClick}
            disabled={loading}
            className={`mt-3 text-black text-xl font-bold py-1 rounded-sm w-full border border-black transition duration-300 ${
              loading ? "bg-gradient-to-r from-blue-500 to-white animate-pulse" : ""
            } ${success ? "bg-blue-500" : ""}`}
          >
            {loading ? "Donating..." : success ? <span className="text-white text-2xl mr-2">✓</span> : "Donate APTOS"}
          </button>
          <div className="flex justify-between mt-2">
            {predefinedAmounts.map((amount) => (
              <button
                key={amount}
                onClick={() => handlePredefinedDonation(amount)}
                className="mx-1 text-black font-bold py-1 rounded-sm w-full border border-black "
              >
                Donate {amount}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donate;
