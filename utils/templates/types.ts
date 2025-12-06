import type { ResumeData } from '../../types';

export interface PdfTemplateRenderer {
    render: (doc: any, data: ResumeData) => void;
}
