import type { ResumeData, CustomSection, Skill, StylingOptions } from '../types';

const escapeLatex = (str: string): string => {
  if (!str) return '';
  return str
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/&/g, '\\&')
    .replace(/%/g, '\\%')
    .replace(/\$/g, '\\$')
    .replace(/#/g, '\\#')
    .replace(/_/g, '\\_')
    .replace(/{/g, '\\{')
    .replace(/}/g, '\\}')
    .replace(/~/g, '\\textasciitilde{}')
    .replace(/\^/g, '\\textasciicircum{}');
};

const hexToRgb = (hex: string): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
      : '0, 0, 0';
};

const generatePreamble = (styling: StylingOptions): string => {
    const { font, heading, subheading, sectionTitle } = styling;
    
    const fontPackages: { [key: string]: string } = {
        'Charter': '\\usepackage{charter}',
        'Lato': '\\usepackage[default]{lato}',
        'Roboto': '\\usepackage{roboto}',
        'Helvetica': '\\usepackage{helvet}',
        'Arial': '\\usepackage{helvet}',
        'Calibri': '\\usepackage{calibri}',
        'Times New Roman': '\\usepackage{times}',
        'Georgia': '\\usepackage{georgia}',
        'Garamond': '\\usepackage{ebgaramond}',
    };

    const sansSerifSwitchFonts = ['Helvetica', 'Arial', 'Roboto', 'Calibri'];

    const fontPackage = fontPackages[font.family] || fontPackages['Helvetica'];
    const fontFamilyCommand = sansSerifSwitchFonts.includes(font.family) ? '\\renewcommand{\\familydefault}{\\sfdefault}' : '';

    return `
\\documentclass[${font.size}pt, letterpaper]{article}

% Packages:
\\usepackage[
    ignoreheadfoot,
    top=2 cm,
    bottom=2 cm,
    left=2 cm,
    right=2 cm,
    footskip=1.0 cm,
]{geometry}
\\usepackage{titlesec}
\\usepackage{tabularx}
\\usepackage{array}
\\usepackage[dvipsnames]{xcolor}

% Color Definitions
\\definecolor{bodyColor}{RGB}{${hexToRgb(font.color)}}
\\definecolor{headingColor}{RGB}{${hexToRgb(heading.color)}}
\\definecolor{subheadingColor}{RGB}{${hexToRgb(subheading.color)}}
\\definecolor{sectionTitleColor}{RGB}{${hexToRgb(sectionTitle.color)}}
\\definecolor{primaryColor}{RGB}{51, 51, 51}

\\usepackage{enumitem}
\\usepackage{fontawesome5}
\\usepackage{amsmath}
\\usepackage[
    pdftitle={CV},
    pdfauthor={},
    colorlinks=true,
    urlcolor=primaryColor
]{hyperref}
\\usepackage[pscoord]{eso-pic}
\\usepackage{calc}
\\usepackage{bookmark}
\\usepackage{lastpage}
\\usepackage{changepage}
\\usepackage{paracol}
\\usepackage{ifthen}
\\usepackage{needspace}
\\usepackage{iftex}
\\usepackage{setspace}

% ATS parsable settings:
\\ifPDFTeX
    \\input{glyphtounicode}
    \\pdfgentounicode=1
    \\usepackage[T1]{fontenc}
    \\usepackage[utf8]{inputenc}
    \\usepackage{lmodern}
\\fi

${fontPackage}
${fontFamilyCommand}

% General settings:
\\raggedright
\\pagestyle{empty}
\\setcounter{secnumdepth}{0}
\\setlength{\\parindent}{0pt}
\\setlength{\\topskip}{0pt}
\\setlength{\\columnsep}{0.15cm}
\\pagenumbering{gobble}
\\color{bodyColor}
\\setstretch{${styling.lineHeight}}

\\titleformat{\\section}{\\needspace{4\\baselineskip}${styling.sectionTitle.weight === 'bold' ? `\\bfseries` : ''}\\fontsize{${sectionTitle.size}pt}{${sectionTitle.size}pt}\\selectfont\\color{sectionTitleColor}}{}{0pt}{}[\\vspace{1pt}\\titlerule]
\\titlespacing{\\section}{-1pt}{0.3 cm}{0.2 cm}
`;
};


const generateHeader = (details: ResumeData['personalDetails'], styling: StylingOptions): string => {
  const links = [
    details.location,
    `\\hrefWithoutArrow{mailto:${details.email}}{${escapeLatex(details.email)}}`,
    `\\hrefWithoutArrow{tel:${details.phone.replace(/\s+/g, '')}}{${escapeLatex(details.phone)}}`,
    details.website ? `\\hrefWithoutArrow{https://${details.website}}{${escapeLatex(details.website)}}` : '',
    details.linkedin ? `\\hrefWithoutArrow{https://${details.linkedin}}{${escapeLatex(details.linkedin)}}` : '',
    details.github ? `\\hrefWithoutArrow{https://${details.github}}{${escapeLatex(details.github)}}` : '',
  ].filter(Boolean).join('%\\kern 5.0 pt%\\AND%\\kern 5.0 pt%');

  return `
    \\begin{header}
        {\\fontsize{${styling.heading.size}pt}{${styling.heading.size}pt}\\selectfont\\color{headingColor} ${styling.heading.weight === 'bold' ? `\\bfseries` : ''} ${escapeLatex(details.name)}}

        \\vspace{5 pt}

        \\normalsize
        \\mbox{${links}}
    \\end{header}
  `;
};

const generateSummary = (summary: string): string => `
    \\section{Summary}
    \\begin{onecolentry}
        ${escapeLatex(summary)}
    \\end{onecolentry}
`;

const generateExperience = (experience: ResumeData['experience'], styling: StylingOptions): string => {
  if (experience.length === 0 || !experience.some(e => e.role)) return '';
  const entries = experience.map(exp => {
    const roleText = escapeLatex(exp.role);
    const styledRole = styling.subheading.weight === 'bold' ? `\\textbf{${roleText}}` : roleText;
    
    return `
        \\begin{twocolentry}{
            ${escapeLatex(exp.startDate)} -- ${escapeLatex(exp.endDate)}
        }
            {\\fontsize{${styling.subheading.size}pt}{${styling.subheading.size}pt}\\selectfont\\color{subheadingColor}${styledRole}}{, ${escapeLatex(exp.company)}} -- ${escapeLatex(exp.location)}\\end{twocolentry}

        \\vspace{0.10 cm}
        \\begin{onecolentry}
            \\begin{highlights}
                ${exp.highlights.map(h => `\\item ${escapeLatex(h)}`).join('\n                ')}
            \\end{highlights}
        \\end{onecolentry}
  `}).join('\n\n        \\vspace{0.2 cm}\n');

  return `
    \\section{Experience}
    ${entries}
  `;
};

const generateEducation = (education: ResumeData['education'], styling: StylingOptions): string => {
  if (education.length === 0 || !education.some(e => e.university)) return '';
  const entries = education.map(edu => {
    const uniText = escapeLatex(edu.university);
    const styledUni = styling.subheading.weight === 'bold' ? `\\textbf{${uniText}}` : uniText;
    const dateText = `${escapeLatex(edu.startDate)} -- ${escapeLatex(edu.endDate || 'Present')}`;
    
    const highlights = [];
    if (edu.gpa) highlights.push(`\\item GPA: ${escapeLatex(edu.gpa)}`);
    if (edu.coursework && edu.coursework.length > 0 && edu.coursework.some(c => c)) {
      highlights.push(`\\item \\textbf{Coursework:} ${escapeLatex(edu.coursework.filter(c => c).join(', '))}`);
    }
    
    const highlightsContent = highlights.length > 0 
      ? `\\begin{onecolentry}\\begin{highlights}\n${highlights.join('\n')}\n\\end{highlights}\\end{onecolentry}` 
      : '';
    
      return `
        \\begin{twocolentry}{
            ${dateText}
        }
           {\\fontsize{${styling.subheading.size}pt}{${styling.subheading.size}pt}\\selectfont\\color{subheadingColor} ${styledUni}}{, ${escapeLatex(edu.degree)}}\\end{twocolentry}

        ${highlightsContent ? '\\vspace{0.10 cm}\n' : ''}${highlightsContent}
  `}).join('\n\n        \\vspace{0.2 cm}\n');

  return `
    \\section{Education}
    ${entries}
  `;
};

const generateProjects = (projects: ResumeData['projects'], styling: StylingOptions): string => {
  if (projects.length === 0 || !projects.some(p => p.name)) return '';
  const entries = projects.map(proj => {
    const nameText = escapeLatex(proj.name);
    const styledName = styling.subheading.weight === 'bold' ? `\\textbf{${nameText}}` : nameText;
    
    const urlText = proj.url ? `\\href{https://${proj.url.replace(/^https?:\/\//, '')}}{${escapeLatex(proj.url)}}` : '';
    
    const highlights = [];
    if (proj.description) highlights.push(`\\item ${escapeLatex(proj.description)}`);
    if (proj.tools && proj.tools.length > 0 && proj.tools.some(t => t)) {
      highlights.push(`\\item Tools Used: ${escapeLatex(proj.tools.filter(t => t).join(', '))}`);
    }
    
    const highlightsContent = highlights.length > 0 
      ? `\\begin{onecolentry}\\begin{highlights}\n${highlights.join('\n')}\n\\end{highlights}\\end{onecolentry}` 
      : '';
    
    return `
        \\begin{twocolentry}{
            ${urlText}
        }
            {\\fontsize{${styling.subheading.size}pt}{${styling.subheading.size}pt}\\selectfont\\color{subheadingColor}${styledName}}\\end{twocolentry}

        ${highlightsContent ? '\\vspace{0.10 cm}\n' : ''}${highlightsContent}
  `}).join('\n\n        \\vspace{0.2 cm}\n');

  return `
    \\section{Projects}
    ${entries}
  `;
};

const generateCustomSections = (sections: CustomSection[]): string => {
  if (sections.length === 0) return '';
  return sections
    .filter(sec => sec.title && sec.content.some(c => c))
    .map(section => `
    \\section{${escapeLatex(section.title)}}
    \\begin{onecolentry}
        \\begin{highlights}
            ${section.content.map(item => `\\item ${escapeLatex(item)}`).join('\n                ')}
        \\end{highlights}
    \\end{onecolentry}
  `).join('\n');
};

const generateSkills = (skills: Skill[]): string => {
  if (!skills || skills.length === 0) return '';
  const entries = skills
    .filter(s => s.skills.some(skill => skill))
    .map(skillGroup => {
        const skillsList = escapeLatex(skillGroup.skills.filter(s => s).join(', '));
        const categoryTitle = skillGroup.category ? `\\textbf{${escapeLatex(skillGroup.category)}:} ` : '';
        return `\\begin{onecolentry}
        ${categoryTitle}${skillsList}
    \\end{onecolentry}`;
    })
    .join('\n\n        \\vspace{0.2 cm}\n');

  if (!entries) return '';

  return `
    \\section{Skills}
    ${entries}
  `;
};

export const generateLatexString = (data: ResumeData): string => {
    const preamble = generatePreamble(data.styling);

    const sectionGenerators: { [key: string]: () => string } = {
        experience: () => generateExperience(data.experience, data.styling),
        education: () => generateEducation(data.education, data.styling),
        projects: () => generateProjects(data.projects, data.styling),
        customSections: () => generateCustomSections(data.customSections),
        skills: () => generateSkills(data.skills),
    };

    const orderedSections = data.sectionOrder
        .map(key => sectionGenerators[key] ? sectionGenerators[key]() : '')
        .join('\n');

    return `
${preamble}

\\renewcommand\\labelitemi{$\\vcenter{\\hbox{\\small$\\bullet$}}$}
\\newenvironment{highlights}{
    \\begin{itemize}[
        topsep=0.10 cm,
        parsep=0.10 cm,
        partopsep=0pt,
        itemsep=0pt,
        leftmargin=0 cm + 10pt
    ]
}{
    \\end{itemize}
}

\\newenvironment{onecolentry}{
    \\begin{adjustwidth}{0 cm + 0.00001 cm}{0 cm + 0.00001 cm}
}{
    \\end{adjustwidth}
}

\\newenvironment{twocolentry}[2][]{
    \\onecolentry
    \\def\\secondColumn{#2}
    \\setcolumnwidth{\\fill, 4.5 cm}
    \\begin{paracol}{2}
}{
    \\switchcolumn \\raggedleft \\secondColumn
    \\end{paracol}
    \\endonecolentry
}

\\newenvironment{header}{
    \\setlength{\\topsep}{0pt}\\par\\kern\\topsep\\centering\\linespread{1.5}
}{
    \\par\\kern\\topsep
}

\\let\\hrefWithoutArrow\\href

\\begin{document}
    \\newcommand{\\AND}{\\unskip
        \\cleaders\\copy\\ANDbox\\hskip\\wd\\ANDbox
        \\ignorespaces
    }
    \\newsavebox\\ANDbox
    \\sbox\\ANDbox{$|$}

    ${generateHeader(data.personalDetails, data.styling)}
    \\vspace{5 pt - 0.3 cm}
    ${data.summary ? generateSummary(data.summary) : ''}
    ${orderedSections}

\\end{document}
`;
};