import type { PdfTemplateRenderer } from './types';
import type { ResumeData } from '../../types';
import {
    PAGE_MARGIN,
    PAGE_WIDTH,
    PAGE_HEIGHT,
    CONTENT_WIDTH,
    applyFontStyle,
    checkPageBreak,
    addWrappedText
} from '../pdfHelpers';

const SECTION_SPACING = 18;
const ITEM_SPACING = 12;
const HEADING_SPACING = 6;
const LIST_INDENT = 20;

export const ClassicTemplate: PdfTemplateRenderer = {
    render: (doc: any, data: ResumeData) => {
        const { personalDetails, summary, styling, sectionOrder, ...sectionsData } = data;
        let y = PAGE_MARGIN;

        const renderSectionTitle = (title: string) => {
            y = checkPageBreak(doc, y, styling.sectionTitle.size + HEADING_SPACING * 4);
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
            y = addWrappedText(doc, contactInfo, 0, y, PAGE_WIDTH, styling.lineHeight, { align: 'center' });
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
            y = addWrappedText(doc, summary, PAGE_MARGIN, y, CONTENT_WIDTH, styling.lineHeight);
            y += SECTION_SPACING;
        }

        const sectionRenderers: { [key: string]: () => void } = {
            experience: () => {
                const items = sectionsData.experience.filter(e => e.role);
                if (items.length === 0) return;
                renderSectionTitle('Experience');
                items.forEach(exp => {
                    y = checkPageBreak(doc, y, styling.subheading.size * 2);

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
                        applyFontStyle(doc, { ...styling.font, size: styling.font.size * 0.9 });
                        doc.text(dateText, PAGE_MARGIN, y);
                        y += doc.getTextDimensions(dateText).h;
                    }
                    y += ITEM_SPACING;

                    // Highlights
                    if (exp.highlights && exp.highlights.filter(h => h).length > 0) {
                        applyFontStyle(doc, styling.font);
                        exp.highlights.filter(h => h).forEach(h => {
                            y = addWrappedText(doc, h, PAGE_MARGIN, y, CONTENT_WIDTH, styling.lineHeight, { isListItem: true, indent: LIST_INDENT });
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
                    y = checkPageBreak(doc, y, styling.subheading.size * 2);

                    applyFontStyle(doc, styling.subheading);
                    const universityText = edu.university;
                    const degreeText = edu.degree ? `, ${edu.degree}` : '';
                    const dateText = `${edu.startDate}${edu.endDate ? ` - ${edu.endDate}` : ''}`;

                    const leftPart = `${universityText}${degreeText}`;
                    const leftWidth = doc.getTextWidth(leftPart);
                    const dateWidth = doc.getTextWidth(dateText);

                    if (leftWidth + dateWidth + 20 < CONTENT_WIDTH) {
                        doc.text(leftPart, PAGE_MARGIN, y);
                        doc.text(dateText, PAGE_WIDTH - PAGE_MARGIN, y, { align: 'right' });
                        y += doc.getTextDimensions(leftPart).h;
                    } else {
                        doc.text(leftPart, PAGE_MARGIN, y);
                        y += doc.getTextDimensions(leftPart).h;
                        applyFontStyle(doc, { ...styling.font, size: styling.font.size * 0.9 });
                        doc.text(dateText, PAGE_MARGIN, y);
                        y += doc.getTextDimensions(dateText).h;
                    }
                    y += ITEM_SPACING / 2;

                    // GPA and Coursework
                    if ((edu.gpa || (edu.coursework && edu.coursework.filter(c => c).length > 0))) {
                        applyFontStyle(doc, styling.font);
                        if (edu.gpa) {
                            y = addWrappedText(doc, `GPA: ${edu.gpa}`, PAGE_MARGIN, y, CONTENT_WIDTH, styling.lineHeight, { isListItem: true, indent: LIST_INDENT });
                            y += 4;
                        }
                        if (edu.coursework && edu.coursework.filter(c => c).length > 0) {
                            y = addWrappedText(doc, `Coursework: ${edu.coursework.filter(c => c).join(', ')}`, PAGE_MARGIN, y, CONTENT_WIDTH, styling.lineHeight, { isListItem: true, indent: LIST_INDENT });
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
                    y = checkPageBreak(doc, y, styling.subheading.size * 2);

                    applyFontStyle(doc, styling.subheading);
                    const nameText = proj.name;
                    const urlText = proj.url || '';

                    const nameWidth = doc.getTextWidth(nameText);
                    const urlWidth = urlText ? doc.getTextWidth(urlText) : 0;

                    if (nameWidth + urlWidth + 20 < CONTENT_WIDTH) {
                        doc.text(nameText, PAGE_MARGIN, y);
                        if (urlText) {
                            const url = `https://${urlText.replace(/^https?:\/\//, '')}`;
                            applyFontStyle(doc, { ...styling.font, size: styling.font.size * 0.9, color: '#007BFF' });
                            doc.textWithLink(urlText, PAGE_WIDTH - PAGE_MARGIN, y, { url, align: 'right' });
                        }
                        y += doc.getTextDimensions(nameText).h;
                    } else {
                        doc.text(nameText, PAGE_MARGIN, y);
                        y += doc.getTextDimensions(nameText).h;
                        if (urlText) {
                            const url = `https://${urlText.replace(/^https?:\/\//, '')}`;
                            applyFontStyle(doc, { ...styling.font, size: styling.font.size * 0.9, color: '#007BFF' });
                            doc.textWithLink(urlText, PAGE_MARGIN, y, { url });
                            y += doc.getTextDimensions(urlText).h;
                        }
                    }
                    y += ITEM_SPACING / 2;

                    if (proj.description || (proj.tools && proj.tools.filter(t => t).length > 0)) {
                        applyFontStyle(doc, styling.font);
                        if (proj.description) {
                            y = addWrappedText(doc, proj.description, PAGE_MARGIN, y, CONTENT_WIDTH, styling.lineHeight, { isListItem: true, indent: LIST_INDENT });
                            y += 4;
                        }
                        if (proj.tools && proj.tools.filter(t => t).length > 0) {
                            y = addWrappedText(doc, `Tools Used: ${proj.tools.filter(t => t).join(', ')}`, PAGE_MARGIN, y, CONTENT_WIDTH, styling.lineHeight, { isListItem: true, indent: LIST_INDENT });
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
                    y = checkPageBreak(doc, y, styling.font.size * 2);
                    const skillsText = skillGroup.skills.filter(s => s).join(', ');

                    if (skillGroup.category) {
                        const categoryText = `${skillGroup.category}: `;
                        applyFontStyle(doc, { ...styling.font, weight: 'bold' });
                        const categoryWidth = doc.getTextWidth(categoryText);

                        y = checkPageBreak(doc, y, doc.getLineHeight() * styling.lineHeight);
                        doc.text(categoryText, PAGE_MARGIN, y);

                        applyFontStyle(doc, styling.font);
                        const remainingWidth = CONTENT_WIDTH - categoryWidth;
                        const skillLines = doc.splitTextToSize(skillsText, remainingWidth);

                        doc.text(skillLines[0] || '', PAGE_MARGIN + categoryWidth, y);
                        y += doc.getLineHeight() * styling.lineHeight;

                        for (let i = 1; i < skillLines.length; i++) {
                            y = checkPageBreak(doc, y, doc.getLineHeight() * styling.lineHeight);
                            doc.text(skillLines[i], PAGE_MARGIN + categoryWidth, y);
                            y += doc.getLineHeight() * styling.lineHeight;
                        }
                    } else {
                        applyFontStyle(doc, styling.font);
                        y = addWrappedText(doc, skillsText, PAGE_MARGIN, y, CONTENT_WIDTH, styling.lineHeight);
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
                        y = addWrappedText(doc, c, PAGE_MARGIN, y, CONTENT_WIDTH, styling.lineHeight, { isListItem: true, indent: LIST_INDENT });
                        y += 4;
                    });
                    y += SECTION_SPACING;
                });
            },
        };

        sectionOrder.forEach(key => {
            if (sectionRenderers[key]) sectionRenderers[key]();
        });
    }
};
