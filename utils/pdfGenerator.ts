import type { ResumeData, FontStyle } from '../types';

declare global {
  interface Window {
    jsPDF: any;
  }
}

const PAGE_MARGIN = 72; // 1 inch
const FONT_LINE_HEIGHT_MULTIPLIER = 1.15;
const SECTION_SPACING = 18;
const HEADING_SPACING = 4;
const SUBHEADING_SPACING = 2;
const LIST_ITEM_SPACING = 1;
const LIST_INDENT = 15;

const getPdfFontFamily = (family: string): string => {
  const serifFonts = ['Charter', 'Georgia', 'Times New Roman', 'Garamond'];
  return serifFonts.includes(family) ? 'times' : 'helvetica';
};

const hexToRgb = (hex: string): number[] => {
  // Remove # if present
  const cleanHex = hex.replace(/^#/, '');
  // Handle 3-digit hex codes
  if (cleanHex.length === 3) {
    return [
      parseInt(cleanHex[0] + cleanHex[0], 16),
      parseInt(cleanHex[1] + cleanHex[1], 16),
      parseInt(cleanHex[2] + cleanHex[2], 16)
    ];
  }
  // Handle 6-digit hex codes
  if (cleanHex.length === 6) {
    return [
      parseInt(cleanHex.substring(0, 2), 16),
      parseInt(cleanHex.substring(2, 4), 16),
      parseInt(cleanHex.substring(4, 6), 16)
    ];
  }
  // Default to black if invalid
  return [0, 0, 0];
};

const applyFontStyle = (doc: any, style: FontStyle) => {
  const family = getPdfFontFamily(style.family);
  doc.setFont(family, 'normal');
  doc.setFontSize(style.size);
  const rgb = hexToRgb(style.color || '#000000');
  doc.setTextColor(rgb[0], rgb[1], rgb[2]);
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

  const addWrappedText = (text: string, x: number, maxWidth: number, align: 'left' | 'center' | 'right' = 'left', isListItem: boolean = false) => {
    if (!text || text.trim() === '') return;
    const lines = doc.splitTextToSize(text.trim(), maxWidth);
    const bulletText = '•  ';
    
    lines.forEach((line: string) => {
      checkPageBreak(doc.getLineHeight() * FONT_LINE_HEIGHT_MULTIPLIER);
      
      if (isListItem) {
        // For list items, always align left with bullet
        doc.text(bulletText + line, x, y);
      } else {
        // For non-list items, use the specified alignment
        doc.text(line, x, y, { align });
      }
      y += doc.getLineHeight() * FONT_LINE_HEIGHT_MULTIPLIER;
    });
  };

  const renderSectionTitle = (title: string) => {
    checkPageBreak(data.styling.sectionTitle.size + HEADING_SPACING * 3);
    applyFontStyle(doc, data.styling.sectionTitle);
    doc.setFont(getPdfFontFamily(data.styling.sectionTitle.family), 'bold');
    doc.text(title, PAGE_MARGIN, y);
    y += doc.getTextDimensions(title).h + HEADING_SPACING;
    doc.setLineWidth(1);
    const titleRgb = hexToRgb(data.styling.sectionTitle.color || '#000000');
    doc.setDrawColor(titleRgb[0], titleRgb[1], titleRgb[2]);
    doc.line(PAGE_MARGIN, y, PAGE_WIDTH - PAGE_MARGIN, y);
    y += HEADING_SPACING * 2.5;
  };
  
  // --- RENDER SECTIONS ---

  // Header
  const { personalDetails, summary, styling, sectionOrder, ...sectionsData } = data;
  if (personalDetails?.name) {
    applyFontStyle(doc, styling.heading);
    doc.setFont(getPdfFontFamily(styling.heading.family), 'bold');
    doc.text(personalDetails.name, PAGE_WIDTH / 2, y, { align: 'center' });
    y += doc.getTextDimensions(personalDetails.name).h + HEADING_SPACING;
  }

  applyFontStyle(doc, styling.font);
  doc.setFontSize(styling.font.size * 0.9);
  const contactInfo = [
    personalDetails?.location,
    personalDetails?.email,
    personalDetails?.phone,
    personalDetails?.website,
    personalDetails?.linkedin,
    personalDetails?.github
  ].filter(Boolean).join(' | ');
  
  if (contactInfo) {
    addWrappedText(contactInfo, PAGE_WIDTH / 2, CONTENT_WIDTH * 0.9, 'center', false);
  }
  y += HEADING_SPACING;
  const fontRgb = hexToRgb(styling.font.color || '#000000');
  doc.setDrawColor(fontRgb[0], fontRgb[1], fontRgb[2]);
  doc.line(PAGE_MARGIN, y, PAGE_WIDTH - PAGE_MARGIN, y);
  y += SECTION_SPACING;

  // Summary
  if (summary && summary.trim()) {
    renderSectionTitle('Summary');
    applyFontStyle(doc, styling.font);
    addWrappedText(summary, PAGE_MARGIN, CONTENT_WIDTH, 'left', false);
    y += SECTION_SPACING;
  }
  
  const sectionRenderers: { [key: string]: () => void } = {
    experience: () => {
      const items = (sectionsData.experience || []).filter(e => e?.role && e.role.trim());
      if (items.length === 0) return;
      renderSectionTitle('Experience');
      items.forEach(exp => {
        const highlightCount = (exp.highlights || []).filter(h => h && h.trim()).length;
        checkPageBreak(styling.subheading.size + highlightCount * styling.font.size * 1.5 + SECTION_SPACING);
        applyFontStyle(doc, styling.subheading);
        doc.setFont(getPdfFontFamily(styling.subheading.family), 'bold');
        const date = `${exp.startDate || ''}${exp.endDate ? ` - ${exp.endDate}` : ''}`.trim();
        const roleAndCompany = `${exp.role || ''}${exp.company ? `, ${exp.company}`: ''}`.trim();
        if (roleAndCompany) {
          doc.text(roleAndCompany, PAGE_MARGIN, y);
          if (date) {
            doc.setFont(getPdfFontFamily(styling.subheading.family), 'normal');
            doc.text(date, PAGE_WIDTH - PAGE_MARGIN, y, { align: 'right' });
          }
          y += doc.getTextDimensions(roleAndCompany).h;
        }
        
        if (exp.location && exp.location.trim()) {
          applyFontStyle(doc, styling.font);
          doc.setFont(getPdfFontFamily(styling.font.family), 'italic');
          doc.text(exp.location, PAGE_MARGIN, y);
          y += doc.getTextDimensions(exp.location).h + SUBHEADING_SPACING * 2;
        } else {
          y += SUBHEADING_SPACING;
        }
        
        applyFontStyle(doc, styling.font);
        (exp.highlights || []).filter(h => h && h.trim()).forEach(h => {
          addWrappedText(h, PAGE_MARGIN + LIST_INDENT, CONTENT_WIDTH - LIST_INDENT, 'left', true);
          y += LIST_ITEM_SPACING;
        });
        y += HEADING_SPACING * 2;
      });
    },
    education: () => {
      const items = (sectionsData.education || []).filter(e => e?.university && e.university.trim());
      if (items.length === 0) return;
      renderSectionTitle('Education');
      items.forEach(edu => {
        checkPageBreak(styling.subheading.size * 3 + SECTION_SPACING);
        applyFontStyle(doc, styling.subheading);
        doc.setFont(getPdfFontFamily(styling.subheading.family), 'bold');
        const date = `${edu.startDate || ''}${edu.endDate ? ` - ${edu.endDate}` : ''}`.trim();
        const university = (edu.university || '').trim();
        if (university) {
          doc.text(university, PAGE_MARGIN, y);
          if (date) {
            doc.setFont(getPdfFontFamily(styling.subheading.family), 'normal');
            doc.text(date, PAGE_WIDTH - PAGE_MARGIN, y, { align: 'right' });
          }
          y += doc.getTextDimensions(university).h;
        }
        
        if (edu.degree && edu.degree.trim()) {
          applyFontStyle(doc, styling.font);
          doc.setFont(getPdfFontFamily(styling.font.family), 'italic');
          doc.text(edu.degree, PAGE_MARGIN, y);
          y += doc.getTextDimensions(edu.degree).h + SUBHEADING_SPACING * 2;
        } else {
          y += SUBHEADING_SPACING;
        }
        
        applyFontStyle(doc, styling.font);
        if (edu.gpa && edu.gpa.trim()) {
          addWrappedText(`GPA: ${edu.gpa}`, PAGE_MARGIN + LIST_INDENT, CONTENT_WIDTH - LIST_INDENT, 'left', true);
        }
        const courseworkItems = (edu.coursework || []).filter(c => c && c.trim());
        if (courseworkItems.length > 0) {
          addWrappedText(`Coursework: ${courseworkItems.join(', ')}`, PAGE_MARGIN + LIST_INDENT, CONTENT_WIDTH - LIST_INDENT, 'left', true);
        }
        y += HEADING_SPACING * 2;
      });
    },
    projects: () => {
      const items = (sectionsData.projects || []).filter(p => p?.name && p.name.trim());
      if (items.length === 0) return;
      renderSectionTitle('Projects');
      items.forEach(proj => {
          checkPageBreak(styling.subheading.size * 3 + SECTION_SPACING);
          applyFontStyle(doc, styling.subheading);
          doc.setFont(getPdfFontFamily(styling.subheading.family), 'bold');
          const name = (proj.name || '').trim();
          if (name) {
            doc.text(name, PAGE_MARGIN, y);
            y += doc.getTextDimensions(name).h + SUBHEADING_SPACING;
          }

          applyFontStyle(doc, styling.font);
          if (proj.description && proj.description.trim()) {
            addWrappedText(proj.description, PAGE_MARGIN + LIST_INDENT, CONTENT_WIDTH - LIST_INDENT, 'left', true);
          }
          const toolsItems = (proj.tools || []).filter(t => t && t.trim());
          if (toolsItems.length > 0) {
            addWrappedText(`Tools Used: ${toolsItems.join(', ')}`, PAGE_MARGIN + LIST_INDENT, CONTENT_WIDTH - LIST_INDENT, 'left', true);
          }
          y += HEADING_SPACING * 2;
      });
    },
    skills: () => {
      const items = (sectionsData.skills || []).filter(s => s?.skills && s.skills.filter(i => i && i.trim()).length > 0);
      if (items.length === 0) return;
      renderSectionTitle('Skills');
      items.forEach(skillGroup => {
        checkPageBreak(styling.font.size * 2 + SECTION_SPACING);
        applyFontStyle(doc, styling.font);
        const skillsList = (skillGroup.skills || []).filter(s => s && s.trim());
        if (skillsList.length === 0) return;
        
        const skillsText = skillsList.join(', ');
        if (skillGroup.category && skillGroup.category.trim()) {
            doc.setFont(getPdfFontFamily(styling.font.family), 'bold');
            const categoryText = `${skillGroup.category}: `;
            doc.text(categoryText, PAGE_MARGIN, y);
            const categoryWidth = doc.getTextWidth(categoryText);
            doc.setFont(getPdfFontFamily(styling.font.family), 'normal');
            addWrappedText(skillsText, PAGE_MARGIN + categoryWidth, CONTENT_WIDTH - categoryWidth, 'left', false);
        } else {
            addWrappedText(skillsText, PAGE_MARGIN, CONTENT_WIDTH, 'left', false);
        }
        y += styling.font.size * 1.3;
      });
      y += SECTION_SPACING;
    },
    customSections: () => {
      const items = (sectionsData.customSections || []).filter(s => s?.title && s.title.trim());
      if (items.length === 0) return;
      items.forEach(section => {
        renderSectionTitle(section.title);
        applyFontStyle(doc, styling.font);
        const contentItems = (section.content || []).filter(c => c && c.trim());
        contentItems.forEach(c => {
          addWrappedText(c, PAGE_MARGIN + LIST_INDENT, CONTENT_WIDTH - LIST_INDENT, 'left', true);
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