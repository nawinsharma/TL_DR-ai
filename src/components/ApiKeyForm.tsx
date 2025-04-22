import React, { useState } from 'react';

interface ApiKeyFormProps {
  onSave: (apiKey: string) => void;
}

const ApiKeyForm: React.FC<ApiKeyFormProps> = ({ onSave }) => {
  const [apiKey, setApiKey] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey.trim()) {
      setError('Please enter your Gemini API key');
      return;
    }
    
    // Simple validation for API key format
    if (apiKey.trim().length < 10) {
      setError('API key seems too short. Please check and try again.');
      return;
    }
    
    onSave(apiKey.trim());
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div className="flex flex-col items-center mb-4">
        <img 
          src="/assets/icon-128.svg" 
          alt="AI Summarizer Logo" 
          className="w-16 h-16 mb-3"
        />
        <h2 className="text-xl font-bold text-center dark:text-white">Welcome to AI Summarizer</h2>
      </div>
      
      <p className="mb-4 text-text-light dark:text-gray-300">
        To use this extension, please enter your Google Gemini API key below.
      </p>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label 
            htmlFor="apiKey" 
            className="block text-sm font-medium mb-1 dark:text-gray-200"
          >
            Gemini API Key
          </label>
          <input
            type="password"
            id="apiKey"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Enter your API key"
          />
          {error && (
            <p className="mt-1 text-red-600 dark:text-red-400 text-sm">{error}</p>
          )}
        </div>
        
        <div className="mt-6">
          <button
            type="submit"
            className="w-full py-2 px-4 bg-primary hover:bg-primary-dark text-white font-bold rounded transition-colors"
          >
            Save API Key
          </button>
        </div>
      </form>
      
      <div className="mt-4 text-sm text-text-light dark:text-gray-300">
        <p className="mb-2">
          Don't have an API key?{' '}
          <a 
            href="https://ai.google.dev/tutorials/get_api_key" 
            target="_blank" 
            rel="noreferrer"
            className="text-primary hover:underline"
          >
            Get one here
          </a>
        </p>
        <p className="text-xs dark:text-gray-400">
          Your API key is stored locally and is only used to access the Gemini API.
        </p>
      </div>
    </div>
  );
};

export default ApiKeyForm;