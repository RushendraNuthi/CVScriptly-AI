'use client';

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Loader2, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { suggestRelevantKeywords } from '@/ai/flows/suggest-relevant-keywords';

export function KeywordSuggester() {
  const [jobDescription, setJobDescription] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSuggestKeywords = async () => {
    if (!jobDescription) {
      toast({
        variant: 'destructive',
        title: 'Job description needed',
        description: 'Please paste a job description to get keyword suggestions.',
      });
      return;
    }
    setIsLoading(true);
    setKeywords([]);
    try {
      const result = await suggestRelevantKeywords({ jobDescription });
      setKeywords(result.keywords);
    } catch (error) {
      console.error('Error suggesting keywords:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to suggest keywords. Please try again.',
      });
    }
    setIsLoading(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied!',
      description: `"${text}" copied to clipboard.`,
    });
  }

  return (
    <div className="space-y-4">
      <h3 className="font-headline text-lg font-semibold">
        ATS Keyword Suggester
      </h3>
      <p className="text-sm text-muted-foreground">
        Paste a job description below to extract relevant keywords and optimize your resume for Applicant Tracking Systems (ATS).
      </p>
      <Textarea
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        placeholder="Paste the job description here..."
        rows={8}
      />
      <Button onClick={handleSuggestKeywords} disabled={isLoading} className="w-full">
        {isLoading ? <Loader2 className="animate-spin" /> : <Sparkles />}
        <span>{isLoading ? 'Extracting...' : 'Extract Keywords'}</span>
      </Button>

      {keywords.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-semibold">Suggested Keywords:</h4>
          <div className="flex flex-wrap gap-2 p-4 border rounded-lg bg-card">
            {keywords.map((keyword, index) => (
              <Badge key={index} variant="secondary" className="text-base py-1 px-3 hover:bg-muted cursor-pointer" onClick={() => copyToClipboard(keyword)}>
                {keyword}
                <Copy size={12} className="ml-2 opacity-50" />
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
