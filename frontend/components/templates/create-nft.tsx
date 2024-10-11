import { FormEvent, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader } from "../ui/card";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { DateTimeInput } from "../ui/date-time-input";
import { LabeledInput } from "../ui/labeled-input";
import { ConfirmButton } from "../ui/confirm-button";
import { uploadCollectionData } from "@/utils/assetsUploader";
import { createCollection } from "@/entry-functions/create_collection";
import { aptosClient } from "@/utils/aptosClient";
import { toast } from "../ui/use-toast";
import { Button } from "../ui/button";
import { Copy } from "lucide-react";

interface NFTConfig {
  collectionName: string;
  collectionDescription: string;
  collectionImage: string;
  contractAddress: string;
  maxSupply: number;
  mintLimitPerAccount: number;
  mintFee: number;
  isMintActive: boolean;
}

const CreateNFT = () => {
  const aptosWallet = useWallet();
  const { account, signAndSubmitTransaction } = useWallet();

  const [files, setFiles] = useState<FileList | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [preMintAmount, setPreMintAmount] = useState<number>();
  const [publicMintStartDate, setPublicMintStartDate] = useState<Date>();
  const [publicMintStartTime, setPublicMintStartTime] = useState<string>();
  const [publicMintEndDate, setPublicMintEndDate] = useState<Date>();
  const [publicMintEndTime, setPublicMintEndTime] = useState<string>();
  const [royaltyPercentage, setRoyaltyPercentage] = useState<number>();
  const [publicMintLimitPerAccount, setPublicMintLimitPerAccount] = useState<number>(1);
  const [publicMintFeePerNFT, setPublicMintFeePerNFT] = useState<number>();
  const [nftConfig, setNftConfig] = useState<NFTConfig | null>(null);

  const onCreateCollection = async () => {
    try {
      if (!account) throw new Error("Please connect your wallet");
      if (!files) throw new Error("Please upload files");
      if (isUploading) throw new Error("Uploading in progress");

      setIsUploading(true);

      const { collectionName, collectionDescription, maxSupply, projectUri } = await uploadCollectionData(
        aptosWallet,
        files,
      );

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

      const committedTransactionResponse = await aptosClient().waitForTransaction({
        transactionHash: response.hash,
      });

      if (committedTransactionResponse.success) {
        toast({
          title: "Success",
          description: `Transaction succeeded, hash: ${committedTransactionResponse.hash}`,
        });

        // Set the NFT configuration after successful creation
        setNftConfig({
          collectionName,
          collectionDescription,
          collectionImage: "https://utfs.io/f/PKy8oE1GN2J3pihxJUVwi394rogIqdXzW56n8bYJTPQ1MAjv", // You might want to update this with the actual image URL
          contractAddress: account.address,
          maxSupply,
          mintLimitPerAccount: publicMintLimitPerAccount,
          mintFee: publicMintFeePerNFT || 0,
          isMintActive: new Date() >= (publicMintStartDate || new Date()),
        });
      }
    } catch (error) {
      alert(error);
    } finally {
      setIsUploading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast({
          title: "Copied",
          description: "Text copied to clipboard",
        });
      },
      (err) => {
        console.error("Could not copy text: ", err);
      },
    );
  };

  return (
    <div className="bg-white rounded-md w-full shadow-md mx-auto border-2 border-black h-[460px] overflow-y-auto font-vt323">
      <div className="p-3">
        <div className="rounded-sm mt-2">
          <img
            src="https://utfs.io/f/PKy8oE1GN2J3pihxJUVwi394rogIqdXzW56n8bYJTPQ1MAjv"
            alt="NFT creation"
            className="w-full h-auto max-h-40 object-contain mb-2"
          />
        </div>

        <div className="flex flex-col items-start justify-between py-2 gap-4 max-w-screen-xl mx-auto text-black">
          <Card className="w-full">
            <CardHeader>
              <CardDescription>Uploads collection files to Irys, a decentralized storage</CardDescription>
            </CardHeader>
            <CardContent>
              <input
                type="file"
                multiple
                onChange={(e) => setFiles(e.target.files)}
                disabled={isUploading || !account}
              />
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 item-center gap-4 mt-2">
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

          <div className="grid grid-cols-2 item-center gap-4">
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
          </div>

          <ConfirmButton
            title="Create Collection"
            className="self-start w-full bg-blue-500"
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

          {nftConfig && (
            <div className="mt-4 p-4 border rounded-md">
              <h3 className="text-lg font-semibold mb-2">NFT Configuration</h3>
              {Object.entries(nftConfig).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between mb-2">
                  <span className="font-medium">{key}:</span>
                  <div className="flex items-center">
                    <span className="mr-2">{String(value)}</span>
                    <Button onClick={() => copyToClipboard(String(value))} variant="ghost" size="sm" className="p-1">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateNFT;
