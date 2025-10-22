'use client';

import type { ResumeData } from '@/lib/types';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { PersonalInfoForm } from '@/components/form/personal-info-form';
import { SummaryForm } from '@/components/form/summary-form';
import { ExperienceForm } from '@/components/form/experience-form';
import { EducationForm } from '@/components/form/education-form';
import { SkillsForm } from '@/components/form/skills-form';
import { KeywordSuggester } from '@/components/keyword-suggester';

type ResumeFormProps = {
  data: ResumeData;
  onUpdate: (data: Partial<ResumeData>) => void;
};

export function ResumeForm({ data, onUpdate }: ResumeFormProps) {
  return (
    <section>
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 mb-4 h-auto">
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="tools">Tools</TabsTrigger>
        </TabsList>

        <div className="p-0.5">
          <TabsContent value="personal">
            <PersonalInfoForm data={data} onUpdate={onUpdate} />
          </TabsContent>
          <TabsContent value="summary">
            <SummaryForm data={data} onUpdate={onUpdate} />
          </TabsContent>
          <TabsContent value="experience">
            <ExperienceForm data={data} onUpdate={onUpdate} />
          </TabsContent>
          <TabsContent value="education">
            <EducationForm data={data} onUpdate={onUpdate} />
          </TabsContent>
          <TabsContent value="skills">
            <SkillsForm data={data} onUpdate={onUpdate} />
          </TabsContent>
          <TabsContent value="tools">
            <KeywordSuggester />
          </TabsContent>
        </div>
      </Tabs>
    </section>
  );
}
