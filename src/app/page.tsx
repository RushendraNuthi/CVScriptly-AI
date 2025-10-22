
import Link from 'next/link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Github, Linkedin, Mail, Globe } from 'lucide-react';
import { Logo } from '@/components/icons';
import Image from 'next/image';

const homepageData = {
  hero_section: {
    title: 'CVScriptly AI',
    subtitle: 'Craft ATS-Optimized Resumes with AI Precision',
    description:
      'Build your resume smarter and faster—open source, privacy-first, future-ready.',
    features: [
      'Resume Builder',
      'CV Maker',
      'ATS-Friendly',
      'AI Suggestions',
      'Professional Templates',
      'Job Winning Resumes',
      'Easy to Use',
      'Free Download',
    ],
    primary_cta: {
      text: 'Build My Resume',
      url: '/build',
    },
  },
  templates_section: {
    heading: 'Explore Modern Resume Templates',
    templates: [
      { name: 'Modern', image: 'https://static.wixstatic.com/media/17a144_a3d8f247bcd84be9829c1d40cd013958~mv2.png/v1/fill/w_480,h_480,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/17a144_a3d8f247bcd84be9829c1d40cd013958~mv2.png' },
      { name: 'Creative', image: 'https://resumeworded.com/assets/images/resume-guides/financial-data-analyst.png' },
      { name: 'Minimalist', image: 'https://tint.creativemarket.com/DxYyLbdoYlStPfJRviF1wnXx8b_wwRFc4mX3kYmXq9Q/width:1200/height:800/gravity:nowe/rt:fill-down/el:1/czM6Ly9maWxlcy5jcmVhdGl2ZW1hcmtldC5jb20vaW1hZ2VzL3NjcmVlbnNob3RzL3Byb2R1Y3RzLzIyMjQvMjIyNDAvMjIyNDAzNjgvcHJldmlldy0xLW8uanBn?1682665921' },
      { name: 'Professional', image: 'https://i.pinimg.com/736x/90/3a/ff/903aff0006453febf4c58ff057321019.jpg' },
    ],
  },
  faq_section: {
    heading: 'Frequently Asked Questions',
    questions: [
      {
        question: 'What is an ATS-compliant resume?',
        answer:
          "An ATS-compliant resume is one I've designed to be easily parsed by Applicant Tracking Systems. I ensure that CVScriptly AI templates use clean designs and standard fonts that are readable by most ATS software.",
      },
      {
        question: 'How does CVScriptly AI use AI?',
        answer:
          'I use generative AI to help you write professional summaries, create quantifiable bullet points from your job descriptions, and suggest relevant keywords to include in your resume based on a job posting.',
      },
      {
        question: 'Is my data secure?',
        answer:
          "Yes. I've built this tool to be privacy-first. Your data is stored only in your browser's session storage and is automatically deleted when you close the tab. I don't have a database, so your information never leaves your computer.",
      },
      {
        question: 'Can I export my resume to PDF/DOCX?',
        answer:
          'Currently, you can export your resume as a PDF. I am working on adding DOCX and TXT export options in a future update.',
      },
      {
        question: 'What is open-source about the project?',
        answer:
          'The entire codebase for CVScriptly AI is available on GitHub. You can view, modify, and even contribute to the project. I believe in transparency and community collaboration.',
      },
      {
        question: 'Can I import data from LinkedIn or Google?',
        answer:
          'This feature is on my roadmap. I plan to allow users to import their professional data from platforms like LinkedIn to make the resume-building process even faster.',
      },
      {
        question: 'Is CVScriptly AI really free?',
        answer:
          'Yes, CVScriptly AI is completely free to use. As an open-source project, my goal is to provide a powerful resume-building tool that is accessible to everyone.',
      },
      {
        question: 'Can I choose different resume templates?',
        answer:
          'Absolutely! I offer a selection of professionally designed, ATS-friendly templates. You can switch between them at any time to see which one best fits your style and industry.',
      },
    ],
  },
  about_developer_section: {
    heading: 'About the Developer',
    developer: {
      name: 'Rushendra Nuthi',
      bio: 'A passionate Computer Science & Cybersecurity student focused on building full-stack apps and security tools. Google Cybersecurity Certified. Loves Python, Flask, ML, and secure coding. Dedicated to developing open-source, user-centric digital solutions.',
      portfolio_url:
        'https://rushendranuthi.netlify.app/',
    },
    contact_links: [
      {
        label: 'GitHub',
        url: 'https://github.com/RushendraNuthi',
        icon: Github,
      },
      {
        label: 'LinkedIn',
        url: 'https://linkedin.com/in/rushendranuthi13',
        icon: Linkedin,
      },
      {
        label: 'Email',
        url: 'mailto:rushendra.nuthi123@gmail.com',
        icon: Mail,
      },
    ],
  },
  footer: {
    copyright: `© ${new Date().getFullYear()} CVScriptly AI. All Rights Reserved.`,
    repo_url: 'https://github.com/RushendraNuthi/CVScriptly-AI',
  },
};

export default function Home() {
  const {
    hero_section,
    templates_section,
    faq_section,
    about_developer_section,
    footer,
  } = homepageData;

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Logo className="h-8 w-8" />
            <span className="font-headline text-xl font-semibold text-primary">
              {hero_section.title}
            </span>
          </Link>
          <Button asChild>
            <Link href={hero_section.primary_cta.url}>
              {hero_section.primary_cta.text}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-32">
          <div className="container text-center">
            <h1 className="font-headline text-4xl font-extrabold tracking-tight lg:text-6xl text-primary">
              {hero_section.title}
            </h1>
            <h2 className="mt-4 font-headline text-2xl font-semibold tracking-tight md:text-3xl">
              {hero_section.subtitle}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              {hero_section.description}
            </p>
            <div className="mt-8 flex justify-center">
              <Button asChild size="lg">
                <Link href={hero_section.primary_cta.url}>
                  {hero_section.primary_cta.text}
                  <ArrowRight className="ml-2" />
                </Link>
              </Button>
            </div>
            <div className="mt-12 flex flex-wrap justify-center gap-2">
              {hero_section.features.map((feature, index) => (
                <Badge key={index} variant="secondary" className="px-3 py-1 text-sm">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>
        </section>

        {/* Templates Section */}
        <section id="templates" className="py-20 bg-muted/30">
          <div className="container">
            <h2 className="text-center font-headline text-3xl font-bold">
              {templates_section.heading}
            </h2>
            <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6">
              {templates_section.templates.map((template) => (
                <div
                  key={template.name}
                  className="group relative overflow-hidden rounded-lg border bg-card shadow-sm transition-transform duration-300 hover:scale-105"
                >
                  <Image
                    src={template.image}
                    alt={`${template.name} resume template`}
                    width={600}
                    height={800}
                    className="object-cover object-top transition-transform duration-300 group-hover:rotate-3"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-4">
                    <h3 className="font-semibold text-lg text-white">
                      {template.name}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-20">
          <div className="container max-w-4xl">
            <h2 className="text-center font-headline text-3xl font-bold">
              {faq_section.heading}
            </h2>
            <Accordion type="single" collapsible className="mt-10 w-full">
              {faq_section.questions.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left font-semibold text-lg hover:no-underline">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-base">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* About Developer Section */}
        <section id="about" className="py-20 bg-muted/30">
          <div className="container max-w-4xl text-center">
            <h2 className="font-headline text-3xl font-bold">
              {about_developer_section.heading}
            </h2>
            <div className="mt-8 rounded-lg border bg-card p-8 shadow-sm flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-4 overflow-hidden">
                <Image
                  src="https://raw.githubusercontent.com/RushendraNuthi/RushendraNuthi/main/profile.svg"
                  alt="Rushendra Nuthi"
                  width={96}
                  height={96}
                  className="object-cover"
                />
              </div>
              <h3 className="font-headline text-2xl font-semibold">
                {about_developer_section.developer.name}
              </h3>
              <p className="mt-4 text-muted-foreground">
                {about_developer_section.developer.bio}
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-4">
                {about_developer_section.contact_links.map((link) => (
                  <Button key={link.label} variant="outline" asChild>
                    <a href={link.url} target="_blank" rel="noopener noreferrer">
                      <link.icon className="mr-2 h-4 w-4" />
                      {link.label}
                    </a>
                  </Button>
                ))}
                 <Button variant="outline" asChild>
                    <a href={about_developer_section.developer.portfolio_url} target="_blank" rel="noopener noreferrer">
                      <Globe className="mr-2 h-4 w-4" />
                      Portfolio
                    </a>
                  </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="container flex flex-col sm:flex-row h-auto sm:h-20 items-center justify-between py-4 sm:py-0">
          <p className="text-sm text-muted-foreground text-center sm:text-left">
            {footer.copyright}
          </p>
          <div className="flex items-center gap-4 mt-4 sm:mt-0">
            <a href={footer.repo_url} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-2">
              <Github className="h-4 w-4" />
              <span>Source code on GitHub</span>
            </a>
            <p className="text-sm text-muted-foreground">Open contributions are welcome!</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
