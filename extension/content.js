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

function reloadAptosSdk() {
  const existingScript = document.querySelector('script[src="https://unpkg.com/aptos@1.3.16/dist/index.global.js"]');
  if (existingScript) {
    existingScript.remove();
  }

  const aptosSdkScript = document.createElement("script");
  aptosSdkScript.src = "https://unpkg.com/aptos@1.3.16/dist/index.global.js";

  aptosSdkScript.onload = function () {
    console.log("Aptos SDK reloaded");
  };

  aptosSdkScript.onerror = function (error) {
    console.error("Error loading Aptos SDK:", error);
  };

  document.head.appendChild(aptosSdkScript);
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
              reloadAptosSdk(); // Reload the Aptos SDK after fetching

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

        // Modify the JS code to be wallet-agnostic
        let newJS = updateIdsInJsCode(result.jsCode, randomNumber);

        // Add wallet detection logic
        newJS = `
          const detectWallet = async () => {
            if (window.aptos) return window.aptos;
            if (window.petra) return window.petra;
            if (window.martian) return window.martian;
            if (window.pontem) return window.pontem;
            if (window.fewcha) return window.fewcha;
            return null;
          };

          const waitForAptosWallet = async () => {
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

// Initialize script with only Aptos SDK
reloadAptosSdk(); // Load the Aptos SDK initially

// Run the function every 1 second
setInterval(replaceBlkTags, 1000);
