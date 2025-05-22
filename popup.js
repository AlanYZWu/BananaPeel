document.addEventListener('DOMContentLoaded', () => {
  // Get elements
  const originalTextElement = document.getElementById('original-text');
  const translatedTextElement = document.getElementById('translated-text');

  // Function to update the popup with translation results
  function updateTranslation() {
    chrome.storage.local.get(['lastTranslation'], (result) => {
      if (result.lastTranslation) {
        originalTextElement.textContent = result.lastTranslation.original;
        translatedTextElement.textContent = result.lastTranslation.translated;
      }
    });
  }

  // Update translation when popup opens
  updateTranslation();

  // Listen for storage changes
  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local' && changes.lastTranslation) {
      updateTranslation();
    }
  });
}); 