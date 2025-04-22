import React, { useState } from 'react';

interface SummaryResultProps {
  summary: string;
  title: string;
  onReset: () => void;
}

const SummaryResult: React.FC<SummaryResultProps> = ({ summary, title, onReset }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(summary).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <img 
            src="/assets/icon-16.svg" 
            alt="AI" 
            className="w-5 h-5 mr-2" 
          />
          <h3 className="text-lg font-semibold">Summary</h3>
        </div>
        <div className="space-x-2">
          <button
            onClick={handleCopy}
            className="py-1 px-3 bg-secondary hover:bg-secondary-dark text-white text-sm rounded transition-colors"
            title="Copy summary to clipboard"
          >
            {copied ? '✓ Copied!' : 'Copy'}
          </button>
          <button
            onClick={onReset}
            className="py-1 px-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-sm rounded transition-colors"
            title="Generate a new summary"
          >
            New Summary
          </button>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 overflow-y-auto max-h-80 border border-gray-200 dark:border-gray-700">
        <div className="prose dark:prose-invert">
          {summary.split('\n').map((paragraph, index) => (
            <p key={index} className="text-gray-800 dark:text-gray-200 mb-2">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
      
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        <button
          onClick={() => {
            const text = `${title}\n\n${summary}\n\nSummarized by AI Summarizer`;
            navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
          className="py-1 px-3 bg-primary-light hover:bg-primary text-white text-sm rounded transition-colors"
          title="Copy with title"
        >
          Copy with Title
        </button>
        
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`${summary.substring(0, 220)}... \n\nSummarized with AI Summarizer`)}`}
          target="_blank"
          rel="noreferrer"
          className="py-1 px-3 bg-blue-400 hover:bg-blue-500 text-white text-sm rounded transition-colors"
          title="Share on Twitter"
        >
          Share on Twitter
        </a>
        
        <button
          onClick={() => {
            const blob = new Blob([`${title}\n\n${summary}\n\nSummarized by AI Summarizer`], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${title.replace(/\s+/g, '-').toLowerCase()}-summary.txt`;
            a.click();
            URL.revokeObjectURL(url);
          }}
          className="py-1 px-3 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded transition-colors"
          title="Download as text file"
        >
          Download
        </button>
      </div>
    </div>
  );
};

export default SummaryResult;