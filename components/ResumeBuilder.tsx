import React, { useState, useEffect } from 'react';
import type { ResumeData } from '../types';
import PersonalDetailsForm from './steps/PersonalDetailsForm';
import SummaryForm from './steps/SummaryForm';
import ExperienceForm from './steps/ExperienceForm';
import EducationForm from './steps/EducationForm';
import ProjectsForm from './steps/ProjectsForm';
import CustomSectionsForm from './steps/CustomSectionsForm';
import SkillsForm from './steps/SkillsForm';
import StylingForm from './steps/StylingForm';
import ProgressBar from './ui/ProgressBar';
import LiveResumePreview from './LiveResumePreview';
import { useHistoryState } from '../hooks/useHistoryState';

interface ResumeBuilderProps {
  initialData: ResumeData;
  onPreview: (data: ResumeData) => void;
}

const ResumeBuilder: React.FC<ResumeBuilderProps> = ({ initialData, onPreview }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const { 
    state: resumeData, 
    setState: setResumeData, 
    undo, 
    redo, 
    canUndo, 
    canRedo 
  } = useHistoryState<ResumeData>(initialData);
  const [steps, setSteps] = useState<Array<{ id: number; name: string; key: string }>>([]);
  
  useEffect(() => {
    const sectionMap: { [key: string]: string } = {
        experience: 'Experience',
        education: 'Education',
        projects: 'Projects',
        customSections: 'Add Sections',
        skills: 'Skills',
    };

    const dynamicSteps = resumeData.sectionOrder.map(key => ({
        key,
        name: sectionMap[key],
    }));

    const newSteps = [
        { key: 'personalDetails', name: 'Personal Details' },
        { key: 'summary', name: 'Summary' },
        ...dynamicSteps,
        { key: 'styling', name: 'Styling' }
    ].map((step, index) => ({ ...step, id: index + 1 }));
    
    setSteps(newSteps);
  }, [resumeData.sectionOrder]);

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      onPreview(resumeData);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const updateData = <K extends keyof ResumeData>(key: K, value: ResumeData[K]) => {
    setResumeData(prev => ({ ...prev, [key]: value }));
  };

  const handleReorder = (newSectionOrder: string[]) => {
    updateData('sectionOrder', newSectionOrder);
  };

  const renderStep = () => {
    if (!steps.length) return null;
    const currentStepKey = steps[currentStep - 1]?.key;

    switch (currentStepKey) {
      case 'personalDetails':
        return <PersonalDetailsForm data={resumeData.personalDetails} updateData={(val) => updateData('personalDetails', val)} />;
      case 'summary':
        return <SummaryForm data={resumeData} updateData={(val) => updateData('summary', val)} />;
      case 'experience':
        return <ExperienceForm data={resumeData.experience} updateData={(val) => updateData('experience', val)} />;
      case 'education':
        return <EducationForm data={resumeData.education} updateData={(val) => updateData('education', val)} />;
      case 'projects':
        return <ProjectsForm data={resumeData.projects} updateData={(val) => updateData('projects', val)} />;
      case 'customSections':
        return <CustomSectionsForm data={resumeData.customSections} updateData={(val) => updateData('customSections', val)} />;
      case 'skills':
        return <SkillsForm data={resumeData.skills} updateData={(val) => updateData('skills', val)} />;
      case 'styling':
        return <StylingForm data={resumeData.styling} updateData={(val) => updateData('styling', val)} />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 p-4 md:p-8">
      {/* Left Column: Form */}
      <div className="lg:col-span-1">
        <ProgressBar steps={steps} currentStep={currentStep} onStepClick={setCurrentStep} onReorder={handleReorder} />
        
        <div className="mt-8 bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="p-6 sm:p-10">
            {renderStep()}
          </div>
          <div className="bg-neutral-50 px-6 sm:px-10 py-4 flex justify-between items-center">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className="px-6 py-2 text-sm font-semibold text-neutral-700 bg-transparent rounded-md hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Back
            </button>

            <div className="flex items-center space-x-2">
                <button
                    onClick={undo}
                    disabled={!canUndo}
                    className="p-2 text-neutral-600 rounded-full hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Undo change"
                    title="Undo"
                >
                    <UndoIcon />
                </button>
                <button
                    onClick={redo}
                    disabled={!canRedo}
                    className="p-2 text-neutral-600 rounded-full hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Redo change"
                    title="Redo"
                >
                    <RedoIcon />
                </button>
            </div>

            <button
              onClick={handleNext}
              className="px-6 py-2 text-sm font-semibold text-white bg-primary-500 rounded-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all"
            >
              {currentStep === steps.length ? 'Preview & Analyze' : 'Next Step'}
            </button>
          </div>
        </div>
      </div>

      {/* Right Column: Live Preview */}
      <div className="lg:col-span-1 hidden lg:block">
         <div className="sticky top-8">
            <LiveResumePreview resumeData={resumeData} />
         </div>
      </div>
    </div>
  );
};

const UndoIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v1M3 10L7 6m-4 4l4 4" />
    </svg>
);

const RedoIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10H11a8 8 0 00-8 8v1M21 10l-4-4m4 4l-4 4" />
    </svg>
);


export default ResumeBuilder;