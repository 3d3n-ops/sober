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
            overrideSection.style.display = 'none';
            confirmInput.style.display = 'none';
            submitOverride.style.display = 'none';
            overrideBtn.style.display = 'block';
            
            // Navigate to the blocked URL if available, otherwise go back
            if (blockedUrl) {
                window.location.href = blockedUrl;
            } else {
                window.history.back();
            }
        }
    });
});
