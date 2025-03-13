'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, AlertCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { examsApi } from '@/lib/api/exams';
import { authApi } from '@/lib/api';
import { Exam } from '@/types/exam';

// Import our new components
import { ExamCard } from '@/components/exams/exam-card';
import { ExamListItem } from '@/components/exams/exam-list-item';
import { ExamEmptyState } from '@/components/exams/exam-empty-state';
import { ExamSearchFilter } from '@/components/exams/exam-search-filter';
import { DeleteExamDialog } from '@/components/exams/delete-exam-dialog';
import { LoadingIndicator } from '@/components/exams/loading-indicator';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { useAuth } from '@/providers/auth-provider';

export default function ExamsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [isSearching, setIsSearching] = useState(false);

  // Get current user
  const { user: authUser } = useAuth();

  const isAdmin = authUser?.roles === 'admin';

  // Fetch exams from backend with improved error and loading handling
  const {
    data: examsData,
    isLoading: examsLoading,
    isFetching: examsFetching,
    error,
  } = useQuery({
    queryKey: ['exams', page, searchQuery, isAdmin],
    queryFn: async () => {
      try {
        setIsSearching(true);
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('limit', '12');
        if (searchQuery) params.append('search', searchQuery);

        // For students, only request published exams
        if (!isAdmin) params.append('status', 'published');

        const { data } = await examsApi.getAll(params.toString());
        return data;
      } catch (error) {
        console.error('Failed to fetch exams:', error);
        throw error;
      } finally {
        setIsSearching(false);
      }
    },
  });

  console.log(examsData);

  // Delete exam mutation (admin only)
  const deleteExamMutation = useMutation({
    mutationFn: (examId: string) => examsApi.deleteExam(examId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exams'] });
      setDeleteDialogOpen(false);
    },
  });

  // Handle exam deletion
  const handleDeleteExam = () => {
    if (selectedExam && isAdmin) {
      deleteExamMutation.mutate(selectedExam.id);
    }
  };

  // Filter and search function with loading state
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1); // Reset to first page on search
  };

  // Handle view change
  const handleViewChange = (newView: 'grid' | 'list') => {
    setView(newView);
  };

  // Navigate to exam details/access page
  const handleExamAction = (exam: Exam) => {
    router.push(`/exams/${exam.id}/details`);
  };
  // Handle opening delete dialog
  const handleOpenDeleteDialog = (exam: Exam) => {
    setSelectedExam(exam);
    setDeleteDialogOpen(true);
  };

  // Calculate overall loading state
  const isInitialLoading = examsLoading;
  const isRefetching = examsFetching && !examsLoading;

  // Extract and filter exams
  const exams = Array.isArray(examsData)
    ? isAdmin
      ? examsData // Admins see all exams returned by the API
      : examsData.filter(exam => exam.status === 'published') // Extra client-side filter for students
    : [];
  const totalPages = 1; // Assuming one page for now

  // Initial loading skeleton
  if (isInitialLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div>
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-4 w-64 mt-2" />
          </div>
          <Skeleton className="h-9 w-36" />
        </div>
        <Separator />
        <Skeleton className="h-10 w-80" />
        <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i} className="overflow-hidden">
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full mt-2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex w-full justify-between">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-5 w-16" />
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 py-20">
        <AlertCircle className="h-16 w-16 text-destructive opacity-80" />
        <h3 className="text-2xl font-semibold">Failed to load exams</h3>
        <p className="text-muted-foreground max-w-md text-center">
          We encountered an error while trying to load your exams. Please try again later or contact
          support.
        </p>
        <Button
          size="lg"
          onClick={() => queryClient.invalidateQueries({ queryKey: ['exams'] })}
          className="mt-2"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Exams
          </h2>
          <p className="text-muted-foreground mt-1">
            {isAdmin
              ? 'Create, manage and monitor examination resources.'
              : 'View and participate in available exams.'}
          </p>
        </div>
        {isAdmin && (
          <Button
            onClick={() => router.push('/exams/create')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Exam
          </Button>
        )}
      </div>

      <Separator className="my-6" />

      {/* Search and filter section using component */}
      <ExamSearchFilter
        searchQuery={searchQuery}
        view={view}
        isSearching={isSearching}
        onSearchChange={handleSearch}
        onViewChange={handleViewChange}
      />

      {/* Show refetching indicator when refetching but not during initial loading */}
      {isRefetching && <LoadingIndicator />}

      {/* Exams display section with empty state */}
      {exams.length === 0 ? (
        <ExamEmptyState searchQuery={searchQuery} isAdmin={isAdmin} />
      ) : view === 'grid' ? (
        // Grid view with components
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {exams.map(exam => (
            <ExamCard
              key={exam.id}
              exam={exam as import('@/types/exam').Exam}
              isAdmin={isAdmin}
              onAction={handleExamAction}
              onDelete={handleOpenDeleteDialog}
            />
          ))}
        </div>
      ) : (
        // List view with components
        <div className="border rounded-md divide-y">
          {exams.map(exam => (
            <ExamListItem
              key={exam.id}
              exam={exam as import('@/types/exam').Exam}
              isAdmin={isAdmin}
              onAction={handleExamAction}
              onDelete={handleOpenDeleteDialog}
            />
          ))}
        </div>
      )}

      {/* Pagination - Only show when needed and disable when fetching */}
      {exams.length > 0 && totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  className={
                    page <= 1 || isRefetching ? 'pointer-events-none opacity-50' : 'cursor-pointer'
                  }
                  disabled={isRefetching}
                />
              </PaginationItem>

              {/* Generate page numbers */}
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      onClick={() => setPage(pageNum)}
                      isActive={page === pageNum}
                      disabled={isRefetching}
                      className={isRefetching ? 'opacity-50' : ''}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              {totalPages > 5 && (
                <>
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink
                      onClick={() => setPage(totalPages)}
                      disabled={isRefetching}
                      className={isRefetching ? 'opacity-50' : ''}
                    >
                      {totalPages}
                    </PaginationLink>
                  </PaginationItem>
                </>
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  className={
                    page >= totalPages || isRefetching
                      ? 'pointer-events-none opacity-50'
                      : 'cursor-pointer'
                  }
                  disabled={isRefetching}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Delete confirmation dialog using component */}
      <DeleteExamDialog
        isOpen={deleteDialogOpen}
        exam={selectedExam}
        isDeleting={deleteExamMutation.isPending}
        onClose={() => setDeleteDialogOpen(false)}
        onDelete={handleDeleteExam}
      />
    </div>
  );
}
