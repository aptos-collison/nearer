import React, { useState, useEffect } from "react";
import { Loader } from "lucide-react";
import templatesJson from "../../utils/template.json";

interface MarketplaceConfig {
  nfts: Array<{
    image: string;
    price: string;
  }>;
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

  const [marketplaceConfig, setMarketplaceConfig] = useState<MarketplaceConfig>({
    nfts: [
      { image: "", price: "" },
      { image: "", price: "" },
      { image: "", price: "" },
      { image: "", price: "" },
    ],
  });

  // Payment/Donation states
  const [recipient, setRecipient] = useState<string>("0x000000000000");
  const [link, setLink] = useState<string>("your link");
  const [id, setId] = useState<string>("your cloudflare ID");
  const [token, setToken] = useState<string>("your cloudflare api token");
  const [nameSpace, setNameSpace] = useState<string>("your cloudflare name space");

  useEffect(() => {
    if (currentBlinkObject.templateName) {
      setSelectedTemplate(currentBlinkObject.templateName);
      const template = templates[currentBlinkObject.templateName];

      // Extract configurations based on template type
      try {
        switch (currentBlinkObject.templateName.toLowerCase()) {
          case "marketplace":
            const extractedMarketplaceConfig = extractMarketplaceConfig(template.js);
            setMarketplaceConfig(extractedMarketplaceConfig);
            setRecipient(extractRecipient(template.js));
            break;

          case "donation":
          case "payment":
            setRecipient(extractRecipient(template.js));
            break;
          case "portfolio":
            setLink(extractLink(template.js));
            break;
          case "review":
            setLink(extractLink(template.js));
            setId(extractID(template.js));
            setToken(extractToken(template.js));
            setNameSpace(extractNameSpace(template.js));
            break;
        }
      } catch (error) {
        console.error("Error extracting config:", error);
      }
    }
  }, [currentBlinkObject]);

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
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = "image/*";

      fileInput.onchange = async (event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file) {
          // Create FormData to upload the image
          const formData = new FormData();
          formData.append("file", file);
          formData.append("upload_preset", "baserl");

          try {
            const response = await fetch("https://api.cloudinary.com/v1_1/dgaw6tnra/image/upload", {
              method: "POST",
              body: formData,
            });

            const data = await response.json();
            if (data.secure_url) {
              const newImageUrl = data.secure_url;
              editingElement.src = newImageUrl;
            }

            setShowTooltip(false);
          } catch (error) {
            console.error("Error uploading image:", error);
          }
        }
      };

      fileInput.click();
    }
  };

  const cancelImageUpdate = () => {
    setShowTooltip(false);
  };

  // const handleNftImageClick = async (index: number) => {
  //   const fileInput = document.createElement("input");
  //   fileInput.type = "file";
  //   fileInput.accept = "image/*";

  //   fileInput.onchange = async (event) => {
  //     const file = (event.target as HTMLInputElement).files?.[0];
  //     if (file) {
  //       // Create FormData to upload the image
  //       const formData = new FormData();
  //       formData.append("file", file);
  //       formData.append("upload_preset", "baserl");

  //       try {
  //         const response = await fetch("https://api.cloudinary.com/v1_1/dgaw6tnra/image/upload", {
  //           method: "POST",
  //           body: formData,
  //         });

  //         const data = await response.json();
  //         if (data.secure_url) {
  //           const newImageUrl = data.secure_url;

  //           setMarketplaceConfig((prev) => {
  //             const updatedNfts = [...prev.nfts];
  //             updatedNfts[index].image = newImageUrl;
  //             return { ...prev, nfts: updatedNfts };
  //           });

  //           const imgElement = document.querySelector(`.templateContainer img:nth-child(${index + 1})`);
  //           if (imgElement instanceof HTMLImageElement) {
  //             imgElement.src = newImageUrl;
  //           }
  //         }
  //       } catch (error) {
  //         console.error("Error uploading image:", error);
  //       }
  //     }
  //   };

  //   fileInput.click();
  // };

  const handleNftPriceChange = (index: number, newPrice: string) => {
    setMarketplaceConfig((prev) => {
      const updatedNfts = [...prev.nfts];
      updatedNfts[index].price = newPrice;
      return { ...prev, nfts: updatedNfts };
    });
  };

  const createBlink = async () => {
    if (!selectedTemplate) return;

    const editedHtml = document.querySelector(".templateContainer")?.innerHTML || "";
    const template = templates[selectedTemplate];
    let modifiedJs = template.js;

    // Update JS based on template type
    switch (selectedTemplate.toLowerCase()) {
      case "donation":
      case "payment":
        modifiedJs = updateRecipientTemplateJs(template.js);
        break;
      case "portfolio":
        modifiedJs = updateLinkTemplateJs(template.js);
        break;
      case "review":
        modifiedJs = updateLinkTemplateJs(template.js); // Update LINK
        modifiedJs = updateToken(modifiedJs); // Update TOKEN based on modifiedJs
        modifiedJs = updateID(modifiedJs); // Update ID based on modifiedJs
        modifiedJs = updateNameSpace(modifiedJs); // Update NAME SPACE based on modifiedJs
        break;
      case "marketplace":
        modifiedJs = updateMarketplaceConfig(template.js, marketplaceConfig);
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

    console.log(iFrame);

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

  const updateRecipientTemplateJs = (js: string): string => {
    let updatedJs = js;
    updatedJs = updatedJs.replace(/const RECIPIENT = "[^"]*"/, `const RECIPIENT = "${recipient}"`);
    return updatedJs;
  };

  const updateLinkTemplateJs = (js: string): string => {
    let updatedJs = js;
    updatedJs = updatedJs.replace(/const LINK = "[^"]*"/, `const LINK = "${link}"`);
    return updatedJs;
  };

  const updateID = (js: string): string => {
    let updatedJs = js;
    updatedJs = updatedJs.replace(/const CLOUDFLARE_ACCOUNT_ID = "[^"]*"/, `const CLOUDFLARE_ACCOUNT_ID = "${id}"`);
    return updatedJs;
  };
  const updateToken = (js: string): string => {
    let updatedJs = js;
    updatedJs = updatedJs.replace(/const CLOUDFLARE_API_TOKEN = "[^"]*"/, `const CLOUDFLARE_API_TOKEN = "${token}"`);
    return updatedJs;
  };
  const updateNameSpace = (js: string): string => {
    let updatedJs = js;
    updatedJs = updatedJs.replace(
      /const CLOUDFLARE_NAMESPACE_ID = "[^"]*"/,
      `const CLOUDFLARE_NAMESPACE_ID = "${nameSpace}"`,
    );
    return updatedJs;
  };

  const extractRecipient = (js: string): string => {
    const match = js.match(/const RECIPIENT = "([^"]*)"/);
    return match ? match[1] : "";
  };

  const extractID = (js: string): string => {
    const match = js.match(/const CLOUDFLARE_ACCOUNT_ID = "([^"]*)"/);
    return match ? match[1] : "";
  };

  const extractToken = (js: string): string => {
    const match = js.match(/const CLOUDFLARE_API_TOKEN = "([^"]*)"/);
    return match ? match[1] : "";
  };
  const extractLink = (js: string): string => {
    const match = js.match(/const LINK = "([^"]*)"/);
    return match ? match[1] : "";
  };
  const extractNameSpace = (js: string): string => {
    const match = js.match(/const CLOUDFLARE_NAMESPACE_ID = "([^"]*)"/);
    return match ? match[1] : "";
  };

  const extractMarketplaceConfig = (js: string): MarketplaceConfig => {
    const nftImagesMatch = js.match(/const PRODUCT_IMAGES = \[(.*?)\]/s);
    const nftPricesMatch = js.match(/const PRODUCT_PRICES = \[(.*?)\]/s);
    const match = js.match(/const RECIPIENT = "([^"]*)"/);

    if (!nftImagesMatch || !nftPricesMatch || !match) {
      throw new Error("Marketplace configuration not found");
    }

    const images = JSON.parse(`[${nftImagesMatch[1]}]`);
    const prices = JSON.parse(`[${nftPricesMatch[1]}]`);

    return {
      nfts: images.map((image: string, index: number) => ({
        image,
        price: prices[index].toString(),
        recipient: match ? match[1] : "",
      })),
    };
  };

  const updateMarketplaceConfig = (js: string, newConfig: MarketplaceConfig): string => {
    const updatedJs = js
      .replace(
        /const PRODUCT_IMAGES = \[(.*?)\]/s,
        `const PRODUCT_IMAGES = [${newConfig.nfts.map((nft) => `"${nft.image}"`).join(", ")}]`,
      )
      .replace(
        /const PRODUCT_PRICES = \[(.*?)\]/s,
        `const PRODUCT_PRICES = [${newConfig.nfts.map((nft) => nft.price).join(", ")}]`,
      )

      .replace(/const RECIPIENT = "[^"]*"/, `const RECIPIENT = "${recipient}"`);

    return updatedJs;
  };

  return (
    <div className="">
      {isLoading ? (
        <div className="flex justify-center items-center flex-col h-[80vh]">
          {/* <img src="/icons/loader.svg" className="animate-spin h-12 w-12 text-white" alt="Loading" /> */}
          <Loader className="animate-spin h-20 w-20 text-white" />
          <p className="text-white mt-6">Deploying Your Nearer</p>
        </div>
      ) : (
        <>
          {selectedTemplate && (
            <div className="flex bg-white rounded-lg shadow-md p-4 mt-12 overflow-y-auto">
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

          {selectedTemplate === "review" && (
            <div className="mt-5 p-4 rounded-lg bg-gray-100 shadow-md">
              <h5 className="text-lg font-bold mb-2 text-center">Edit Review Fields</h5>
              <label className="block mb-1">Cloudflare Account ID</label>
              <input
                type="text"
                value={id}
                onChange={(e) => setId(e.target.value)}
                className="p-2 border border-gray-300 rounded mb-2 w-full"
              />
              <label className="block mb-1">Cloudflare API Token</label>
              <input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="p-2 border border-gray-300 rounded mb-2 w-full"
              />
              <label className="block mb-1">Cloudflare NameSpace ID</label>
              <input
                type="text"
                value={nameSpace}
                onChange={(e) => setNameSpace(e.target.value)}
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
              <h5 className="text-lg font-bold mb-2 text-center">Edit Shop Items</h5>
              <label className="block mb-1">Recipient</label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="p-2 border border-gray-300 rounded mb-2 w-full"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {marketplaceConfig.nfts.map((nft, index) => (
                  <div key={index} className="p-4 border border-gray-300 rounded bg-white shadow">
                    <h6 className="font-semibold">Item Price {index + 1}</h6>
                    <div>
                      <input
                        type="text"
                        value={nft.price}
                        onChange={(e) => handleNftPriceChange(index, e.target.value)}
                        className="p-2 border border-gray-300 rounded w-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedTemplate === "portfolio" && (
            <div className="mt-5 p-4 rounded-lg bg-gray-100 shadow-md">
              <h5 className="text-lg font-bold mb-2 text-center">Edit Portfolio</h5>
              <div className="space-y-3">
                {/* Profile Fields */}

                <div>
                  <label className="block mb-1">Contact Link ( calendly, meet.. )</label>
                  <input
                    type="text"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
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
