# CVScriptly-AI: AI-Powered ATS Resume Builder

<div align="center">
<img width="600" height="238" alt="CVScriptly-AI Logo" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Netlify Status](https://api.netlify.com/api/v1/badges/your-badge-id/deploy-status)](https://app.netlify.com)

**Create professional, ATS-compliant resumes in minutes** with AI assistance. Export to PDF, DOCX, or LaTeX formats. Built with React, TypeScript, and powered by Google Gemini AI.

## ✨ Features

### 🤖 AI-Powered Content Generation
- **Smart Summary Suggestions**: Get AI-generated professional summaries based on your experience
- **ATS Optimization Analysis**: Receive AI feedback and scoring for your resume's ATS compatibility
- **Keyword Recommendations**: AI suggests relevant keywords tailored to job descriptions

### 📄 Multiple Export Formats
- **PDF Export**: High-quality, print-ready PDFs generated client-side with jsPDF
- **DOCX Export**: Professional Word documents perfect for further customization
- **LaTeX Export**: Download .tex source files for advanced LaTeX users
- **Real-time Preview**: See your changes instantly before downloading

### 🎨 Customizable Design
- **Theme Presets**: Choose from Default, Modern Sans, or Classic Serif themes
- **Custom Styling**: Adjust fonts, sizes, colors, and line spacing
- **Section Reordering**: Drag and drop to arrange sections how you want

### 🔒 Privacy-First
- **Client-Side Processing**: All resume generation happens in your browser
- **No Data Storage**: Your information never leaves your computer
- **Secure**: No tracking, no databases, no sharing

### 🎯 ATS-Optimized
- **ATS-Friendly Templates**: Designed to pass through Applicant Tracking Systems
- **Clean Structure**: Properly formatted sections and headings
- **Standard Fonts**: Using system fonts that ATS can easily parse

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Google Gemini API Key** (for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/RushendraNuthi/CVScriptly-AI.git
   cd CVScriptly-AI
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:3000`

## 🏗️ Project Structure

```
cvscriptly-ai/
├── components/           # React components
│   ├── Homepage.tsx     # Landing page
│   ├── ResumeBuilder.tsx # Main builder interface
│   ├── Preview.tsx      # Preview and download
│   ├── steps/           # Form components for each section
│   └── ui/              # Reusable UI components
├── hooks/               # Custom React hooks
├── services/            # External service integrations
│   └── geminiService.ts # AI integration
├── utils/               # Utility functions
│   ├── pdfGenerator.ts  # PDF generation
│   ├── docxGenerator.ts # DOCX generation
│   └── latexGenerator.ts # LaTeX generation
├── types.ts             # TypeScript type definitions
├── constants.ts         # App constants and presets
├── netlify/
│   └── functions/       # Netlify serverless functions
│       └── gemini-proxy.ts # API proxy for AI
└── index.html           # Entry HTML file
```

## 🔧 Technology Stack

- **Frontend Framework**: React 19 with TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **PDF Generation**: jsPDF
- **DOCX Generation**: docx.js
- **AI Integration**: Google Gemini API (via Netlify Functions)
- **Hosting**: Netlify
- **Version Control**: Git

## 📖 Usage Guide

### Creating Your Resume

1. **Start Building**: Click "Create My Resume" or "Get Started"
2. **Fill Personal Details**: Add your name, contact info, and links
3. **Add Sections**: Fill in Experience, Education, Projects, Skills, etc.
4. **Get AI Help**: Use the AI assistant to generate summaries and optimize content
5. **Customize Style**: Choose a theme or customize fonts and colors
6. **Preview**: Review your resume in real-time
7. **Download**: Export as PDF, DOCX, or LaTeX

### Using AI Features

#### Generate Summary
- Navigate to the Summary section
- Click "Generate with AI"
- Review and customize the AI-generated summary

#### Analyze Resume
- Go to Preview page
- AI automatically analyzes your resume
- View your ATS optimization score
- Read suggestions for improvement

## 🚀 Deployment

### Deploy to Netlify

The project is configured for easy deployment on Netlify:

1. **Push to GitHub**: Ensure your code is in a GitHub repository
2. **Connect to Netlify**: 
   - Go to [Netlify](https://app.netlify.com)
   - Click "New site from Git"
   - Select your repository
3. **Configure Build**:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. **Set Environment Variables**:
   - Add `GEMINI_API_KEY` in site settings
5. **Deploy**: Netlify will automatically build and deploy

### Manual Deployment

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔐 Security Considerations

- **API Keys**: Never commit API keys to version control
- **Environment Variables**: Use `.env.local` for local development
- **HTTPS**: Always use HTTPS in production
- **Content Security Policy**: Configure CSP headers on Netlify
- **Input Validation**: All user inputs are sanitized client-side

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Contribution Guidelines

- Follow TypeScript best practices
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed
- Follow the existing code style

## 📝 Roadmap

- [ ] Multi-language support
- [ ] LinkedIn profile import
- [ ] Resume templates marketplace
- [ ] Collaborative editing
- [ ] Resume analytics dashboard
- [ ] Mobile app version
- [ ] Browser extension
- [ ] Resume version history

## 🐛 Troubleshooting

### Common Issues

**Issue**: PDF generation fails
- **Solution**: Ensure jsPDF library is loaded from CDN

**Issue**: AI features not working
- **Solution**: Verify GEMINI_API_KEY is correctly set in environment variables

**Issue**: DOCX download doesn't work
- **Solution**: Check if docx.js library loaded successfully from CDN

**Issue**: Build fails on Netlify
- **Solution**: Ensure all dependencies are in `package.json` and build command is correct

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Rushendra Nuthi**

- Portfolio: [rushendranuthi.netlify.app](https://rushendranuthi.netlify.app)
- GitHub: [@RushendraNuthi](https://github.com/RushendraNuthi)
- LinkedIn: [rushendranuthi13](https://linkedin.com/in/rushendranuthi13)
- Email: rushendra.nuthi123@gmail.com

## 🙏 Acknowledgments

- Google Gemini AI for powering the AI features
- jsPDF and docx.js communities for excellent libraries
- Netlify for seamless hosting and serverless functions
- React and Tailwind CSS teams for amazing frameworks
- All contributors and users who have supported this project

## 📊 Project Statistics

- **Total Commits**: See GitHub insights
- **Contributors**: See GitHub contributors
- **Stars**: Help us reach 100 stars! ⭐
- **Forks**: Clone and customize for your needs

---

<div align="center">
Made with ❤️ by Rushendra Nuthi

⭐ Star this repo if you find it helpful!

[Report Bug](https://github.com/RushendraNuthi/CVScriptly-AI/issues) · [Request Feature](https://github.com/RushendraNuthi/CVScriptly-AI/issues) · [Documentation](https://github.com/RushendraNuthi/CVScriptly-AI/wiki)
</div>
