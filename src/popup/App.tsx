import React, { useState, useEffect } from 'react';
import ApiKeyForm from '../components/ApiKeyForm';
import LoadingSpinner from '../components/LoadingSpinner';
import { generateSummary } from '../services/geminiService';
import SummaryResult from '../components/SummaryResult';

const App: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [currentUrl, setCurrentUrl] = useState<string>('');
  const [summary, setSummary] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pageTitle, setPageTitle] = useState<string>('');
  const [darkMode, setDarkMode] = useState<boolean>(true); // Set dark mode as default

  // Load API key from storage
  useEffect(() => {
    chrome.storage.sync.get(['geminiApiKey', 'darkMode'], (result) => {
      if (result.geminiApiKey) {
        setApiKey(result.geminiApiKey);
      }
      // Only override dark mode from storage if explicitly set
      if (result.darkMode !== undefined) {
        setDarkMode(result.darkMode);
      } else {
        // Save the default dark mode to storage
        chrome.storage.sync.set({ darkMode: true });
      }
    });

    // Get current tab URL and title
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.url) {
        setCurrentUrl(tabs[0].url);
        setPageTitle(tabs[0].title || 'Current Page');
      }
    });
  }, []);

  // Toggle dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    chrome.storage.sync.set({ darkMode });
  }, [darkMode]);

  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    chrome.storage.sync.set({ geminiApiKey: key });
  };

  const handleSummarize = async () => {
    if (!apiKey) {
      setError('Please enter your Gemini API key first.');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const pageContent = await getPageContent();
      const result = await generateSummary(apiKey, pageContent);
      setSummary(result);
    } catch (err) {
      console.error('Error generating summary:', err);
      setError('Failed to generate summary. Please check your API key and try again.');
    } finally {
      setLoading(false);
    }
  };

  const getPageContent = (): Promise<string> => {
    return new Promise((resolve) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: () => {
              // Extract main content from the page
              const article = document.querySelector('article');
              if (article) {
                return article.innerText;
              }
              
              // Fallback to body text
              const bodyText = document.body.innerText;
              return bodyText.slice(0, 15000); // Limit to 15K chars for API limits
            }
          }, (results) => {
            if (results && results[0]?.result) {
              resolve(results[0].result as string);
            } else {
              resolve('Could not extract content from the page.');
            }
          });
        } else {
          resolve('No active tab found.');
        }
      });
    });
  };

  return (
    <div className={`min-h-screen p-4 ${darkMode ? 'dark' : ''}`}>
      <header className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <img 
            src="/assets/icon-48.svg" 
            alt="AI Summarizer Logo" 
            className="w-8 h-8 mr-2" 
          />
          <h1 className="text-2xl font-bold text-primary">AI Summarizer</h1>
        </div>
        <button 
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          {darkMode ? '🌙' : '☀️'}
        </button>
      </header>

      {!apiKey ? (
        <ApiKeyForm onSave={handleSaveApiKey} />
      ) : (
        <div>
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-1 truncate">{pageTitle}</h2>
            <p className="text-sm text-text-light dark:text-gray-400 truncate">{currentUrl}</p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {!summary && !loading && (
            <button 
              onClick={handleSummarize}
              className="w-full py-2 px-4 bg-primary hover:bg-primary-dark text-white font-bold rounded transition-colors"
            >
              Summarize Page
            </button>
          )}

          {loading && <LoadingSpinner message="Generating summary..." />}

          {summary && (
            <SummaryResult 
              summary={summary} 
              title={pageTitle}
              onReset={() => setSummary('')}
            />
          )}

          <div className="mt-4 text-right">
            <button 
              onClick={() => {
                setApiKey('');
                chrome.storage.sync.remove('geminiApiKey');
              }}
              className="text-sm text-text-light hover:text-primary dark:text-gray-400"
            >
              Change API Key
            </button>
          </div>
        </div>
      )}

      <footer className="mt-6 text-center text-sm text-text-light dark:text-gray-400">
        <a href='https://nawin.xyz' target='_blank'>@nawin.xyz</a>
      </footer>
    </div>
  );
};

export default App;