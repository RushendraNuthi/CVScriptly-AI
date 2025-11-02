import React from 'react';
import type { ResumeData } from '../types';

interface LiveResumePreviewProps {
    resumeData: ResumeData;
}

const LiveResumePreview: React.FC<LiveResumePreviewProps> = ({ resumeData }) => {
    const { personalDetails, summary, education, experience, projects, customSections, skills, styling, sectionOrder } = resumeData;
    const bodyStyle: React.CSSProperties = { 
        fontFamily: styling.font.family, 
        fontSize: `${styling.font.size}pt`, 
        color: styling.font.color,
        fontWeight: styling.font.weight,
        lineHeight: styling.lineHeight,
    };

    const sections: { [key: string]: React.ReactNode } = {
        experience: experience.length > 0 && experience.some(e => e.role) && (
            <section key="experience">
                <h2 className="border-b-2 pb-1 mb-2" style={{ fontFamily: styling.sectionTitle.family, fontSize: `${styling.sectionTitle.size}pt`, color: styling.sectionTitle.color, borderColor: styling.sectionTitle.color, fontWeight: styling.sectionTitle.weight }}>Experience</h2>
                {experience.map(exp => exp.role && (
                    <div key={exp.id} className="mb-4 last:mb-0">
                        <div className="flex justify-between items-baseline flex-wrap">
                            <h3 className="flex-grow pr-2" style={{ fontFamily: styling.subheading.family, fontSize: `${styling.subheading.size}pt`, color: styling.subheading.color, fontWeight: styling.subheading.weight }}>
                                {exp.role}
                                <span className="font-normal" style={{color: styling.font.color, fontWeight: 'normal'}}>{exp.company && `, ${exp.company}`}{exp.location && ` -- ${exp.location}`}</span>
                            </h3>
                            <p className="text-[10px] sm:text-xs text-neutral-600 whitespace-nowrap">{exp.startDate}{exp.endDate && ` - ${exp.endDate}`}</p>
                        </div>
                        {exp.highlights.some(h => h) && (
                        <ul className="list-disc list-inside mt-1 ml-4 space-y-1">
                            {exp.highlights.filter(h => h).map((h, i) => <li key={i}>{h}</li>)}
                        </ul>
                        )}
                    </div>
                ))}
            </section>
        ),
        education: education.length > 0 && education.some(e=>e.university) && (
            <section key="education">
                <h2 className="border-b-2 pb-1 mb-2" style={{ fontFamily: styling.sectionTitle.family, fontSize: `${styling.sectionTitle.size}pt`, color: styling.sectionTitle.color, borderColor: styling.sectionTitle.color, fontWeight: styling.sectionTitle.weight }}>Education</h2>
                {education.map(edu => edu.university && (
                    <div key={edu.id} className="mb-2 last:mb-0">
                        <div className="flex justify-between items-baseline flex-wrap">
                            <h3 className="flex-grow pr-2" style={{ fontFamily: styling.subheading.family, fontSize: `${styling.subheading.size}pt`, color: styling.subheading.color, fontWeight: styling.subheading.weight }}>
                              {edu.university}
                              <span className="font-normal" style={{color: styling.font.color, fontWeight: 'normal'}}>{edu.degree && `, ${edu.degree}`}</span>
                            </h3>
                            <p className="text-[10px] sm:text-xs text-neutral-600 whitespace-nowrap">{edu.startDate}{edu.endDate && ` - ${edu.endDate}`}</p>
                        </div>
                        {(edu.gpa || (edu.coursework && edu.coursework.some(c=>c))) && (
                        <ul className="list-disc list-inside mt-1 ml-4">
                            {edu.gpa && <li>GPA: {edu.gpa}</li>}
                            {edu.coursework && edu.coursework.some(c=>c) && <li>Coursework: {edu.coursework.filter(c=>c).join(', ')}</li>}
                        </ul>)}
                    </div>
                ))}
            </section>
        ),
        projects: projects.length > 0 && projects.some(p=>p.name) && (
            <section key="projects">
                <h2 className="border-b-2 pb-1 mb-2" style={{ fontFamily: styling.sectionTitle.family, fontSize: `${styling.sectionTitle.size}pt`, color: styling.sectionTitle.color, borderColor: styling.sectionTitle.color, fontWeight: styling.sectionTitle.weight }}>Projects</h2>
                {projects.map(proj => proj.name && (
                    <div key={proj.id} className="mb-4 last:mb-0">
                        <div className="flex justify-between items-baseline flex-wrap">
                            <h3 className="flex-grow pr-2" style={{ fontFamily: styling.subheading.family, fontSize: `${styling.subheading.size}pt`, color: styling.subheading.color, fontWeight: styling.subheading.weight }}>{proj.name}</h3>
                            {proj.url && <a href={`https://${proj.url.replace(/^https?:\/\//, '')}`} target="_blank" rel="noopener noreferrer" className="text-[10px] sm:text-xs text-primary-500 hover:underline whitespace-nowrap">{proj.url}</a>}
                        </div>
                        <ul className="list-disc list-inside mt-1 ml-4 space-y-1">
                            {proj.description && <li>{proj.description}</li>}
                            {proj.tools && proj.tools.some(t=>t) && <li>Tools Used: {proj.tools.filter(t=>t).join(', ')}</li>}
                        </ul>
                    </div>
                ))}
            </section>
        ),
        customSections: customSections.length > 0 && customSections.some(s => s.title) && (
            <React.Fragment key="customSections">
              {customSections.map(section => section.title && (
                <section key={section.id}>
                  <h2 className="border-b-2 pb-1 mb-2" style={{ fontFamily: styling.sectionTitle.family, fontSize: `${styling.sectionTitle.size}pt`, color: styling.sectionTitle.color, borderColor: styling.sectionTitle.color, fontWeight: styling.sectionTitle.weight }}>{section.title}</h2>
                  {section.content.some(c => c) && (
                    <ul className="list-disc list-inside mt-1 ml-4 space-y-1">
                        {section.content.filter(c => c).map((c, i) => <li key={i}>{c}</li>)}
                    </ul>
                  )}
                </section>
              ))}
            </React.Fragment>
        ),
        skills: skills.length > 0 && skills.some(s => s.skills.some(skill => skill)) && (
            <section key="skills">
                <h2 className="border-b-2 pb-1 mb-2" style={{ fontFamily: styling.sectionTitle.family, fontSize: `${styling.sectionTitle.size}pt`, color: styling.sectionTitle.color, borderColor: styling.sectionTitle.color, fontWeight: styling.sectionTitle.weight }}>Skills</h2>
                <div className="space-y-1">
                  {skills.map(skillGroup => skillGroup.skills.some(s => s) && (
                      <p key={skillGroup.id}>
                          {skillGroup.category && <span style={{ fontWeight: 'bold' }}>{skillGroup.category}: </span>}
                          {skillGroup.skills.filter(s => s).join(', ')}
                      </p>
                  ))}
                </div>
            </section>
        )
    };

    return (
        <div className="bg-white shadow-2xl rounded-lg p-4 sm:p-6 md:p-8 lg:aspect-[210/297] w-full overflow-y-auto" style={bodyStyle}>
            <div className="text-center border-b pb-4 mb-4 border-neutral-300">
                <h1 
                    className="text-neutral-900 break-words"
                    style={{
                        fontFamily: styling.heading.family,
                        fontSize: `${styling.heading.size}pt`,
                        color: styling.heading.color,
                        fontWeight: styling.heading.weight,
                    }}
                >
                    {personalDetails.name}
                </h1>
                <div className="text-xs sm:text-sm mt-2 break-words flex flex-wrap justify-center items-center gap-x-2 gap-y-1">
                    {personalDetails.location && <span>{personalDetails.location}</span>}
                    {personalDetails.email && <span className="hidden sm:inline">|</span>}
                    {personalDetails.email && <span>{personalDetails.email}</span>}
                    {personalDetails.phone && <span className="hidden sm:inline">|</span>}
                    {personalDetails.phone && <span>{personalDetails.phone}</span>}
                    {personalDetails.website && <span className="hidden sm:inline">|</span>}
                    {personalDetails.website && <span>{personalDetails.website}</span>}
                    {personalDetails.linkedin && <span className="hidden sm:inline">|</span>}
                    {personalDetails.linkedin && <span>{personalDetails.linkedin}</span>}
                    {personalDetails.github && <span className="hidden sm:inline">|</span>}
                    {personalDetails.github && <span>{personalDetails.github}</span>}
                </div>
            </div>

            <div className="space-y-6">
                {summary && (
                    <section>
                        <h2 className="border-b-2 pb-1 mb-2" style={{ fontFamily: styling.sectionTitle.family, fontSize: `${styling.sectionTitle.size}pt`, color: styling.sectionTitle.color, borderColor: styling.sectionTitle.color, fontWeight: styling.sectionTitle.weight }}>Summary</h2>
                        <p className="whitespace-pre-wrap">{summary}</p>
                    </section>
                )}
                {sectionOrder.map(key => sections[key] || null)}
            </div>
        </div>
    );
};

export default LiveResumePreview;