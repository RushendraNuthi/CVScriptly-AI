import type { PdfTemplateRenderer } from './types';
import { ClassicTemplate } from './ClassicTemplate';
import { ModernTemplate } from './ModernTemplate';

const registry: { [key: string]: PdfTemplateRenderer } = {
    'classic': ClassicTemplate,
    'modern': ModernTemplate,
};

export const getTemplateRenderer = (templateId: string): PdfTemplateRenderer => {
    return registry[templateId.toLowerCase()] || ClassicTemplate;
};
