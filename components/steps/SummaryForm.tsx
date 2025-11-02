import React, { useState } from 'react';
import type { ResumeData } from '../../types';
import Textarea from '../ui/Textarea';
import { generateSummary } from '../../services/geminiService';

interface Props {
  data: ResumeData;
  updateData: (summary: string) => void;
}

const SummaryForm: React.FC<Props> = ({ data, updateData }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateSummary = async () => {
    setIsLoading(true);
    const summary = await generateSummary(data);
    updateData(summary);
    setIsLoading(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-bold text-neutral-900">Professional Summary</h2>
           <p className="text-sm text-neutral-600">Write a short, compelling summary of your career.</p>
        </div>
        <button
          onClick={handleGenerateSummary}
          disabled={isLoading}
          className="flex items-center px-4 py-2 text-sm font-semibold text-white bg-primary-500 rounded-md hover:bg-primary-600 disabled:opacity-50 disabled:cursor-wait transition-opacity"
        >
          {isLoading ? (
            <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
            </>
          ) : (
            <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Generate with AI
            </>
          )}
        </button>
      </div>
      <Textarea
        label="Summary"
        id="summary"
        value={data.summary}
        onChange={(e) => updateData(e.target.value)}
        rows={6}
        placeholder="e.g., Results-driven Software Engineer with 5+ years of experience..."
      />
    </div>
  );
};

export default SummaryForm;