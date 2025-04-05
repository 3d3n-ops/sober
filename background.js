chrome.webNavigation.onBeforeNavigate.addListener(function(details) {
    //List of AI apps to block
    const aiSites = [
        "chat.openai.com",
        "claude.ai",
        "deepseek.ai",
        "bard.google.com",
        "perplexity.ai",
        "anthropic.com",
        "huggingface.co"
    ];

    //this checks the url of the tab to see if it contains the blocked site. If it does, then it will update the tab and show our blocked html page.  
    const url = new URL(details.url);
    if (aiSites.some(site => url.hostname.includes(site))) {
        chrome.tabs.update(details.tabId, {
            url: chrome.runtime.getURL("blocked.html") + "?blocked=" + encodeURIComponent(details.url)
        });
        return { cancel: true };
    }
});
