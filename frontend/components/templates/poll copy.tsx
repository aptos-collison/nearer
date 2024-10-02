import React, { useState, useEffect, useCallback } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { toast } from "@/components/ui/use-toast";
import { aptosClient } from "@/utils/aptosClient";
import { VOTING_MODULE_ADDRESS } from "@/constants";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { InputTransactionData } from "@aptos-labs/wallet-adapter-react";

const Polls: React.FC = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [candidates, setCandidates] = useState<string[]>([]);
  const [scores, setScores] = useState<number[]>([]);
  const [newCandidate, setNewCandidate] = useState("");
  const [winner, setWinner] = useState<string | null>(null);
  const [timer, setTimer] = useState(0);

  const { account, signAndSubmitTransaction } = useWallet();

  const [storeAddress, setStoreAddress] = useState<string | undefined>(account?.address);

  const formatTime = useCallback((time: number): string => {
    const hours = String(Math.floor(time / 60)).padStart(2, "0");
    const minutes = String(time % 60).padStart(2, "0");
    return `${hours} : ${minutes} : 00`;
  }, []);

  // Function to calculate percentage
  const calculatePercentage = (votes: number, totalVotes: number): string => {
    if (totalVotes === 0) return "0%";
    return ((votes / totalVotes) * 100).toFixed(1) + "%";
  };

  const fetchScores = async () => {
    if (!account) return null;
    try {
      const result = await aptosClient().view<[string[], string[]]>({
        payload: {
          function: `${VOTING_MODULE_ADDRESS}::Voting::view_current_scores`,
          functionArguments: [account.address],
        },
      });
      return result;
    } catch (error) {
      console.error("Failed to fetch scores:", error);
      return null;
    }
  };

  // Update the updateCandidatesAndScores function
  const updateCandidatesAndScores = async () => {
    const result = await fetchScores();
    console.log(result);
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
      console.log(result);
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

  const handleVote = useCallback(
    (candidate: string) => {
      if (!account?.address) return;
      handleTransaction("vote", [candidate, account.address], "Vote cast successfully!");
    },
    [account, handleTransaction],
  );

  const handleDeclareWinner = useCallback(() => {
    if (!account?.address) return;
    handleTransaction("declare_winner", [account.address], "Winner declared successfully!");
  }, [account, handleTransaction]);

  useEffect(() => {
    if (account?.address) {
      checkInitialization();
      updateCandidatesAndScores();
    }
  }, [account, updateCandidatesAndScores]);

  return (
    <div>
      <p className="text-lg font-medium text-gray-400">Dynamic Poll Template</p>
      <div className="bg-white p-4 shadow-md mx-auto border-gray-400 h-[460px] overflow-y-auto">
        <img
          src="https://utfs.io/f/PKy8oE1GN2J3cXPyS4JnrjPmytFlpWZ2Y3gkRdK087boqXfG"
          alt="Poll"
          className="w-full h-auto max-h-48 object-contain mb-4"
        />

        <div className="py-2 px-1 flex flex-col gap-4">
          {!isInitialized ? (
            <div>
              <Label className="text-gray-700">Initialize Poll:</Label>
              <Input
                value={newCandidate}
                onChange={(e) => setNewCandidate(e.target.value)}
                placeholder="Enter first candidate"
                className="mt-1 text-black"
              />
              <Button
                onClick={handleInitialize}
                disabled={loading || !newCandidate}
                className="bg-orange-400 text-white font-bold py-2 rounded-sm w-full mt-2"
              >
                Initialize Poll
              </Button>
            </div>
          ) : (
            <>
              {candidates.length < 4 && (
                <div>
                  <Label className="text-gray-700">Add Candidate:</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      value={newCandidate}
                      onChange={(e) => setNewCandidate(e.target.value)}
                      placeholder="Enter candidate name"
                      className="text-black"
                    />
                    <Button
                      onClick={() => handleAddCandidate()}
                      disabled={loading || !newCandidate}
                      className="bg-orange-400 text-white font-bold py-2 rounded-sm"
                    >
                      Add
                    </Button>
                  </div>
                </div>
              )}

              <div>
                <Label className="text-gray-700">Vote for a candidate:</Label>
                <div className="space-y-2 mt-2">
                  {candidates.map((candidate, index) => {
                    const totalVotes = scores.reduce((sum, score) => sum + score, 0);
                    const votePercentage = calculatePercentage(scores[index] || 0, totalVotes);
                    return (
                      <Button
                        key={index}
                        onClick={() => handleVote(candidate)}
                        disabled={loading}
                        className="bg-orange-400 text-white font-bold py-3 rounded-sm w-full flex justify-between items-center"
                      >
                        <span>{candidate}</span>
                        <span>{votePercentage}</span>
                      </Button>
                    );
                  })}
                </div>
              </div>

              <Button
                onClick={handleDeclareWinner}
                disabled={loading || timer > 0}
                className="bg-orange-600 text-white font-bold py-3 rounded-sm w-full"
              >
                Declare Winner
              </Button>
            </>
          )}

          <div className="text-center text-gray-800 mt-4">
            {timer > 0 ? (
              <div className="bg-gray-800 rounded-md p-3">
                <h1 className="font-medium text-white">Current Timer</h1>
                <span className="font-semibold text-lg text-orange-200">{formatTime(timer)}</span>
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

export default Polls;