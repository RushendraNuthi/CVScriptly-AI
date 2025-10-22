'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { ResumeData } from '@/lib/types';
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

const designSchema = z.object({
  fontFamily: z.string(),
  fontSize: z.string(),
  primaryColor: z.string(),
});

type DesignFormProps = {
  data: ResumeData;
  onUpdate: (data: Partial<ResumeData>) => void;
};

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
  { name: 'Emerald', value: '158 41% 30%' },
  { name: 'Ruby', value: '0 72% 51%' },
  { name: 'Sapphire', value: '217 89% 61%' },
  { name: 'Amethyst', value: '271 76% 53%' },
  { name: 'Graphite', value: '210 14% 23%' },
];

export function DesignForm({ data, onUpdate }: DesignFormProps) {
  const form = useForm<z.infer<typeof designSchema>>({
    resolver: zodResolver(designSchema),
    defaultValues: data.design,
  });

  const handleUpdate = (values: z.infer<typeof designSchema>) => {
    onUpdate({ design: values });
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>Font</CardTitle></CardHeader>
        <CardContent className="space-y-6">
          <Controller
            control={form.control}
            name="fontFamily"
            render={({ field }) => (
              <div className="space-y-2">
                <Label>Font Family</Label>
                <Select onValueChange={(value) => { field.onChange(value); handleUpdate(form.getValues()); }} defaultValue={field.value}>
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
                  defaultValue={field.value}
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
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader><CardTitle>Color</CardTitle></CardHeader>
        <CardContent>
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
