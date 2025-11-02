import type { ResumeData, StylingOptions } from './types';

export const themePresets: { name: string; styling: StylingOptions }[] = [
    {
        name: 'Default',
        styling: {
            font: { family: 'Helvetica', size: 10, color: '#333333', weight: 'normal' },
            heading: { family: 'Helvetica', size: 25, color: '#333333', weight: 'bold' },
            subheading: { family: 'Helvetica', size: 11, color: '#333333', weight: 'bold' },
            sectionTitle: { family: 'Helvetica', size: 12, color: '#000000', weight: 'bold' },
            lineHeight: 1.15,
        }
    },
    {
        name: 'Modern Sans',
        styling: {
            font: { family: 'Roboto', size: 10, color: '#404040', weight: 'normal' },
            heading: { family: 'Roboto', size: 22, color: '#171717', weight: 'bold' },
            subheading: { family: 'Roboto', size: 11, color: '#171717', weight: 'bold' },
            sectionTitle: { family: 'Roboto', size: 11, color: '#007BFF', weight: 'bold' },
            lineHeight: 1.4,
        }
    },
    {
        name: 'Classic Serif',
        styling: {
            font: { family: 'Times New Roman', size: 11, color: '#000000', weight: 'normal' },
            heading: { family: 'Times New Roman', size: 28, color: '#000000', weight: 'normal' },
            subheading: { family: 'Times New Roman', size: 12, color: '#000000', weight: 'bold' },
            sectionTitle: { family: 'Times New Roman', size: 13, color: '#000000', weight: 'bold' },
            lineHeight: 1.2,
        }
    }
];

export const initialResumeData: ResumeData = {
  personalDetails: {
    name: 'John Doe',
    location: 'Your Location',
    email: 'youremail@yourdomain.com',
    phone: '0541 999 99 99',
    website: 'yourwebsite.com',
    linkedin: 'linkedin.com/in/yourusername',
    github: 'github.com/yourusername',
  },
  summary: 'RenderCV is a LaTeX-based CV/resume version-control and maintenance app. It allows you to create a high-quality CV or resume as a PDF file from a YAML file, with Markdown syntax support and complete control over the LaTeX code.',
  education: [
    {
      id: 'edu1',
      university: 'University of Pennsylvania',
      degree: 'BS in Computer Science',
      startDate: 'Sept 2000',
      endDate: 'May 2005',
      gpa: '3.9/4.0',
      coursework: ['Computer Architecture', 'Comparison of Learning Algorithms', 'Computational Theory'],
    },
  ],
  experience: [
    {
      id: 'exp1',
      role: 'Software Engineer',
      company: 'Apple',
      location: 'Cupertino, CA',
      startDate: 'June 2005',
      endDate: 'Aug 2007',
      highlights: [
        'Reduced time to render user buddy lists by 75% by implementing a prediction algorithm',
        'Integrated iChat with Spotlight Search by creating a tool to extract metadata from saved chat transcripts',
        'Redesigned chat file format and implemented backward compatibility for search',
      ],
    },
    {
      id: 'exp2',
      role: 'Software Engineer Intern',
      company: 'Microsoft',
      location: 'Redmond, WA',
      startDate: 'June 2003',
      endDate: 'Aug 2003',
      highlights: [
        'Designed a UI for the VS open file switcher (Ctrl-Tab) and extended it to tool windows',
        'Created a service to provide gradient across VS and VS add-ins, optimizing its performance via caching',
      ],
    },
  ],
  projects: [
    {
      id: 'proj1',
      name: 'Multi-User Drawing Tool',
      url: 'github.com/name/repo',
      description: 'Developed an electronic classroom where multiple users can simultaneously view and draw on a "chalkboard" with each person\'s edits synchronized',
      tools: ['C++', 'MFC'],
    },
    {
      id: 'proj2',
      name: 'Synchronized Desktop Calendar',
      url: 'github.com/name/repo',
      description: 'Developed a desktop calendar with globally shared and synchronized calendars, allowing users to schedule meetings with other users',
      tools: ['C#', '.NET', 'SQL', 'XML'],
    },
  ],
  customSections: [],
  skills: [
    {
      id: 'skills1',
      category: 'Programming Languages',
      skills: ['C++', 'C', 'Java', 'Objective-C', 'C#', 'SQL', 'JavaScript'],
    },
    {
      id: 'skills2',
      category: 'Technologies',
      skills: ['.NET', 'Microsoft SQL Server', 'XCode', 'Interface Builder'],
    },
  ],
  sectionOrder: ['experience', 'education', 'projects', 'skills', 'customSections'],
  styling: themePresets[0].styling,
};