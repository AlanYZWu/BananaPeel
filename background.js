// Create context menu item
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "translateText",
    title: "Translate",
    contexts: ["selection"]
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "translateText") {
    const selectedText = info.selectionText;
    
    try {
      // Inject content script if not already injected
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js']
      });

      // Send message to content script to handle translation
      await chrome.tabs.sendMessage(tab.id, {
        action: "translate",
        text: selectedText
      });

      await chrome.action.openPopup();
    } catch (error) {
      console.error('Error:', error);
    }
  }
}); 