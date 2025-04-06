// Initialize storage when extension is installed
chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.local.set({ allowedSites: {} });
});

// Function to check if a site is temporarily allowed
function isTemporarilyAllowed(url) {
  return new Promise((resolve) => {
    chrome.storage.local.get(['allowedSites'], function(result) {
      const allowedSites = result.allowedSites || {};
      const hostname = new URL(url).hostname;
      
      if (allowedSites[hostname]) {
        const expirationTime = allowedSites[hostname];
        const currentTime = Date.now();
        
        if (currentTime < expirationTime) {
          // Site is still within allowed time window
          resolve(true);
          return;
        } else {
          // Exception has expired, remove it
          delete allowedSites[hostname];
          chrome.storage.local.set({ allowedSites: allowedSites });
        }
      }
      resolve(false);
    });
  });
}

chrome.webNavigation.onBeforeNavigate.addListener(async function(details) {
  const aiSites = [
    "chat.openai.com",
    "claude.ai",
    "deepseek.ai",
    "bard.google.com",
    "perplexity.ai",
    "anthropic.com",
    "huggingface.co"
  ];
  
  const url = new URL(details.url);
  
  if (aiSites.some(site => url.hostname.includes(site))) {
    // Check if this site has a temporary exception
    const isAllowed = await isTemporarilyAllowed(details.url);
    
    if (isAllowed) {
      // Let user through if there's a temporary exception
      return;
    }
    
    // Otherwise, block and redirect
    chrome.tabs.update(details.tabId, {
      url: chrome.runtime.getURL("blocked.html") + "?blocked=" + encodeURIComponent(details.url)
    });
    return { cancel: true };
  }
});