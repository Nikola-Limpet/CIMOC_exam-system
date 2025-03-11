'use client';

import { format } from 'date-fns';
import { Calendar, Clock, MoreHorizontal, FileEdit, Trash2, Eye, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Exam } from '@/types/exam';
import { getAvailabilityInfo, getStatusColor, getStatusIcon } from '@/lib/utils/exam-utils';
import { cn } from '@/lib/utils';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ExamListItemProps {
  exam: Exam;
  isAdmin: boolean;
  onAction: (exam: Exam) => void;
  onDelete: (exam: Exam) => void;
}

export function ExamListItem({ exam, isAdmin, onAction, onDelete }: ExamListItemProps) {
  const router = useRouter();
  const availability = getAvailabilityInfo(exam.availableFrom, exam.availableTo);

  return (
    <div
      className="p-4 flex items-center justify-between hover:bg-muted/50 cursor-pointer transition-colors"
      onClick={() => onAction(exam)}
    >
      <div className="flex items-center gap-4">
        <div
          className={cn(
            'w-1.5 h-12 rounded-full',
            exam.status === 'published'
              ? 'bg-green-500'
              : exam.status === 'draft'
              ? 'bg-yellow-500'
              : 'bg-gray-500'
          )}
        />
        <div>
          <h3 className="font-medium text-base">{exam.title}</h3>
          <div className="flex items-center gap-4 mt-1 flex-wrap">
            {exam.status && (
              <Badge
                variant="outline"
                className={cn('capitalize flex items-center h-5', getStatusColor(exam.status))}
              >
                {getStatusIcon(exam.status)}
                {exam.status}
              </Badge>
            )}

            {exam.duration && (
              <span className="flex items-center text-xs text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" />
                {exam.duration} min
              </span>
            )}

            {(exam.availableFrom || exam.availableTo) && (
              <span className={cn('flex items-center text-xs', availability.color)}>
                <Calendar className="h-3 w-3 mr-1" />
                {availability.text}
              </span>
            )}

            {!exam.availableFrom && !exam.availableTo && exam.createdAt && (
              <span className="flex items-center text-xs text-muted-foreground">
                <Calendar className="h-3 w-3 mr-1" />
                Created {format(new Date(exam.createdAt), 'MMM d, yyyy')}
              </span>
            )}

            {isAdmin && exam.participants !== undefined && (
              <span className="flex items-center text-xs text-muted-foreground">
                <Users className="h-3 w-3 mr-1" />
                {exam.participants} {exam.participants === 1 ? 'user' : 'users'}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {exam.totalQuestions !== undefined ? (
          <div className="text-sm bg-muted/40 px-2 py-0.5 rounded-md">
            {exam.totalQuestions} questions
          </div>
        ) : (
          <div className="text-sm bg-muted/40 px-2 py-0.5 rounded-md text-muted-foreground">
            No questions
          </div>
        )}

        {isAdmin && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="opacity-60 hover:opacity-100">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={e => {
                  e.stopPropagation();
                  router.push(`/exams/${exam.id}`);
                }}
              >
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={e => {
                  e.stopPropagation();
                  router.push(`/exams/${exam.id}/edit`);
                }}
              >
                <FileEdit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={e => {
                  e.stopPropagation();
                  onDelete(exam);
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}
