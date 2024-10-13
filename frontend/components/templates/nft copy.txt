import { useRef, useState } from "react";
import { Button, buttonVariants } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardDescription, CardHeader } from "../ui/card";
import { isAptosConnectWallet, useWallet } from "@aptos-labs/wallet-adapter-react";
import { DateTimeInput } from "../ui/date-time-input";
import { LabeledInput } from "../ui/labeled-input";
import { ConfirmButton } from "../ui/confirm-button";

const NFT = () => {
  const [amount, setAmount] = useState("");
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

  // Internal state
  const [isUploading, setIsUploading] = useState(false);

  // On create collection button clicked
  const onCreateCollection = async () => {
    alert('successful');
  };

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

  // Local Ref
  const inputRef = useRef<HTMLInputElement>(null);

  const isCollectionCreated = false;
  const { account, wallet, signAndSubmitTransaction } = useWallet();

  return (
    <div>
      <p className="text-lg font-medium text-gray-400 ">{isCollectionCreated ? "NFT Template" : "Create New Collection"}</p>
      {/* <LaunchpadHeader title={isCollectionCreated ? "Mint NFT" : "Create New Collection"} /> */}

      <div className="bg-white rounded-none p-4 w-full shadow-md mx-auto border-gray-400 h-[460px]">
          <div className="bg-[#313939] rounded-sm">
            <img
              src="https://utfs.io/f/PKy8oE1GN2J3pihxJUVwi394rogIqdXzW56n8bYJTPQ1MAjv"
              alt="NFT aptos"
              className="w-full h-auto max-h-52 object-contain mb-4 rounded-lg"
            />
          </div>

      {isCollectionCreated ? (
        // NFT Minting UI
        <div className="bg-white rounded-none p-4 w-full shadow-md mx-auto border-gray-400 h-[460px]">
          <div className="bg-[#313939] rounded-sm">
            <img
              src="https://utfs.io/f/PKy8oE1GN2J3pihxJUVwi394rogIqdXzW56n8bYJTPQ1MAjv"
              alt="NFT aptos"
              className="w-full h-auto max-h-52 object-contain mb-4 rounded-lg"
            />
          </div>

          <div className="px-1 py-2 flex flex-col">
            <div>
              <Label className="text-gray-700">Mint to:</Label>
              <Input
                name="address"
                type="text"
                placeholder="Enter Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="flex-1 bg-transparent text-black rounded-none"
              />
            </div>
            <div className="mt-1">
              <Label className="text-gray-700">Quantity:</Label>
              <Input
                name="amount"
                type="number"
                placeholder="Quantity to Mint"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="flex-1 bg-transparent text-black rounded-none"
              />
            </div>

            <Button
              onClick={handleNFT}
              disabled={loading}
              className={`mt-3 bg-blue-500 text-white font-bold py-3 rounded-sm w-full transition duration-300 ${loading ? "bg-gradient-to-r from-blue-400 to-white animate-pulse" : ""} ${success ? "bg-blue-500" : ""}`}
            >
              {loading ? "Minting..." : success ? <span className="text-white text-2xl mr-2">✓</span> : "Mint NFT"}
            </Button>
          </div>
        </div>
      ) : (
        // Collection Creation UI
        <div className="flex flex-col md:flex-row items-start justify-between px-4 py-2 gap-4 max-w-screen-xl mx-auto">
          <div className="w-full md:w-2/3 flex flex-col gap-y-4 order-2 md:order-1">
            {/* {(!account) && (
              <WarningAlert title={account ? "Wrong account connected" : "No account connected"}>
                To continue with creating your collection, make sure you are connected with a Wallet and with the same
                profile account as in your COLLECTION_CREATOR_ADDRESS in{" "}
                <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                  .env
                </code>{" "}
                file
              </WarningAlert>
            )} */}

            {/* {wallet && isAptosConnectWallet(wallet) && (
              <WarningAlert title="Wallet not supported">
                Google account is not supported when creating a NFT collection. Please use a different wallet.
              </WarningAlert>
            )} */}

            <Card>
              <CardHeader>
                <CardDescription>Uploads collection files to Irys, a decentralized storage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-start justify-between">
                  {!files?.length && (
                    <Label
                      htmlFor="upload"
                      className={buttonVariants({
                        variant: "outline",
                        className: "cursor-pointer",
                      })}
                    >
                      Choose Folder to Upload
                    </Label>
                  )}
                  <Input
                    className="hidden"
                    ref={inputRef}
                    id="upload"
                    disabled={isUploading || !account || !wallet || isAptosConnectWallet(wallet)}
                    // webkitdirectory="true"
                    multiple
                    type="file"
                    placeholder="Upload Assets"
                    onChange={(event) => {
                      setFiles(event.currentTarget.files);
                    }}
                  />

                  {!!files?.length && (
                    <div>
                      {files.length} files selected{" "}
                      <Button
                        variant="link"
                        className="text-destructive"
                        onClick={() => {
                          setFiles(null);
                          if (inputRef.current) {
                            inputRef.current.value = "";
                          }
                        }}
                      >
                        Clear
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="flex item-center gap-4 mt-4">
              <DateTimeInput
                id="mint-start"
                label="Public mint start date"
                tooltip="When minting becomes active"
                disabled={isUploading || !account}
                date={publicMintStartDate}
                onDateChange={setPublicMintStartDate}
                time={publicMintStartTime}
                onTimeChange={() => setPublicMintStartTime}
                className="basis-1/2"
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
                className="basis-1/2"
              />
            </div>

            <LabeledInput
              id="mint-limit"
              required
              label="Mint limit per address"
              tooltip="How many NFTs an individual address is allowed to mint"
              disabled={isUploading || !account}
              onChange={(e) => {
                setPublicMintLimitPerAccount(parseInt(e.target.value));
              }}
            />

            <LabeledInput
              id="royalty-percentage"
              label="Royalty Percentage"
              tooltip="The percentage of trading value that collection creator gets when an NFT is sold on marketplaces"
              disabled={isUploading || !account}
              onChange={(e) => {
                setRoyaltyPercentage(parseInt(e.target.value));
              }}
            />

            <LabeledInput
              id="mint-fee"
              label="Mint fee per NFT in APT"
              tooltip="The fee the nft minter is paying the collection creator when they mint an NFT, denominated in APT"
              disabled={isUploading || !account}
              onChange={(e) => {
                setPublicMintFeePerNFT(Number(e.target.value));
              }}
            />

            <LabeledInput
              id="for-myself"
              label="Mint for myself"
              tooltip="How many NFTs to mint immediately for the creator"
              disabled={isUploading || !account}
              onChange={(e) => {
                setPreMintAmount(parseInt(e.target.value));
              }}
            />

            <ConfirmButton
              title="Create Collection"
              className="self-start"
              onSubmit={onCreateCollection}
              disabled={
                !account ||
                !files?.length ||
                !publicMintStartDate ||
                !publicMintLimitPerAccount ||
                !account ||
                isUploading
              }
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
        </div>
        )}
        </div>
    </div>
  );
};

export default NFT;
