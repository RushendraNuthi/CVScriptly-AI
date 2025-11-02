import React, { useState, useEffect, useCallback } from 'react';
import type { ResumeData, AIFeedback } from '../types';
import { analyzeResumeForATS } from '../services/geminiService';
import { generateLatexString } from '../utils/latexGenerator';
import { generateDocxBlob } from '../utils/docxGenerator';
import { generatePdfBlob } from '../utils/pdfGenerator';
import LiveResumePreview from './LiveResumePreview';

interface PreviewProps {
  resumeData: ResumeData;
  onEdit: () => void;
  onStartOver: () => void;
}

const AIFeedbackDisplay: React.FC<{ feedback: AIFeedback | null, isLoading: boolean }> = ({ feedback, isLoading }) => {
    if (isLoading) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-md border border-neutral-200 animate-pulse">
                <div className="h-7 bg-neutral-200 rounded w-3/4 mb-4"></div>
                <div className="text-center mb-6">
                    <div className="h-5 bg-neutral-200 rounded w-1/2 mx-auto mb-2"></div>
                    <div className="h-20 bg-neutral-200 rounded w-28 mx-auto"></div>
                </div>
                <div className="space-y-4">
                    <div>
                        <div className="h-6 bg-neutral-200 rounded w-1/4 mb-2"></div>
                        <div className="space-y-2">
                            <div className="h-4 bg-neutral-200 rounded"></div>
                            <div className="h-4 bg-neutral-200 rounded w-5/6"></div>
                        </div>
                    </div>
                    <div>
                        <div className="h-6 bg-neutral-200 rounded w-1/3 mb-2"></div>
                        <div className="space-y-2">
                            <div className="h-4 bg-neutral-200 rounded"></div>
                            <div className="h-4 bg-neutral-200 rounded"></div>
                            <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!feedback) return null;

    const scoreColor = feedback.score >= 85 ? 'text-success-500' : feedback.score >= 60 ? 'text-yellow-500' : 'text-danger-500';

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-neutral-200">
            <h3 className="text-2xl font-bold text-neutral-900 mb-4">AI Resume Analysis</h3>
            <div className="text-center mb-6">
                <p className="text-lg text-neutral-700">ATS Optimization Score</p>
                <p className={`text-7xl font-extrabold ${scoreColor}`}>{feedback.score}<span className="text-3xl">%</span></p>
            </div>
            <div className="space-y-4">
                <div>
                    <h4 className="font-semibold text-lg mb-2 text-neutral-900">Summary</h4>
                    <p className="text-neutral-700">{feedback.summary}</p>
                </div>
                 <div>
                    <h4 className="font-semibold text-lg mb-2 text-neutral-900">Suggestions</h4>
                    <ul className="list-disc list-inside space-y-2 text-neutral-700">
                        {feedback.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                </div>
            </div>
        </div>
    );
};

const Preview: React.FC<PreviewProps> = ({ resumeData, onEdit, onStartOver }) => {
  const [aiFeedback, setAIFeedback] = useState<AIFeedback | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCompiling, setIsCompiling] = useState(false);
  const [isGeneratingDocx, setIsGeneratingDocx] = useState(false);
  const [compilationError, setCompilationError] = useState<string | null>(null);

  const runAnalysis = useCallback(async () => {
    setIsLoading(true);
    const feedback = await analyzeResumeForATS(resumeData);
    setAIFeedback(feedback);
    setIsLoading(false);
  }, [resumeData]);

  useEffect(() => {
    runAnalysis();
  }, [runAnalysis]);
  
  const handleDownloadLatex = () => {
    const latexCode = generateLatexString(resumeData);
    const blob = new Blob([latexCode], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${resumeData.personalDetails.name.replace(/\s/g, '_')}_Resume.tex`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadPDF = async () => {
    setIsCompiling(true);
    setCompilationError(null);
    try {
        const pdfBlob = generatePdfBlob(resumeData);
        const link = document.createElement('a');
        link.href = URL.createObjectURL(pdfBlob);
        link.download = `${resumeData.personalDetails.name.replace(/\s/g, '_')}_Resume.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    } catch (error) {
        console.error('Error generating PDF:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        setCompilationError(`Failed to generate the PDF file. ${errorMessage}`);
    } finally {
        setIsCompiling(false);
    }
  };

  const handleDownloadDocx = async () => {
    setIsGeneratingDocx(true);
    setCompilationError(null);
    try {
        const blob = await generateDocxBlob(resumeData);
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${resumeData.personalDetails.name.replace(/\s/g, '_')}_Resume.docx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    } catch (error) {
        console.error("Error generating .docx file:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        setCompilationError(`Failed to generate the .docx file. ${errorMessage}`);
    } finally {
        setIsGeneratingDocx(false);
    }
  };


  return (
    <div className="bg-neutral-50 min-h-screen p-4 sm:p-8">
        <div className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm shadow-md z-10">
            <div className="container mx-auto p-4">
                 <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <h2 className="text-2xl font-bold text-neutral-900 text-center sm:text-left">Preview & Download</h2>
                    <div className="flex flex-wrap justify-center sm:justify-end items-center gap-2">
                        <button onClick={onEdit} className="px-4 py-2 text-sm font-semibold text-primary-500 bg-neutral-200 rounded-md hover:bg-neutral-300 transition-colors">
                            Edit
                        </button>
                        <button
                            onClick={handleDownloadPDF}
                            disabled={isCompiling}
                            className="px-4 py-2 text-sm font-semibold text-white bg-primary-500 rounded-md hover:bg-primary-600 transition-colors disabled:bg-primary-300 disabled:cursor-not-allowed flex items-center"
                        >
                            {isCompiling && (
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            )}
                            {isCompiling ? 'Generating...' : 'Download PDF'}
                        </button>
                        <button
                            onClick={handleDownloadDocx}
                            disabled={isGeneratingDocx}
                            className="px-4 py-2 text-sm font-semibold text-white bg-primary-500 rounded-md hover:bg-primary-600 transition-colors disabled:bg-primary-300 disabled:cursor-not-allowed flex items-center"
                        >
                            {isGeneratingDocx && (
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            )}
                            {isGeneratingDocx ? 'Generating...' : 'Download .docx'}
                        </button>
                        <button onClick={handleDownloadLatex} title="Download LaTeX source" className="px-3 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-200 rounded-md transition-colors">
                            .tex
                        </button>
                        <button onClick={onStartOver} className="px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-200 rounded-md transition-colors">
                            Start Over
                        </button>
                    </div>
                </div>
                 <p className="text-center text-xs text-neutral-600 pt-2">
                     Your resume files are generated directly in your browser for privacy and speed. You can also download the
                     <code className="mx-1 px-1 rounded bg-neutral-200 text-neutral-900 font-mono text-[10px]">.tex</code> 
                     source file to compile manually with a LaTeX distribution.
                 </p>
            </div>
        </div>

      <div className="container mx-auto pt-40 sm:pt-28">
         {compilationError && (
            <div className="bg-danger-100 border-l-4 border-danger-500 text-danger-700 p-4 rounded-md mb-6 relative" role="alert">
                <div className="flex">
                    <div>
                        <p className="font-bold">File Generation Error</p>
                        <p className="mt-2 text-sm whitespace-pre-wrap">{compilationError}</p>
                    </div>
                </div>
                <button onClick={() => setCompilationError(null)} className="absolute top-0 bottom-0 right-0 px-4 py-3" aria-label="Dismiss">
                    <svg className="fill-current h-6 w-6 text-danger-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
                </button>
            </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <LiveResumePreview resumeData={resumeData} />
            </div>
            <div className="lg:col-span-1">
                <AIFeedbackDisplay feedback={aiFeedback} isLoading={isLoading} />
            </div>
        </div>
      </div>
    </div>
  );
};

export default Preview;