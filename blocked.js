document.addEventListener('DOMContentLoaded', function() {
    const overrideBtn = document.getElementById('overrideBtn');
    const overrideSection = document.getElementById('overrideSection');
    const confirmInput = document.getElementById('confirmInput');
    const submitOverride = document.getElementById('submitOverride');
    
    // Get the blocked URL from the query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const blockedUrl = urlParams.get('blocked') || '';
    
    // Display the blocked URL if available
    const blockedUrlElement = document.getElementById('blockedUrl');
    if (blockedUrlElement && blockedUrl) {
        const hostname = new URL(blockedUrl).hostname;
        blockedUrlElement.textContent = hostname;
    }
    
    overrideBtn.addEventListener('click', function() {
      overrideSection.style.display = 'block';
      confirmInput.style.display = 'block';
      overrideBtn.style.display = 'none';
    });
    
    confirmInput.addEventListener('input', function() {
      if (confirmInput.value.toLowerCase() === 'i am about to let ai think for me') {
        submitOverride.style.display = 'block';
      } else {
        submitOverride.style.display = 'none';
      }
    });
    
    submitOverride.addEventListener('click', function() {
      if (confirmInput.value.toLowerCase() === 'i am about to let ai think for me') {
        if (blockedUrl) {
          // Store the allowed site in local storage with expiration time (10 minutes)
          try {
            const hostname = new URL(blockedUrl).hostname;
            const expirationTime = Date.now() + (10 * 60 * 1000); // 10 minutes
            const allowedSites = {};
            allowedSites[hostname] = expirationTime;
            
            chrome.storage.local.set({ allowedSites: allowedSites }, function() {
              // Navigate directly to the blocked URL
              window.location.href = blockedUrl;
            });
          } catch (error) {
            console.error("Error:", error);
            // If anything fails, just try direct navigation
            window.location.href = blockedUrl;
          }
        } else {
          // If no blocked URL is available, go back
          window.history.back();
        }
      }
    });
  });