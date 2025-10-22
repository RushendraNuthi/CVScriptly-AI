export interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  gpa: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
  bulletPoints: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  url: string;
  bulletPoints: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

export type Design = {
  fontFamily: string;
  fontSize: string;
  primaryColor: string;
};

export interface ResumeData {
  personalInfo: PersonalInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  projects: Project[];
  certifications: Certification[];
  design: Design;
}
