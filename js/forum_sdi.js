document.addEventListener('DOMContentLoaded', function() {
    console.log('Forum SDI page loaded - data.go.id embedded');
    
    const iframe = document.getElementById('dataGoIdFrame');
    const loadingOverlay = document.getElementById('loadingOverlay');
    const errorMessage = document.getElementById('errorMessage');
    const refreshBtn = document.getElementById('refreshBtn');
    const openNewBtn = document.getElementById('openNewBtn');
    const openExternalBtn = document.getElementById('openExternalBtn');
    
    // Hide loading overlay when iframe is loaded
    iframe.addEventListener('load', function() {
        loadingOverlay.style.display = 'none';
        console.log('data.go.id loaded successfully');
    });
    
    // Handle iframe errors
    iframe.addEventListener('error', function() {
        loadingOverlay.style.display = 'none';
        errorMessage.style.display = 'flex';
        console.error('Failed to load data.go.id in iframe');
    });
    
    // Check if iframe is blocked by X-Frame-Options
    setTimeout(function() {
        // If iframe hasn't loaded after 8 seconds, show error
        if (loadingOverlay.style.display !== 'none') {
            try {
                // Try to access iframe content - will fail if blocked by X-Frame-Options
                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                if (!iframeDoc || !iframeDoc.body) {
                    throw new Error('Cannot access iframe content');
                }
            } catch (e) {
                loadingOverlay.style.display = 'none';
                errorMessage.style.display = 'flex';
                console.error('data.go.id is blocked by X-Frame-Options policy');
            }
        }
    }, 8000);
    
    // Refresh button functionality
    refreshBtn.addEventListener('click', function() {
        loadingOverlay.style.display = 'flex';
        errorMessage.style.display = 'none';
        // Add timestamp to URL to avoid caching issues
        iframe.src = 'https://data.go.id/?' + new Date().getTime();
    });
    
    // Open in new tab button
    openNewBtn.addEventListener('click', function() {
        window.open('https://data.go.id/', '_blank');
    });
    
    // Open external button in error message
    openExternalBtn.addEventListener('click', function() {
        window.open('https://data.go.id/', '_blank');
    });
    
    // Add keyboard shortcut for refresh (Ctrl + R)
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'r') {
            e.preventDefault();
            refreshBtn.click();
        }
    });
    
    // Additional feature: periodically check if iframe is still responsive
    setInterval(function() {
        try {
            // Try to access iframe content to check if it's still accessible
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            if (!iframeDoc || !iframeDoc.body) {
                throw new Error('Iframe content not accessible');
            }
        } catch (e) {
            console.warn('Iframe content is not accessible, might be blocked');
            // Don't show error immediately as it might be temporary
        }
    }, 30000); // Check every 30 seconds
});