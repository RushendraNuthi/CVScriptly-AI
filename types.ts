export interface PersonalDetails {
  name: string;
  location: string;
  email: string;
  phone: string;
  website: string;
  linkedin: string;
  github: string;
}

export interface Education {
  id: string;
  university: string;
  degree: string;
  startDate: string;
  endDate: string;
  gpa: string;
  coursework: string[];
}

export interface Experience {
  id:string;
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  highlights: string[];
}

export interface Project {
  id: string;
  name: string;
  url: string;
  description: string;
  tools: string[];
}

export interface CustomSection {
  id: string;
  title: string;
  content: string[];
}

export interface Skill {
  id: string;
  category: string;
  skills: string[];
}

export interface FontStyle {
  family: string;
  size: number; // in points (pt)
  color: string; // hex code
  weight: 'normal' | 'bold';
}

export interface StylingOptions {
  font: FontStyle; // Default/Body
  heading: FontStyle; // Name
  subheading: FontStyle; // Role, University name
  sectionTitle: FontStyle; // "Experience", "Education"
  lineHeight: number; // e.g., 1.15 for 115%
}

export interface ResumeData {
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

export interface AIFeedback {
    score: number;
    suggestions: string[];
    summary: string;
}