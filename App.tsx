
import React, { useState } from 'react';
import Homepage from './components/Homepage';
import ResumeBuilder from './components/ResumeBuilder';
import Preview from './components/Preview';
import type { ResumeData } from './types';
import { initialResumeData } from './constants';

type AppView = 'homepage' | 'builder' | 'preview';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('homepage');
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);

  const startBuilding = () => {
    setView('builder');
  };

  const showPreview = (data: ResumeData) => {
    setResumeData(data);
    setView('preview');
  };

  const editAgain = () => {
    setView('builder');
  };

  const startOver = () => {
    setResumeData(initialResumeData);
    setView('homepage');
  }

  const renderView = () => {
    switch (view) {
      case 'homepage':
        return <Homepage onStartBuilding={startBuilding} />;
      case 'builder':
        return <ResumeBuilder initialData={resumeData} onPreview={showPreview} />;
      case 'preview':
        return <Preview resumeData={resumeData} onEdit={editAgain} onStartOver={startOver} />;
      default:
        return <Homepage onStartBuilding={startBuilding} />;
    }
  };

  return (
    <main className="min-h-screen font-sans antialiased">
      {renderView()}
    </main>
  );
};

export default App;
