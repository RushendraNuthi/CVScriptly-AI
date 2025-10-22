'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { ResumeData, Design } from '@/lib/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { cn } from '@/lib/utils';

const designSchema = z.object({
  template: z.string(),
  fontFamily: z.string(),
  fontSize: z.string(),
  primaryColor: z.string(),
});

type DesignFormProps = {
  data: ResumeData;
  onUpdate: (data: Partial<ResumeData>) => void;
};

export const templates: { name: string, design: Design }[] = [
  { name: 'Classic', design: { template: 'classic', fontFamily: 'PT Sans', fontSize: '11px', primaryColor: '210 14% 23%' } },
  { name: 'Modern', design: { template: 'modern', fontFamily: 'Poppins', fontSize: '10px', primaryColor: '210 14% 23%' } },
  { name: 'Creative', design: { template: 'creative', fontFamily: 'Verdana', fontSize: '11px', primaryColor: '15 79% 55%' } },
];

const fontFamilies = [
  'PT Sans', 'Poppins', 'Verdana', 'Georgia', 'Garamond', 'Times New Roman'
];
const fontSizes = [
  { label: 'Small', value: '10px' },
  { label: 'Medium', value: '11px' },
  { label: 'Large', value: '12px' },
];
const colorSwatches = [
  { name: 'Default', value: '216 45% 30%' },
  { name: 'Black', value: '210 14% 23%' },
  { name: 'Emerald', value: '158 41% 30%' },
  { name: 'Ruby', value: '0 72% 51%' },
  { name: 'Sapphire', value: '217 89% 61%' },
  { name: 'Amethyst', value: '271 76% 53%' },
];

export function DesignForm({ data, onUpdate }: DesignFormProps) {
  const form = useForm<z.infer<typeof designSchema>>({
    resolver: zodResolver(designSchema),
    defaultValues: data.design,
  });

  const handleUpdate = (values: z.infer<typeof designSchema>) => {
    onUpdate({ design: values });
  };

  const handleTemplateChange = (templateName: string) => {
    const selectedTemplate = templates.find(t => t.name === templateName);
    if (selectedTemplate) {
      form.reset(selectedTemplate.design);
      handleUpdate(selectedTemplate.design);
    }
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>Template</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {templates.map(template => (
              <button
                key={template.name}
                type="button"
                onClick={() => handleTemplateChange(template.name)}
                className={cn(
                  'p-2 border-2 rounded-lg text-center aspect-square flex flex-col justify-center items-center gap-2',
                  data.design.template === template.design.template ? 'border-primary bg-primary/10' : 'hover:border-primary/50'
                )}
              >
                <div className="w-10 h-10 rounded-full" style={{backgroundColor: `hsl(${template.design.primaryColor})`}}></div>
                <p className="font-semibold" style={{fontFamily: template.design.fontFamily}}>{template.name}</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader><CardTitle>Customize</CardTitle></CardHeader>
        <CardContent className="space-y-6">
          <Controller
            control={form.control}
            name="fontFamily"
            render={({ field }) => (
              <div className="space-y-2">
                <Label>Font Family</Label>
                <Select onValueChange={(value) => { field.onChange(value); handleUpdate(form.getValues()); }} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a font" />
                  </SelectTrigger>
                  <SelectContent>
                    {fontFamilies.map(font => <SelectItem key={font} value={font}>{font}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}
          />

          <Controller
            control={form.control}
            name="fontSize"
            render={({ field }) => (
              <div className="space-y-2">
                <Label>Font Size</Label>
                <RadioGroup
                  onValueChange={(value) => { field.onChange(value); handleUpdate(form.getValues()); }}
                  value={field.value}
                  className="flex gap-4"
                >
                  {fontSizes.map(size => (
                    <div key={size.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={size.value} id={`fs-${size.value}`} />
                      <Label htmlFor={`fs-${size.value}`}>{size.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}
          />
          
           <Controller
            control={form.control}
            name="primaryColor"
            render={({ field }) => (
              <div className="space-y-2">
                <Label>Accent Color</Label>
                <div className="flex flex-wrap gap-3">
                  {colorSwatches.map(color => (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => { field.onChange(color.value); handleUpdate(form.getValues()); }}
                      className={`h-10 w-10 rounded-full border-2 ${field.value === color.value ? 'border-ring' : 'border-transparent'}`}
                      style={{ backgroundColor: `hsl(${color.value})` }}
                      aria-label={color.name}
                    />
                  ))}
                </div>
              </div>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
}
