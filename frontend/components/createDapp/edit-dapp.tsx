import React, { useState, useEffect } from "react";
import { Loader } from "lucide-react";
import templatesJson from "../../utils/template.json";

// Types for different configurations
interface PortfolioConfig {
  profile: {
    name: string;
    bio: string;
    image: string;
    calendlyLink: string;
  };
  socialLinks: Array<{
    platform: string;
    url: string;
    icon: string;
  }>;
  works: Array<{
    title: string;
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

  // Configuration states
  const [portfolioConfig, setPortfolioConfig] = useState<PortfolioConfig>({
    profile: {
      name: "Creative Name",
      bio: "Digital Artist & Creator based in New York",
      image: "/api/placeholder/120/120",
      calendlyLink: "https://calendly.com/your-link",
    },
    socialLinks: [],
    works: [],
  
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
          case "portfolio":
            const extractedTokenConfig = extractConfigFromTemplate("portfolio", template.js);
            setPortfolioConfig(extractedTokenConfig as PortfolioConfig);
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
  const handlePortfolioConfigUpdate = (
    section: keyof PortfolioConfig["profile"] | "works" | "socialLinks",
    value: any,
  ) => {
    setPortfolioConfig((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        [section]: value,
      },
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
      case "portfolio":
        modifiedJs = updateTemplateConfig("portfolio", template.js, portfolioConfig);
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

  const updateTemplateJs = (js: string): string => {
    let updatedJs = js;
    updatedJs = updatedJs.replace(/const RECIPIENT = "[^"]*"/, `const RECIPIENT = "${recipient}"`);
    return updatedJs;
  };

  const extractRecipient = (js: string): string => {
    const match = js.match(/const RECIPIENT = "([^"]*)"/);
    return match ? match[1] : "";
  };

  const extractPortfolioConfig = (js: string): PortfolioConfig => {
    // Extract the portfolioConfig object using regex
    const configMatch = js.match(
      /const PORTFOLIO_CONFIG = {([\s\S]*?)};/,
    );
    if (!configMatch) throw new Error("Portfolio configuration not found");
  
    // Parse the matched configuration
    const configText = configMatch[1].replace(/\n/g, "").trim();
  
    // Replace single quotes with double quotes for JSON parsing
    const jsonText = configText.replace(/'/g, '"');
  
    try {
      // Safely parse the JSON configuration object
      const config = JSON.parse(`{${jsonText}}`);
      
      return {
        profile: {
          name: config.profile.name,
          bio: config.profile.bio,
          image: config.profile.image,
          calendlyLink: config.profile.calendlyLink,
        },
        socialLinks: config.socialLinks.map((link: { platform: any; url: any; icon: any }) => ({
          platform: link.platform,
          url: link.url,
          icon: link.icon,
        })),
        works: config.works.map((work: { title: any; image: any; price: any }) => ({
          title: work.title,
          image: work.image,
          price: work.price,
        })),
      };
    } catch (error) {
      console.error("Error parsing configuration:", error);
      throw new Error("Error extracting config: " + error);
    }
  };
  

  // Usage example:
  const extractConfigFromTemplate = (templateName: string, js: string) => {
    switch (templateName.toLowerCase()) {
      case "portfolio":
        return extractPortfolioConfig(js);

      default:
        throw new Error(`Unknown template type: ${templateName}`);
    }
  };

  // Helper function to update configurations in template code
  const updateTemplateConfig = (
    templateName: string,
    js: string,
    newConfig: PortfolioConfig,
  ): string => {
    switch (templateName.toLowerCase()) {
      case 'portfolio': {
        const config = newConfig;
  
        return js.replace(
          /const PORTFOLIO_CONFIG = {([\s\S]*?)};/,
          `const PORTFOLIO_CONFIG = {
    profile: {
      name: '${config.profile.name}',
      bio: '${config.profile.bio}',
      image: '${config.profile.image}',
      calendlyLink: '${config.profile.calendlyLink}'
    },
    socialLinks: ${JSON.stringify(config.socialLinks)},
    works: ${JSON.stringify(config.works)},
  };`
        );
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

          {selectedTemplate === "portfolio" && (
            <div className="mt-5 p-4 rounded-lg bg-gray-100 shadow-md">
              <h5 className="text-lg font-bold mb-2 text-center">Edit Portfolio Configuration</h5>
              <div className="space-y-3">
                {/* Profile Fields */}
                <div>
                  <label className="block mb-1">Name</label>
                  <input
                    type="text"
                    value={portfolioConfig.profile.name}
                    onChange={(e) => handlePortfolioConfigUpdate("name", e.target.value)}
                    className="p-2 border border-gray-300 rounded w-full"
                  />
                </div>
                <div>
                  <label className="block mb-1">Bio</label>
                  <textarea
                    value={portfolioConfig.profile.bio}
                    onChange={(e) => handlePortfolioConfigUpdate("bio", e.target.value)}
                    className="p-2 border border-gray-300 rounded w-full"
                  />
                </div>
                <div>
                  <label className="block mb-1">Profile Image URL</label>
                  <input
                    type="text"
                    value={portfolioConfig.profile.image}
                    onChange={(e) => handlePortfolioConfigUpdate("image", e.target.value)}
                    className="p-2 border border-gray-300 rounded w-full"
                  />
                </div>
                <div>
                  <label className="block mb-1">Calendly Link</label>
                  <input
                    type="text"
                    value={portfolioConfig.profile.calendlyLink}
                    onChange={(e) => handlePortfolioConfigUpdate("calendlyLink", e.target.value)}
                    className="p-2 border border-gray-300 rounded w-full"
                  />
                </div>

                {/* Social Links */}
                <h6 className="text-md font-semibold mb-2">Social Links</h6>
                {portfolioConfig.socialLinks.map((link, index) => (
                  <div key={index} className="space-y-2">
                    <div>
                      <label className="block mb-1">Platform</label>
                      <input
                        type="text"
                        value={link.platform}
                        onChange={(e) => {
                          const updatedLinks = [...portfolioConfig.socialLinks];
                          updatedLinks[index].platform = e.target.value;
                          setPortfolioConfig((prev) => ({
                            ...prev,
                            socialLinks: updatedLinks,
                          }));
                        }}
                        className="p-2 border border-gray-300 rounded w-full"
                      />
                    </div>
                    <div>
                      <label className="block mb-1">URL</label>
                      <input
                        type="text"
                        value={link.url}
                        onChange={(e) => {
                          const updatedLinks = [...portfolioConfig.socialLinks];
                          updatedLinks[index].url = e.target.value;
                          setPortfolioConfig((prev) => ({
                            ...prev,
                            socialLinks: updatedLinks,
                          }));
                        }}
                        className="p-2 border border-gray-300 rounded w-full"
                      />
                    </div>
                    <div>
                      <label className="block mb-1">Icon</label>
                      <input
                        type="text"
                        value={link.icon}
                        onChange={(e) => {
                          const updatedLinks = [...portfolioConfig.socialLinks];
                          updatedLinks[index].icon = e.target.value;
                          setPortfolioConfig((prev) => ({
                            ...prev,
                            socialLinks: updatedLinks,
                          }));
                        }}
                        className="p-2 border border-gray-300 rounded w-full"
                      />
                    </div>
                  </div>
                ))}

                {/* Add button for more social links */}
                <button
                  onClick={() => {
                    setPortfolioConfig((prev) => ({
                      ...prev,
                      socialLinks: [...prev.socialLinks, { platform: "", url: "", icon: "" }],
                    }));
                  }}
                  className="mt-2 p-2 bg-blue-500 text-white rounded"
                >
                  Add Social Link
                </button>

                {/* Works Section */}
                <h6 className="text-md font-semibold mb-2">Works</h6>
                {portfolioConfig.works.map((work, index) => (
                  <div key={index} className="space-y-2">
                    <div>
                      <label className="block mb-1">Title</label>
                      <input
                        type="text"
                        value={work.title}
                        onChange={(e) => {
                          const updatedWorks = [...portfolioConfig.works];
                          updatedWorks[index].title = e.target.value;
                          setPortfolioConfig((prev) => ({
                            ...prev,
                            works: updatedWorks,
                          }));
                        }}
                        className="p-2 border border-gray-300 rounded w-full"
                      />
                    </div>
                    <div>
                      <label className="block mb-1">Image URL</label>
                      <input
                        type="text"
                        value={work.image}
                        onChange={(e) => {
                          const updatedWorks = [...portfolioConfig.works];
                          updatedWorks[index].image = e.target.value;
                          setPortfolioConfig((prev) => ({
                            ...prev,
                            works: updatedWorks,
                          }));
                        }}
                        className="p-2 border border-gray-300 rounded w-full"
                      />
                    </div>
                    <div>
                      <label className="block mb-1">Price</label>
                      <input
                        type="text"
                        value={work.price}
                        onChange={(e) => {
                          const updatedWorks = [...portfolioConfig.works];
                          updatedWorks[index].price = e.target.value;
                          setPortfolioConfig((prev) => ({
                            ...prev,
                            works: updatedWorks,
                          }));
                        }}
                        className="p-2 border border-gray-300 rounded w-full"
                      />
                    </div>
                  </div>
                ))}

                {/* Add button for more works */}
                <button
                  onClick={() => {
                    setPortfolioConfig((prev) => ({
                      ...prev,
                      works: [...prev.works, { title: "", image: "", price: "" }],
                    }));
                  }}
                  className="mt-2 p-2 bg-blue-500 text-white rounded"
                >
                  Add Work
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EditDapp;
