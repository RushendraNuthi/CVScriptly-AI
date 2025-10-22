'use client';
import { useState } from 'react';
import type { ResumeData } from '@/lib/types';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PersonalInfoForm } from '@/components/form/personal-info-form';
import { SummaryForm } from '@/components/form/summary-form';
import { ExperienceForm } from '@/components/form/experience-form';
import { EducationForm } from '@/components/form/education-form';
import { SkillsForm } from '@/components/form/skills-form';
import { ProjectsForm } from '@/components/form/projects-form';
import { CertificationsForm } from '@/components/form/certifications-form';
import { KeywordSuggester } from '@/components/keyword-suggester';
import { ResumePreview } from '@/components/resume-preview';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { DesignForm } from './form/design-form';

type ResumeFormProps = {
  data: ResumeData;
  onUpdate: (data: Partial<ResumeData>) => void;
};

const formTabs = [
  'personal',
  'summary',
  'experience',
  'education',
  'skills',
  'projects',
  'certifications',
  'design',
  'tools',
];

export function ResumeForm({ data, onUpdate }: ResumeFormProps) {
  const [currentTab, setCurrentTab] = useState(formTabs[0]);

  const navigate = (direction: 'next' | 'prev') => {
    const currentIndex = formTabs.indexOf(currentTab);
    let nextIndex;
    if (direction === 'next') {
      nextIndex = currentIndex < formTabs.length - 1 ? currentIndex + 1 : currentIndex;
    } else {
      nextIndex = currentIndex > 0 ? currentIndex - 1 : currentIndex;
    }
    setCurrentTab(formTabs[nextIndex]);
  };
  
  const NavButtons = ({ sectionName }: { sectionName: string}) => {
    const currentIndex = formTabs.indexOf(sectionName);
    return (
       <div className="mt-8 flex justify-between">
        <Button
          variant="outline"
          onClick={() => navigate('prev')}
          disabled={currentIndex === 0}
        >
          <ChevronLeft />
          Previous
        </Button>
        <Button
          variant="outline"
          onClick={() => navigate('next')}
          disabled={currentIndex === formTabs.length - 1}
        >
          Next
          <ChevronRight />
        </Button>
      </div>
    );
  }

  return (
    <section>
      <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
        <ScrollArea className="w-full">
          <TabsList className="mb-4">
            {formTabs.map(tab => (
              <TabsTrigger key={tab} value={tab}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</TabsTrigger>
            ))}
            <TabsTrigger value="preview" className="lg:hidden">Preview</TabsTrigger>
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <div className="p-0.5">
          <TabsContent value="personal">
            <PersonalInfoForm data={data} onUpdate={onUpdate} />
            <NavButtons sectionName="personal" />
          </TabsContent>
          <TabsContent value="summary">
            <SummaryForm data={data} onUpdate={onUpdate} />
            <NavButtons sectionName="summary" />
          </TabsContent>
          <TabsContent value="experience">
            <ExperienceForm data={data} onUpdate={onUpdate} />
            <NavButtons sectionName="experience" />
          </TabsContent>
          <TabsContent value="education">
            <EducationForm data={data} onUpdate={onUpdate} />
            <NavButtons sectionName="education" />
          </TabsContent>
          <TabsContent value="skills">
            <SkillsForm data={data} onUpdate={onUpdate} />
            <NavButtons sectionName="skills" />
          </TabsContent>
          <TabsContent value="projects">
            <ProjectsForm data={data} onUpdate={onUpdate} />
            <NavButtons sectionName="projects" />
          </TabsContent>
          <TabsContent value="certifications">
            <CertificationsForm data={data} onUpdate={onUpdate} />
            <NavButtons sectionName="certifications" />
          </TabsContent>
          <TabsContent value="design">
            <DesignForm data={data} onUpdate={onUpdate} />
            <NavButtons sectionName="design" />
          </TabsContent>
          <TabsContent value="tools">
            <KeywordSuggester />
            <NavButtons sectionName="tools" />
          </TabsContent>
           <TabsContent value="preview" className="lg:hidden">
            <div className="bg-card rounded-lg shadow-sm">
              <ResumePreview data={data} isMobilePreview />
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </section>
  );
}
