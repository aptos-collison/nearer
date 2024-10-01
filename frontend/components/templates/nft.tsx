import { FormEvent, useRef, useState } from "react";
import { Button, buttonVariants } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardDescription, CardHeader } from "../ui/card";
import { isAptosConnectWallet, useWallet } from "@aptos-labs/wallet-adapter-react";
import { DateTimeInput } from "../ui/date-time-input";
import { LabeledInput } from "../ui/labeled-input";
import { ConfirmButton } from "../ui/confirm-button";
import { uploadCollectionData } from "@/utils/assetsUploader";
import { createCollection } from "@/entry-functions/create_collection";
import { aptosClient } from "@/utils/aptosClient";
import { useGetCollections } from "@/hooks/useGetCollections";
import { GetCollectionDataResponse } from "@aptos-labs/ts-sdk";
import { toast } from "../ui/use-toast";
import { mintNFT } from "@/entry-functions/mint_nft";
import { useGetCollectionData } from "@/hooks/useGetCollectionData";
import { useQueryClient } from "@tanstack/react-query";
import { clampNumber } from "@/utils/clampNumber";

const NFT = () => {
  // Wallet Adapter provider
  const aptosWallet = useWallet();
  const collections: Array<GetCollectionDataResponse> = useGetCollections();

  function getLastCollection(collections: Array<GetCollectionDataResponse>): GetCollectionDataResponse | null {
    if (collections.length === 0) {
      return null;
    }
    return collections[collections.length - 2];
  }

  const isCollectionCreated = getLastCollection(collections);

  const { data } = useGetCollectionData(isCollectionCreated?.collection_id);
  const queryClient = useQueryClient();
  const [amount, setAmount] = useState<number>(1);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [files, setFiles] = useState<FileList | null>(null);
  const [preMintAmount, setPreMintAmount] = useState<number>();
  const [publicMintStartDate, setPublicMintStartDate] = useState<Date>();
  const [publicMintStartTime, setPublicMintStartTime] = useState<string>();
  const [publicMintEndDate, setPublicMintEndDate] = useState<Date>();
  const [publicMintEndTime, setPublicMintEndTime] = useState<string>();
  const [royaltyPercentage, setRoyaltyPercentage] = useState<number>();
  const [publicMintLimitPerAccount, setPublicMintLimitPerAccount] = useState<number>(1);
  const [publicMintFeePerNFT, setPublicMintFeePerNFT] = useState<number>();

  const { userMintBalance = 0, collection, totalMinted = 0, maxSupply = 1 } = data ?? {};

  // Internal state
  const [isUploading, setIsUploading] = useState(false);

  // On create collection button clicked
  const onCreateCollection = async () => {
    try {
      if (!account) throw new Error("Please connect your wallet");
      if (!files) throw new Error("Please upload files");
      // if (account.address !== CREATOR_ADDRESS) throw new Error("Wrong account");
      if (isUploading) throw new Error("Uploading in progress");

      // Set internal isUploading state
      setIsUploading(true);

      // Upload collection files to Irys
      const { collectionName, collectionDescription, maxSupply, projectUri } = await uploadCollectionData(
        aptosWallet,
        files,
      );

      // Submit a create_collection entry function transaction
      const response = await signAndSubmitTransaction(
        createCollection({
          collectionDescription,
          collectionName,
          projectUri,
          maxSupply,
          royaltyPercentage,
          preMintAmount,
          allowList: undefined,
          allowListStartDate: undefined,
          allowListEndDate: undefined,
          allowListLimitPerAccount: undefined,
          allowListFeePerNFT: undefined,
          publicMintStartDate,
          publicMintEndDate,
          publicMintLimitPerAccount,
          publicMintFeePerNFT,
        }),
      );

      // Wait for the transaction to be commited to chain
      const committedTransactionResponse = await aptosClient().waitForTransaction({
        transactionHash: response.hash,
      });

      // Once the transaction has been successfully commited to chain, navigate to the `my-collection` page
      if (committedTransactionResponse.success) {
        toast({
          title: "Success",
          description: `Transaction succeeded, hash: ${committedTransactionResponse.hash}`,
        });
      }
    } catch (error) {
      alert(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleNFT = async (e: FormEvent) => {
    e.preventDefault();
    // if (!account || !data?.isMintActive) return;
    if (!collection?.collection_id) return;

        console.log("clicked");


    const response = await signAndSubmitTransaction(
      mintNFT({ collectionId: collection.collection_id, amount: amount }),
    );
    await aptosClient().waitForTransaction({ transactionHash: response.hash });
    queryClient.invalidateQueries();
    setAmount(1);
  };

  // Local Ref
  const inputRef = useRef<HTMLInputElement>(null);

  // const isCollectionCreated = false;
  const { account, wallet, signAndSubmitTransaction } = useWallet();

  console.log(`collection map`, collections);
  return (
    <div>
      <p className="text-lg font-medium text-gray-400">
        {isCollectionCreated ? "NFT Template" : "Create New Collection"}
      </p>

      <div className="bg-white rounded-none p-4 w-full shadow-md mx-auto border-gray-400 h-[460px] overflow-y-auto">
        <div className="bg-[#313939] rounded-sm">
          <img
            src={
              isCollectionCreated?.cdn_asset_uris?.cdn_image_uri ??
              "https://utfs.io/f/PKy8oE1GN2J3pihxJUVwi394rogIqdXzW56n8bYJTPQ1MAjv"
            }
            alt="NFT aptos"
            className="w-full h-auto max-h-52 object-contain mb-4 rounded-lg"
          />
        </div>

        {isCollectionCreated ? (
          <>
            <div className="flex flex-col gap-3 bg-gray-50 p-2 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-500">NFT Name</p>
                <p className="text-xl text-gray-600 font-bold ">
                  {isCollectionCreated?.collection_name}
                </p>
                <p className="text-xs text-gray-500">{isCollectionCreated?.description}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Your Balance</p>
                <p className="text-xl text-gray-600 font-bold ">
                  {clampNumber(totalMinted)} / {clampNumber(maxSupply)} Minted
                </p>
                <p className="text-xs text-gray-500">Current holdings</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Total Supply</p>
                <p className="text-xl font-bold text-gray-600">{maxSupply}</p>
                <p className="text-xs text-gray-500">Minted / Max Supply</p>
              </div>
            </div>
            <div className="px-1 py-2 flex flex-col">
              <Label className="text-gray-700">Quantity:</Label>
              <Input
                id="mint-amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(parseInt(e.target.value))}
                className="flex-1 bg-transparent text-black rounded-none mt-1"
              />
              <Button
                onClick={handleNFT}
                disabled={loading}
                className={`mt-3 bg-teal-500 text-white font-bold py-3 rounded-sm w-full transition duration-300 ${loading ? "bg-gradient-to-r from-blue-400 to-pink-400 animate-pulse" : ""} ${success ? "bg-green-500" : ""}`}
              >
                {loading ? "Minting..." : success ? <span className="text-white text-2xl mr-2">✓</span> : "Mint NFT"}
              </Button>
            </div>
          </>
        ) : (
          // NFT Minting UI

          // Collection Creation UI
          <div className="flex flex-col items-start justify-between py-2 gap-4 max-w-screen-xl mx-auto text-black">
            <Card>
              <CardHeader>
                <CardDescription>Uploads collection files to Irys, a decentralized storage</CardDescription>
              </CardHeader>
              <CardContent>{/* File upload logic here */}</CardContent>
            </Card>

            <div className="flex flex-col item-center gap-4 mt-4">
              <DateTimeInput
                id="mint-start"
                label="Public mint start date"
                tooltip="When minting becomes active"
                disabled={isUploading || !account}
                date={publicMintStartDate}
                onDateChange={setPublicMintStartDate}
                time={publicMintStartTime}
                onTimeChange={() => setPublicMintStartTime}
              />
              <DateTimeInput
                id="mint-end"
                label="Public mint end date"
                tooltip="When minting finishes"
                disabled={isUploading || !account}
                date={publicMintEndDate}
                onDateChange={setPublicMintEndDate}
                time={publicMintEndTime}
                onTimeChange={() => setPublicMintEndTime}
              />
            </div>

            <LabeledInput
              id="mint-limit"
              required
              label="Mint limit per address"
              tooltip="How many NFTs an individual address is allowed to mint"
              disabled={isUploading || !account}
              onChange={(e) => setPublicMintLimitPerAccount(parseInt(e.target.value))}
            />
            <LabeledInput
              id="royalty-percentage"
              label="Royalty Percentage"
              tooltip="The percentage of trading value that collection creator gets when an NFT is sold on marketplaces"
              disabled={isUploading || !account}
              onChange={(e) => setRoyaltyPercentage(parseInt(e.target.value))}
            />
            <LabeledInput
              id="mint-fee"
              label="Mint fee per NFT in APT"
              tooltip="The fee the nft minter is paying the collection creator when they mint an NFT, denominated in APT"
              disabled={isUploading || !account}
              onChange={(e) => setPublicMintFeePerNFT(Number(e.target.value))}
            />
            <LabeledInput
              id="for-myself"
              label="Mint for myself"
              tooltip="How many NFTs to mint immediately for the creator"
              disabled={isUploading || !account}
              onChange={(e) => setPreMintAmount(parseInt(e.target.value))}
            />

            <ConfirmButton
              title="Create Collection"
              className="self-start w-full bg-teal-400"
              onSubmit={onCreateCollection}
              disabled={!account || !files?.length || !publicMintStartDate || !publicMintLimitPerAccount || isUploading}
              confirmMessage={
                <>
                  <p>The upload process requires at least 2 message signatures</p>
                  <ol className="list-decimal list-inside">
                    <li>To upload collection cover image file and NFT image files into Irys.</li>
                    <li>To upload collection metadata file and NFT metadata files into Irys.</li>
                  </ol>
                  <p>In the case we need to fund a node on Irys, a transfer transaction submission is required also.</p>
                </>
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default NFT;
