import { pinyin } from "pinyin";

// Function to detect if text is Chinese
function isChinese(text) {
  return /[\u4e00-\u9fa5]/.test(text);
}

// Function to translate text using Google Translate API
async function translateText(text) {
  const sourceChinese = isChinese(text);
  const targetLang = sourceChinese ? 'en' : 'zh-CN';
  const sourceLang = sourceChinese ? 'zh-CN' : 'en';

  try {
    const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`);
    const data = await response.json();
    const translatedText = data[0][0][0];

    // If translating to Chinese, add pinyin to translation
    if (!sourceChinese) {
      const pinyinText = pinyin(translatedText, {
        segement: true,
        group: true
      }).join(' ');
      return `${translatedText}\n${pinyinText}`;
    }

    // Return English translation
    return translatedText;
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