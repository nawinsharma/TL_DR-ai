// This content script can access the current web page DOM
// It runs in the context of the web page

console.log("AI Summarizer content script loaded");

// Function to extract the main content from a webpage
function extractPageContent(): string {
  // Try to find the main article content
  const article = document.querySelector('article');
  if (article) {
    return article.textContent || '';
  }
  
  // Try to find content in common content containers
  const contentSelectors = [
    'main',
    '.content',
    '.main-content',
    '#content',
    '#main-content',
    '.article-body',
    '.post-content'
  ];
  
  for (const selector of contentSelectors) {
    const element = document.querySelector(selector);
    if (element) {
      return element.textContent || '';
    }
  }
  
  // If no specific content container is found, get the body text
  // excluding scripts, styles, etc.
  const bodyText = Array.from(document.body.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li'))
    .map(element => element.textContent)
    .filter(text => text && text.trim().length > 0)
    .join('\n');
  
  if (bodyText) {
    return bodyText;
  }
  
  // Last resort: return all body text
  return document.body.innerText;
}

// Listen for messages from the extension popup or background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Content script received message:", message);
  
  if (message.action === "extractContent") {
    const content = extractPageContent();
    // Limit content size (Gemini API has token limits)
    const trimmedContent = content.substring(0, 30000);
    sendResponse({ content: trimmedContent });
  }
  
  // Return true to indicate you want to send a response asynchronously
  return true;
});

export {};