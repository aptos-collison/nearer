import React, { useState, useCallback } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { toast } from "@/components/ui/use-toast";
import { aptosClient } from "@/utils/aptosClient";
import { VOTING_MODULE_ADDRESS } from "@/constants";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { InputTransactionData } from "@aptos-labs/wallet-adapter-react";

const InitializePoll: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [newCandidate, setNewCandidate] = useState("");
  const [timer, setTimer] = useState(60);

  const { account, signAndSubmitTransaction } = useWallet();

  const formatTime = useCallback((time: number): string => {
    const hours = String(Math.floor(time / 60)).padStart(2, "0");
    const minutes = String(time % 60).padStart(2, "0");
    return `${hours} : ${minutes} : 00`;
  }, []);

  const createTransactionPayload = useCallback(
    (functionName: string, args: (string | number)[]): InputTransactionData => ({
      data: {
        function: `${VOTING_MODULE_ADDRESS}::Voting::${functionName}`,
        functionArguments: args,
      },
    }),
    []
  );

  const handleTransaction = useCallback(
    async (payloadFunction: string, args: (string | number)[], successMessage: string) => {
      if (!account) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please connect your wallet first.",
        });
        return;
      }

      if (!signAndSubmitTransaction) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Transaction signing is not available.",
        });
        return;
      }

      setLoading(true);
      try {
        const payload = createTransactionPayload(payloadFunction, args);
        const tx = await signAndSubmitTransaction(payload);
        await aptosClient().waitForTransaction(tx.hash);
        toast({ title: "Success", description: successMessage });
      } catch (error: any) {
        console.error(error);
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || `Failed to ${payloadFunction}`,
        });
      } finally {
        setLoading(false);
      }
    },
    [account, createTransactionPayload, signAndSubmitTransaction]
  );

  const handleInitialize = useCallback(() => {
    if (!newCandidate) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please provide a candidate.",
      });
      return;
    }
    handleTransaction("initialize_with_option", [newCandidate], "Poll initialized successfully!").then(() => {
      setNewCandidate("");
    });
  }, [newCandidate, handleTransaction]);

  return (
    <div className="bg-white rounded-md w-full shadow-md mx-auto border-2 border-black h-[460px] font-vt323 overflow-y-auto">
      <div className="p-4">
        <img
          src="https://utfs.io/f/PKy8oE1GN2J3cXPyS4JnrjPmytFlpWZ2Y3gkRdK087boqXfG"
          alt="Poll"
          className="w-full h-auto max-h-40 object-contain mb-2"
        />

        <div className="py-2 px-1 flex flex-col gap-4">
          <div>
            <Label className="text-black text-lg">Initialize Poll:</Label>
            <Input
              value={newCandidate}
              onChange={(e) => setNewCandidate(e.target.value)}
              placeholder="Enter first candidate"
              className="mt-1 text-black bg-transparent rounded-none"
            />
            <button
              onClick={handleInitialize}
              disabled={loading || !newCandidate}
              className="text-black text-xl border border-black font-bold py-1 rounded-sm w-full mt-4"
            >
              Initialize Poll
            </button>
          </div>

          <div className="text-center text-gray-800 mt-2">
            {timer > 0 ? (
              <div className="bg-gray-900 rounded-none p-3">
                <h1 className="font-medium text-white">Current Timer</h1>
                <span className="font-semibold text-lg text-blue-500">{formatTime(timer)}</span>
              </div>
            ) : (
              <h1 className="font-bold text-lg">No Active Timer</h1>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InitializePoll;