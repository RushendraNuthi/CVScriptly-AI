import type { ResumeData } from '../types';

declare global {
  interface Window {
    docx: any;
  }
}

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const loadDocxLibrary = async (retries = 3, delay = 100): Promise<void> => {
    for (let i = 0; i < retries; i++) {
        if (window.docx) {
            return;
        }
        await wait(delay * Math.pow(2, i)); // Exponential backoff
    }

    if (window.docx) {
        return;
    }

    return Promise.reject(new Error(
        'The required library for .docx generation failed to load. Please check your network connection and disable any ad-blockers that might be interfering.'
    ));
};

export const generateDocxBlob = async (data: ResumeData): Promise<Blob> => {
    await loadDocxLibrary();
    
    const {
        Document, Packer, Paragraph, TextRun, AlignmentType,
        convertInchesToTwip, BorderStyle, TabStopType, TabStopPosition,
        LevelFormat
    } = window.docx;

    const hexToRgb = (hex: string): string => hex.replace(/^#/, '');

    const doc = new Document({
        creator: "CVScriptly-AI",
        title: `${data.personalDetails.name}'s Resume`,
        styles: {
            paragraphStyles: [
                {
                    id: 'heading',
                    name: 'Heading',
                    basedOn: 'Normal',
                    next: 'Normal',
                    quickFormat: true,
                    run: {
                        font: data.styling.heading.family,
                        size: data.styling.heading.size * 2,
                        color: hexToRgb(data.styling.heading.color),
                        bold: data.styling.heading.weight === 'bold',
                    },
                    paragraph: {
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 240 },
                    },
                },
                {
                    id: 'sectionTitle',
                    name: 'Section Title',
                    basedOn: 'Normal',
                    next: 'Normal',
                    quickFormat: true,
                    run: {
                        font: data.styling.sectionTitle.family,
                        size: data.styling.sectionTitle.size * 2,
                        color: hexToRgb(data.styling.sectionTitle.color),
                        bold: data.styling.sectionTitle.weight === 'bold',
                    },
                    paragraph: {
                        spacing: { before: 320, after: 180 },
                        border: {
                            bottom: {
                                color: "auto",
                                space: 1,
                                style: BorderStyle.SINGLE,
                                size: 6,
                            },
                        },
                    },
                },
                {
                    id: 'subheading',
                    name: 'Sub-heading',
                    basedOn: 'Normal',
                    next: 'Normal',
                    quickFormat: true,
                    run: {
                        font: data.styling.subheading.family,
                        size: data.styling.subheading.size * 2,
                        color: hexToRgb(data.styling.subheading.color),
                        bold: data.styling.subheading.weight === 'bold',
                    },
                    paragraph: {
                        spacing: { after: 80 },
                    },
                },
                {
                    id: 'body',
                    name: 'Body',
                    basedOn: 'Normal',
                    next: 'Normal',
                    quickFormat: true,
                    run: {
                        font: data.styling.font.family,
                        size: data.styling.font.size * 2,
                        color: hexToRgb(data.styling.font.color),
                        bold: data.styling.font.weight === 'bold',
                    },
                    paragraph: {
                        spacing: {
                            line: Math.round(240 * data.styling.lineHeight),
                            lineRule: 'auto',
                        }
                    }
                },
            ],
        },
        numbering: {
            config: [
                {
                    reference: "bullet-points",
                    levels: [
                        {
                            level: 0,
                            format: LevelFormat.BULLET,
                            text: "•",
                            style: {
                                paragraph: {
                                    indent: { left: convertInchesToTwip(0.25), hanging: convertInchesToTwip(0.18) },
                                }
                            }
                        }
                    ]
                }
            ]
        }
    });

    const children: InstanceType<typeof Paragraph>[] = [];

    // Personal Details
    children.push(new Paragraph({
        text: data.personalDetails.name,
        style: 'heading'
    }));
    
    const contactParts = [
        data.personalDetails.location,
        data.personalDetails.email,
        data.personalDetails.phone,
        data.personalDetails.website,
        data.personalDetails.linkedin,
        data.personalDetails.github
    ].filter(Boolean);
    
    if (contactParts.length > 0) {
        children.push(new Paragraph({
            text: contactParts.join(' | '),
            alignment: AlignmentType.CENTER,
            style: 'body',
            paragraph: { spacing: { after: 320 } }
        }));
    }

    // Summary
    if(data.summary) {
        children.push(new Paragraph({ text: 'Summary', style: 'sectionTitle' }));
        children.push(new Paragraph({ text: data.summary, style: 'body', paragraph: { spacing: { after: 240 } } }));
    }

    const generateExperience = () => {
        const sectionChildren: InstanceType<typeof Paragraph>[] = [];
        if (data.experience.length > 0 && data.experience.some(e => e.role)) {
            sectionChildren.push(new Paragraph({ text: 'Experience', style: 'sectionTitle' }));
            data.experience.forEach(exp => {
                if (!exp.role) return;
                
                const dateText = `${exp.startDate}${exp.endDate ? ` - ${exp.endDate}` : ''}`;
                
                sectionChildren.push(new Paragraph({
                    children: [
                        new TextRun({ 
                            text: exp.role,
                            font: data.styling.subheading.family,
                            size: data.styling.subheading.size * 2,
                            color: hexToRgb(data.styling.subheading.color),
                            bold: data.styling.subheading.weight === 'bold',
                        }),
                        new TextRun({ 
                            text: exp.company ? `, ${exp.company}` : '',
                            font: data.styling.font.family,
                            size: data.styling.font.size * 2,
                            color: hexToRgb(data.styling.font.color),
                            bold: false,
                        }),
                        new TextRun({ 
                            text: exp.location ? ` -- ${exp.location}` : '',
                            font: data.styling.font.family,
                            size: data.styling.font.size * 2,
                            color: hexToRgb(data.styling.font.color),
                            bold: false,
                        }),
                        new TextRun({ 
                            text: `\t${dateText}`,
                        }),
                    ],
                    tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
                    paragraph: { spacing: { after: 80 } },
                }));
                
                if (exp.highlights && exp.highlights.filter(h => h).length > 0) {
                    exp.highlights.forEach(h => {
                        if (h) sectionChildren.push(new Paragraph({ 
                            text: h, 
                            numbering: { reference: 'bullet-points', level: 0 }, 
                            style: 'body',
                            paragraph: { spacing: { after: 80 } }
                        }));
                    });
                }
                sectionChildren.push(new Paragraph({ paragraph: { spacing: { after: 120 } } }));
            });
        }
        return sectionChildren;
    }
    
    const generateEducation = () => {
        const sectionChildren: InstanceType<typeof Paragraph>[] = [];
        if (data.education.length > 0 && data.education.some(e => e.university)) {
            sectionChildren.push(new Paragraph({ text: 'Education', style: 'sectionTitle' }));
            data.education.forEach(edu => {
                if (!edu.university) return;
                
                const dateText = `${edu.startDate}${edu.endDate ? ` - ${edu.endDate}` : ''}`;
                
                sectionChildren.push(new Paragraph({
                    children: [
                        new TextRun({ 
                            text: edu.university,
                            font: data.styling.subheading.family,
                            size: data.styling.subheading.size * 2,
                            color: hexToRgb(data.styling.subheading.color),
                            bold: data.styling.subheading.weight === 'bold',
                        }),
                        new TextRun({ 
                            text: edu.degree ? `, ${edu.degree}` : '',
                            font: data.styling.font.family,
                            size: data.styling.font.size * 2,
                            color: hexToRgb(data.styling.font.color),
                            bold: false,
                        }),
                        new TextRun({ 
                            text: `\t${dateText}`,
                        }),
                    ],
                    tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
                    paragraph: { spacing: { after: 80 } },
                }));
                
                if (edu.gpa) {
                    sectionChildren.push(new Paragraph({ 
                        text: `GPA: ${edu.gpa}`, 
                        numbering: { reference: 'bullet-points', level: 0 }, 
                        style: 'body',
                        paragraph: { spacing: { after: 80 } }
                    }));
                }
                
                if (edu.coursework && edu.coursework.length > 0 && edu.coursework.some(c=>c)) {
                    sectionChildren.push(new Paragraph({ 
                        text: `Coursework: ${edu.coursework.filter(c=>c).join(', ')}`, 
                        numbering: { reference: 'bullet-points', level: 0 }, 
                        style: 'body',
                        paragraph: { spacing: { after: 80 } }
                    }));
                }
                
                sectionChildren.push(new Paragraph({ paragraph: { spacing: { after: 120 } } }));
            });
        }
        return sectionChildren;
    }

    const generateProjects = () => {
        const sectionChildren: InstanceType<typeof Paragraph>[] = [];
        if (data.projects.length > 0 && data.projects.some(p => p.name)) {
            sectionChildren.push(new Paragraph({ text: 'Projects', style: 'sectionTitle' }));
            data.projects.forEach(proj => {
                if (!proj.name) return;
                
                const childrenArr: any[] = [new TextRun({ text: proj.name })];
                if (proj.url) {
                    childrenArr.push(new TextRun({ text: `\t${proj.url}` }));
                }
                
                sectionChildren.push(new Paragraph({
                    children: childrenArr,
                    style: 'subheading',
                    tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
                }));
                
                if(proj.description) {
                    sectionChildren.push(new Paragraph({ 
                        text: proj.description, 
                        numbering: { reference: 'bullet-points', level: 0 }, 
                        style: 'body',
                        paragraph: { spacing: { after: 80 } }
                    }));
                }
                
                if(proj.tools && proj.tools.length > 0 && proj.tools.some(t=>t)) {
                    sectionChildren.push(new Paragraph({ 
                        text: `Tools Used: ${proj.tools.filter(t=>t).join(', ')}`, 
                        numbering: { reference: 'bullet-points', level: 0 }, 
                        style: 'body',
                        paragraph: { spacing: { after: 80 } }
                    }));
                }
                
                sectionChildren.push(new Paragraph({ paragraph: { spacing: { after: 120 } } }));
            });
        }
        return sectionChildren;
    }

    const generateCustomSections = () => {
        const sectionChildren: InstanceType<typeof Paragraph>[] = [];
        data.customSections.forEach(section => {
            if (section.title) {
                sectionChildren.push(new Paragraph({ text: section.title, style: 'sectionTitle' }));
                section.content.forEach(item => {
                    if (item) sectionChildren.push(new Paragraph({ 
                        text: item, 
                        numbering: { reference: 'bullet-points', level: 0 }, 
                        style: 'body',
                        paragraph: { spacing: { after: 80 } }
                    }));
                });
                sectionChildren.push(new Paragraph({ paragraph: { spacing: { after: 120 } } }));
            }
        });
        return sectionChildren;
    }
    
    const generateSkills = () => {
        const sectionChildren: InstanceType<typeof Paragraph>[] = [];
        if (data.skills.length > 0 && data.skills.some(s => s.skills.some(skill => skill))) {
            sectionChildren.push(new Paragraph({ text: 'Skills', style: 'sectionTitle' }));
            data.skills.forEach(skillGroup => {
                if (skillGroup.skills.some(s => s)) {
                    sectionChildren.push(new Paragraph({
                        children: [
                            new TextRun({ text: skillGroup.category ? `${skillGroup.category}: ` : '', bold: true }),
                            new TextRun(skillGroup.skills.filter(s=>s).join(', ')),
                        ],
                        style: 'body',
                        paragraph: { spacing: { after: 120 } }
                    }));
                }
            });
        }
        return sectionChildren;
    }

    const sectionGenerators: { [key: string]: () => InstanceType<typeof Paragraph>[] } = {
        experience: generateExperience,
        education: generateEducation,
        projects: generateProjects,
        customSections: generateCustomSections,
        skills: generateSkills,
    };
    
    data.sectionOrder.forEach(key => {
        if (sectionGenerators[key]) {
            children.push(...sectionGenerators[key]());
        }
    });

    doc.addSection({
        properties: {
            page: {
                margin: {
                    top: convertInchesToTwip(0.75),
                    right: convertInchesToTwip(0.75),
                    bottom: convertInchesToTwip(0.75),
                    left: convertInchesToTwip(0.75),
                },
            },
        },
        children
    });

    return Packer.toBlob(doc);
};
