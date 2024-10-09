import React, { useState, useEffect } from "react";
import { Loader } from "lucide-react";
import templatesJson from "../../utils/Templates.json";

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
  const [price, setPrice] = useState<string>("");
  const [supply, setSupply] = useState<string>("");
  const [recipient, setRecipient] = useState<string>("0x000000000000");

  useEffect(() => {
    if (currentBlinkObject.templateName) {
      setSelectedTemplate(currentBlinkObject.templateName);
      // Extract initial values from the template
      const template = templates[currentBlinkObject.templateName];
      // setRecipient(extractRecipient(template.js));
    }
  }, [currentBlinkObject]);

  const handleTemplateSelect = (templateName: string) => {
    setSelectedTemplate(templateName);
    setEditingElement(null);
  };

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
    const htmlContent = `${editedHtml}`;

    const template = templates[selectedTemplate];
    const modifiedJs = updateTemplateJs(template.js);

    const iFrame = { iframe: { html: htmlContent, js: modifiedJs } };
    const res = await fetch("http://localhost:8000/storeToIpfs", {
      method: "POST",
      body: JSON.stringify(iFrame),
      headers: {
        "Content-Type": "application/json",
      },
    });

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

  return (
    <div className="">
      {isLoading ? (
        <div className="flex justify-center items-center mt-20 flex-col">
          <img src="/icons/loader.svg" className="animate-spin h-12 w-12 text-white" alt="Loading" />
          <p className="text-white">Deploying Your APT-Link To IPFS</p>
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
        </>
      )}
    </div>
  );
};

export default EditDapp;
