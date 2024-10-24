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

  // Replace onclick handlers with data attributes
  const elementsWithOnclick = tempDiv.querySelectorAll("[onclick]");
  elementsWithOnclick.forEach((element) => {
    const onclickValue = element.getAttribute("onclick");
    element.removeAttribute("onclick");
    element.setAttribute("data-click", onclickValue);
    element.setAttribute("class", (element.getAttribute("class") || "") + " js-click-handler");
  });

  // Update IDs
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
  const existingScript = document.querySelector('script[src*="ethers"]');
  if (existingScript) {
    existingScript.remove();
  }

  const ethereumSdkScript = document.createElement("script");
  ethereumSdkScript.src = "https://unpkg.com/ethers@5.7.2/dist/ethers.umd.min.js";

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
        const matchText = match[0];
        const url1 = match[2].trim();

        if (url1.startsWith("http")) {
          url = url1;
        } else if (url1.startsWith("ipfs://")) {
          url = "https://ipfs.io/ipfs/" + url1.substring("ipfs://".length);
        }

        if (!url) continue;

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
              reloadEthereumSdk();

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
            })
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

        result.span.innerHTML = result.span.innerHTML.replace(result.matchText, newHtml);

        let newJS = updateIdsInJsCode(result.jsCode, randomNumber);

        // Create namespaced wallet handling code
        const walletCode = `
          (function() {
            const walletHandler${randomNumber} = {
              detectWallet: async function() {
                if (window.ethereum) {
                  try {
                    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
                    if (chainId === '0x4e454152' || '0x4e454153')  {
                      return window.ethereum;
                    } else {
                      console.log('Please connect to the Aurora network');
                      return null;
                    }
                  } catch (error) {
                    console.error('Error detecting wallet:', error);
                    return null;
                  }
                }
                return null;
              },

              waitForEthereumWallet: async function() {
                return new Promise((resolve) => {
                  const checkWallet = async () => {
                    const wallet = await this.detectWallet();
                    if (wallet) {
                      resolve(new ethers.providers.Web3Provider(wallet));
                    } else {
                      setTimeout(checkWallet.bind(this), 100);
                    }
                  };
                  checkWallet.bind(this)();
                });
              },

              connectWallet: async function() {
                const provider = await this.waitForEthereumWallet();
                if (provider) {
                  try {
                    await provider.send('eth_requestAccounts', []);
                    console.log('Wallet connected');
                    return provider;
                  } catch (error) {
                    console.error('Failed to connect wallet:', error);
                    return null;
                  }
                }
                return null;
              }
            };

            // Add click event listeners
            document.addEventListener('DOMContentLoaded', () => {
              document.querySelectorAll('.js-click-handler').forEach(element => {
                const clickFunction = element.getAttribute('data-click');
                if (clickFunction) {
                  element.addEventListener('click', async (e) => {
                    e.preventDefault();
                    const provider = await walletHandler${randomNumber}.connectWallet();
                    if (provider) {
                      // Execute the original function in the context of the wallet handler
                      const func = new Function('return ' + clickFunction)();
                      func.call(window);
                    }
                  });
                }
              });
            });

            // Make wallet handler available globally with unique name
            window.walletHandler${randomNumber} = walletHandler${randomNumber};

            ${newJS}
          })();
        `;

        setTimeout(() => {
          try {
            injectScript(walletCode);
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
reloadEthereumSdk();

// Run the function every 1 second
setInterval(replaceBlkTags, 1000);