// This background script handles any background tasks and messaging
// It will run as a service worker in Chrome extensions using Manifest V3

console.log("AI Summarizer background script loaded");

// Listen for installation events
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    // First time installation
    console.log("AI Summarizer extension installed");
  } else if (details.reason === "update") {
    console.log(`AI Summarizer extension updated from ${details.previousVersion}`);
  }
});

// Listen for messages from content script or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Message received in background script:", message);
  
  if (message.action === "getSummary") {
    sendResponse({ status: "Background received getSummary request" });
  }
  
  // Return true to indicate you want to send a response asynchronously
  return true;
});

export {};