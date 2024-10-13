import React, { useState, useCallback, useEffect } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { toast } from "@/components/ui/use-toast";
import { aptosClient } from "@/utils/aptosClient";
import { VOTING_MODULE_ADDRESS } from "@/constants";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { InputTransactionData } from "@aptos-labs/wallet-adapter-react";

const InitializePoll: React.FC = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [candidates, setCandidates] = useState<string[]>([]);
  const [scores, setScores] = useState<number[]>([]);
  const [newCandidate, setNewCandidate] = useState("");
  const timer = 60;

  const { account, signAndSubmitTransaction } = useWallet();

  const storeAddr = account?.address; // This is the addr of the campaign creator should be added to show where the voting campaign is stored. show init when the link is created.

  const formatTime = useCallback((time: number): string => {
    const hours = String(Math.floor(time / 60)).padStart(2, "0");
    const minutes = String(time % 60).padStart(2, "0");
    return `${hours} : ${minutes} : 00`;
  }, []);

  const calculatePercentage = (votes: number, totalVotes: number): string => {
    if (totalVotes === 0) return "0%";
    return ((votes / totalVotes) * 100).toFixed(1) + "%";
  };

  const fetchScores = async () => {
    if (!storeAddr) return null;
    try {
      const result = await aptosClient().view<[string[], string[]]>({
        payload: {
          function: `${VOTING_MODULE_ADDRESS}::Voting::view_current_scores`,
          functionArguments: [storeAddr],
        },
      });
      return result;
    } catch (error) {
      console.error("Failed to fetch scores:", error);
      return null;
    }
  };

  const updateCandidatesAndScores = async () => {
    const result = await fetchScores();
   
    if (result) {
      const [candidateNames, scoreStrings] = result;
      setCandidates(candidateNames);
      const numericScores = scoreStrings.map((score) => parseInt(score, 10));
      setScores(numericScores);
    }
  };

  const createTransactionPayload = useCallback(
    (functionName: string, args: (string | number)[]): InputTransactionData => ({
      data: {
        function: `${VOTING_MODULE_ADDRESS}::Voting::${functionName}`,
        functionArguments: args,
      },
    }),
    [],
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
        await updateCandidatesAndScores();
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
    [account, createTransactionPayload, signAndSubmitTransaction, updateCandidatesAndScores],
  );

  const checkInitialization = async () => {
    if (!account) return;

    try {
      const result = await fetchScores();
   
      if (result && result[0].length > 0) {
        setIsInitialized(true);
      }
    } catch (error) {
      console.error("Failed to check initialization:", error);
    }
  };

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
      setIsInitialized(true);
      setNewCandidate("");
    });
  }, [newCandidate, handleTransaction]);

  const handleAddCandidate = useCallback(() => {
    if (!account?.address || !newCandidate) return;
    handleTransaction("add_option", [newCandidate, account.address], "Candidate added successfully!").then(() =>
      setNewCandidate(""),
    );
  }, [account, newCandidate, handleTransaction]);

  useEffect(() => {
    if (account?.address) {
      checkInitialization();
      updateCandidatesAndScores();
    }
  }, [account]);

  return (
    <div className="bg-white rounded-md w-full shadow-md mx-auto border-2 border-black h-[460px] font-vt323 overflow-y-auto">
      <div className="p-4">
        <img
          src="https://utfs.io/f/PKy8oE1GN2J3cXPyS4JnrjPmytFlpWZ2Y3gkRdK087boqXfG"
          alt="Poll"
          className="w-full h-auto max-h-40 object-contain mb-2"
        />

        <div>{isInitialized ? isInitialized : null}</div>

        <div className="py-2 px-1 flex flex-col gap-4">
          {candidates.length === 0 && (
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
          )}

          {candidates.length < 4 && (
            <div>
              <Label className="text-black">Add Candidate:</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  value={newCandidate}
                  onChange={(e) => setNewCandidate(e.target.value)}
                  placeholder="Enter candidate name"
                  className="text-black rounded-none bg-transparent"
                />
                <button
                  onClick={() => handleAddCandidate()}
                  disabled={loading || !newCandidate}
                  className=" text-black font-bold py-1 px-4 border border-black rounded-sm"
                >
                  Add
                </button>
              </div>

              <div className="space-y-2 mt-2">
                {candidates.map((candidate, index) => {
                  const totalVotes = scores.reduce((sum, score) => sum + score, 0);
                  const votePercentage = calculatePercentage(scores[index] || 0, totalVotes);
                  return (
                    <button
                      key={index}
                      disabled={loading}
                      className="bg-blue-500 text-white font-bold py-2 rounded-sm w-full flex justify-between items-center px-4"
                    >
                      <span>{candidate}</span>
                      <span className="hidden hover:block">{votePercentage}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

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
