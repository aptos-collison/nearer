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
  const [recipient, setRecipient] = useState<string>(
    "0xf9424969a5cfeb4639c4c75c2cd0ca62620ec624f4f28d76c4881a1e567d753f",
  );
  const [transferAmount, setTransferAmount] = useState<number | undefined>();
  const [serviceType, setServiceType] = useState<string>("Gig Payment");

  const { data } = useQuery({
    queryKey: ["apt-balance", account?.address],
    refetchInterval: 10_000,
    queryFn: async () => {
      try {
        if (!account) {
          throw new Error("Account not connected");
        }
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
          amount: Math.floor(transferAmount * Math.pow(10, 8)), // Convert to Octas (8 decimal places)
        }),
      );
      const executedTransaction = await aptosClient().waitForTransaction({
        transactionHash: committedTransaction.hash,
      });
      queryClient.invalidateQueries();
      toast({
        title: "Success",
        description: `Transaction succeeded, hash: ${executedTransaction.hash}`,
      });
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
    <div>
      <p className="text-lg font-medium text-gray-400">Creator Payment Template</p>
      <div className="bg-white rounded-none p-4 w-full shadow-md mx-auto border-gray-400 h-[460px]">
        <img
          src="https://utfs.io/f/PKy8oE1GN2J3QgJ0elMB4oh9KpZbJwuajRl6c2XWTSfEVm85"
          alt="Payment aptos"
          className="w-full h-auto max-h-48 object-contain mb-4"
        />
        <div className="py-3 px-1 flex flex-col mt-3">
          <div className="flex flex-col mt-2">
            <Label className="text-gray-700">Service Rendered:</Label>
            <select
              className="flex-1 bg-transparent p-2 border border-gray-300 outline-none mt-2 text-black"
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
            >
              <option>Gig Payment</option>
              <option>Tip</option>
            </select>
          </div>
          <div className="mt-1">
            <Label className="text-gray-700">Payment Fee:</Label>
            <Input
              name="amount"
              type="number"
              placeholder="Enter Amount"
              value={transferAmount || ""}
              onChange={(e) => setTransferAmount(Number(e.target.value))}
              className="flex-1 bg-transparent text-black rounded-none mt-1"
            />
          </div>

          <Button
            onClick={handlePayment}
            disabled={loading}
            className={`mt-3 bg-teal-500 text-white font-bold py-3 rounded-sm w-full transition duration-300 ${
              loading ? "bg-gradient-to-r from-blue-400 to-pink-400 animate-pulse" : ""
            }`}
          >
            {loading ? "Paying..." : "Send Payment"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Payment;
