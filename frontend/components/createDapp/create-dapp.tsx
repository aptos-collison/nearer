import React, { useState } from "react";
import templatesJson from "../../utils/Templates.json";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CreateNFT from "../templates/create-nft";
import CreateToken from "../templates/create-token";
import InitializePoll from "../templates/create-poll";

interface Template {
  html: string;
  js: string;
  name: string;
}

interface Templates {
  [key: string]: Template;
}

const templates: Templates = templatesJson as Templates;

interface CreateDappProps {
  currentBlinkObject: any;
  setCurrentBlinkObject: React.Dispatch<React.SetStateAction<any>>;
  handleNextClick: () => void;
}

export const CreateDapp: React.FC<CreateDappProps> = ({
  currentBlinkObject,
  setCurrentBlinkObject,
  handleNextClick,
}) => {
  const [currentBlinkObjectState, setCurrentBlinkObjectState] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogComponent, setDialogComponent] = useState<JSX.Element | null>(null);

  function updateBlinkObjectTemplate(id: number, name: string) {
    const newBlinkObject = { ...currentBlinkObject, templateId: id, templateName: name };
    setCurrentBlinkObject(newBlinkObject);
    setCurrentBlinkObjectState(true);
    setSelectedTemplate(name);
  }

  const openDialog = (component: JSX.Element) => {
    setDialogComponent(component);
    setDialogOpen(true);
  };

  return (
    <div className="flex flex-col items-center justify-between">
      <div className="grid grid-cols-3 gap-4 mt-10 w-full">
        {Object.keys(templates).map((template, index) => (
          <div
            key={index}
            className={`flex flex-col items-center justify-center px-2 py-4 m-2 rounded-3xl border transition-all cursor-pointer 
              ${selectedTemplate === template ? "bg-gray-100 border-sky-500" : "bg-white border-transparent"}`}
            onClick={() => updateBlinkObjectTemplate(index + 1, template)}
          >
            <span className="mb-4 text-xl font-bold">{templates[template].name}</span>
            <div dangerouslySetInnerHTML={{ __html: templates[template].html }} />
          </div>
        ))}
      </div>

      <div className="flex justify-center space-x-3 w-full mt-8">
        {selectedTemplate === "token" && (
          <Button
            className="bg-[#89e219] text-lg text-white font-semibold py-2 px-10 rounded-lg hover:bg-[#5ed63d]"
            onClick={() => openDialog(<CreateToken />)}
          >
            Create Token
          </Button>
        )}

        {selectedTemplate === "nft" && (
          <Button
            className="bg-[#89e219] text-lg text-white font-semibold py-2 px-10 rounded-lg hover:bg-[#5ed63d]"
            onClick={() => openDialog(<CreateNFT />)}
          >
            Create NFT
          </Button>
        )}

        {selectedTemplate === "polls" && (
          <Button
            className="bg-[#89e219] text-lg text-white font-semibold py-2 px-10 rounded-lg hover:bg-[#5ed63d]"
            onClick={() => openDialog(<InitializePoll />)}
          >
            Initialize Vote
          </Button>
        )}

        <Button
          className={`text-white font-semibold text-lg py-2 rounded-lg cursor-pointer 
          ${currentBlinkObjectState ? "bg-blue-500 hover:bg-blue-600" : "bg-black"} px-16`}
          onClick={handleNextClick}
          disabled={!currentBlinkObjectState}
        >
          {currentBlinkObjectState ? "Next" : "Select a template"}
        </Button>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedTemplate === "nft" ? "Create NFT" : selectedTemplate === "token" ? "Create Token" : "Initialize Vote"}</DialogTitle>
          </DialogHeader>
          {dialogComponent}
        </DialogContent>
      </Dialog>
    </div>
  );
};



// const uploadPaymentComponentToIPFS = async () => {
//   console.log("Starting upload to IPFS...");

//   const iFrame = {
//     iframe: {
//       html: `
//       <style>
//         .dynamic-mint-container {
//           background-color: white;
//           width: 100%;
//           max-width: 28rem;
//           border: 2px solid black;
//           border-radius: 0.375rem;
//           height: 460px;
//           font-family: 'VT323', monospace;
//           overflow-y: auto;
//           box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
//           margin: 0 auto;
//           padding: 16px;
//         }
//         .image-container {
//           display: flex;
//           justify-content: center;
//           align-items: center;
//           margin-bottom: 16px;
//         }
//         .token-icon {
//           max-width: 96px;
//           max-height: 160px;
//           object-fit: contain;
//           border-radius: 9999px;
//           overflow: hidden;
//         }
//         .input-group {
//           margin-bottom: 16px;
//         }
//         .input-label {
//           display: block;
//           margin-bottom: 4px;
//           font-weight: 500;
//         }
//         .input-field {
//           width: 100%;
//           padding: 8px;
//           border: 1px solid #d1d5db;
//           border-radius: 4px;
//         }
//         .checkbox-group {
//           display: flex;
//           align-items: center;
//           margin-bottom: 16px;
//         }
//         .checkbox-label {
//           margin-left: 8px;
//         }
//         .advanced-options {
//           border-top: 1px solid #d1d5db;
//           padding-top: 16px;
//           margin-top: 16px;
//         }
//         .button {
//           width: 100%;
//           padding: 8px 16px;
//           background-color: #3b82f6;
//           color: white;
//           font-weight: 700;
//           border: none;
//           border-radius: 4px;
//           cursor: pointer;
//           transition: background-color 0.3s;
//         }
//         .button:hover {
//           background-color: #2563eb;
//         }
//         .button:disabled {
//           opacity: 0.7;
//           cursor: not-allowed;
//         }
//         .loading {
//           background: linear-gradient(to right, #60a5fa, #ffffff);
//           animation: pulse 2s infinite;
//         }
//         @keyframes pulse {
//           0% { background-position: 0% 50%; }
//           50% { background-position: 100% 50%; }
//           100% { background-position: 0% 50%; }
//         }
//         .success {
//           background-color: #10b981;
//         }
//         .error-message {
//           color: #ef4444;
//           margin-top: 8px;
//         }
//         .mint-info {
//           display: flex;
//           justify-content: space-between;
//           margin-top: 16px;
//         }
//         .mint-info-item {
//           text-align: center;
//         }
//         .mint-info-label {
//           font-size: 0.875rem;
//           color: #4b5563;
//         }
//         .mint-info-value {
//           font-size: 1.25rem;
//           font-weight: 700;
//           color: #111827;
//         }
//       </style>
//       <div id="dynamicMintContainer" class="dynamic-mint-container">
//         <div class="image-container">
//           <img id="tokenIcon" src="https://utfs.io/f/PKy8oE1GN2J3w6bQu3oTGjD39YCQS6grBNLTs0O8fHmZ51cK" alt="Token icon" class="token-icon">
//         </div>
//         <div id="createTokenForm">
//           <div class="input-group">
//             <label for="tokenName" class="input-label">Token Name</label>
//             <input id="tokenName" type="text" class="input-field" placeholder="Enter token name">
//           </div>
//           <div class="input-group">
//             <label for="tokenSymbol" class="input-label">Token Symbol</label>
//             <input id="tokenSymbol" type="text" class="input-field" placeholder="Enter token symbol">
//           </div>
//           <div class="input-group">
//             <label for="tokenDecimals" class="input-label">Decimals</label>
//             <input id="tokenDecimals" type="number" class="input-field" placeholder="Enter number of decimal places">
//           </div>
//           <div class="input-group">
//             <label for="tokenIcon" class="input-label">Token Icon</label>
//             <input id="tokenIcon" type="file" accept="image/*">
//           </div>
//           <div class="checkbox-group">
//             <input id="showAdvanced" type="checkbox">
//             <label for="showAdvanced" class="checkbox-label">Show advanced options</label>
//           </div>
//           <div id="advancedOptions" class="advanced-options" style="display: none;">
//             <div class="input-group">
//               <label for="projectUri" class="input-label">Project URI</label>
//               <input id="projectUri" type="text" class="input-field" placeholder="Enter project URI">
//             </div>
//             <div class="input-group">
//               <label for="mintFee" class="input-label">Mint Fee</label>
//               <input id="mintFee" type="number" class="input-field" placeholder="Mint fee per smallest unit">
//             </div>
//             <div class="input-group">
//               <label for="preMintAmount" class="input-label">Pre-mint Amount</label>
//               <input id="preMintAmount" type="number" class="input-field" placeholder="Enter pre-mint amount">
//             </div>
//             <div class="input-group">
//               <label for="mintLimit" class="input-label">Mint Limit per Address</label>
//               <input id="mintLimit" type="number" class="input-field" placeholder="Mint limit per address">
//             </div>
//             <div class="input-group">
//               <label for="maxSupply" class="input-label">Max Supply</label>
//               <input id="maxSupply" type="number" class="input-field" placeholder="Enter max supply (optional)">
//             </div>
//           </div>
//           <button id="createTokenButton" class="button">Create Token</button>
//         </div>
//         <div id="mintTokenForm" style="display: none;">
//           <div class="input-group">
//             <label for="mintQuantity" class="input-label">Quantity to Mint</label>
//             <input id="mintQuantity" type="number" class="input-field" placeholder="Enter quantity to mint">
//           </div>
//           <div class="mint-info">
//             <div class="mint-info-item">
//               <div class="mint-info-label">Mint Limit</div>
//               <div id="mintLimit" class="mint-info-value">0</div>
//             </div>
//             <div class="mint-info-item">
//               <div class="mint-info-label">Your Balance</div>
//               <div id="yourBalance" class="mint-info-value">0</div>
//             </div>
//             <div class="mint-info-item">
//               <div class="mint-info-label">Total Supply</div>
//               <div id="totalSupply" class="mint-info-value">0 / 0</div>
//             </div>
//           </div>
//           <button id="mintTokenButton" class="button">Mint Tokens</button>
//           <div class="input-group">
//             <label class="input-label">Token Address:</label>
//             <a id="tokenAddress" class="input-field" target="_blank" rel="noopener noreferrer"></a>
//           </div>
//         </div>
//         <div id="errorMessage" class="error-message"></div>
//       </div>
//     `,
//       js: `
//       (function() {
//         let formData = {
//           name: "",
//           symbol: "",
//           decimals: "",
//           icon_uri: "",
//           project_uri: "",
//           mint_fee_per_smallest_unit_of_fa: "",
//           pre_mint_amount: "",
//           mint_limit_per_addr: "",
//           max_supply: "",
//           mintTo: "",
//           quantity: "",
//         };
//         let asset = null;
//         let userMintBalance = 0;
//         let yourBalance = 0;
//         let maxSupply = 0;
//         let currentSupply = 0;
//         let loading = false;
//         let success = false;
//         let isCreatingToken = true;

//         const initializeDynamicMint = async () => {
//           const createTokenForm = document.getElementById('createTokenForm');
//           const mintTokenForm = document.getElementById('mintTokenForm');
//           const showAdvancedCheckbox = document.getElementById('showAdvanced');
//           const advancedOptions = document.getElementById('advancedOptions');
//           const createTokenButton = document.getElementById('createTokenButton');
//           const mintTokenButton = document.getElementById('mintTokenButton');
//           const errorMessageElement = document.getElementById('errorMessage');

//           // Initialize form event listeners
//           document.querySelectorAll('input').forEach(input => {
//             input.addEventListener('change', handleInputChange);
//           });

//           showAdvancedCheckbox.addEventListener('change', () => {
//             advancedOptions.style.display = showAdvancedCheckbox.checked ? 'block' : 'none';
//           });

//           createTokenButton.addEventListener('click', onCreateAsset);
//           mintTokenButton.addEventListener('click', mintFA);

//           // Check if we're creating a new token or minting an existing one
//           // This would typically involve checking the blockchain or a database
//           // For this example, we'll just use a placeholder condition
//           if (isCreatingToken) {
//             createTokenForm.style.display = 'block';
//             mintTokenForm.style.display = 'none';
//           } else {
//             createTokenForm.style.display = 'none';
//             mintTokenForm.style.display = 'block';
//             updateMintInfo();
//           }
//         };

//         const handleInputChange = (e) => {
//           const { name, value } = e.target;
//           formData[name] = value;
//         };

//         const onCreateAsset = async () => {
//           setLoading(true);
//           setError(null);

//           try {
//             // Placeholder for asset creation logic
//             // This would typically involve interacting with the blockchain
//             console.log('Creating asset with formData:', formData);

//             // Simulating a successful asset creation
//             asset = {
//               name: formData.name,
//               symbol: formData.symbol,
//               decimals: formData.decimals,
//               asset_type: '0x123...', // Placeholder asset address
//             };

//             isCreatingToken = false;
//             setSuccess(true);
//             document.getElementById('createTokenForm').style.display = 'none';
//             document.getElementById('mintTokenForm').style.display = 'block';
//             updateMintInfo();
//           } catch (error) {
//             setError('Failed to create asset: ' + error.message);
//           } finally {
//             setLoading(false);
//           }
//         };

//         const mintFA = async (e) => {
//           e.preventDefault();
//           setError(null);

//           if (!asset) {
//             return setError("Asset not found");
//           }

//           const amount = parseFloat(formData.quantity);
//           if (Number.isNaN(amount) || amount <= 0) {
//             return setError("Invalid amount");
//           }

//           setLoading(true);

//           try {
//             // Placeholder for minting logic
//             // This would typically involve interacting with the blockchain
//             console.log('Minting', amount, 'tokens of type', asset.asset_type);

//             // Simulating a successful mint
//             yourBalance += amount;
//             currentSupply += amount;
//             updateMintInfo();
//             setSuccess(true);
//           } catch (error) {
//             setError('Failed to mint tokens: ' + error.message);
//           } finally {
//             setLoading(false);
//           }
//         };

//         const updateMintInfo = () => {
//           document.getElementById('mintLimit').textContent = Math.min(userMintBalance, maxSupply - currentSupply);
//           document.getElementById('yourBalance').textContent = yourBalance;
//           document.getElementById('totalSupply').textContent = \`\${currentSupply} / \${maxSupply}\`;
//           document.getElementById('tokenAddress').textContent = asset.asset_type;
//           document.getElementById('tokenAddress').href = \`https://explorer.aptoslabs.com/account/\${asset.asset_type}?network=testnet\`;
//         };

//         const setLoading = (isLoading) => {
//           loading = isLoading;
//           const button = isCreatingToken ? document.getElementById('createTokenButton') : document.getElementById('mintTokenButton');
//           button.disabled = isLoading;
//           button.classList.toggle('loading', isLoading);
//           button.textContent = isLoading ? 'Processing...' : (isCreatingToken ? 'Create Token' : 'Mint Tokens');
//         };

//         const setSuccess = (isSuccess) => {
//           success = isSuccess;
//           const button = isCreatingToken ? document.getElementById('createTokenButton') : document.getElementById('mintTokenButton');
//           button.classList.toggle('success', isSuccess);
//           if (isSuccess) {
//             button.textContent = '✓ Done!';
//             setTimeout(() => {
//               button.classList.remove('success');
//               button.textContent = isCreatingToken ? 'Create Token' : 'Mint Tokens';
//             }, 3000);
//           }
//         };

//         const setError = (errorMessage) => {
//           const errorElement = document.getElementById('errorMessage');
//           errorElement.textContent = errorMessage || '';
//         };

//         // Initialize the component
//         initializeDynamicMint();
//       })();
//     `,
//     },
//   };

//   try {
//     const res = await fetch("http://localhost:8000/storeToIpfs", {
//       method: "POST",
//       body: JSON.stringify(iFrame),
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     const ipfsResponse = await res.text();
//     console.log("Upload completed. IPFS response:", ipfsResponse);
//     return ipfsResponse;
//   } catch (error) {
//     console.error("Error during upload to IPFS:", error);
//     throw error;
//   }
// };

{
  /* <div>
          <p className="text-lg text-white font-medium">Payment Template</p>
          <Payment />
        </div>
        <div>
          <p className="text-lg text-white font-medium">Marketplace Template</p>
          <Marketplace />
        </div>
        <div>
          <p className="text-lg text-white font-medium">Donation Template</p>
          <Donate />
        </div>
        <div>
          <p className="text-lg text-white font-medium">Swap Template</p>
          <Swap />
        </div>
        <div>
          <p className="text-lg text-white font-medium">NFT Template</p>
          <NFT />
        </div>
        <div>
          <p className="text-lg text-white font-medium">Polls Template</p>
          <Polls />
        </div> */
}
