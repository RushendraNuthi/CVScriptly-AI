# CVScriptly AI

![CVScriptly AI Screenshot](https://raw.githubusercontent.com/RushendraNuthi/CVScriptly-AI/main/public/og-image.png)

CVScriptly AI is an open-source, privacy-first resume builder that leverages generative AI to help you create professional, ATS-friendly resumes with ease. This tool is designed for job seekers who want to craft a compelling resume smarter and faster, without compromising on privacy.

The project is live at: [cvscriptly.com](https://cvscriptly.com/)

## ✨ Features

- **Intuitive Resume Builder**: A clean, user-friendly interface to add and edit your personal info, professional summary, work experience, education, skills, projects, and certifications.
- **AI-Powered Content**:
    - **Professional Summary Generator**: Get a compelling summary tailored to your career stage and experience.
    - **Quantifiable Bullet Points**: Transform your job descriptions into impactful, metric-driven bullet points that grab attention.
    - **ATS Keyword Suggester**: Extract relevant keywords from a job description to optimize your resume for Applicant Tracking Systems.
- **Professional Templates**: Choose from a selection of modern, professionally designed, and ATS-compliant resume templates.
- **Real-Time Preview**: See your resume update live as you type.
- **Privacy-First**: Your data is stored exclusively in your browser's session storage and is never sent to a server or database. It's deleted when you close the tab.
- **PDF Export**: Download your finished resume as a pixel-perfect PDF.
- **Open Source**: The entire codebase is available on GitHub. Contributions are welcome!

## 🚀 Getting Started

To run the project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/RushendraNuthi/CVScriptly-AI.git
    cd CVScriptly-AI
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project and add your Google AI (Gemini) API key. You can get one from [Google AI Studio](https://aistudio.google.com/app/apikey).
    ```
    GEMINI_API_KEY=your_api_key_here
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  **Run the Genkit developer server (in a separate terminal):**
    This enables the AI-powered features.
    ```bash
    npm run genkit:watch
    ```

The application will be available at `http://localhost:9002`.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **AI**: [Google's Genkit](https://firebase.google.com/docs/genkit) with the Gemini model
- **UI**: [React](https://reactjs.org/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS](https://tailwindcss.com/)
- **Components**: [ShadCN/UI](https://ui.shadcn.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Form Management**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) for validation

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

Don't forget to give the project a star! Thanks again!

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.
