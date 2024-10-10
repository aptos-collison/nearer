import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { aptosClient } from "@/utils/aptosClient";
import { checkIfFund, uploadFile } from "@/utils/Irys";
import { createAsset } from "@/entry-functions/create_asset";
import { toast } from "@/components/ui/use-toast";

const CreateToken = () => {
  const [formData, setFormData] = useState({
    name: "",
    symbol: "",
    decimals: "",
    icon_uri: "",
    project_uri: "",
    mint_fee_per_smallest_unit_of_fa: "",
    pre_mint_amount: "",
    mint_limit_per_addr: "",
    max_supply: "",
  });

  const { account, signAndSubmitTransaction } = useWallet();
  const aptosWallet = useWallet();

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<File>();
  const [isUploading, setIsUploading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setPreviewImage(reader.result);
          setFormData((prev) => ({ ...prev, icon_uri: file.name }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const onCreateAsset = async () => {
    try {
      if (!account) {
        toast({
          title: "No wallet connected",
          description: "Please connect your wallet.",
        });
        return;
      }

      if (!formData.decimals || !formData.name || !formData.symbol || !image) {
        toast({
          title: "Complete all fields",
          description: "Please complete all required fields to proceed.",
        });
        return;
      }

      setIsUploading(true);
      const funded = await checkIfFund(aptosWallet, image.size);
      if (!funded) throw new Error("Insufficient funds for asset node");

      const iconURL = await uploadFile(aptosWallet, image);
      const response = await signAndSubmitTransaction(
        createAsset({
          maxSupply: Number(formData.max_supply),
          name: formData.name,
          symbol: formData.symbol,
          decimal: Number(formData.decimals),
          iconURL,
          projectURL: formData.project_uri,
          mintFeePerFA: Number(formData.mint_fee_per_smallest_unit_of_fa),
          mintForMyself: Number(formData.pre_mint_amount),
          maxMintPerAccount: Number(formData.mint_limit_per_addr),
        }),
      );

      const committedTx = await aptosClient().waitForTransaction({
        transactionHash: response.hash,
      });

      if (committedTx.success) {
        toast({
          title: "Success",
          description: `Transaction succeeded, hash: ${committedTx.hash}`,
        });
        setSuccess(true);
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to create token",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-md w-full shadow-md mx-auto border-2 border-black h-[460px] font-vt323 p-3 overflow-y-auto">
      <div className="p-4">
        <div className=" flex  items-center justify-center rounded-sm">
          <img
            src={previewImage ? previewImage : "https://utfs.io/f/PKy8oE1GN2J3w6bQu3oTGjD39YCQS6grBNLTs0O8fHmZ51cK"}
            alt={` icon`}
            className=" max-w-24 h-auto max-h-40 object-contain mb-4 rounded-full overflow-hidden"
          />
        </div>

        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Token Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter token name"
              />
            </div>
            <div>
              <Label htmlFor="symbol">Token Symbol</Label>
              <Input
                id="symbol"
                name="symbol"
                value={formData.symbol}
                onChange={handleInputChange}
                placeholder="Enter token symbol"
              />
            </div>
          </div>

          <div className="mt-2">
            <Label htmlFor="decimals">Decimals</Label>
            <Input
              id="decimals"
              name="decimals"
              type="number"
              value={formData.decimals}
              onChange={handleInputChange}
              placeholder="Enter number of decimal places"
            />
          </div>

          <div className="mt-2">
            <Label htmlFor="icon_upload">Token Icon</Label>
            <div className="flex items-center space-x-2 mt-1">
              <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="flex items-center">
                <Upload className="w-4 h-4 mr-2" />
                Upload Icon
              </Button>
              <Input
                id="icon_upload"
                name="icon_upload"
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleImageUpload}
                accept="image/*"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 my-3">
            <Checkbox id="advanced" checked={showAdvanced} onCheckedChange={() => setShowAdvanced(!showAdvanced)} />
            <Label htmlFor="advanced">Show advanced options</Label>
          </div>

          {showAdvanced && (
            <div className="space-y-4 border-t pt-4">
              <div>
                <Label htmlFor="project_uri">Project URI</Label>
                <Input
                  id="project_uri"
                  name="project_uri"
                  value={formData.project_uri}
                  onChange={handleInputChange}
                  placeholder="Enter project URI"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="mint_fee_per_smallest_unit_of_fa">Mint Fee</Label>
                  <Input
                    id="mint_fee_per_smallest_unit_of_fa"
                    name="mint_fee_per_smallest_unit_of_fa"
                    type="number"
                    value={formData.mint_fee_per_smallest_unit_of_fa}
                    onChange={handleInputChange}
                    placeholder="Mint fee per smallest unit"
                  />
                </div>
                <div>
                  <Label htmlFor="pre_mint_amount">Pre-mint Amount</Label>
                  <Input
                    id="pre_mint_amount"
                    name="pre_mint_amount"
                    type="number"
                    value={formData.pre_mint_amount}
                    onChange={handleInputChange}
                    placeholder="Enter pre-mint amount"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="mint_limit_per_addr">Mint Limit per Address</Label>
                  <Input
                    id="mint_limit_per_addr"
                    name="mint_limit_per_addr"
                    type="number"
                    value={formData.mint_limit_per_addr}
                    onChange={handleInputChange}
                    placeholder="Mint limit per address"
                  />
                </div>
                <div className="mb-4">
                  <Label htmlFor="max_supply">Max Supply</Label>
                  <Input
                    id="max_supply"
                    name="max_supply"
                    type="number"
                    value={formData.max_supply}
                    onChange={handleInputChange}
                    placeholder="Enter max supply (optional)"
                  />
                </div>
              </div>
            </div>
          )}
          <Button
            onClick={onCreateAsset}
            disabled={loading}
            className={`w-full ${
              loading
                ? "bg-gradient-to-r from-blue-400 to-white animate-pulse"
                : success
                  ? "bg-blue-500"
                  : "bg-blue-500 hover:bg-blue-400"
            } text-white font-bold py-2 px-4 rounded`}
          >
            {loading ? "Processing..." : success ? "✓ Done!" : "Create Token"}
          </Button>
        </>
      </div>
    </div>
  );
};

export default CreateToken;
