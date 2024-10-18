import React, { useState, useEffect } from "react";
import { Loader } from "lucide-react";
import templatesJson from "../../utils/template.json";

// Types for different configurations
interface TokenConfig {
  name: string;
  symbol: string;
  contractAddress: string;
  iconUri: string;
  maxSupply: number;
  mintLimit: number;
}

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

interface PollsConfig {
  address: string;
  name: string;
  creator: string;
}

interface Template {
  html: string;
  js: string;
  name: string;
}

interface Templates {
  [key: string]: Template;
}

const templates: Templates = templatesJson as Templates;

interface EditDappProps {
  currentBlinkObject: any;
  setCurrentBlinkObject: (blinkObject: any) => void;
  handleNextClick: () => void;
  setNewIPFShash: (hash: string) => void;
}

const EditDapp: React.FC<EditDappProps> = ({
  currentBlinkObject,
  // setCurrentBlinkObject,
  handleNextClick,
  setNewIPFShash,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [editingElement, setEditingElement] = useState<HTMLElement | null>(null);
  const [bgColor, setBgColor] = useState<string>("#ffffff");
  const [textColor, setTextColor] = useState<string>("#333333");
  const [text, setText] = useState<string>("Your text here");
  const [editMode, setEditMode] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>("");

  // Configuration states
  const [tokenConfig, setTokenConfig] = useState<TokenConfig>({
    name: "",
    symbol: "",
    contractAddress: "",
    iconUri: "",
    maxSupply: 0,
    mintLimit: 0,
  });

  const [nftConfig, setNftConfig] = useState<NFTConfig>({
    collectionName: "",
    collectionDescription: "",
    collectionImage: "",
    contractAddress: "",
    maxSupply: 0,
    mintLimitPerAccount: 0,
    mintFee: 0,
    isMintActive: false,
  });

  const [pollsConfig, setPollsConfig] = useState<PollsConfig>({
    address: "",
    name: "",
    creator: "",
  });

  // Payment/Donation states
  const [recipient, setRecipient] = useState<string>("0x000000000000");
  const [price, setPrice] = useState<string>("");
  const [supply, setSupply] = useState<string>("");

  useEffect(() => {
    if (currentBlinkObject.templateName) {
      setSelectedTemplate(currentBlinkObject.templateName);
      const template = templates[currentBlinkObject.templateName];

      // Extract configurations based on template type
      try {
        switch (currentBlinkObject.templateName.toLowerCase()) {
          case "token":
            const extractedTokenConfig = extractConfigFromTemplate("token", template.js);
            setTokenConfig(extractedTokenConfig as TokenConfig);
            break;
          case "nft":
            const extractedNFTConfig = extractConfigFromTemplate("nft", template.js);
            setNftConfig(extractedNFTConfig as NFTConfig);
            break;
          case "polls":
            const extractedPollsConfig = extractConfigFromTemplate("polls", template.js);
            setPollsConfig(extractedPollsConfig as PollsConfig);
            break;
          case "donation":
          case "payment":
            setRecipient(extractRecipient(template.js));
            break;
        }
      } catch (error) {
        console.error("Error extracting config:", error);
      }
    }
  }, [currentBlinkObject]);

  // Add new handlers for updating configs
  const handleTokenConfigUpdate = (field: keyof TokenConfig, value: string | number) => {
    setTokenConfig((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNFTConfigUpdate = (field: keyof NFTConfig, value: string | number | boolean) => {
    setNftConfig((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePollsConfigUpdate = (field: keyof PollsConfig, value: string) => {
    setPollsConfig((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // const handleTemplateSelect = (templateName: string) => {
  //   setSelectedTemplate(templateName);
  //   setEditingElement(null);
  // };

  const handleElementClick = (element: HTMLElement) => {
    setEditingElement(element);
    setBgColor(element.style.backgroundColor || "#ffffff");
    setTextColor(element.style.color || "#333333");
    setText(element.textContent || "Select a text to edit");

    if (element instanceof HTMLImageElement) {
      setShowTooltip(true);
      setImageUrl(element.src);
    } else {
      setShowTooltip(false);
    }
  };

  const handleBgColorChange = (newColor: string) => {
    setBgColor(newColor);
    if (editingElement) {
      editingElement.style.backgroundColor = newColor;
    }
  };

  const handleTextColorChange = (newColor: string) => {
    setTextColor(newColor);
    if (editingElement) {
      editingElement.style.color = newColor;
    }
  };

  const handleTextChange = (newText: string) => {
    setText(newText);
    if (editingElement) {
      editingElement.textContent = newText;
    }
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value);
  };

  const updateImageUrl = () => {
    if (editingElement instanceof HTMLImageElement) {
      editingElement.src = imageUrl;
    }
    setShowTooltip(false);
  };

  const cancelImageUpdate = () => {
    setShowTooltip(false);
  };

  const createBlink = async () => {
    if (!selectedTemplate) return;

    const editedHtml = document.querySelector(".templateContainer")?.innerHTML || "";
    const template = templates[selectedTemplate];
    let modifiedJs = template.js;

    // Update JS based on template type
    switch (selectedTemplate.toLowerCase()) {
      case "token":
        modifiedJs = updateTemplateConfig("token", template.js, tokenConfig);
        break;
      case "nft":
        modifiedJs = updateTemplateConfig("nft", template.js, nftConfig);
        break;
      case "polls":
        modifiedJs = updateTemplateConfig("polls", template.js, pollsConfig);
        break;
      case "donation":
      case "payment":
        modifiedJs = updateTemplateJs(template.js);
        break;
    }

    const iFrame = { iframe: { html: editedHtml, js: modifiedJs } };
    const res = await fetch("http://localhost:8000/storeToIpfs", {
      method: "POST",
      body: JSON.stringify(iFrame),
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log(iFrame)

    let ipfsText = await res.text();
    setNewIPFShash(ipfsText);
    handleNextClick();
  };

  const handleDeployClick = async () => {
    setIsLoading(true);
    await createBlink();
    await new Promise((resolve) => setTimeout(resolve, 4000));
    setIsLoading(false);
  };

  const updateTemplateJs = (js: string): string => {
    let updatedJs = js;
    updatedJs = updatedJs.replace(/const RECIPIENT = "[^"]*"/, `const RECIPIENT = "${recipient}"`);
    return updatedJs;
  };

  const extractRecipient = (js: string): string => {
    const match = js.match(/const RECIPIENT = "([^"]*)"/);
    return match ? match[1] : "";
  };

  const extractTokenConfig = (js: string): TokenConfig => {
    // Extract TOKEN_CONFIG object using regex
    const configMatch = js.match(/const TOKEN_CONFIG = ({[\s\S]*?});/);
    if (!configMatch) throw new Error("Token configuration not found");

    // Parse the matched configuration
    const configText = configMatch[1].replace(/\n/g, "");
    // Safely evaluate the configuration object
    const config = eval(`(${configText})`);

    return {
      name: config.name,
      symbol: config.symbol,
      contractAddress: config.contractAddress,
      iconUri: config.iconUri,
      maxSupply: config.maxSupply,
      mintLimit: config.mintLimit,
    };
  };

  const extractNFTConfig = (js: string): NFTConfig => {
    // Extract NFT_CONFIG object using regex
    const configMatch = js.match(/const NFT_CONFIG = ({[\s\S]*?});/);
    if (!configMatch) throw new Error("NFT configuration not found");
    // Parse the matched configuration
    const configText = configMatch[1].replace(/\n/g, "");
    // Safely evaluate the configuration object

    const config = eval(`(${configText})`);

    return {
      collectionName: config.collectionName,
      collectionDescription: config.collectionDescription,
      collectionImage: config.collectionImage,
      contractAddress: config.contractAddress,
      maxSupply: config.maxSupply,
      mintLimitPerAccount: config.mintLimitPerAccount,
      mintFee: config.mintFee,
      isMintActive: config.isMintActive,
    };
  };

  const extractPollsConfig = (js: string): PollsConfig => {
    // Extract individual constants using regex
    const addressMatch = js.match(/const address = "(.*?)"/);
    const nameMatch = js.match(/const name = "(.*?)"/);
    const creatorMatch = js.match(/const creator = "(.*?)"/);

    if (!addressMatch || !nameMatch || !creatorMatch) {
      throw new Error("Polls configuration not found");
    }

    return {
      address: addressMatch[1],
      name: nameMatch[1],
      creator: creatorMatch[1],
    };
  };

  // Usage example:
  const extractConfigFromTemplate = (templateName: string, js: string) => {
    switch (templateName.toLowerCase()) {
      case "token":
        return extractTokenConfig(js);
      case "nft":
        return extractNFTConfig(js);
      case "polls":
        return extractPollsConfig(js);
      default:
        throw new Error(`Unknown template type: ${templateName}`);
    }
  };

  // Helper function to update configurations in template code
  const updateTemplateConfig = (
    templateName: string,
    js: string,
    newConfig: TokenConfig | NFTConfig | PollsConfig,
  ): string => {
    switch (templateName.toLowerCase()) {
      case "token": {
        const config = newConfig as TokenConfig;
        return js.replace(
          /const TOKEN_CONFIG = {[\s\S]*?};/,
          `const TOKEN_CONFIG = {
  name: '${config.name}',
  symbol: '${config.symbol}',
  contractAddress: '${config.contractAddress}',
  iconUri: '${config.iconUri}',
  maxSupply: ${config.maxSupply},
  mintLimit: ${config.mintLimit}
};`,
        );
      }
      case "nft": {
        const config = newConfig as NFTConfig;
        return js.replace(
          /const NFT_CONFIG = {[\s\S]*?};/,
          `const NFT_CONFIG = {
  collectionName: '${config.collectionName}',
  collectionDescription: '${config.collectionDescription}',
  collectionImage: '${config.collectionImage}',
  contractAddress: '${config.contractAddress}',
  maxSupply: ${config.maxSupply},
  mintLimitPerAccount: ${config.mintLimitPerAccount},
  mintFee: ${config.mintFee},
  isMintActive: ${config.isMintActive}
};`,
        );
      }
      case "polls": {
        const config = newConfig as PollsConfig;
        return js
          .replace(/const address = "[^"]*"/, `const address = "${config.address}"`)
          .replace(/const name = "[^"]*"/, `const name = "${config.name}"`)
          .replace(/const creator = "[^"]*"/, `const creator = "${config.creator}"`);
      }
      default:
        throw new Error(`Unknown template type: ${templateName}`);
    }
  };

  return (
    <div className="">
      {isLoading ? (
        <div className="flex justify-center items-center mt-32 flex-col">
          {/* <img src="/icons/loader.svg" className="animate-spin h-12 w-12 text-white" alt="Loading" /> */}
          <Loader className="animate-spin h-20 w-20 text-white" />
          <p className="text-white mt-6">Deploying Your Blink To IPFS</p>
        </div>
      ) : (
        <>
          {selectedTemplate && (
            <div className="flex bg-white rounded-lg shadow-md p-4 mt-12">
              <div
                className="templateContainer flex-1 rounded-lg p-4 mr-4"
                dangerouslySetInnerHTML={{ __html: templates[selectedTemplate].html }}
                onClick={(e) => handleElementClick(e.target as HTMLElement)}
              />
              {editMode && (
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">Edit Element</h3>
                  <div className="mb-2">
                    <label className="block text-sm font-medium text-gray-700">Background Color</label>
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => handleBgColorChange(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block text-sm font-medium text-gray-700">Text Color</label>
                    <input
                      type="color"
                      value={textColor}
                      onChange={(e) => handleTextColorChange(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block text-sm font-medium text-gray-700">Text Content</label>
                    <input
                      type="text"
                      value={text}
                      onChange={(e) => handleTextChange(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                  </div>
                </div>
              )}
              {showTooltip && (
                <div className="absolute bg-white p-2 rounded shadow-md">
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={handleImageUrlChange}
                    placeholder="Enter image URL"
                    className="p-2 border border-gray-300 rounded mb-2"
                  />
                  <div className="flex justify-between">
                    <button onClick={updateImageUrl} className="bg-[#89e219] text-white p-1 rounded">
                      Update
                    </button>
                    <button onClick={cancelImageUpdate} className="bg-red-500 text-white p-1 rounded">
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          <div className="mt-4 flex gap-4 justify-center">
            {!editMode ? (
              <>
                <button
                  className="bg-blue-500 text-white font-semibold py-2 px-14 rounded hover:bg-blue-600"
                  onClick={() => setEditMode(true)}
                >
                  Edit
                </button>
                <button
                  className="bg-[#89e219] text-white font-semibold py-2 px-10 rounded hover:bg-[#5ed63d]"
                  onClick={handleDeployClick}
                >
                  Deploy
                </button>
              </>
            ) : (
              <>
                <button
                  className="bg-blue-500 text-white font-semibold py-2 px-14 rounded hover:bg-blue-600"
                  onClick={() => setEditMode(false)}
                >
                  Save
                </button>
                <button
                  className="bg-gray-300 text-black font-semibold py-2 px-10 rounded hover:bg-gray-400"
                  onClick={() => setEditMode(false)}
                >
                  Cancel
                </button>
              </>
            )}
          </div>

          {selectedTemplate === "donation" && (
            <div className="mt-5 p-4 rounded-lg bg-gray-100 shadow-md">
              <h5 className="text-lg font-bold mb-2 text-center">Edit Donation Field</h5>
              <label className="block mb-1">Recipient</label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="p-2 border border-gray-300 rounded mb-2 w-full"
              />
            </div>
          )}

          {selectedTemplate === "payment" && (
            <div className="mt-5 p-4 rounded-lg bg-gray-100 shadow-md">
              <h5 className="text-lg font-bold mb-2 text-center">Edit Payment Field</h5>
              <label className="block mb-1">Recipient</label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="p-2 border border-gray-300 rounded mb-2 w-full"
              />
            </div>
          )}

          {selectedTemplate === "marketplace" && (
            <div className="mt-5 p-4 rounded-lg bg-gray-100 shadow-md">
              <h5 className="text-lg font-bold mb-2 text-center">Edit Payment Field</h5>
              <label className="block mb-1">NFT Address</label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="p-2 border border-gray-300 rounded mb-2 w-full"
              />
              <label className="block mb-1">Price</label>
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="p-2 border border-gray-300 rounded mb-2 w-full"
              />
              <label className="block mb-1">Max Supply</label>
              <input
                type="text"
                value={supply}
                onChange={(e) => setSupply(e.target.value)}
                className="p-2 border border-gray-300 rounded mb-2 w-full"
              />
            </div>
          )}

          {selectedTemplate === "token" && (
            <div className="mt-5 p-4 rounded-lg bg-gray-100 shadow-md">
              <h5 className="text-lg font-bold mb-2 text-center">Edit Token Configuration</h5>
              <div className="space-y-3">
                <div>
                  <label className="block mb-1">Token Name</label>
                  <input
                    type="text"
                    value={tokenConfig.name}
                    onChange={(e) => handleTokenConfigUpdate("name", e.target.value)}
                    className="p-2 border border-gray-300 rounded w-full"
                  />
                </div>
                <div>
                  <label className="block mb-1">Symbol</label>
                  <input
                    type="text"
                    value={tokenConfig.symbol}
                    onChange={(e) => handleTokenConfigUpdate("symbol", e.target.value)}
                    className="p-2 border border-gray-300 rounded w-full"
                  />
                </div>
                <div>
                  <label className="block mb-1">Contract Address</label>
                  <input
                    type="text"
                    value={tokenConfig.contractAddress}
                    onChange={(e) => handleTokenConfigUpdate("contractAddress", e.target.value)}
                    className="p-2 border border-gray-300 rounded w-full"
                  />
                </div>
                <div>
                  <label className="block mb-1">Max Supply</label>
                  <input
                    type="number"
                    value={tokenConfig.maxSupply}
                    onChange={(e) => handleTokenConfigUpdate("maxSupply", parseInt(e.target.value))}
                    className="p-2 border border-gray-300 rounded w-full"
                  />
                </div>
                <div>
                  <label className="block mb-1">Mint Limit</label>
                  <input
                    type="number"
                    value={tokenConfig.mintLimit}
                    onChange={(e) => handleTokenConfigUpdate("mintLimit", parseInt(e.target.value))}
                    className="p-2 border border-gray-300 rounded w-full"
                  />
                </div>
              </div>
            </div>
          )}

          {selectedTemplate === "nft" && (
            <div className="mt-5 p-4 rounded-lg bg-gray-100 shadow-md">
              <h5 className="text-lg font-bold mb-2 text-center">Edit NFT Configuration</h5>
              <div className="space-y-3">
                <div>
                  <label className="block mb-1">Collection Name</label>
                  <input
                    type="text"
                    value={nftConfig.collectionName}
                    onChange={(e) => handleNFTConfigUpdate("collectionName", e.target.value)}
                    className="p-2 border border-gray-300 rounded w-full"
                  />
                </div>
                <div>
                  <label className="block mb-1">Description</label>
                  <textarea
                    value={nftConfig.collectionDescription}
                    onChange={(e) => handleNFTConfigUpdate("collectionDescription", e.target.value)}
                    className="p-2 border border-gray-300 rounded w-full"
                  />
                </div>
                <div>
                  <label className="block mb-1">Contract Address</label>
                  <input
                    type="text"
                    value={nftConfig.contractAddress}
                    onChange={(e) => handleNFTConfigUpdate("contractAddress", e.target.value)}
                    className="p-2 border border-gray-300 rounded w-full"
                  />
                </div>
                <div>
                  <label className="block mb-1">Mint Fee (APT)</label>
                  <input
                    type="number"
                    value={nftConfig.mintFee}
                    onChange={(e) => handleNFTConfigUpdate("mintFee", parseFloat(e.target.value))}
                    className="p-2 border border-gray-300 rounded w-full"
                  />
                </div>
                <div>
                  <label className="block mb-1">Max Supply</label>
                  <input
                    type="number"
                    value={nftConfig.maxSupply}
                    onChange={(e) => handleNFTConfigUpdate("maxSupply", parseInt(e.target.value))}
                    className="p-2 border border-gray-300 rounded w-full"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={nftConfig.isMintActive}
                    onChange={(e) => handleNFTConfigUpdate("isMintActive", e.target.checked)}
                    className="mr-2"
                  />
                  <label>Minting Active</label>
                </div>
              </div>
            </div>
          )}

          {selectedTemplate === "polls" && (
            <div className="mt-5 p-4 rounded-lg bg-gray-100 shadow-md">
              <h5 className="text-lg font-bold mb-2 text-center">Edit Polls Configuration</h5>
              <div className="space-y-3">
                <div>
                  <label className="block mb-1">Poll Name</label>
                  <input
                    type="text"
                    value={pollsConfig.name}
                    onChange={(e) => handlePollsConfigUpdate("name", e.target.value)}
                    className="p-2 border border-gray-300 rounded w-full"
                  />
                </div>
                <div>
                  <label className="block mb-1">Contract Address</label>
                  <input
                    type="text"
                    value={pollsConfig.address}
                    onChange={(e) => handlePollsConfigUpdate("address", e.target.value)}
                    className="p-2 border border-gray-300 rounded w-full"
                  />
                </div>
                <div>
                  <label className="block mb-1">Creator Address</label>
                  <input
                    type="text"
                    value={pollsConfig.creator}
                    onChange={(e) => handlePollsConfigUpdate("creator", e.target.value)}
                    className="p-2 border border-gray-300 rounded w-full"
                  />
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EditDapp;
