import { BookOpen, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface ExamEmptyStateProps {
  searchQuery: string;
  isAdmin: boolean;
}

export function ExamEmptyState({ searchQuery, isAdmin }: ExamEmptyStateProps) {
  const router = useRouter();

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed bg-background p-10 text-center">
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        <div className="rounded-full bg-muted p-3">
          <BookOpen className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="mt-6 text-xl font-semibold">No exams found</h3>
        <p className="mb-6 mt-2 text-sm text-muted-foreground max-w-sm">
          {searchQuery
            ? `No exams match your search "${searchQuery}". Try a different query or clear the search.`
            : isAdmin
            ? "You haven't created any exams yet. Get started by creating your first exam."
            : 'No exams are currently available to you.'}
        </p>
        {isAdmin && (
          <Button
            onClick={() => router.push('/exams/create')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Your First Exam
          </Button>
        )}
      </div>
    </div>
  );
}
