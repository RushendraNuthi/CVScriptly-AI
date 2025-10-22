import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import './print.css';

const faviconDataUri = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAACXBIWXMAAAsTAAALEwEAmpwYAAAEi0lEQVR4nO2d72vUdRzA3+cD0/6DwKnFznPzdzadOt1cZrYyM11m23mbW9t5qyhCRJZuSxAREYkujCEiIqIDERPRaksh9Un0B+Sehv+CDw5eccI7vhSU3fG9vb/vPi94Pdj94N6vez/Ye48mEggEAoFAIBAIBAKB5PLCAM/XDfHl/ALT84cozR8Ca9YVeFJX4Ne6Aj3iiXmfMXfhAR4sLEBSXHCAszLCLPHAi3nGXjoACXTcxRLSeabTeXjqIIcbO5ktBknrjBHrBx0sIZOnlMlDWatffhmd8W8mfQkNg6BKQuZsGGT8rz8ndglLBkCVxMxJqnGAYvSxxgHOJXIJyz4EVRI1J6ml/RSjjy/rT+ASVvSDKombk9TyPorR51YkbQmr+kCVRM5JalUfxejzK/sStITV+0GVxM5JanUvxehrXu5NyBKaekGVRM9JqqmXYvR1TUlYQnMPqJL4OUk15yhGX7s2Z3wJ63OgimHW5SjpnP/4B+MIs9blGI92lX82u4SWfaCKYVqyTP85a5bhf1vChizj0baWLGfFIpv2gSqG2biPseislbgxS06s0ZYFVQzT3Mnc1iz3o/P+V1u7+UWs0d4NqhinNcec9m5G2rt4tLmbUnT2Z3FzF0/EGlu6QBWnbLHcuPUDUMUpWy03btsLqjhlm+XGjvdBFad0WG7cvgdUccp2y4073gNVnLLDcuPOTlDFKTstN+7aDao4ZZflxs7doIpTOi037tkFqjhlj+XGve+CKk7Za7mxayeo4pQuy43Zd0AVp2QtN/bsAFWc0mO5cf/boIpT9ltu7N8Oqjil33LjwFugilMGLDfm3wRVnJK33FjoAFWcUrDc+FEHqJW8f+ghbR8/ZLQWlj9rJhpj5ZM3QK3k/cVJRotTUBMnGZ2Jxlj5dBuolbx/8jtGp25CLSx/1kw0xsrnr4NayfsfT9D2+wSjtbD8WTPRGCsHt4IqTjloufHQa6CKUw5Zbjy8BVSvV9DhKhtjZfhVUL1eQcNVNsbKkXZQvV5BR6psjJWRzaB6vYJGqmyMlbE2UMUpY5Ybj7WBKk45ZrnxeCuoXq+g41U2xsqJTaB6vYJOVNkYKyc3gur1CjpZZWOsnGoB1esVdKrKxlg5vQFUccppy41n1oMqTjljufGrdaDW+goaqvCqqXVjrHzdDGrNr6DJyn6p1roxVr5ZC2qtr6DJCq+aWjfGyrdrQK31FfS4wqum1o2xMr4GVHHKuOXGc02gilPOWW48/wqo4pTzlhsvrAZVnHLBcuPFl0EVp1y03HhpFajilEuWGy+vBFWcctly45UVoIpTrlhunFgOqjhlwnLjtWWgilOuWW68vhRUccp1y403loIqTrlhufHmElDFKTctN95qBFWccsty4+0GSrcboOzVRrv/xKdSbtXznPaVW8UadxYz/f1ieGqGYU9LuNrI7DsZvtC+Oxl+E2v8kGHsxwz8L1zEUbHGg3nMnUpzf2oReHYyzc8/LWCOWKQ82N16Ru6leXQvTeleGpxYKjfdreeo2S8/EAgEAoFAIBAIBAKB5TPwBpjXmB915b8sAAAAASUVORK5CYII=';

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
    icon: faviconDataUri,
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
