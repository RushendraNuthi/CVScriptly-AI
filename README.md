# AI-Powered ATS-Optimized Resume Builder

A modern, secure, and privacy-focused resume builder that helps you create ATS (Applicant Tracking System) compliant resumes with AI-powered optimization. Generate professional resumes in PDF, DOCX, or LaTeX formats directly in your browser - no data ever leaves your device for generation.

## 🌟 Features

### Core Features
- **📄 Multiple Export Formats**: Download your resume as PDF, DOCX, or LaTeX source files
- **🤖 AI-Powered ATS Analysis**: Get real-time feedback and suggestions for ATS optimization using Google Gemini AI
- **🎨 Customizable Styling**: Full control over fonts, colors, and formatting
- **👁️ Live Preview**: Real-time preview of your resume as you edit
- **📱 Responsive Design**: Beautiful, modern UI that works on all devices
- **🔒 Privacy-First**: Resume generation happens entirely in your browser (PDF/DOCX)
- **⚡ Fast & Efficient**: Built with React and Vite for optimal performance

### Resume Sections
- **Personal Details**: Name, contact information, location, social profiles
- **Summary**: AI-generated or custom professional summary
- **Experience**: Work history with highlights and achievements
- **Education**: Academic background with GPA and coursework
- **Projects**: Showcase your projects with descriptions and tools used
- **Skills**: Organized by categories (e.g., Programming Languages, Technologies)
- **Custom Sections**: Add any additional sections you need

### Export Options
- **PDF**: High-quality PDF generation using jsPDF (client-side)
- **DOCX**: Professional Word document generation using docx.js library
- **LaTeX**: Source file export for advanced customization and version control

## 🛠️ Tech Stack

- **Frontend Framework**: React 19.2.0
- **Build Tool**: Vite 6.2.0
- **Language**: TypeScript 5.8.2
- **Styling**: Tailwind CSS (via CDN)
- **PDF Generation**: jsPDF 2.5.1
- **DOCX Generation**: docx.js 8.5.0
- **AI Integration**: Google Gemini AI (@google/genai 1.27.0)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher recommended)
- **npm** or **yarn** package manager
- **Google Gemini API Key** (for AI features)

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-powered-ats-resume-builder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
   
   > **Note**: Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:3000` (or the port shown in your terminal)

## 🏗️ Project Structure

```
ai-powered-ats-resume-builder/
├── components/           # React components
│   ├── steps/           # Form components for each resume section
│   ├── ui/              # Reusable UI components
│   ├── Homepage.tsx     # Landing page
│   ├── ResumeBuilder.tsx # Main resume builder component
│   ├── Preview.tsx      # Preview and download page
│   └── LiveResumePreview.tsx # Live resume preview component
├── services/            # External services
│   └── geminiService.ts # Google Gemini AI integration
├── utils/              # Utility functions
│   ├── pdfGenerator.ts  # PDF generation logic
│   ├── docxGenerator.ts # DOCX generation logic
│   └── latexGenerator.ts # LaTeX generation logic
├── hooks/               # Custom React hooks
│   └── useHistoryState.ts # History state management
├── types.ts             # TypeScript type definitions
├── constants.ts         # Default values and constants
├── vite.config.ts       # Vite configuration
├── tsconfig.json        # TypeScript configuration
└── index.html           # HTML entry point
```

## 📖 Usage

### Creating Your Resume

1. **Fill in Personal Details**
   - Enter your name, contact information, and social profiles

2. **Add Summary**
   - Write your own summary or use AI to generate one

3. **Add Experience**
   - List your work experience with roles, companies, dates, and achievements

4. **Add Education**
   - Include your educational background with degrees, dates, GPA, and coursework

5. **Add Projects**
   - Showcase your projects with names, descriptions, URLs, and tools used

6. **Add Skills**
   - Organize your skills by categories

7. **Add Custom Sections** (Optional)
   - Add any additional sections like certifications, publications, etc.

8. **Customize Styling**
   - Adjust fonts, sizes, and colors to match your preferences

9. **Preview & Download**
   - Review your resume with live preview
   - Get AI-powered ATS optimization feedback
   - Download in PDF, DOCX, or LaTeX format

### AI Features

- **Summary Generation**: Automatically generate a professional summary based on your experience, projects, and skills
- **ATS Analysis**: Get an optimization score and specific suggestions to improve ATS compatibility

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Your Google Gemini API key for AI features | Yes (for AI features) |

### Build Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## 🔒 Privacy & Security

- **Client-Side Generation**: PDF and DOCX files are generated entirely in your browser
- **No Server Required**: Resume data never leaves your device for file generation
- **AI API Calls**: Only AI features (summary generation, ATS analysis) require internet connection and send data to Google Gemini API
- **No Data Storage**: The application doesn't store any of your resume data

## 🐛 Troubleshooting

### PDF Generation Issues

- **Library Not Loading**: Ensure you have an active internet connection for jsPDF library
- **Font Issues**: PDF uses basic fonts (Times/Helvetica) - custom fonts may not render correctly

### DOCX Generation Issues

- **Library Not Loading**: Ensure you have an active internet connection for docx.js library
- **Download Fails**: Check browser console for errors, ensure pop-up blockers aren't interfering

### AI Features Not Working

- **API Key Missing**: Ensure `GEMINI_API_KEY` is set in `.env.local`
- **API Errors**: Check your API key is valid and has sufficient quota
- **Network Issues**: Ensure you have an active internet connection

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is private and proprietary. All rights reserved.

## 🙏 Acknowledgments

- [Google Gemini AI](https://ai.google.dev/) for AI capabilities
- [jsPDF](https://github.com/parallax/jsPDF) for PDF generation
- [docx.js](https://github.com/dolanmiu/docx) for DOCX generation
- [React](https://react.dev/) and [Vite](https://vitejs.dev/) for the amazing development experience

## 📞 Support

For issues, questions, or suggestions, please open an issue on the repository.

---

**Built with ❤️ for job seekers who want professional, ATS-optimized resumes**
