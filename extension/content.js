// Function to inject a script into the page context
function injectScript(code) {
  const script = document.createElement("script");
  script.setAttribute("type", "text/javascript");
  script.textContent = code;
  (document.head || document.documentElement).appendChild(script);
  script.onload = function () {
    script.remove();
  };
}

const makeid = () => {
  return Math.floor(Math.random() * 100000000);
};

function updateIds(htmlString, number) {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = htmlString;

  const elementsWithId = tempDiv.querySelectorAll("[id]");
  elementsWithId.forEach((element) => {
    element.id += number;
  });

  const styleTags = tempDiv.querySelectorAll("style");
  styleTags.forEach((styleTag) => {
    styleTag.innerHTML = styleTag.innerHTML.replace(/#(\w+)\s*\{/g, (match, id) => {
      return `#${id}${number}{`;
    });
  });

  return tempDiv.innerHTML;
}

function updateIdsInJsCode(jsCode, number) {
  return jsCode.replace(/getElementById\s*\(\s*(['"`])(\w+)\1\s*\)/g, (match, quote, id) => {
    return `getElementById(${quote}${id}${number}${quote})`;
  });
}

function reloadEthereumSdk() {
  const existingScript = document.querySelector('script[src="https://cdn.ethers.io/lib/ethers-5.0.umd.min.js"]');
  if (existingScript) {
    existingScript.remove();
  }

  const ethereumSdkScript = document.createElement("script");
  ethereumSdkScript.src = "https://cdn.ethers.io/lib/ethers-5.0.umd.min.js";

  ethereumSdkScript.onload = function () {
    console.log("Ethereum SDK reloaded");
  };

  ethereumSdkScript.onerror = function (error) {
    console.error("Error loading Ethereum SDK:", error);
  };

  document.head.appendChild(ethereumSdkScript);
}

async function replaceBlkTags() {
  try {
    const spans = document.querySelectorAll("span");
    const fetchPromises = [];

    spans.forEach((span) => {
      const blkRegex = /(&lt;|<)blk\s*(.*?)\s*blk(&gt;|>)/g;
      let match;

      while ((match = blkRegex.exec(span.innerHTML)) !== null) {
        if (!match || match.length < 3) continue;

        let url = null;
        const matchText = match[0]; // Store the full matched text
        const url1 = match[2].trim();

        if (url1.startsWith("http")) {
          url = url1;
        } else if (url1.startsWith("ipfs://")) {
          url = "https://ipfs.io/ipfs/" + url1.substring("ipfs://".length);
        }

        if (!url) continue;

        console.log(`Fetching URL: ${url}`);

        fetchPromises.push(
          fetch(url)
            .then((response) => {
              if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
              return response.json();
            })
            .then((result) => {
              if (!result?.iframe?.html || !result?.iframe?.js) {
                throw new Error("Invalid response format");
              }
              reloadEthereumSdk(); // Reload the Ethereum SDK after fetching

              return {
                span,
                matchText,
                htmlText: result.iframe.html,
                jsCode: result.iframe.js,
              };
            })
            .catch((error) => {
              console.error(`Error processing ${url}:`, error);
              return null;
            }),
        );
      }
    });

    if (fetchPromises.length === 0) return;

    const results = await Promise.all(fetchPromises);

    results.forEach((result) => {
      if (!result || !result.matchText) return;

      try {
        const randomNumber = makeid();
        const newHtml = updateIds(result.htmlText, randomNumber);

        // Replace the matched content
        result.span.innerHTML = result.span.innerHTML.replace(result.matchText, newHtml);

        // Modify the JS code to be wallet-agnostic for Ethereum/Base
        let newJS = updateIdsInJsCode(result.jsCode, randomNumber);

        // Add wallet detection logic for Ethereum/Base
        newJS = `
          const detectWallet = async () => {
            if (window.ethereum) {
              // Check if the wallet is connected to Base
              const chainId = await window.ethereum.request({ method: 'eth_chainId' });
              if (chainId === '8453' || '84532') { // Chain ID for Base
                return window.ethereum;
              } else {
                console.log('Please connect to the Base network');
                return null;
              }
            }
            return null;
          };

          const waitForEthereumWallet = async () => {
            return new Promise((resolve) => {
              const checkWallet = async () => {
                const wallet = await detectWallet();
                if (wallet) {
                  resolve(wallet);
                } else {
                  setTimeout(checkWallet, 100);
                }
              };
              checkWallet();
            });
          };

   ]
          const connectWallet = async () => {
            const wallet = await waitForEthereumWallet();
            if (wallet) {
              try {
                await wallet.request({ method: 'eth_requestAccounts' });
                console.log('Wallet connected');
              } catch (error) {
                console.error('Failed to connect wallet:', error);
              }
            } else {
              console.log('No Base-compatible wallet found');
            }
          };

          ${newJS}
        `;

        setTimeout(() => {
          try {
            injectScript(newJS);
          } catch (error) {
            console.error("Error injecting script:", error);
          }
        }, 500);
      } catch (error) {
        console.error("Error processing result:", error);
      }
    });
  } catch (error) {
    console.error("Error in replaceBlkTags:", error);
  }
}

// Initialize script with Ethereum SDK
reloadEthereumSdk(); // Load the Ethereum SDK initially

// Run the function every 1 second
setInterval(replaceBlkTags, 1000);