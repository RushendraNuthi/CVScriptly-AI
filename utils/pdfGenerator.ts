import type { ResumeData, FontStyle } from '../types';

declare global {
  interface Window {
    jsPDF: any;
  }
}

// Spacing constants for a polished layout
const PAGE_MARGIN = 72; // 1 inch (72 points)
const SECTION_SPACING = 18;
const ITEM_SPACING = 12;
const HEADING_SPACING = 6;
const LIST_INDENT = 20;

const getPdfFontFamily = (family: string): string => {
  const serifFonts = ['Charter', 'Georgia', 'Times New Roman', 'Garamond'];
  return serifFonts.includes(family) ? 'times' : 'helvetica';
};

const applyFontStyle = (doc: any, style: FontStyle) => {
  const family = getPdfFontFamily(style.family);
  const fontStyle = style.weight === 'bold' ? 'bold' : 'normal';
  doc.setFont(family, fontStyle);
  doc.setFontSize(style.size);
  doc.setTextColor(style.color);
};

export const generatePdfBlob = (data: ResumeData): Blob => {
  const { jsPDF } = window;
  if (!jsPDF) {
    throw new Error('jsPDF library is not loaded. Please check your internet connection.');
  }
  
  const doc = new jsPDF({
    orientation: 'p',
    unit: 'pt',
    format: 'letter'
  });

  const { personalDetails, summary, styling, sectionOrder, ...sectionsData } = data;
  const PAGE_WIDTH = doc.internal.pageSize.getWidth();
  const PAGE_HEIGHT = doc.internal.pageSize.getHeight();
  const CONTENT_WIDTH = PAGE_WIDTH - 2 * PAGE_MARGIN;
  let y = PAGE_MARGIN;

  const checkPageBreak = (spaceNeeded: number) => {
    if (y + spaceNeeded > PAGE_HEIGHT - PAGE_MARGIN) {
      doc.addPage();
      y = PAGE_MARGIN;
    }
  };

  const addWrappedText = (text: string, x: number, maxWidth: number, options: { isListItem?: boolean; indent?: number; align?: 'left' | 'center' | 'right' } = {}) => {
    const { isListItem = false, indent = 0, align = 'left' } = options;
    const textX = x + indent;
    const textMaxWidth = maxWidth - indent;

    const textOptions = align === 'left' ? {} : { align };

    if (isListItem) {
        const bullet = '•  ';
        const bulletWidth = doc.getTextWidth(bullet);
        const itemMaxWidth = textMaxWidth - bulletWidth;
        const lines = doc.splitTextToSize(text, itemMaxWidth);

        lines.forEach((line: string, index: number) => {
            checkPageBreak(doc.getLineHeight() * styling.lineHeight);
            if (index === 0) {
                doc.text(bullet + line, textX, y);
            } else {
                doc.text(line, textX + bulletWidth, y);
            }
            y += doc.getLineHeight() * styling.lineHeight;
        });
    } else {
        const lines = doc.splitTextToSize(text, textMaxWidth);
        lines.forEach((line: string) => {
            checkPageBreak(doc.getLineHeight() * styling.lineHeight);
            doc.text(line, align === 'center' ? PAGE_WIDTH / 2 : textX, y, textOptions);
            y += doc.getLineHeight() * styling.lineHeight;
        });
    }
  };

  const renderSectionTitle = (title: string) => {
    checkPageBreak(styling.sectionTitle.size + HEADING_SPACING * 4);
    applyFontStyle(doc, styling.sectionTitle);
    const titleDim = doc.getTextDimensions(title);
    doc.text(title, PAGE_MARGIN, y);
    y += titleDim.h + HEADING_SPACING;
    doc.setLineWidth(0.75);
    doc.setDrawColor(styling.sectionTitle.color);
    doc.line(PAGE_MARGIN, y, PAGE_WIDTH - PAGE_MARGIN, y);
    y += HEADING_SPACING * 3;
  };
  
  // --- HEADER ---
  applyFontStyle(doc, styling.heading);
  const nameDim = doc.getTextDimensions(personalDetails.name);
  doc.text(personalDetails.name, PAGE_WIDTH / 2, y, { align: 'center' });
  y += nameDim.h + HEADING_SPACING * 2;

  applyFontStyle(doc, styling.font);
  doc.setFontSize(styling.font.size * 0.9);
  const contactParts = [
    personalDetails.location,
    personalDetails.email,
    personalDetails.phone,
    personalDetails.website,
    personalDetails.linkedin,
    personalDetails.github
  ].filter(Boolean);
  
  if (contactParts.length > 0) {
    const contactInfo = contactParts.join(' | ');
    addWrappedText(contactInfo, 0, PAGE_WIDTH, { align: 'center' });
    y += HEADING_SPACING * 2;
  }
  
  doc.setDrawColor(styling.font.color);
  doc.setLineWidth(0.5);
  doc.line(PAGE_MARGIN, y, PAGE_WIDTH - PAGE_MARGIN, y);
  y += SECTION_SPACING;

  // Summary
  if (summary) {
    renderSectionTitle('Summary');
    applyFontStyle(doc, styling.font);
    addWrappedText(summary, PAGE_MARGIN, CONTENT_WIDTH);
    y += SECTION_SPACING;
  }
  
  const sectionRenderers: { [key: string]: () => void } = {
    experience: () => {
      const items = sectionsData.experience.filter(e => e.role);
      if (items.length === 0) return;
      renderSectionTitle('Experience');
      items.forEach(exp => {
        checkPageBreak(styling.subheading.size * 2);
        
        // Role, Company, Location on one line, Date on the right
        applyFontStyle(doc, styling.subheading);
        const roleText = exp.role;
        const companyText = exp.company ? `, ${exp.company}` : '';
        const locationText = exp.location ? ` -- ${exp.location}` : '';
        const dateText = `${exp.startDate}${exp.endDate ? ` - ${exp.endDate}` : ''}`;
        
        const leftPart = `${roleText}${companyText}${locationText}`;
        const leftWidth = doc.getTextWidth(leftPart);
        const dateWidth = doc.getTextWidth(dateText);
        
        // Check if they fit on one line
        if (leftWidth + dateWidth + 20 < CONTENT_WIDTH) {
          doc.text(leftPart, PAGE_MARGIN, y);
          doc.text(dateText, PAGE_WIDTH - PAGE_MARGIN, y, { align: 'right' });
          y += doc.getTextDimensions(leftPart).h;
        } else {
          // Multi-line layout
          doc.text(leftPart, PAGE_MARGIN, y);
          y += doc.getTextDimensions(leftPart).h;
          applyFontStyle(doc, {...styling.font, size: styling.font.size * 0.9});
          doc.text(dateText, PAGE_MARGIN, y);
          y += doc.getTextDimensions(dateText).h;
        }
        y += ITEM_SPACING;
        
        // Highlights
        if (exp.highlights && exp.highlights.filter(h => h).length > 0) {
          applyFontStyle(doc, styling.font);
          exp.highlights.filter(h => h).forEach(h => {
            addWrappedText(h, PAGE_MARGIN, CONTENT_WIDTH, { isListItem: true, indent: LIST_INDENT });
            y += 4;
          });
        }
        y += ITEM_SPACING;
      });
    },
    
    education: () => {
      const items = sectionsData.education.filter(e => e.university);
      if (items.length === 0) return;
      renderSectionTitle('Education');
      items.forEach(edu => {
        checkPageBreak(styling.subheading.size * 2);
        
        applyFontStyle(doc, styling.subheading);
        const universityText = edu.university;
        const degreeText = edu.degree ? `, ${edu.degree}` : '';
        const dateText = `${edu.startDate}${edu.endDate ? ` - ${edu.endDate}` : ''}`;
        
        const leftPart = `${universityText}${degreeText}`;
        const leftWidth = doc.getTextWidth(leftPart);
        const dateWidth = doc.getTextWidth(dateText);
        
        // Check if they fit on one line
        if (leftWidth + dateWidth + 20 < CONTENT_WIDTH) {
          doc.text(leftPart, PAGE_MARGIN, y);
          doc.text(dateText, PAGE_WIDTH - PAGE_MARGIN, y, { align: 'right' });
          y += doc.getTextDimensions(leftPart).h;
        } else {
          doc.text(leftPart, PAGE_MARGIN, y);
          y += doc.getTextDimensions(leftPart).h;
          applyFontStyle(doc, {...styling.font, size: styling.font.size * 0.9});
          doc.text(dateText, PAGE_MARGIN, y);
          y += doc.getTextDimensions(dateText).h;
        }
        y += ITEM_SPACING / 2;
        
        // GPA and Coursework
        if ((edu.gpa || (edu.coursework && edu.coursework.filter(c => c).length > 0))) {
          applyFontStyle(doc, styling.font);
          if (edu.gpa) {
            addWrappedText(`GPA: ${edu.gpa}`, PAGE_MARGIN, CONTENT_WIDTH, { isListItem: true, indent: LIST_INDENT });
            y += 4;
          }
          if (edu.coursework && edu.coursework.filter(c => c).length > 0) {
            addWrappedText(`Coursework: ${edu.coursework.filter(c => c).join(', ')}`, PAGE_MARGIN, CONTENT_WIDTH, { isListItem: true, indent: LIST_INDENT });
            y += 4;
          }
        }
        y += ITEM_SPACING / 2;
      });
    },
    
    projects: () => {
      const items = sectionsData.projects.filter(p => p.name);
      if (items.length === 0) return;
      renderSectionTitle('Projects');
      items.forEach(proj => {
        checkPageBreak(styling.subheading.size * 2);
        
        applyFontStyle(doc, styling.subheading);
        const nameText = proj.name;
        const urlText = proj.url || '';
        
        const nameWidth = doc.getTextWidth(nameText);
        const urlWidth = urlText ? doc.getTextWidth(urlText) : 0;
        
        // Check if they fit on one line
        if (nameWidth + urlWidth + 20 < CONTENT_WIDTH) {
          doc.text(nameText, PAGE_MARGIN, y);
          if (urlText) {
            const url = `https://${urlText.replace(/^https?:\/\//, '')}`;
            applyFontStyle(doc, {...styling.font, size: styling.font.size * 0.9, color: '#007BFF'});
            doc.textWithLink(urlText, PAGE_WIDTH - PAGE_MARGIN, y, { url, align: 'right' });
          }
          y += doc.getTextDimensions(nameText).h;
        } else {
          // Multi-line layout
          doc.text(nameText, PAGE_MARGIN, y);
          y += doc.getTextDimensions(nameText).h;
          if (urlText) {
            const url = `https://${urlText.replace(/^https?:\/\//, '')}`;
            applyFontStyle(doc, {...styling.font, size: styling.font.size * 0.9, color: '#007BFF'});
            doc.textWithLink(urlText, PAGE_MARGIN, y, { url });
            y += doc.getTextDimensions(urlText).h;
          }
        }
        y += ITEM_SPACING / 2;
        
        // Description and Tools
        if (proj.description || (proj.tools && proj.tools.filter(t => t).length > 0)) {
          applyFontStyle(doc, styling.font);
          if (proj.description) {
            addWrappedText(proj.description, PAGE_MARGIN, CONTENT_WIDTH, { isListItem: true, indent: LIST_INDENT });
            y += 4;
          }
          if (proj.tools && proj.tools.filter(t => t).length > 0) {
            addWrappedText(`Tools Used: ${proj.tools.filter(t => t).join(', ')}`, PAGE_MARGIN, CONTENT_WIDTH, { isListItem: true, indent: LIST_INDENT });
            y += 4;
          }
        }
        y += ITEM_SPACING / 2;
      });
    },
    
    skills: () => {
      const items = sectionsData.skills.filter(s => s.skills.filter(i => i).length > 0);
      if (items.length === 0) return;
      renderSectionTitle('Skills');
      items.forEach(skillGroup => {
        checkPageBreak(styling.font.size * 2);
        const skillsText = skillGroup.skills.filter(s => s).join(', ');
        
        if (skillGroup.category) {
          const categoryText = `${skillGroup.category}: `;
          applyFontStyle(doc, {...styling.font, weight: 'bold'});
          const categoryWidth = doc.getTextWidth(categoryText);
          
          checkPageBreak(doc.getLineHeight() * styling.lineHeight);
          doc.text(categoryText, PAGE_MARGIN, y);
          
          applyFontStyle(doc, styling.font);
          const remainingWidth = CONTENT_WIDTH - categoryWidth;
          const skillLines = doc.splitTextToSize(skillsText, remainingWidth);
          
          doc.text(skillLines[0] || '', PAGE_MARGIN + categoryWidth, y);
          y += doc.getLineHeight() * styling.lineHeight;

          for (let i = 1; i < skillLines.length; i++) {
            checkPageBreak(doc.getLineHeight() * styling.lineHeight);
            doc.text(skillLines[i], PAGE_MARGIN + categoryWidth, y);
            y += doc.getLineHeight() * styling.lineHeight;
          }
        } else {
          applyFontStyle(doc, styling.font);
          addWrappedText(skillsText, PAGE_MARGIN, CONTENT_WIDTH);
        }
        y += 6;
      });
    },
    
    customSections: () => {
      const items = sectionsData.customSections.filter(s => s.title && s.content.some(c => c));
      if (items.length === 0) return;
      items.forEach(section => {
        renderSectionTitle(section.title);
        applyFontStyle(doc, styling.font);
        section.content.filter(c => c).forEach(c => {
          addWrappedText(c, PAGE_MARGIN, CONTENT_WIDTH, { isListItem: true, indent: LIST_INDENT });
          y += 4;
        });
        y += SECTION_SPACING;
      });
    },
  };

  sectionOrder.forEach(key => {
    if (sectionRenderers[key]) sectionRenderers[key]();
  });

  return doc.output('blob');
};
