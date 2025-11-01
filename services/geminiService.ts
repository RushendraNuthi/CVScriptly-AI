import { GoogleGenAI, Type } from "@google/genai";
import type { ResumeData, AIFeedback } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const generateSummary = async (resumeData: ResumeData): Promise<string> => {
    const prompt = `Based on the following resume data, write a compelling and professional summary of 2-3 sentences for the resume header. Highlight key skills and experiences.
    
    Experience: ${resumeData.experience.map(e => `${e.role} at ${e.company}: ${e.highlights.join(', ')}`).join('; ')}
    Projects: ${resumeData.projects.map(p => `${p.name}: ${p.description}`).join('; ')}
    Skills: ${resumeData.skills.map(s => `${s.category ? s.category + ': ' : ''}${s.skills.join(', ')}`).join('; ')}
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error generating summary:", error);
        return "Failed to generate summary. Please try again.";
    }
};

export const analyzeResumeForATS = async (resumeData: ResumeData, jobDescription?: string): Promise<AIFeedback> => {
    const prompt = `Analyze the following resume data for ATS compatibility and overall effectiveness. If a job description is provided, tailor the analysis for that specific role.
    
    Resume Data:
    ${JSON.stringify(resumeData, null, 2)}

    Job Description (optional):
    ${jobDescription || 'N/A'}

    Provide the following in your response:
    1.  An "ATS Optimization Score" out of 100.
    2.  A list of "Suggestions" for improvement (e.g., action verbs, keywords, formatting).
    3.  A "Summary" of the analysis.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        score: { type: Type.NUMBER, description: 'ATS optimization score from 0 to 100.' },
                        suggestions: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                            description: 'A list of specific suggestions for improvement.'
                        },
                        summary: { type: Type.STRING, description: 'A brief summary of the resume\'s strengths and weaknesses.' }
                    },
                    required: ['score', 'suggestions', 'summary']
                }
            }
        });
        
        const jsonText = response.text.trim();
        const parsedResponse = JSON.parse(jsonText);
        return parsedResponse as AIFeedback;
    } catch (error) {
        console.error("Error analyzing resume:", error);
        return {
            score: 0,
            suggestions: ["Failed to analyze resume due to an API error. Please check your connection and try again."],
            summary: "Analysis could not be completed."
        };
    }
};