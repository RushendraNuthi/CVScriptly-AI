import type { ResumeData, AIFeedback } from '../types';

const apiEndpoint = '/.netlify/functions/gemini-proxy';

export const generateSummary = async (resumeData: ResumeData): Promise<string> => {
    try {
        const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'generateSummary', resumeData })
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Request failed with status ${response.status}`);
        }
        const { summary } = await response.json();
        return summary;
    } catch (error) {
        console.error("Error generating summary:", error);
        return "Failed to generate summary. Please try again.";
    }
};

export const analyzeResumeForATS = async (resumeData: ResumeData, jobDescription?: string): Promise<AIFeedback> => {
    try {
        const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'analyzeResume', resumeData, jobDescription })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Request failed with status ${response.status}`);
        }

        const feedback: AIFeedback = await response.json();
        return feedback;

    } catch (error) {
        console.error("Error analyzing resume:", error);
        return {
            score: 0,
            suggestions: ["Failed to analyze resume due to a server-side error. Please check your connection and try again."],
            summary: "Analysis could not be completed."
        };
    }
};
