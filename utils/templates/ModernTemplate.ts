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

export const ModernTemplate: PdfTemplateRenderer = {
    render: (doc: any, data: ResumeData) => {
        const { personalDetails, summary, styling, sectionOrder, ...sectionsData } = data;

        // Modern Layout: Accent header, left column for details/skills, right for experience
        let y = PAGE_MARGIN;

        // --- HEADER WITH ACCENT BACKGROUND ---
        // Draw a light accent background for the header
        doc.setFillColor(245, 245, 245); // Light Gray
        doc.rect(0, 0, PAGE_WIDTH, 140, 'F');

        y = 60;

        applyFontStyle(doc, styling.heading);
        doc.setFontSize(32);
        doc.text(personalDetails.name, PAGE_MARGIN, y);
        y += 30;

        applyFontStyle(doc, styling.font);
        doc.setFontSize(10);
        const contactInfo = [
            personalDetails.location,
            personalDetails.email,
            personalDetails.phone,
            personalDetails.website,
            personalDetails.linkedin
        ].filter(Boolean).join('  •  ');

        doc.setTextColor(80, 80, 80);
        doc.text(contactInfo, PAGE_MARGIN, y);

        y = 160; // Start content below header

        // Grid Layout: 2 Columns
        const LEFT_COL_WIDTH = 180;
        const COL_GAP = 30;
        const RIGHT_COL_WIDTH = PAGE_WIDTH - PAGE_MARGIN * 2 - LEFT_COL_WIDTH - COL_GAP;
        const RIGHT_COL_X = PAGE_MARGIN + LEFT_COL_WIDTH + COL_GAP;

        let leftY = y;
        let rightY = y;

        // Render functions for each section
        const renderers: { [key: string]: () => void } = {
            summary: () => {
                // Summary spans full width usually, but let's put it on the right key column in modern
                applyFontStyle(doc, styling.sectionTitle);
                doc.setTextColor(styling.sectionTitle.color); // Accent color
                doc.text('PROFILE', RIGHT_COL_X, rightY);
                rightY += 15;

                applyFontStyle(doc, styling.font);
                rightY = addWrappedText(doc, summary, RIGHT_COL_X, rightY, RIGHT_COL_WIDTH, styling.lineHeight);
                rightY += 20;
            },
            skills: () => {
                applyFontStyle(doc, styling.sectionTitle);
                doc.setTextColor(styling.sectionTitle.color);
                doc.text('SKILLS', PAGE_MARGIN, leftY);
                leftY += 15;

                const items = sectionsData.skills.filter(s => s.skills.some(k => k));
                items.forEach(grp => {
                    applyFontStyle(doc, { ...styling.font, weight: 'bold' });
                    if (grp.category) {
                        leftY = addWrappedText(doc, grp.category, PAGE_MARGIN, leftY, LEFT_COL_WIDTH, styling.lineHeight);
                        leftY += 2;
                    }

                    applyFontStyle(doc, styling.font);
                    const skills = grp.skills.filter(s => s).join(', ');
                    leftY = addWrappedText(doc, skills, PAGE_MARGIN, leftY, LEFT_COL_WIDTH, styling.lineHeight);
                    leftY += 10;
                });
                leftY += 15;
            },
            education: () => {
                applyFontStyle(doc, styling.sectionTitle);
                doc.setTextColor(styling.sectionTitle.color);
                doc.text('EDUCATION', PAGE_MARGIN, leftY);
                leftY += 15;

                const items = sectionsData.education.filter(e => e.university);
                items.forEach(edu => {
                    applyFontStyle(doc, { ...styling.subheading, size: 10 });
                    leftY = addWrappedText(doc, edu.university, PAGE_MARGIN, leftY, LEFT_COL_WIDTH, styling.lineHeight);
                    leftY += 2;

                    applyFontStyle(doc, styling.font);
                    if (edu.degree) {
                        leftY = addWrappedText(doc, edu.degree, PAGE_MARGIN, leftY, LEFT_COL_WIDTH, styling.lineHeight);
                        leftY += 2;
                    }
                    if (edu.startDate) {
                        const date = `${edu.startDate} - ${edu.endDate || 'Present'}`;
                        doc.setTextColor(100, 100, 100);
                        doc.text(date, PAGE_MARGIN, leftY);
                        leftY += 12;
                    }
                    leftY += 8;
                });
                leftY += 15;
            },
            experience: () => {
                applyFontStyle(doc, styling.sectionTitle);
                doc.setTextColor(styling.sectionTitle.color);
                doc.text('EXPERIENCE', RIGHT_COL_X, rightY);
                rightY += 15;

                const items = sectionsData.experience.filter(e => e.role);
                items.forEach(exp => {
                    applyFontStyle(doc, styling.subheading);
                    doc.text(exp.role, RIGHT_COL_X, rightY);
                    rightY += 12;

                    applyFontStyle(doc, { ...styling.font, weight: 'bold', color: '#555' });
                    const companyLine = `${exp.company} ${exp.location ? `| ${exp.location}` : ''}`;
                    doc.text(companyLine, RIGHT_COL_X, rightY);

                    const date = `${exp.startDate} - ${exp.endDate || 'Present'}`;
                    doc.setFont('helvetica', 'normal');
                    doc.setFontSize(9);
                    doc.setTextColor(120, 120, 120);
                    const dateWidth = doc.getTextWidth(date);
                    doc.text(date, PAGE_WIDTH - PAGE_MARGIN - dateWidth, rightY); // Align date right

                    rightY += 15;

                    if (exp.highlights && exp.highlights.length > 0) {
                        applyFontStyle(doc, styling.font);
                        exp.highlights.filter(h => h).forEach(h => {
                            rightY = addWrappedText(doc, h, RIGHT_COL_X, rightY, RIGHT_COL_WIDTH, styling.lineHeight, { isListItem: true, indent: 10 });
                            rightY += 3;
                        });
                    }
                    rightY += 15;
                });
            },
            projects: () => {
                applyFontStyle(doc, styling.sectionTitle);
                doc.setTextColor(styling.sectionTitle.color);
                doc.text('PROJECTS', RIGHT_COL_X, rightY);
                rightY += 15;

                const items = sectionsData.projects.filter(p => p.name);
                items.forEach(proj => {
                    applyFontStyle(doc, styling.subheading);
                    doc.text(proj.name, RIGHT_COL_X, rightY);
                    rightY += 12;

                    if (proj.description) {
                        applyFontStyle(doc, styling.font);
                        rightY = addWrappedText(doc, proj.description, RIGHT_COL_X, rightY, RIGHT_COL_WIDTH, styling.lineHeight);
                        rightY += 5;
                    }
                    rightY += 10;
                });
            },
            customSections: () => {
                const items = sectionsData.customSections.filter(s => s.title);
                items.forEach(sec => {
                    applyFontStyle(doc, styling.sectionTitle);
                    doc.setTextColor(styling.sectionTitle.color);
                    doc.text(sec.title.toUpperCase(), RIGHT_COL_X, rightY);
                    rightY += 15;

                    applyFontStyle(doc, styling.font);
                    sec.content.filter(c => c).forEach(c => {
                        rightY = addWrappedText(doc, c, RIGHT_COL_X, rightY, RIGHT_COL_WIDTH, styling.lineHeight, { isListItem: true, indent: 10 });
                        rightY += 3;
                    });
                    rightY += 15;
                });
            }
        };

        // Render Order:
        // Left Column: Skills, Education
        // Right Column: Summary, Experience, Projects, Custom

        // Explicit order for Modern Template specifically
        if (summary) renderers.summary();
        renderers.experience();
        renderers.projects();
        renderers.customSections();

        renderers.skills();
        renderers.education();

        // Draw divider line
        doc.setDrawColor(230, 230, 230);
        doc.line(PAGE_MARGIN + LEFT_COL_WIDTH + COL_GAP / 2, 160, PAGE_MARGIN + LEFT_COL_WIDTH + COL_GAP / 2, Math.max(leftY, rightY));
    }
};
