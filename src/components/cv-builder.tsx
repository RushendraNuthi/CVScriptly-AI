'use client';

import { useState, useEffect, useCallback } from 'react';
import type { ResumeData } from '@/lib/types';
import { Header } from '@/components/header';
import { ResumeForm } from '@/components/resume-form';
import { ResumePreview } from '@/components/resume-preview';
import { Skeleton } from '@/components/ui/skeleton';

const initialData: ResumeData = {
  personalInfo: {
    name: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
  },
  summary: '',
  experience: [],
  education: [],
  skills: [],
};

export default function CVBuilder() {
  const [data, setData] = useState<ResumeData>(initialData);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const item = window.sessionStorage.getItem('cvscriptly-data');
      if (item) {
        setData(JSON.parse(item));
      }
    } catch (error) {
      console.warn('Could not parse resume data from session storage', error);
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      try {
        window.sessionStorage.setItem('cvscriptly-data', JSON.stringify(data));
      } catch (error) {
        console.warn('Could not save resume data to session storage', error);
      }
    }
  }, [data, isInitialized]);

  const handleUpdate = useCallback((newData: Partial<ResumeData>) => {
    setData((prev) => ({ ...prev, ...newData }));
  }, []);

  const handleClear = () => {
    setData(initialData);
    window.sessionStorage.removeItem('cvscriptly-data');
  };

  const handlePrint = () => {
    window.print();
  };

  if (!isInitialized) {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <header className="sticky top-0 z-10 w-full bg-background/80 backdrop-blur-sm border-b">
                <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
                    <Skeleton className="h-8 w-48" />
                    <div className="flex gap-2">
                        <Skeleton className="h-10 w-36" />
                        <Skeleton className="h-10 w-10" />
                    </div>
                </div>
            </header>
            <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 p-4 md:p-8">
                <div className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-96 w-full" />
                </div>
                <Skeleton className="h-[calc(100vh-6rem)] w-full hidden lg:block" />
            </main>
        </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header onPrint={handlePrint} onClear={handleClear} />
      <main className="flex-1 w-full max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 p-4 md:p-8">
        <ResumeForm data={data} onUpdate={handleUpdate} />
        <ResumePreview data={data} />
      </main>
    </div>
  );
}
