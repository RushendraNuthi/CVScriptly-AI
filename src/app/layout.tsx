import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import './print.css';

export const metadata: Metadata = {
  title: 'CVScriptly AI - Free AI-Powered Resume Builder',
  description: 'Build and download professional, ATS-friendly resumes for free. CVScriptly AI uses generative AI to help you write compelling summaries and bullet points.',
  keywords: 'resume builder, free resume builder, AI resume builder, cv maker, ATS-friendly resume, professional resume, job application, resume template',
  authors: [{ name: 'Rushendra Nuthi' }],
  openGraph: {
    title: 'CVScriptly AI - Free AI-Powered Resume Builder',
    description: 'Craft job-winning resumes with the power of AI. Privacy-first and open-source.',
    url: 'https://cvscriptly-ai.netlify.app/',
    siteName: 'CVScriptly AI',
    images: [
      {
        url: 'https://cvscriptly-ai.netlify.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CVScriptly AI - AI-Powered Resume Builder',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CVScriptly AI - Free AI-Powered Resume Builder',
    description: 'Build professional, ATS-optimized resumes for free with AI-powered suggestions. Open-source and privacy-focused.',
    creator: '@Rushendra_Nuthi',
    images: ['https://cvscriptly-ai.netlify.app/og-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=PT+Sans:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
