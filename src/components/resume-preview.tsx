'use client';

import type { ResumeData } from '@/lib/types';
import { Separator } from '@/components/ui/separator';
import { Mail, Phone, Linkedin, Globe, MapPin } from 'lucide-react';

type ResumePreviewProps = {
  data: ResumeData | null;
  isMobilePreview?: boolean;
};

export function ResumePreview({ data, isMobilePreview = false }: ResumePreviewProps) {
  const previewClass = isMobilePreview 
    ? "w-full text-sm"
    : "sticky top-20 h-fit max-h-[calc(100vh-6rem)] w-full overflow-y-auto rounded-lg bg-card shadow-sm lg:block hidden text-sm";

  if (!data) {
    return (
      <aside className="sticky top-20 h-[calc(100vh-6rem)] w-full rounded-lg bg-card shadow-sm lg:block hidden p-8">
        <p className="text-center text-muted-foreground">
          Your resume will appear here as you fill out the form.
        </p>
      </aside>
    );
  }

  const { personalInfo, summary, experience, education, skills, projects, certifications } = data;

  return (
    <aside
      id="resume-preview-content"
      className={previewClass}
    >
      <div className="p-8 md:p-12">
        <header className="text-center mb-6">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary tracking-tight">
            {personalInfo.name || 'Your Name'}
          </h2>
          <div className="flex justify-center items-center flex-wrap gap-x-4 gap-y-1 text-muted-foreground mt-2 text-xs md:text-sm">
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
            <h3 className="font-headline text-lg font-semibold text-primary border-b-2 border-primary/20 pb-1 mb-2">
              Professional Summary
            </h3>
            <p className="text-foreground/80">{summary}</p>
          </section>
        )}

        {experience.length > 0 && (
          <section className="mb-6">
            <h3 className="font-headline text-lg font-semibold text-primary border-b-2 border-primary/20 pb-1 mb-2">
              Work Experience
            </h3>
            {experience.map((exp) => (
              <div key={exp.id} className="mb-4">
                <div className="flex justify-between items-baseline flex-wrap">
                  <h4 className="font-bold text-base">{exp.role || "Role"}</h4>
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

        {projects.length > 0 && (
          <section className="mb-6">
            <h3 className="font-headline text-lg font-semibold text-primary border-b-2 border-primary/20 pb-1 mb-2">
              Projects
            </h3>
            {projects.map((proj) => (
              <div key={proj.id} className="mb-4">
                <div className="flex justify-between items-baseline">
                  <h4 className="font-bold text-base">{proj.name || "Project Name"}</h4>
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

        {education.length > 0 && (
          <section className="mb-6">
            <h3 className="font-headline text-lg font-semibold text-primary border-b-2 border-primary/20 pb-1 mb-2">
              Education
            </h3>
            {education.map((edu) => (
              <div key={edu.id} className="mb-3">
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
        
        {certifications.length > 0 && (
          <section className="mb-6">
            <h3 className="font-headline text-lg font-semibold text-primary border-b-2 border-primary/20 pb-1 mb-2">
              Certifications
            </h3>
            {certifications.map((cert) => (
              <div key={cert.id} className="mb-3">
                <div className="flex justify-between items-baseline flex-wrap">
                  <h4 className="font-bold text-base">{cert.name || "Certification Name"}</h4>
                  <span className="text-muted-foreground text-xs shrink-0">{cert.date || 'Date'}</span>
                </div>
                <p className="text-muted-foreground">{cert.issuer || "Issuer"}</p>
              </div>
            ))}
          </section>
        )}

        {skills.length > 0 && (
          <section>
            <h3 className="font-headline text-lg font-semibold text-primary border-b-2 border-primary/20 pb-1 mb-2">
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
    </aside>
  );
}
