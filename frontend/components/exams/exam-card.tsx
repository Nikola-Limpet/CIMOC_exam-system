'use client';

import { format } from 'date-fns';
import { Calendar, MoreHorizontal, FileEdit, Trash2, Eye, Timer, User, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Exam } from '@/types/exam';
import {
  getAvailabilityInfo,
  getStatusColor,
  getStatusIcon,
  getStatusBackground,
} from '@/lib/utils/exam-utils';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { TakeExamDialog } from './take-exam-dialog';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { isExamActive } from '@/lib/examUtils';

interface ExamCardProps {
  exam: Exam;
  isAdmin: boolean;
  onAction: (exam: Exam) => void;
  onDelete: (exam: Exam) => void;
}

export function ExamCard({ exam, isAdmin, onAction, onDelete }: ExamCardProps) {
  const router = useRouter();
  const availability = getAvailabilityInfo(exam.availableFrom, exam.availableTo);
  const examActive = isExamActive(exam);
  const [takeExamDialogOpen, setTakeExamDialogOpen] = useState(false);

  const handleTakeExamClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (examActive) {
      setTakeExamDialogOpen(true);
    }
  };

  const handleProceedToExam = () => {
    setTakeExamDialogOpen(false);
    router.push(`/exams/${exam.id}/take`);
  };

  const handleCardClick = () => {
    if (isAdmin) {
      onAction(exam);
    } else {
      router.push(`/exams/${exam.id}/details`);
    }
  };

  return (
    <Card
      className="overflow-hidden transition-all border border-border/40 hover:border-border hover:shadow-md cursor-pointer group"
      onClick={handleCardClick}
    >
      <CardHeader className="pb-3 relative">
        <div
          className="absolute top-0 left-0 w-full h-1"
          style={{ background: getStatusBackground(exam.status) }}
        />
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="line-clamp-1 group-hover:text-primary transition-colors">
              {exam.title}
            </CardTitle>
            <CardDescription className="line-clamp-2 mt-1">
              {exam.description || 'No description provided.'}
            </CardDescription>
          </div>

          {isAdmin && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
                <Button variant="ghost" size="icon" className="opacity-60 hover:opacity-100">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
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
      </CardHeader>

      <CardContent className="pb-3">
        <div className="flex flex-col space-y-3">
          {exam.duration !== undefined && (
            <div className="flex items-center text-sm">
              <Timer className="mr-2 h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span>
                {exam.duration} {exam.duration === 1 ? 'minute' : 'minutes'} duration
              </span>
            </div>
          )}

          {(exam.availableFrom || exam.availableTo) && (
            <div className="flex items-center text-sm">
              <Calendar className="mr-2 h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className={availability.color}>{availability.text}</span>
            </div>
          )}

          {!exam.availableFrom && !exam.availableTo && exam.createdAt && (
            <div className="flex items-center text-sm">
              <Calendar className="mr-2 h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-muted-foreground">
                Created {format(new Date(exam.createdAt), 'MMM d, yyyy')}
              </span>
            </div>
          )}

          {isAdmin && exam.participants !== undefined && (
            <div className="flex items-center text-sm">
              <Users className="mr-2 h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span>
                {exam.participants} {exam.participants === 1 ? 'participant' : 'participants'}
              </span>
            </div>
          )}

          {isAdmin && exam.createdBy && (
            <div className="flex items-center text-sm">
              <User className="mr-2 h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-muted-foreground truncate" title={exam.createdBy}>
                Creator: {exam.createdBy.substring(0, 8)}...
              </span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between pt-2">
        <div className="flex w-full items-center justify-between">
          {exam.status ? (
            <Badge
              variant="outline"
              className={cn('capitalize flex items-center', getStatusColor(exam.status))}
            >
              {getStatusIcon(exam.status)}
              {exam.status}
            </Badge>
          ) : (
            <span className="text-sm text-muted-foreground">No status</span>
          )}

          {exam.totalQuestions !== undefined ? (
            <span className="text-sm text-muted-foreground bg-muted/40 px-2 py-0.5 rounded-md">
              {exam.totalQuestions} {exam.totalQuestions === 1 ? 'question' : 'questions'}
            </span>
          ) : (
            <span className="text-sm text-muted-foreground bg-muted/40 px-2 py-0.5 rounded-md">
              No questions yet
            </span>
          )}
        </div>

        {/* Student actions */}
        {!isAdmin && examActive && (
          <Button
            size="sm"
            onClick={handleTakeExamClick}
            className="ml-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white"
          >
            Take Exam
          </Button>
        )}
      </CardFooter>

      {/* Take exam confirmation dialog */}
      <TakeExamDialog
        isOpen={takeExamDialogOpen}
        exam={exam}
        onClose={() => setTakeExamDialogOpen(false)}
        onProceed={handleProceedToExam}
      />
    </Card>
  );
}
