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
import { ProjectsForm } from '@/components/form/projects-form';
import { CertificationsForm } from '@/components/form/certifications-form';
import { KeywordSuggester } from '@/components/keyword-suggester';
import { ResumePreview } from '@/components/resume-preview';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

type ResumeFormProps = {
  data: ResumeData;
  onUpdate: (data: Partial<ResumeData>) => void;
};

export function ResumeForm({ data, onUpdate }: ResumeFormProps) {
  return (
    <section>
      <Tabs defaultValue="personal" className="w-full">
        <ScrollArea className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="certifications">Certs</TabsTrigger>
            <TabsTrigger value="tools">Tools</TabsTrigger>
            <TabsTrigger value="preview" className="lg:hidden">Preview</TabsTrigger>
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

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
          <TabsContent value="projects">
            <ProjectsForm data={data} onUpdate={onUpdate} />
          </TabsContent>
          <TabsContent value="certifications">
            <CertificationsForm data={data} onUpdate={onUpdate} />
          </TabsContent>
          <TabsContent value="tools">
            <KeywordSuggester />
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
