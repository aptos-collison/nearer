import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { toast } from "../ui/use-toast";
import { getAccountAPTBalance } from "@/view-functions/getAccountBalance";
import { transferAPT } from "@/entry-functions/transferAPT";
import { aptosClient } from "@/utils/aptosClient";

const Payment: React.FC = () => {
  const { account, signAndSubmitTransaction } = useWallet();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [recipient, setRecipient] = useState("0xf9424969a5cfeb4639c4c75c2cd0ca62620ec624f4f28d76c4881a1e567d753f");
  const [transferAmount, setTransferAmount] = useState<number | undefined>();
  const [serviceType, setServiceType] = useState("Gig Payment");

  const { data } = useQuery({
    queryKey: ["apt-balance", account?.address],
    refetchInterval: 10_000,
    queryFn: async () => {
      if (!account) throw new Error("Account not connected");
      try {
        const balance = await getAccountAPTBalance({ accountAddress: account.address });
        return { balance };
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to fetch balance",
        });
        return { balance: 0 };
      }
    },
  });

  const handlePayment = async () => {
    if (!account || !recipient || !transferAmount) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please ensure all fields are filled",
      });
      return;
    }

    setLoading(true);
    try {
      const committedTransaction = await signAndSubmitTransaction(
        transferAPT({
          to: recipient,
          amount: Math.floor(transferAmount * 1e8), // Convert to Octas
        }),
      );
      await aptosClient().waitForTransaction({ transactionHash: committedTransaction.hash });
      queryClient.invalidateQueries();
      toast({ title: "Success", description: `Transaction succeeded, hash: ${committedTransaction.hash}` });
    } catch (error: any) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Transaction Failed",
        description: error.message || "An error occurred during the transaction",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-orange-50 rounded-none w-full shadow-md mx-auto border-2 border-black h-[460px] font-vt323">
      <div className="h-6 bg-orange-500 w-full flex justify-between px-2">
        <p className="text-base font-semibold text-black">Creator Payment Template</p>
        <img src="https://utfs.io/f/PKy8oE1GN2J3JMeRo2HVozIYU8DFRWmkp7SC4bh16KiGHZfv" alt="Logo" />
      </div>

      <div className="p-4">
        <img
          src="https://utfs.io/f/PKy8oE1GN2J3QgJ0elMB4oh9KpZbJwuajRl6c2XWTSfEVm85"
          alt="Payment aptos"
          className="w-full h-auto max-h-44 object-contain mb-4"
        />
        <div className="py-3 px-1 flex flex-col mt-3">
          <Label className="text-black font-semibold text-lg">Service Rendered:</Label>
          <select
            className="flex-1 bg-transparent p-2 border border-gray-300 outline-none mt-2 text-black"
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value)}
          >
            <option value="Gig Payment">Gig Payment</option>
            <option value="Tip">Tip</option>
          </select>

          <Label className="text-black font-semibold text-lg mt-1">Payment Fee:</Label>
          <Input
            name="amount"
            type="number"
            placeholder="Enter Amount"
            value={transferAmount || ""}
            onChange={(e) => setTransferAmount(Number(e.target.value))}
            className="flex-1 bg-transparent text-black rounded-none mt-1"
          />

          <button
            onClick={handlePayment}
            disabled={loading}
            className={`mt-3 text-black text-xl font-bold py-1 rounded-sm w-full border border-black transition duration-300 ${loading ? "bg-gradient-to-r from-blue-400 to-pink-400 animate-pulse" : ""}`}
          >
            {loading ? "Paying..." : "Send Payment"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Payment;
