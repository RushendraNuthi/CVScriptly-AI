import type { ResumeData } from '../types';

// Import docx library - try dynamic import with fallback
let docxModule: any = null;
let docxPromise: Promise<any> | null = null;

const loadDocxLibrary = async (): Promise<any> => {
    // If already loaded, return it
    if (docxModule) {
        return docxModule;
    }

    // If already loading, return the promise
    if (docxPromise) {
        return docxPromise;
    }

    // Try to import from npm package
    docxPromise = (async () => {
        try {
            // Try ES module import
            const docx = await import('docx');
            docxModule = docx;
            return docx;
        } catch (importError) {
            console.warn('Failed to import docx from npm package, trying CDN fallback...', importError);
            
            // Fallback to CDN loading using UMD build
            return new Promise((resolve, reject) => {
                // Check if already loaded via CDN
                if ((window as any).docx) {
                    docxModule = (window as any).docx;
                    resolve((window as any).docx);
                    return;
                }

                // Check if script already exists
                const existingScript = document.querySelector('script[data-docx-library]') as HTMLScriptElement;
                if (existingScript) {
                    const checkLoaded = setInterval(() => {
                        if ((window as any).docx) {
                            clearInterval(checkLoaded);
                            docxModule = (window as any).docx;
                            resolve((window as any).docx);
                        }
                    }, 50);
                    
                    setTimeout(() => {
                        clearInterval(checkLoaded);
                        if (!docxModule) {
                            reject(new Error("Timeout waiting for docx library to load from existing script."));
                        }
                    }, 10000);
                    return;
                }

                // Try jsDelivr CDN first (better for ES modules)
                const script = document.createElement('script');
                script.setAttribute('data-docx-library', 'true');
                script.src = 'https://cdn.jsdelivr.net/npm/docx@8.5.0/dist/index.umd.js';
                script.async = true;
                script.crossOrigin = 'anonymous';

                const timeout = setTimeout(() => {
                    script.remove();
                    // Try alternative CDN
                    loadFromAlternativeCDN(resolve, reject);
                }, 5000);

                script.onload = () => {
                    clearTimeout(timeout);
                    // Wait for the library to be available
                    setTimeout(() => {
                        const docxLib = (window as any).docx || 
                                       (window as any).docxjs || 
                                       (window as any).DOCX ||
                                       (window as any).default;
                        
                        if (docxLib) {
                            docxModule = docxLib;
                            resolve(docxLib);
                        } else {
                            // Try alternative CDN
                            script.remove();
                            loadFromAlternativeCDN(resolve, reject);
                        }
                    }, 200);
                };

                script.onerror = () => {
                    clearTimeout(timeout);
                    script.remove();
                    // Try alternative CDN
                    loadFromAlternativeCDN(resolve, reject);
                };

                document.head.appendChild(script);
            });
        }
    })();

    return docxPromise;
};

const loadFromAlternativeCDN = (resolve: (value: any) => void, reject: (error: Error) => void) => {
    // Try unpkg.com as alternative
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/docx@8.5.0/dist/index.umd.js';
    script.async = true;
    script.crossOrigin = 'anonymous';

    const timeout = setTimeout(() => {
        script.remove();
        reject(new Error('Failed to load docx library from CDN. Please ensure you have an internet connection. Alternatively, install the package: npm install docx'));
    }, 10000);

    script.onload = () => {
        clearTimeout(timeout);
        setTimeout(() => {
            const docxLib = (window as any).docx || 
                           (window as any).docxjs || 
                           (window as any).DOCX ||
                           (window as any).default;
            
            if (docxLib) {
                docxModule = docxLib;
                resolve(docxLib);
            } else {
                script.remove();
                reject(new Error('DOCX library loaded but exports not found. Please install the package: npm install docx'));
            }
        }, 200);
    };

    script.onerror = () => {
        clearTimeout(timeout);
        script.remove();
        reject(new Error('Failed to load the required library for .docx generation. Please check your network connection. Install the package for offline use: npm install docx'));
    };

    document.head.appendChild(script);
};

export const generateDocxBlob = async (data: ResumeData): Promise<Blob> => {
    const docx = await loadDocxLibrary();
    
    // Extract the classes - handle both ES module and UMD formats
    let Document: any, Packer: any, Paragraph: any, TextRun: any;
    let AlignmentType: any, convertInchesToTwip: any, BorderStyle: any;
    let TabStopType: any, TabStopPosition: any, LevelFormat: any;

    // Try different export formats
    if (docx.Document) {
        // ES module format
        Document = docx.Document;
        Packer = docx.Packer;
        Paragraph = docx.Paragraph;
        TextRun = docx.TextRun;
        AlignmentType = docx.AlignmentType;
        convertInchesToTwip = docx.convertInchesToTwip;
        BorderStyle = docx.BorderStyle;
        TabStopType = docx.TabStopType;
        TabStopPosition = docx.TabStopPosition;
        LevelFormat = docx.LevelFormat;
    } else if (docx.default) {
        // Default export format
        Document = docx.default.Document;
        Packer = docx.default.Packer;
        Paragraph = docx.default.Paragraph;
        TextRun = docx.default.TextRun;
        AlignmentType = docx.default.AlignmentType;
        convertInchesToTwip = docx.default.convertInchesToTwip;
        BorderStyle = docx.default.BorderStyle;
        TabStopType = docx.default.TabStopType;
        TabStopPosition = docx.default.TabStopPosition;
        LevelFormat = docx.default.LevelFormat;
    } else if ((window as any).docx) {
        // Global window format
        const winDocx = (window as any).docx;
        Document = winDocx.Document;
        Packer = winDocx.Packer;
        Paragraph = winDocx.Paragraph;
        TextRun = winDocx.TextRun;
        AlignmentType = winDocx.AlignmentType;
        convertInchesToTwip = winDocx.convertInchesToTwip;
        BorderStyle = winDocx.BorderStyle;
        TabStopType = winDocx.TabStopType;
        TabStopPosition = winDocx.TabStopPosition;
        LevelFormat = winDocx.LevelFormat;
    }

    if (!Document || !Packer || !Paragraph || !TextRun) {
        throw new Error('Required docx classes not found. Please ensure the docx library is properly installed: npm install docx');
    }

    const hexToRgb = (hex: string): string => {
        // Remove # if present
        let cleanHex = hex.replace(/^#/, '');
        // Handle 3-digit hex codes
        if (cleanHex.length === 3) {
            cleanHex = cleanHex.split('').map(char => char + char).join('');
        }
        // Return 6-digit hex (without #) for docx
        return cleanHex.length === 6 ? cleanHex : '000000';
    };

    // Define section generator functions first (must be defined before use)
    const generateExperience = () => {
        const sectionChildren: InstanceType<typeof Paragraph>[] = [];
        const items = (data.experience || []).filter(e => e?.role && e.role.trim());
        if (items.length === 0) return sectionChildren;
        
        sectionChildren.push(new Paragraph({ text: 'Experience', style: 'sectionTitle' }));
        items.forEach(exp => {
            const role = (exp.role || '').trim();
            const company = exp.company ? `, ${exp.company.trim()}` : '';
            const date = `${exp.startDate || ''}${exp.endDate ? ` - ${exp.endDate}` : ''}`.trim();
            
            sectionChildren.push(new Paragraph({
                children: [
                    new TextRun({ text: role, bold: true }),
                    new TextRun(company),
                    new TextRun({
                        text: date ? `\t${date}` : '',
                    }),
                ],
                style: 'subheading',
                tabStops: date ? [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }] : [],
            }));
            
            if (exp.location && exp.location.trim()) {
                sectionChildren.push(new Paragraph({
                    text: exp.location.trim(),
                    style: 'body',
                    paragraph: {
                        spacing: { after: 60 }
                    }
                }));
            } else {
                sectionChildren.push(new Paragraph({
                    text: '',
                    paragraph: {
                        spacing: { after: 60 }
                    }
                }));
            }
            
            (exp.highlights || []).filter(h => h && h.trim()).forEach(h => {
                sectionChildren.push(new Paragraph({ 
                    text: h.trim(), 
                    numbering: { reference: 'bullet-points', level: 0 }, 
                    style: 'body' 
                }));
            });
            sectionChildren.push(new Paragraph({ paragraph: { spacing: { after: 120 } } })); // Spacer
        });
        return sectionChildren;
    };
    
    const generateEducation = () => {
        const sectionChildren: InstanceType<typeof Paragraph>[] = [];
        const items = (data.education || []).filter(e => e?.university && e.university.trim());
        if (items.length === 0) return sectionChildren;
        
        sectionChildren.push(new Paragraph({ text: 'Education', style: 'sectionTitle' }));
        items.forEach(edu => {
            const university = (edu.university || '').trim();
            const degree = edu.degree ? `, ${edu.degree.trim()}` : '';
            const date = `${edu.startDate || ''}${edu.endDate ? ` - ${edu.endDate}` : ''}`.trim();
            
            sectionChildren.push(new Paragraph({
                children: [
                    new TextRun({ text: university, bold: true }),
                    new TextRun(degree),
                    new TextRun({
                        text: date ? `\t${date}` : '',
                    }),
                ],
                style: 'subheading',
                tabStops: date ? [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }] : [],
            }));
            
            if (edu.gpa && edu.gpa.trim()) {
                sectionChildren.push(new Paragraph({ 
                    text: `GPA: ${edu.gpa.trim()}`, 
                    numbering: { reference: 'bullet-points', level: 0 }, 
                    style: 'body' 
                }));
            }
            const courseworkItems = (edu.coursework || []).filter(c => c && c.trim());
            if (courseworkItems.length > 0) {
                sectionChildren.push(new Paragraph({ 
                    text: `Coursework: ${courseworkItems.join(', ')}`, 
                    numbering: { reference: 'bullet-points', level: 0 }, 
                    style: 'body' 
                }));
            }
            sectionChildren.push(new Paragraph({ paragraph: { spacing: { after: 120 } } })); // Spacer
        });
        return sectionChildren;
    };

    const generateProjects = () => {
        const sectionChildren: InstanceType<typeof Paragraph>[] = [];
        const items = (data.projects || []).filter(p => p?.name && p.name.trim());
        if (items.length === 0) return sectionChildren;
        
        sectionChildren.push(new Paragraph({ text: 'Projects', style: 'sectionTitle' }));
        items.forEach(proj => {
            const name = (proj.name || '').trim();
            const url = (proj.url || '').trim();
            
            if (url) {
                sectionChildren.push(new Paragraph({
                    children: [
                        new TextRun({ text: name, bold: true }),
                        new TextRun({ text: `\t${url}`, style: 'Hyperlink' }),
                    ],
                    style: 'subheading',
                    tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
                }));
            } else {
                sectionChildren.push(new Paragraph({
                    children: [
                        new TextRun({ text: name, bold: true }),
                    ],
                    style: 'subheading',
                }));
            }
            
            if (proj.description && proj.description.trim()) {
                sectionChildren.push(new Paragraph({ 
                    text: proj.description.trim(), 
                    numbering: { reference: 'bullet-points', level: 0 }, 
                    style: 'body' 
                }));
            }
            const toolsItems = (proj.tools || []).filter(t => t && t.trim());
            if (toolsItems.length > 0) {
                sectionChildren.push(new Paragraph({ 
                    text: `Tools Used: ${toolsItems.join(', ')}`, 
                    numbering: { reference: 'bullet-points', level: 0 }, 
                    style: 'body' 
                }));
            }
            sectionChildren.push(new Paragraph({ paragraph: { spacing: { after: 120 } } })); // Spacer
        });
        return sectionChildren;
    };

    const generateCustomSections = () => {
        const sectionChildren: InstanceType<typeof Paragraph>[] = [];
        const items = (data.customSections || []).filter(s => s?.title && s.title.trim());
        if (items.length === 0) return sectionChildren;
        
        items.forEach(section => {
            sectionChildren.push(new Paragraph({ 
                text: section.title.trim(), 
                style: 'sectionTitle' 
            }));
            
            const contentItems = (section.content || []).filter(item => item && item.trim());
            contentItems.forEach(item => {
                sectionChildren.push(new Paragraph({ 
                    text: item.trim(), 
                    numbering: { reference: 'bullet-points', level: 0 }, 
                    style: 'body' 
                }));
            });
            sectionChildren.push(new Paragraph({ paragraph: { spacing: { after: 120 } } })); // Spacer
        });
        return sectionChildren;
    };
    
    const generateSkills = () => {
        const sectionChildren: InstanceType<typeof Paragraph>[] = [];
        const items = (data.skills || []).filter(s => s?.skills && s.skills.some(skill => skill && skill.trim()));
        if (items.length === 0) return sectionChildren;
        
        sectionChildren.push(new Paragraph({ text: 'Skills', style: 'sectionTitle' }));
        items.forEach(skillGroup => {
            const skillsList = (skillGroup.skills || []).filter(s => s && s.trim());
            if (skillsList.length === 0) return;
            
            const categoryText = skillGroup.category && skillGroup.category.trim() 
                ? `${skillGroup.category.trim()}: ` 
                : '';
            
            sectionChildren.push(new Paragraph({
                children: [
                    new TextRun({ text: categoryText, bold: true }),
                    new TextRun(skillsList.join(', ')),
                ],
                style: 'body',
                paragraph: {
                    spacing: { after: 60 }
                }
            }));
        });
        return sectionChildren;
    };

    // Build all content
    const children: InstanceType<typeof Paragraph>[] = [];

    // Personal Details
    if (data.personalDetails?.name && data.personalDetails.name.trim()) {
        children.push(new Paragraph({
            text: data.personalDetails.name.trim(),
            style: 'heading'
        }));
    }
    const contactInfo = [
        data.personalDetails?.location,
        data.personalDetails?.email,
        data.personalDetails?.phone,
        data.personalDetails?.website,
        data.personalDetails?.linkedin,
        data.personalDetails?.github
    ].filter(Boolean).join(' | ');
    if (contactInfo) {
        children.push(new Paragraph({
            text: contactInfo,
            alignment: AlignmentType.CENTER,
            style: 'body'
        }));
    }

    // Summary
    if(data.summary && data.summary.trim()) {
        children.push(new Paragraph({ text: 'Summary', style: 'sectionTitle' }));
        children.push(new Paragraph({ text: data.summary.trim(), style: 'body' }));
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

    // Create Document with sections in constructor (required for docx.js 8.x)
    const doc = new Document({
        creator: "CVScriptly AI",
        title: `${data.personalDetails?.name || 'Resume'}'s Resume`,
        sections: [
            {
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
                children: children
            }
        ],
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
                        size: data.styling.heading.size * 2, // docx uses half-points
                        color: hexToRgb(data.styling.heading.color),
                        bold: true,
                    },
                    paragraph: {
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 120 },
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
                        bold: true,
                    },
                    paragraph: {
                        spacing: { before: 240, after: 120 },
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
                        bold: true,
                    },
                    paragraph: {
                        spacing: { after: 60 },
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
                    },
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

    return Packer.toBlob(doc);
};