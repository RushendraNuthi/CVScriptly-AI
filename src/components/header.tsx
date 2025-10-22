import Link from 'next/link';
import { Download, Trash2, Home } from 'lucide-react';
import { Logo } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

type HeaderProps = {
  onPrint: () => void;
  onClear: () => void;
};

export function Header({ onPrint, onClear }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 w-full bg-background/80 backdrop-blur-sm border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        <Link href="/" className="flex items-center gap-3">
          <Logo className="h-8 w-8" />
          <h1 className="font-headline text-xl font-semibold text-primary">
            CVScriptly AI
          </h1>
        </Link>
        <div className="flex items-center gap-2">
           <Button variant="outline" size="icon" asChild>
             <Link href="/">
                <Home />
                <span className="sr-only">Home</span>
             </Link>
          </Button>
          <Button onClick={onPrint} variant="outline">
            <Download />
            <span>Download PDF</span>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="icon">
                <Trash2 />
                <span className="sr-only">Clear All Data</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete all
                  your resume data from this browser session.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onClear}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </header>
  );
}
