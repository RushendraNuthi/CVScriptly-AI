import { GoogleGenAI, Type } from "@google/genai";
import type { Handler } from "@netlify/functions";

// --- START of copied types from ../../types.ts ---
interface PersonalDetails {
  name: string;
  location: string;
  email: string;
  phone: string;
  website: string;
  linkedin: string;
  github: string;
}

interface Education {
  id: string;
  university: string;
  degree: string;
  startDate: string;
  endDate: string;
  gpa: string;
  coursework: string[];
}

interface Experience {
  id:string;
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  highlights: string[];
}

interface Project {
  id: string;
  name: string;
  url: string;
  description: string;
  tools: string[];
}

interface CustomSection {
  id: string;
  title: string;
  content: string[];
}

interface Skill {
  id: string;
  category: string;
  skills: string[];
}

interface FontStyle {
  family: string;
  size: number; // in points (pt)
  color: string; // hex code
  weight: 'normal' | 'bold';
}

interface StylingOptions {
  font: FontStyle; // Default/Body
  heading: FontStyle; // Name
  subheading: FontStyle; // Role, University name
  sectionTitle: FontStyle; // "Experience", "Education"
  lineHeight: number; // e.g., 1.15 for 115%
}

interface ResumeData {
  personalDetails: PersonalDetails;
  summary: string;
  education: Education[];
  experience: Experience[];
  projects: Project[];
  customSections: CustomSection[];
  skills: Skill[];
  sectionOrder: string[];
  styling: StylingOptions;
}

interface AIFeedback {
    score: number;
    suggestions: string[];
    summary: string;
}
// --- END of copied types ---

const handler: Handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const { GEMINI_API_KEY } = process.env;
    if (!GEMINI_API_KEY) {
        return { statusCode: 500, body: JSON.stringify({ error: 'Gemini API key is not configured on the server.' }) };
    }
    
    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

    try {
        const { action, resumeData, jobDescription } = JSON.parse(event.body || '{}');

        if (!action || !resumeData) {
            return { statusCode: 400, body: JSON.stringify({ error: 'Missing action or resumeData in request body.' }) };
        }

        switch (action) {
            case 'generateSummary': {
                const prompt = `Based on the following resume data, write a compelling and professional summary of 2-3 sentences for the resume header. Highlight key skills and experiences.
    
                Experience: ${resumeData.experience.map((e: Experience) => `${e.role} at ${e.company}: ${e.highlights.join(', ')}`).join('; ')}
                Projects: ${resumeData.projects.map((p: Project) => `${p.name}: ${p.description}`).join('; ')}
                Skills: ${resumeData.skills.map((s: Skill) => `${s.category ? s.category + ': ' : ''}${s.skills.join(', ')}`).join('; ')}
                `;

                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                });
                return {
                    statusCode: 200,
                    body: JSON.stringify({ summary: response.text.trim() }),
                    headers: { 'Content-Type': 'application/json' }
                };
            }

            case 'analyzeResume': {
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
                return {
                    statusCode: 200,
                    body: jsonText,
                    headers: { 'Content-Type': 'application/json' }
                };
            }

            default:
                return { statusCode: 400, body: JSON.stringify({ error: 'Invalid action specified.' }) };
        }

    } catch (error: any) {
        console.error("Error in Netlify function:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message || 'An internal server error occurred.' })
        };
    }
};

export { handler };