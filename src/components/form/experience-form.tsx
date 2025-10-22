'use client';

import { useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { ResumeData } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { PlusCircle, Sparkles, Trash2, Loader2, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateQuantifiableBulletPoints } from '@/ai/flows/generate-quantifiable-bullet-points';

const experienceSchema = z.object({
  experience: z.array(
    z.object({
      id: z.string(),
      role: z.string().min(1, 'Role is required'),
      company: z.string().min(1, 'Company is required'),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      description: z.string().optional(),
      bulletPoints: z.array(z.string()),
    })
  ),
});

type ExperienceFormProps = {
  data: ResumeData;
  onUpdate: (data: Partial<ResumeData>) => void;
};

export function ExperienceForm({ data, onUpdate }: ExperienceFormProps) {
  const { toast } = useToast();
  const [loadingStates, setLoadingStates] = useState<Record<number, boolean>>({});
  const [aiSuggestions, setAiSuggestions] = useState<Record<number, string[]>>({});

  const form = useForm<z.infer<typeof experienceSchema>>({
    resolver: zodResolver(experienceSchema),
    defaultValues: { experience: data.experience },
  });

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: 'experience',
  });

  const handleUpdate = () => {
    const values = form.getValues();
    onUpdate({ experience: values.experience });
  };
  
  const handleGeneratePoints = async (index: number) => {
    const description = form.getValues(`experience.${index}.description`);
    if (!description) {
      toast({
        variant: 'destructive',
        title: 'Description needed',
        description: 'Please provide a job description to generate bullet points.',
      });
      return;
    }
    setLoadingStates(prev => ({ ...prev, [index]: true }));
    try {
      const result = await generateQuantifiableBulletPoints({ jobDescription: description });
      setAiSuggestions(prev => ({...prev, [index]: result.quantifiableBulletPoints}));
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate bullet points.',
      });
    }
    setLoadingStates(prev => ({ ...prev, [index]: false }));
  };

  const addBulletPoint = (experienceIndex: number, point: string) => {
    const currentPoints = form.getValues(`experience.${experienceIndex}.bulletPoints`);
    const newPoints = [...currentPoints, point];
    update(experienceIndex, { ...form.getValues(`experience.${experienceIndex}`), bulletPoints: newPoints });
    handleUpdate();
    toast({ title: 'Success', description: 'Bullet point added to your experience.' });
  }

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
                name={`experience.${index}.role`}
                render={({ field, fieldState }) => (
                   <div className="space-y-1">
                    <label className="text-sm font-medium">Role / Title</label>
                    <Input placeholder="Software Engineer" {...field} onBlur={handleUpdate} />
                    {fieldState.error && <p className="text-sm text-destructive">{fieldState.error.message}</p>}
                   </div>
                )}
              />
              <Controller
                control={form.control}
                name={`experience.${index}.company`}
                render={({ field, fieldState }) => (
                   <div className="space-y-1">
                    <label className="text-sm font-medium">Company</label>
                    <Input placeholder="Acme Inc." {...field} onBlur={handleUpdate} />
                    {fieldState.error && <p className="text-sm text-destructive">{fieldState.error.message}</p>}
                   </div>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <Controller
                control={form.control}
                name={`experience.${index}.startDate`}
                render={({ field }) => (
                   <div className="space-y-1">
                    <label className="text-sm font-medium">Start Date</label>
                    <Input placeholder="Jan 2020" {...field} onBlur={handleUpdate} />
                   </div>
                )}
              />
               <Controller
                control={form.control}
                name={`experience.${index}.endDate`}
                render={({ field }) => (
                  <div className="space-y-1">
                    <label className="text-sm font-medium">End Date</label>
                    <Input placeholder="Present" {...field} onBlur={handleUpdate} />
                   </div>
                )}
              />
            </div>
             <Controller
                control={form.control}
                name={`experience.${index}.description`}
                render={({ field }) => (
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Job Description / Responsibilities</label>
                    <Textarea placeholder="Describe your responsibilities and achievements in this role..." {...field} onBlur={handleUpdate} rows={4} />
                  </div>
                )}
              />

            <Button onClick={() => handleGeneratePoints(index)} disabled={loadingStates[index]} variant="outline">
              {loadingStates[index] ? <Loader2 className="animate-spin" /> : <Sparkles />}
              <span>Generate Bullet Points</span>
            </Button>

            {aiSuggestions[index] && (
              <div className="space-y-2 pt-2 border-t mt-4">
                  <h4 className="text-sm font-semibold">AI Suggestions:</h4>
                  <ul className="space-y-2">
                    {aiSuggestions[index].map((point, pIndex) => (
                      <li key={pIndex} className="flex items-start gap-2 text-sm bg-muted p-2 rounded-md">
                        <span className="flex-1">{point}</span>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => addBulletPoint(index, point)}>
                          <Copy size={14} />
                        </Button>
                      </li>
                    ))}
                  </ul>
              </div>
            )}
            
            <div className="space-y-1">
              <label className="text-sm font-medium">Your Bullet Points</label>
              <ul className="space-y-2">
                {form.watch(`experience.${index}.bulletPoints`).map((point, pIndex) => (
                  <li key={pIndex} className="flex items-center gap-2">
                    <Textarea value={point} className="flex-1" rows={1} onChange={(e) => {
                      const newPoints = [...form.getValues(`experience.${index}.bulletPoints`)];
                      newPoints[pIndex] = e.target.value;
                      update(index, { ...form.getValues(`experience.${index}`), bulletPoints: newPoints });
                    }} onBlur={handleUpdate} />
                    <Button variant="ghost" size="icon" className="shrink-0" onClick={() => {
                       const newPoints = form.getValues(`experience.${index}.bulletPoints`).filter((_, i) => i !== pIndex);
                       update(index, { ...form.getValues(`experience.${index}`), bulletPoints: newPoints });
                       handleUpdate();
                    }}>
                      <Trash2 size={16} />
                    </Button>
                  </li>
                ))}
              </ul>
              <Button variant="link" size="sm" onClick={() => {
                const newPoints = [...form.getValues(`experience.${index}.bulletPoints`), ''];
                update(index, { ...form.getValues(`experience.${index}`), bulletPoints: newPoints });
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
          append({ id: crypto.randomUUID(), role: '', company: '', startDate: '', endDate: '', description: '', bulletPoints: [] });
        }}
      >
        <PlusCircle className="mr-2" />
        Add Experience
      </Button>
    </div>
  );
}
