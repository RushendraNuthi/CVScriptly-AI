'use client';

import type { ResumeData } from '@/lib/types';
import { Mail, Phone, Linkedin, Globe, MapPin } from 'lucide-react';
import { CSSProperties } from 'react';
import { cn } from '@/lib/utils';

type ResumePreviewProps = {
  data: ResumeData | null;
  isMobilePreview?: boolean;
};

export function ResumePreview({ data, isMobilePreview = false }: ResumePreviewProps) {
  const asideClass = isMobilePreview 
    ? "w-full bg-muted/30 p-4"
    : "sticky top-20 h-fit max-h-[calc(100vh-6rem)] w-full overflow-y-auto lg:block hidden bg-muted/30 p-8";

  const previewClass = "w-[210mm] min-h-[297mm] bg-card shadow-lg origin-top-left lg:origin-top";

  if (!data) {
    return (
      <aside className={asideClass}>
        <div className="w-full aspect-[210/297] bg-card shadow-lg p-8 flex items-center justify-center">
            <p className="text-center text-muted-foreground">
              Your resume will appear here as you fill out the form.
            </p>
        </div>
      </aside>
    );
  }

  const { personalInfo, summary, experience, education, skills, projects, certifications, design } = data;

  const dynamicStyles = {
    '--preview-font-family': design.fontFamily,
    '--preview-font-size': design.fontSize,
    '--preview-primary-color': design.primaryColor,
  } as CSSProperties;
  
  const textClass = `text-[var(--preview-font-size)]`;

  const templateClasses = {
    classic: {
      header: 'text-center mb-6',
      name: 'font-headline text-3xl md:text-4xl font-bold text-primary tracking-tight',
      sectionTitle: 'font-headline text-lg font-semibold text-primary border-b-2 border-primary/20 pb-1 mb-2',
      jobTitle: 'font-bold text-base',
    },
    modern: {
      header: 'text-left mb-8 pb-4 border-b-2 border-primary',
      name: 'font-headline text-4xl md:text-5xl font-bold text-primary tracking-tighter',
      sectionTitle: 'font-headline text-base font-bold text-primary tracking-widest uppercase mb-3',
      jobTitle: 'font-semibold text-base text-primary',
    },
    creative: {
      header: 'text-center mb-8 relative',
      name: 'font-headline text-3xl md:text-4xl font-bold text-primary tracking-wide',
      sectionTitle: 'font-headline text-lg font-bold text-primary pb-1 mb-3',
      jobTitle: 'font-bold text-base',
    },
  };

  const currentTemplate = templateClasses[data.design.template as keyof typeof templateClasses] || templateClasses.classic;

  return (
    <aside className={asideClass}>
      <div className="w-full aspect-[210/297] relative">
        <div
          id="resume-preview-content"
          className={cn(previewClass, "absolute w-[210mm] h-[297mm] transform scale-[var(--scale-factor)]")}
          style={{
            ...dynamicStyles,
            '--scale-factor': isMobilePreview ? '0.35' : '0.55',
           } as any}
        >
          <div className={`p-[20mm] font-[var(--preview-font-family)] ${textClass}`}>
            <style>
              {`
                #resume-preview-content .text-primary { color: hsl(var(--preview-primary-color)); }
                #resume-preview-content .border-primary { border-color: hsl(var(--preview-primary-color)); }
                #resume-preview-content .border-primary\\/20 { border-color: hsl(var(--preview-primary-color) / 0.2); }
                #resume-preview-content .hover\\:text-primary:hover { color: hsl(var(--preview-primary-color)); }
                ${design.template === 'creative' ? `
                  #resume-preview-content .creative-section-title::after { 
                    content: ''; 
                    display: block; 
                    width: 40px; 
                    height: 2px; 
                    background-color: hsl(var(--preview-primary-color)); 
                    margin-top: 4px;
                  }` : ''}
                
                @media (min-width: 375px) { #resume-preview-content { --scale-factor: ${isMobilePreview ? 0.45 : 0.65}; } }
                @media (min-width: 425px) { #resume-preview-content { --scale-factor: ${isMobilePreview ? 0.52 : 0.75}; } }
                @media (min-width: 768px) { #resume-preview-content { --scale-factor: ${isMobilePreview ? 0.9 : 0.8}; } }
                @media (min-width: 1024px) { #resume-preview-content { --scale-factor: 0.55; } }
                @media (min-width: 1280px) { #resume-preview-content { --scale-factor: 0.65; } }
                @media (min-width: 1440px) { #resume-preview-content { --scale-factor: 0.75; } }
                @media (min-width: 1536px) { #resume-preview-content { --scale-factor: 0.8; } }
              `}
            </style>
            <header className={currentTemplate.header}>
              <h2 className={currentTemplate.name}>
                {personalInfo.name || 'Your Name'}
              </h2>
              <div className={cn("flex justify-center items-center flex-wrap gap-x-4 gap-y-1 text-muted-foreground mt-2 text-xs md:text-sm", { 'justify-start': design.template === 'modern'})}>
                {personalInfo.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin size={12} /> {personalInfo.location}
                  </span>
                )}
                {personalInfo.email && (
                  <a href={`mailto:${personalInfo.email}`} className="flex items-center gap-1.5 hover:text-primary">
                    <Mail size={12} /> {personalInfo.email}
                  </a>
                )}
                {personalInfo.phone && (
                  <span className="flex items-center gap-1.5">
                    <Phone size={12} /> {personalInfo.phone}
                  </span>
                )}
                {personalInfo.linkedin && (
                  <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-primary">
                    <Linkedin size={12} /> LinkedIn
                  </a>
                )}
                {personalInfo.website && (
                  <a href={personalInfo.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-primary">
                    <Globe size={12} /> Website
                  </a>
                )}
              </div>
            </header>

            {summary && (
              <section className="mb-6">
                <h3 className={cn(currentTemplate.sectionTitle, {'creative-section-title': design.template === 'creative'})}>
                  Professional Summary
                </h3>
                <p className="text-foreground/80">{summary}</p>
              </section>
            )}

            {experience?.length > 0 && (
              <section className="mb-6">
                <h3 className={cn(currentTemplate.sectionTitle, {'creative-section-title': design.template === 'creative'})}>
                  Work Experience
                </h3>
                {experience.map((exp) => (
                  <div key={exp.id} className="mb-4 break-inside-avoid">
                    <div className="flex justify-between items-baseline flex-wrap">
                      <h4 className={currentTemplate.jobTitle}>{exp.role || "Role"}</h4>
                      <span className="text-muted-foreground text-xs shrink-0">
                        {exp.startDate || 'Start Date'} - {exp.endDate || 'End Date'}
                      </span>
                    </div>
                    <p className="text-muted-foreground italic">{exp.company || 'Company'}</p>
                    <ul className="mt-1 list-disc list-inside text-foreground/80 space-y-1">
                      {exp.bulletPoints.map((point, index) => (
                        <li key={index}>{point}</li>
                      ))}
                      {exp.description && exp.bulletPoints.length === 0 && <li>{exp.description}</li>}
                    </ul>
                  </div>
                ))}
              </section>
            )}

            {projects?.length > 0 && (
              <section className="mb-6">
                <h3 className={cn(currentTemplate.sectionTitle, {'creative-section-title': design.template === 'creative'})}>
                  Projects
                </h3>
                {projects.map((proj) => (
                  <div key={proj.id} className="mb-4 break-inside-avoid">
                    <div className="flex justify-between items-baseline">
                      <h4 className={currentTemplate.jobTitle}>{proj.name || "Project Name"}</h4>
                      {proj.url && <a href={proj.url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground text-xs hover:text-primary">View Project</a>}
                    </div>
                    <ul className="mt-1 list-disc list-inside text-foreground/80 space-y-1">
                      {proj.bulletPoints.map((point, index) => (
                        <li key={index}>{point}</li>
                      ))}
                      {proj.description && proj.bulletPoints.length === 0 && <li>{proj.description}</li>}
                    </ul>
                  </div>
                ))}
              </section>
            )}

            {education?.length > 0 && (
              <section className="mb-6">
                <h3 className={cn(currentTemplate.sectionTitle, {'creative-section-title': design.template === 'creative'})}>
                  Education
                </h3>
                {education.map((edu) => (
                  <div key={edu.id} className="mb-3 break-inside-avoid">
                    <div className="flex justify-between items-baseline flex-wrap">
                      <h4 className="font-bold text-base">{edu.institution || "Institution"}</h4>
                      <span className="text-muted-foreground text-xs shrink-0">
                        {edu.startDate || 'Start'} - {edu.endDate || 'End'}
                      </span>
                    </div>
                    <p className="text-muted-foreground">{edu.degree || "Degree"} in {edu.fieldOfStudy || "Field of Study"}</p>
                    {edu.gpa && <p className="text-muted-foreground text-xs">GPA: {edu.gpa}</p>}
                  </div>
                ))}
              </section>
            )}
            
            {certifications?.length > 0 && (
              <section className="mb-6">
                <h3 className={cn(currentTemplate.sectionTitle, {'creative-section-title': design.template === 'creative'})}>
                  Certifications
                </h3>
                {certifications.map((cert) => (
                  <div key={cert.id} className="mb-3 break-inside-avoid">
                    <div className="flex justify-between items-baseline flex-wrap">
                      <h4 className="font-bold text-base">{cert.name || "Certification Name"}</h4>
                      <span className="text-muted-foreground text-xs shrink-0">{cert.date || 'Date'}</span>
                    </div>
                    <p className="text-muted-foreground">{cert.issuer || "Issuer"}</p>
                  </div>
                ))}
              </section>
            )}

            {skills?.length > 0 && (
              <section>
                <h3 className={cn(currentTemplate.sectionTitle, {'creative-section-title': design.template === 'creative'})}>
                  Skills
                </h3>
                <div className="flex flex-wrap gap-x-2 gap-y-1">
                  {skills.map((skill, index) => (
                    <span key={index} className="text-foreground/80">
                      {skill}{index < skills.length - 1 && ' |'}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
