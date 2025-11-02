import type { ResumeData, FontStyle } from '../types';

declare global {
  interface Window {
    jsPDF: any;
  }
}

// Spacing constants for a polished layout
const PAGE_MARGIN = 72; // 1 inch
const SECTION_SPACING = 16;
const HEADING_SPACING = 4;
const SUBHEADING_SPACING = 2;
const LIST_ITEM_SPACING = 2;
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
    checkPageBreak(styling.sectionTitle.size + HEADING_SPACING * 3);
    applyFontStyle(doc, styling.sectionTitle);
    doc.text(title, PAGE_MARGIN, y);
    y += doc.getTextDimensions(title).h + HEADING_SPACING;
    doc.setLineWidth(0.75);
    doc.setDrawColor(styling.sectionTitle.color);
    doc.line(PAGE_MARGIN, y, PAGE_WIDTH - PAGE_MARGIN, y);
    y += HEADING_SPACING * 2;
  };
  
  // --- RENDER SECTIONS ---

  // Header
  applyFontStyle(doc, styling.heading);
  doc.text(personalDetails.name, PAGE_WIDTH / 2, y, { align: 'center' });
  y += doc.getTextDimensions(personalDetails.name).h + HEADING_SPACING;

  applyFontStyle(doc, styling.font);
  doc.setFontSize(styling.font.size * 0.9);
  const contactInfo = [
    personalDetails.location, personalDetails.email, personalDetails.phone,
    personalDetails.website, personalDetails.linkedin, personalDetails.github
  ].filter(Boolean).join(' | ');
  addWrappedText(contactInfo, 0, PAGE_WIDTH, { align: 'center' });
  y += HEADING_SPACING;
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
        const highlightsCount = exp.highlights ? exp.highlights.filter(h => h).length : 0;
        checkPageBreak(styling.subheading.size + highlightsCount * styling.font.size * 2);
        applyFontStyle(doc, styling.subheading);
        const date = `${exp.startDate}${exp.endDate ? ` — ${exp.endDate}` : ' — Present'}`;
        const roleAndCompany = `${exp.role}${exp.company ? `, ${exp.company}`: ''}`;
        doc.text(roleAndCompany, PAGE_MARGIN, y);
        applyFontStyle(doc, {...styling.subheading, weight: 'normal'});
        doc.text(date, PAGE_WIDTH - PAGE_MARGIN, y, { align: 'right' });
        y += doc.getTextDimensions(roleAndCompany).h;
        
        if (exp.location) {
          applyFontStyle(doc, styling.font);
          doc.setFont(getPdfFontFamily(styling.font.family), 'italic');
          doc.text(exp.location, PAGE_MARGIN, y);
          y += doc.getTextDimensions(exp.location).h + SUBHEADING_SPACING * 2;
        }
        
        if (exp.highlights && exp.highlights.filter(h => h).length > 0) {
          applyFontStyle(doc, styling.font);
          exp.highlights.filter(h => h).forEach(h => {
            addWrappedText(h, PAGE_MARGIN, CONTENT_WIDTH, { isListItem: true, indent: LIST_INDENT });
            y += LIST_ITEM_SPACING;
          });
        }
        y += HEADING_SPACING * 2;
      });
    },
    education: () => {
      const items = sectionsData.education.filter(e => e.university);
      if (items.length === 0) return;
      renderSectionTitle('Education');
      items.forEach(edu => {
        checkPageBreak(styling.subheading.size * 3);
        applyFontStyle(doc, styling.subheading);
        const date = `${edu.startDate}${edu.endDate ? ` — ${edu.endDate}` : ' — Present'}`;
        doc.text(edu.university, PAGE_MARGIN, y);
        applyFontStyle(doc, {...styling.subheading, weight: 'normal'});
        doc.text(date, PAGE_WIDTH - PAGE_MARGIN, y, { align: 'right' });
        y += doc.getTextDimensions(edu.university).h;
        
        if (edu.degree) {
          applyFontStyle(doc, styling.font);
          doc.setFont(getPdfFontFamily(styling.font.family), 'italic');
          doc.text(edu.degree, PAGE_MARGIN, y);
          y += doc.getTextDimensions(edu.degree).h + SUBHEADING_SPACING * 2;
        }
        
        applyFontStyle(doc, styling.font);
        const details = [];
        if (edu.gpa) details.push(`GPA: ${edu.gpa}`);
        if (edu.coursework && edu.coursework.filter(c => c).length > 0) {
          details.push(`Coursework: ${edu.coursework.filter(c => c).join(', ')}`);
        }
        
        if (details.length > 0) {
          details.forEach(detail => {
              addWrappedText(detail, PAGE_MARGIN, CONTENT_WIDTH, { isListItem: true, indent: LIST_INDENT });
          });
        }
        y += HEADING_SPACING * 2;
      });
    },
    projects: () => {
      const items = sectionsData.projects.filter(p => p.name);
      if (items.length === 0) return;
      renderSectionTitle('Projects');
      items.forEach(proj => {
          checkPageBreak(styling.subheading.size * 3);
          applyFontStyle(doc, styling.subheading);
          
          const urlText = proj.url || '';
          const urlWidth = urlText ? doc.getTextWidth(urlText) : 0;
          const availableWidthForName = CONTENT_WIDTH - urlWidth - 10;
          const nameLines = doc.splitTextToSize(proj.name, availableWidthForName);
          
          doc.text(nameLines[0], PAGE_MARGIN, y);

          if (proj.url) {
            const url = `https://${proj.url.replace(/^https?:\/\//, '')}`;
            applyFontStyle(doc, {...styling.font, color: '#007BFF', weight: 'normal'});
            doc.setFontSize(styling.font.size * 0.9);
            doc.textWithLink(proj.url, PAGE_WIDTH - PAGE_MARGIN, y, { url, align: 'right' });
          }

          y += doc.getTextDimensions(nameLines[0]).h;
          
          applyFontStyle(doc, styling.subheading);
          for (let i = 1; i < nameLines.length; i++) {
              checkPageBreak(doc.getLineHeight() * styling.lineHeight);
              doc.text(nameLines[i], PAGE_MARGIN, y);
              y += doc.getLineHeight() * styling.lineHeight;
          }
          y += SUBHEADING_SPACING;

          applyFontStyle(doc, styling.font);
          const details = [];
          if (proj.description) details.push(proj.description);
          if (proj.tools && proj.tools.filter(t => t).length > 0) {
            details.push(`Tools Used: ${proj.tools.filter(t => t).join(', ')}`);
          }

          if (details.length > 0) {
            details.forEach(detail => {
               addWrappedText(detail, PAGE_MARGIN, CONTENT_WIDTH, { isListItem: true, indent: LIST_INDENT });
            });
          }
          y += HEADING_SPACING * 2;
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
              const remainingWidth = CONTENT_WIDTH - categoryWidth;
              const skillLines = doc.splitTextToSize(skillsText, remainingWidth);

              checkPageBreak(doc.getLineHeight() * styling.lineHeight);
              doc.text(categoryText, PAGE_MARGIN, y);
              applyFontStyle(doc, styling.font);
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
      });
       y += SECTION_SPACING;
    },
    customSections: () => {
      const items = sectionsData.customSections.filter(s => s.title && s.content.some(c => c));
      if (items.length === 0) return;
      items.forEach(section => {
        renderSectionTitle(section.title);
        applyFontStyle(doc, styling.font);
        section.content.filter(c => c).forEach(c => {
          addWrappedText(c, PAGE_MARGIN, CONTENT_WIDTH, { isListItem: true, indent: LIST_INDENT });
          y += LIST_ITEM_SPACING;
        });
        y += HEADING_SPACING * 2;
      });
    },
  };

  sectionOrder.forEach(key => {
    if (sectionRenderers[key]) sectionRenderers[key]();
  });

  return doc.output('blob');
};