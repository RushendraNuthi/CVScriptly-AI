'use client';

import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { ResumeData } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2 } from 'lucide-react';

const certificationsSchema = z.object({
  certifications: z.array(
    z.object({
      id: z.string(),
      name: z.string().min(1, 'Certification name is required'),
      issuer: z.string().min(1, 'Issuer is required'),
      date: z.string().optional(),
    })
  ),
});

type CertificationsFormProps = {
  data: ResumeData;
  onUpdate: (data: Partial<ResumeData>) => void;
};

export function CertificationsForm({ data, onUpdate }: CertificationsFormProps) {
  const form = useForm<z.infer<typeof certificationsSchema>>({
    resolver: zodResolver(certificationsSchema),
    defaultValues: { certifications: data.certifications || [] },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'certifications',
  });

  const handleUpdate = () => {
    const values = form.getValues();
    onUpdate({ certifications: values.certifications });
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
              name={`certifications.${index}.name`}
              render={({ field, fieldState }) => (
                <div className="space-y-1">
                  <label className="text-sm font-medium">Certification Name</label>
                  <Input placeholder="e.g., Certified Cloud Practitioner" {...field} onBlur={handleUpdate} />
                  {fieldState.error && <p className="text-sm text-destructive">{fieldState.error.message}</p>}
                </div>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                control={form.control}
                name={`certifications.${index}.issuer`}
                render={({ field, fieldState }) => (
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Issuing Organization</label>
                    <Input placeholder="e.g., Amazon Web Services" {...field} onBlur={handleUpdate} />
                    {fieldState.error && <p className="text-sm text-destructive">{fieldState.error.message}</p>}
                  </div>
                )}
              />
              <Controller
                control={form.control}
                name={`certifications.${index}.date`}
                render={({ field }) => (
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Date Issued</label>
                    <Input placeholder="e.g., June 2023" {...field} onBlur={handleUpdate} />
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
          append({ id: crypto.randomUUID(), name: '', issuer: '', date: '' });
        }}
      >
        <PlusCircle className="mr-2" />
        Add Certification
      </Button>
    </div>
  );
}
