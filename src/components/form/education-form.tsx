'use client';

import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { ResumeData } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2 } from 'lucide-react';

const educationSchema = z.object({
  education: z.array(
    z.object({
      id: z.string(),
      institution: z.string().min(1, 'Institution is required'),
      degree: z.string().min(1, 'Degree is required'),
      fieldOfStudy: z.string().optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      gpa: z.string().optional(),
    })
  ),
});

type EducationFormProps = {
  data: ResumeData;
  onUpdate: (data: Partial<ResumeData>) => void;
};

export function EducationForm({ data, onUpdate }: EducationFormProps) {
  const form = useForm<z.infer<typeof educationSchema>>({
    resolver: zodResolver(educationSchema),
    defaultValues: { education: data.education },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'education',
  });

  const handleUpdate = () => {
    const values = form.getValues();
    onUpdate({ education: values.education });
  };

  return (
    <div className="space-y-6">
      {fields.map((field, index) => (
        <div key={field.id} className="p-4 border rounded-lg bg-card relative group">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"
            onClick={() => {
              remove(index);
              handleUpdate();
            }}
          >
            <Trash2 size={16} />
          </Button>

          <div className="space-y-4">
            <Controller
              control={form.control}
              name={`education.${index}.institution`}
              render={({ field, fieldState }) => (
                <div className="space-y-1">
                  <label className="text-sm font-medium">Institution</label>
                  <Input placeholder="State University" {...field} onBlur={handleUpdate} />
                  {fieldState.error && <p className="text-sm text-destructive">{fieldState.error.message}</p>}
                </div>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                control={form.control}
                name={`education.${index}.degree`}
                render={({ field, fieldState }) => (
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Degree</label>
                    <Input placeholder="Bachelor of Science" {...field} onBlur={handleUpdate} />
                    {fieldState.error && <p className="text-sm text-destructive">{fieldState.error.message}</p>}
                  </div>
                )}
              />
              <Controller
                control={form.control}
                name={`education.${index}.fieldOfStudy`}
                render={({ field }) => (
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Field of Study</label>
                    <Input placeholder="Computer Science" {...field} onBlur={handleUpdate} />
                  </div>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Controller
                control={form.control}
                name={`education.${index}.startDate`}
                render={({ field }) => (
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Start Date</label>
                    <Input placeholder="Aug 2016" {...field} onBlur={handleUpdate} />
                  </div>
                )}
              />
              <Controller
                control={form.control}
                name={`education.${index}.endDate`}
                render={({ field }) => (
                  <div className="space-y-1">
                    <label className="text-sm font-medium">End Date</label>
                    <Input placeholder="May 2020" {...field} onBlur={handleUpdate} />
                  </div>
                )}
              />
              <Controller
                control={form.control}
                name={`education.${index}.gpa`}
                render={({ field }) => (
                  <div className="space-y-1">
                    <label className="text-sm font-medium">GPA</label>
                    <Input placeholder="3.8/4.0" {...field} onBlur={handleUpdate} />
                  </div>
                )}
              />
            </div>
          </div>
        </div>
      ))}
      <Button
        variant="outline"
        onClick={() => {
          append({ id: crypto.randomUUID(), institution: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '', gpa: '' });
        }}
      >
        <PlusCircle className="mr-2" />
        Add Education
      </Button>
    </div>
  );
}
