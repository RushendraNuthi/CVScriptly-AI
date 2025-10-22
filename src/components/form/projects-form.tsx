'use client';

import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { ResumeData } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2 } from 'lucide-react';

const projectsSchema = z.object({
  projects: z.array(
    z.object({
      id: z.string(),
      name: z.string().min(1, 'Project name is required'),
      description: z.string().optional(),
      url: z.string().url('Invalid URL').optional().or(z.literal('')),
      bulletPoints: z.array(z.string()),
    })
  ),
});

type ProjectsFormProps = {
  data: ResumeData;
  onUpdate: (data: Partial<ResumeData>) => void;
};

export function ProjectsForm({ data, onUpdate }: ProjectsFormProps) {
  const form = useForm<z.infer<typeof projectsSchema>>({
    resolver: zodResolver(projectsSchema),
    defaultValues: { projects: data.projects || [] },
  });

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: 'projects',
  });

  const handleUpdate = () => {
    const values = form.getValues();
    onUpdate({ projects: values.projects });
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                control={form.control}
                name={`projects.${index}.name`}
                render={({ field, fieldState }) => (
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Project Name</label>
                    <Input placeholder="My Awesome Project" {...field} onBlur={handleUpdate} />
                    {fieldState.error && <p className="text-sm text-destructive">{fieldState.error.message}</p>}
                  </div>
                )}
              />
              <Controller
                control={form.control}
                name={`projects.${index}.url`}
                render={({ field, fieldState }) => (
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Project URL</label>
                    <Input placeholder="https://myproject.com" {...field} onBlur={handleUpdate} />
                     {fieldState.error && <p className="text-sm text-destructive">{fieldState.error.message}</p>}
                  </div>
                )}
              />
            </div>
             <Controller
                control={form.control}
                name={`projects.${index}.description`}
                render={({ field }) => (
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Description</label>
                    <Textarea placeholder="A brief description of your project..." {...field} onBlur={handleUpdate} rows={2} />
                  </div>
                )}
              />
            
            <div className="space-y-1">
              <label className="text-sm font-medium">Key Contributions / Features</label>
              <ul className="space-y-2">
                {form.watch(`projects.${index}.bulletPoints`).map((point, pIndex) => (
                  <li key={pIndex} className="flex items-center gap-2">
                    <Textarea value={point} className="flex-1" rows={1} onChange={(e) => {
                      const newPoints = [...form.getValues(`projects.${index}.bulletPoints`)];
                      newPoints[pIndex] = e.target.value;
                      update(index, { ...form.getValues(`projects.${index}`), bulletPoints: newPoints });
                    }} onBlur={handleUpdate} />
                    <Button variant="ghost" size="icon" className="shrink-0" onClick={() => {
                       const newPoints = form.getValues(`projects.${index}.bulletPoints`).filter((_, i) => i !== pIndex);
                       update(index, { ...form.getValues(`projects.${index}`), bulletPoints: newPoints });
                       handleUpdate();
                    }}>
                      <Trash2 size={16} />
                    </Button>
                  </li>
                ))}
              </ul>
              <Button variant="link" size="sm" onClick={() => {
                const newPoints = [...form.getValues(`projects.${index}.bulletPoints`), ''];
                update(index, { ...form.getValues(`projects.${index}`), bulletPoints: newPoints });
              }}>
                <PlusCircle size={14} className="mr-2" /> Add bullet point
              </Button>
            </div>
            
          </div>
        </div>
      ))}
      <Button
        variant="outline"
        onClick={() => {
          append({ id: crypto.randomUUID(), name: '', url: '', description: '', bulletPoints: [] });
        }}
      >
        <PlusCircle className="mr-2" />
        Add Project
      </Button>
    </div>
  );
}
