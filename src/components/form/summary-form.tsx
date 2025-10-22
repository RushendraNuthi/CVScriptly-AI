'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Sparkles, Loader2 } from 'lucide-react';
import type { ResumeData } from '@/lib/types';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { generateProfessionalSummary } from '@/ai/flows/generate-professional-summary';

const summarySchema = z.object({
  summary: z.string().optional(),
  careerStage: z.string().min(1, 'Please select a career stage.'),
  experienceSummary: z
    .string()
    .min(10, 'Please provide a brief summary of your experience.'),
});

type SummaryFormProps = {
  data: ResumeData;
  onUpdate: (data: Partial<ResumeData>) => void;
};

export function SummaryForm({ data, onUpdate }: SummaryFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof summarySchema>>({
    resolver: zodResolver(summarySchema),
    defaultValues: {
      summary: data.summary,
      careerStage: '',
      experienceSummary: '',
    },
  });

  const handleGenerateSummary = async () => {
    const { careerStage, experienceSummary } = form.getValues();
    if (!careerStage || !experienceSummary) {
      form.trigger(['careerStage', 'experienceSummary']);
      return;
    }

    setIsLoading(true);
    try {
      const result = await generateProfessionalSummary({
        careerStage,
        experienceSummary,
      });
      const newSummary = result.professionalSummary;
      form.setValue('summary', newSummary);
      onUpdate({ summary: newSummary });
    } catch (error) {
      console.error('Error generating summary:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate professional summary. Please try again.',
      });
    }
    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <div className="space-y-6">
        <div className="p-6 border rounded-lg bg-card space-y-4">
          <h3 className="font-headline text-lg font-semibold">
            AI Summary Generator
          </h3>
          <FormField
            control={form.control}
            name="careerStage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Career Stage</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your career stage" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Entry-Level">Entry-Level</SelectItem>
                    <SelectItem value="Mid-Career">Mid-Career</SelectItem>
                    <SelectItem value="Senior-Level">Senior-Level</SelectItem>
                    <SelectItem value="Executive">Executive</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="experienceSummary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Experience Highlights</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Briefly describe your key skills, roles, and accomplishments. e.g., 'A software engineer with 5 years of experience in building scalable web applications using React and Node.js...'"
                    {...field}
                    rows={4}
                  />
                </FormControl>
                <FormDescription>
                  Provide some context for the AI to write your summary.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            onClick={handleGenerateSummary}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Sparkles />
            )}
            <span>
              {isLoading ? 'Generating...' : 'Generate with AI'}
            </span>
          </Button>
        </div>

        <FormField
          control={form.control}
          name="summary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Professional Summary</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="A concise and engaging summary of your professional background."
                  {...field}
                  onBlur={() => onUpdate({ summary: field.value })}
                  rows={6}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </Form>
  );
}
