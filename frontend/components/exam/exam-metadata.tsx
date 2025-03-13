import { CalendarIcon, Clock } from 'lucide-react';
import { Exam } from '@/types/exam';
import { formatDisplayDate, formatDateRange } from '@/lib/dateUtils';
import { getExamDuration } from '@/lib/examUtils';

interface ExamMetadataProps {
  exam: Exam;
  className?: string;
}

export function ExamMetadata({ exam, className }: ExamMetadataProps) {
  const hasAvailability = exam.availableFrom && exam.availableTo;

  if (!hasAvailability) {
    return <p className="text-sm text-muted-foreground">No availability set</p>;
  }

  return (
    <div className={`flex flex-col space-y-2 ${className || ''}`}>
      <div className="flex items-center text-sm text-muted-foreground">
        <CalendarIcon className="mr-2 h-4 w-4" />
        <span>{formatDisplayDate(exam.availableFrom)}</span>
      </div>
      <div className="flex items-center text-sm text-muted-foreground">
        <Clock className="mr-2 h-4 w-4" />
        <span>{formatDateRange(exam.availableFrom, exam.availableTo)}</span>
      </div>
      {(exam.duration || exam.timeLimit) && (
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="mr-2 h-4 w-4" />
          <span>{getExamDuration(exam)} minutes</span>
        </div>
      )}
    </div>
  );
}
