import type { FontStyle, StylingOptions } from '../types';

export const PAGE_MARGIN = 72; // 1 inch
export const PAGE_WIDTH = 612; // Letter width in pt
export const PAGE_HEIGHT = 792; // Letter height in pt
export const CONTENT_WIDTH = PAGE_WIDTH - 2 * PAGE_MARGIN;

export const getPdfFontFamily = (family: string): string => {
    const serifFonts = ['Charter', 'Georgia', 'Times New Roman', 'Garamond'];
    return serifFonts.includes(family) ? 'times' : 'helvetica';
};

export const applyFontStyle = (doc: any, style: FontStyle) => {
    const family = getPdfFontFamily(style.family);
    const fontStyle = style.weight === 'bold' ? 'bold' : 'normal';
    doc.setFont(family, fontStyle);
    doc.setFontSize(style.size);
    doc.setTextColor(style.color);
};

export const checkPageBreak = (doc: any, y: number, spaceNeeded: number, margin: number = PAGE_MARGIN): number => {
    if (y + spaceNeeded > PAGE_HEIGHT - margin) {
        doc.addPage();
        return margin; // New y position
    }
    return y;
};

export const addWrappedText = (
    doc: any,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number,
    options: { isListItem?: boolean; indent?: number; align?: 'left' | 'center' | 'right' } = {}
): number => {
    const { isListItem = false, indent = 0, align = 'left' } = options;
    const textX = x + indent;
    const textMaxWidth = maxWidth - indent;
    const textOptions = align === 'left' ? {} : { align };

    let currentY = y;

    if (isListItem) {
        const bullet = '•  ';
        const bulletWidth = doc.getTextWidth(bullet);
        const itemMaxWidth = textMaxWidth - bulletWidth;
        const lines = doc.splitTextToSize(text, itemMaxWidth);

        lines.forEach((line: string, index: number) => {
            currentY = checkPageBreak(doc, currentY, doc.getLineHeight() * lineHeight);
            if (index === 0) {
                doc.text(bullet + line, textX, currentY);
            } else {
                doc.text(line, textX + bulletWidth, currentY);
            }
            currentY += doc.getLineHeight() * lineHeight;
        });
    } else {
        const lines = doc.splitTextToSize(text, textMaxWidth);
        lines.forEach((line: string) => {
            currentY = checkPageBreak(doc, currentY, doc.getLineHeight() * lineHeight);
            doc.text(line, align === 'center' ? PAGE_WIDTH / 2 : textX, currentY, textOptions);
            currentY += doc.getLineHeight() * lineHeight;
        });
    }
    return currentY;
};
