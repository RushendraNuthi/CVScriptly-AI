import React, { useState, useEffect } from 'react';

interface HomepageProps {
  onStartBuilding: () => void;
}

const Homepage: React.FC<HomepageProps> = ({ onStartBuilding }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = (
    <>
        <a href="#features" onClick={() => setIsMenuOpen(false)} className="hover:text-primary-500">Features</a>
        <a href="#about" onClick={() => setIsMenuOpen(false)} className="hover:text-primary-500">About</a>
        <a href="#faq" onClick={() => setIsMenuOpen(false)} className="hover:text-primary-500">FAQ</a>
    </>
  );

  return (
    <div className="bg-neutral-50 text-neutral-900">
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled || isMenuOpen ? 'bg-white/80 backdrop-blur-sm shadow-md' : 'bg-transparent'}`}>
        <div className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-primary-500">
            CVScriptly-AI
          </div>
          <nav className="hidden md:flex items-center space-x-8 text-neutral-700">
            {navLinks}
          </nav>
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={onStartBuilding}
              className="px-6 py-2 bg-primary-500 text-white font-semibold rounded-lg hover:bg-primary-600 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Get Started
            </button>
          </div>
          <div className="md:hidden">
             <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}></path></svg>
             </button>
          </div>
        </div>
        {/* Mobile Menu */}
        {isMenuOpen && (
            <div className="md:hidden">
                <nav className="container mx-auto px-4 sm:px-6 py-4 flex flex-col space-y-4 text-neutral-700">
                   {navLinks}
                    <button
                        onClick={onStartBuilding}
                        className="w-full px-6 py-2 bg-primary-500 text-white font-semibold rounded-lg hover:bg-primary-600 transition-colors duration-300 shadow-lg"
                    >
                        Get Started
                    </button>
                </nav>
            </div>
        )}
      </header>

      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
              Land your dream job with the <span className="text-primary-500">perfect resume</span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-neutral-700">
              Create a professional, ATS-friendly resume in minutes. Our AI-powered platform helps you craft a standout resume that gets noticed.
            </p>
            <button
              onClick={onStartBuilding}
              className="mt-8 px-8 py-4 bg-primary-500 text-white font-bold text-lg rounded-full hover:bg-primary-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Create My Resume
            </button>
            <p className="mt-4 text-sm text-neutral-600">
              Join 2,500+ users who landed their dream job. Free, no sign-up required.
            </p>
          </div>
        </section>
        
        {/* Features Section */}
        <section id="features" className="py-16 sm:py-20 bg-neutral-50">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold">Why choose CVScriptly-AI?</h2>
              <p className="mt-4 text-lg text-neutral-700">Our platform is packed with features to help you create a winning resume.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<SparklesIcon />}
                title="AI-Powered Content"
                description="Get AI suggestions for summaries and bullet points that highlight your skills and achievements."
              />
              <FeatureCard 
                icon={<DocumentTextIcon />}
                title="ATS-Optimized Templates"
                description="Choose from a variety of templates designed to pass through applicant tracking systems."
              />
              <FeatureCard 
                icon={<EyeIcon />}
                title="Real-time Preview"
                description="See your changes instantly as you make them, ensuring your resume looks perfect."
              />
              <FeatureCard 
                icon={<PencilAltIcon />}
                title="Customizable Designs"
                description="Easily change fonts, colors, and layouts to match your personal brand."
              />
               <FeatureCard 
                icon={<DownloadIcon />}
                title="Instant PDF Download"
                description="Export your resume as a professional, high-quality PDF ready for job applications."
              />
              <FeatureCard 
                icon={<LockClosedIcon />}
                title="Secure & Private"
                description="Your data is yours. We respect your privacy and don't store your personal information."
              />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6">
             <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold">Create your resume in 3 simple steps</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              <StepCard number="1" title="Choose a Template" description="Select a professional, ATS-friendly template that fits your style and industry." />
              <StepCard number="2" title="Fill in Your Details" description="Use our intuitive editor and AI assistant to add your experience, skills, and projects." />
              <StepCard number="3" title="Download Your Resume" description="Preview your final resume and download it as a high-quality PDF in one click." />
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section id="faq" className="py-16 sm:py-20 bg-white">
            <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
                 <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold">Frequently Asked Questions</h2>
                </div>
                <FAQ />
            </div>
        </section>
        
        {/* About the Developer Section */}
        <section id="about" className="py-16 sm:py-20 bg-neutral-50">
            <div className="container mx-auto px-4 sm:px-6 max-w-4xl text-center">
                 <h2 className="text-3xl md:text-4xl font-bold">About the Developer</h2>
                 <div className="mt-12 bg-white p-8 rounded-2xl shadow-lg inline-block max-w-2xl mx-auto text-center">
                    <img 
                        src="profile.svg" 
                        alt="Profile picture of the developer"
                        className="w-24 h-24 rounded-full mx-auto mb-6 border-4 border-primary-100 shadow-md"
                    />
                    <h3 className="text-2xl font-bold text-neutral-900">Rushendra Nuthi</h3>
                    <p className="mt-4 text-neutral-700">
                        A passionate Computer Science & Cybersecurity student focused on building full-stack apps and security tools. Google Cybersecurity Certified. Loves Python, Flask, ML, and secure coding. Dedicated to developing open-source, user-centric digital solutions.
                    </p>
                    <a 
                        href="https://rushendranuthi.netlify.app/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-6 font-semibold text-primary-500 hover:text-primary-600 transition-colors"
                    >
                       View Portfolio &rarr;
                    </a>
                    <div className="mt-6 flex justify-center space-x-6">
                        <a href="https://github.com/RushendraNuthi" aria-label="GitHub" target="_blank" rel="noopener noreferrer" className="text-neutral-500 hover:text-primary-500"><GitHubIcon /></a>
                        <a href="https://linkedin.com/in/rushendranuthi13" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer" className="text-neutral-500 hover:text-primary-500"><LinkedInIcon /></a>
                        <a href="mailto:rushendra.nuthi123@gmail.com" aria-label="Email" className="text-neutral-500 hover:text-primary-500"><MailIcon /></a>
                    </div>
                 </div>
            </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-20 bg-white">
            <div className="container mx-auto px-4 sm:px-6 text-center">
                 <h2 className="text-3xl md:text-4xl font-bold text-neutral-900">Ready to land your dream job?</h2>
                 <p className="mt-4 text-lg text-neutral-700 max-w-2xl mx-auto">
                    Create your professional resume today and get one step closer to your career goals.
                 </p>
                 <button
                    onClick={onStartBuilding}
                    className="mt-8 px-8 py-4 bg-primary-500 text-white font-bold text-lg rounded-full hover:bg-primary-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                    Get Started For Free
                </button>
            </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white text-neutral-700">
        <div className="container mx-auto px-6 py-8 border-t border-neutral-200">
            <div className="flex flex-col sm:flex-row justify-between items-center text-center sm:text-left">
                <p className="text-sm text-neutral-600 mb-4 sm:mb-0">
                    &copy; {new Date().getFullYear()} CVScriptly-AI. All Rights Reserved.
                </p>
                <a 
                    href="https://github.com/RushendraNuthi/CVScriptly-AI" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    aria-label="GitHub Repository" 
                    className="text-neutral-500 hover:text-primary-500 transition-colors"
                >
                    <GitHubIcon />
                </a>
            </div>
        </div>
      </footer>
    </div>
  );
};

// Fix: Correctly type the `icon` prop to allow passing `className` via `React.cloneElement`.
const FeatureCard: React.FC<{ title: string; description: string; icon: React.ReactElement<{ className?: string }> }> = ({ title, description, icon }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1">
    <div className="text-primary-500 mb-4">{React.cloneElement(icon, { className: "h-10 w-10" })}</div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-neutral-700">{description}</p>
  </div>
);

const StepCard: React.FC<{ number: string; title: string; description: string }> = ({ number, title, description }) => (
  <div className="flex flex-col items-center">
    <div className="w-16 h-16 flex items-center justify-center bg-primary-100 text-primary-700 rounded-full font-bold text-2xl mb-4">
      {number}
    </div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-neutral-700 max-w-xs">{description}</p>
  </div>
);

const FAQ: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const faqs = [
      {
        question: 'What is an ATS-compliant resume?',
        answer:
          "An ATS-compliant resume is one I've designed to be easily parsed by Applicant Tracking Systems. I ensure that CVScriptly-AI templates use clean designs and standard fonts that are readable by most ATS software.",
      },
      {
        question: 'How does CVScriptly-AI use AI?',
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
          'The entire codebase for CVScriptly-AI is available on GitHub. You can view, modify, and even contribute to the project. I believe in transparency and community collaboration.',
      },
      {
        question: 'Can I import data from LinkedIn or Google?',
        answer:
          'This feature is on my roadmap. I plan to allow users to import their professional data from platforms like LinkedIn to make the resume-building process even faster.',
      },
      {
        question: 'Is CVScriptly-AI really free?',
        answer:
          'Yes, CVScriptly-AI is completely free to use. As an open-source project, my goal is to provide a powerful resume-building tool that is accessible to everyone.',
      },
      {
        question: 'Can I choose different resume templates?',
        answer:
          'Absolutely! I offer a selection of professionally designed, ATS-friendly templates. You can switch between them at any time to see which one best fits your style and industry.',
      },
    ];

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="space-y-4">
            {faqs.map((faq, index) => (
                <div key={index} className="border-b border-neutral-300 pb-4">
                    <button onClick={() => toggleFAQ(index)} className="w-full flex justify-between items-center text-left text-lg font-semibold">
                        <span>{faq.question}</span>
                        <ChevronDownIcon className={`w-6 h-6 transform transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`} />
                    </button>
                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-96 mt-4' : 'max-h-0'}`}>
                         <p className="text-neutral-700">{faq.answer}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};


// Icons
const SparklesIcon: React.FC<{className?: string}> = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293a1 1 0 010 1.414L10 12l-2.293 2.293a1 1 0 01-1.414 0L4 12l2.293-2.293a1 1 0 011.414 0L10 12zm11 0l2.293 2.293a1 1 0 010 1.414L18 12l-2.293 2.293a1 1 0 01-1.414 0L12 12l2.293-2.293a1 1 0 011.414 0L18 12z" />
  </svg>
);
const DocumentTextIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);
const EyeIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);
const PencilAltIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
);
const DownloadIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);
const LockClosedIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
);
const ChevronDownIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
);
const LinkedInIcon: React.FC = () => (
     <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/>
    </svg>
);
const GitHubIcon: React.FC = () => (
    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>
);

const MailIcon: React.FC = () => (
    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
    </svg>
);


export default Homepage;