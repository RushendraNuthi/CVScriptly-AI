'use client';
import { useState } from 'react';
import type { ResumeData } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

type SkillsFormProps = {
  data: ResumeData;
  onUpdate: (data: Partial<ResumeData>) => void;
};

export function SkillsForm({ data, onUpdate }: SkillsFormProps) {
  const [currentSkill, setCurrentSkill] = useState('');

  const handleAddSkill = () => {
    if (currentSkill && !data.skills.includes(currentSkill)) {
      const newSkills = [...data.skills, currentSkill];
      onUpdate({ skills: newSkills });
      setCurrentSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const newSkills = data.skills.filter((skill) => skill !== skillToRemove);
    onUpdate({ skills: newSkills });
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="skill-input" className="text-sm font-medium">
          Add Skills
        </label>
        <div className="flex gap-2 mt-1">
          <Input
            id="skill-input"
            value={currentSkill}
            onChange={(e) => setCurrentSkill(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddSkill();
              }
            }}
            placeholder="e.g., JavaScript"
          />
          <Button onClick={handleAddSkill}>Add</Button>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 p-4 border rounded-lg bg-card min-h-[6rem]">
        {data.skills.map((skill, index) => (
          <Badge key={index} variant="secondary" className="text-base py-1 pl-3 pr-2">
            {skill}
            <button
              onClick={() => handleRemoveSkill(skill)}
              className="ml-2 rounded-full hover:bg-muted-foreground/20 p-0.5"
            >
              <X size={14} />
            </button>
          </Badge>
        ))}
        {data.skills.length === 0 && (
          <p className="text-sm text-muted-foreground self-center mx-auto">
            Your skills will appear here.
          </p>
        )}
      </div>
    </div>
  );
}
