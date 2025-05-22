// Function to detect if text is Chinese
function isChinese(text) {
  return /[\u4e00-\u9fa5]/.test(text);
}

// Function to translate text using Google Translate API
async function translateText(text) {
  const isChineseText = isChinese(text);
  const targetLang = isChineseText ? 'en' : 'zh-CN';
  const sourceLang = isChineseText ? 'zh-CN' : 'en';

  try {
    const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`);
    const data = await response.json();
    return data[0][0][0];
  } catch (error) {
    console.error('Translation error:', error);
    return 'Translation failed';
  }
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "translate") {
    translateText(request.text).then(translatedText => {
      // Store the translation result
      chrome.storage.local.set({
        'lastTranslation': {
          original: request.text,
          translated: translatedText
        }
      });
    });
  }
}); 