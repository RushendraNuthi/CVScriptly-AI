import type { ResumeData } from '../types';
import { getTemplateRenderer } from './templates';

declare global {
  interface Window {
    jsPDF: any;
  }
}

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

  const renderer = getTemplateRenderer(data.templateId || 'modern');
  renderer.render(doc, data);

  return doc.output('blob');
};
