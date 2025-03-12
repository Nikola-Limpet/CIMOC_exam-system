import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Clock, CheckCircle2 } from 'lucide-react';
import { Exam } from '@/types/exam';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import { isExamActive, formatExamPeriod } from '@/lib/examUtils';
import { Badge } from '@/components/ui/badge';

interface ExamCardProps {
  exam: Exam;
}

export function ExamCard({ exam }: ExamCardProps) {
  const isActive = isExamActive(exam);
  const hasAvailability = exam.availableFrom && exam.availableTo;

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle>{exam.title}</CardTitle>
          {isActive && <Badge variant="success">Active Now</Badge>}
        </div>
        <CardDescription>
          {exam.availableFrom ? (
            <>Starts {formatDate(exam.availableFrom)}</>
          ) : (
            'No start time specified'
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        {hasAvailability ? (
          <div className="flex flex-col space-y-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <CalendarIcon className="mr-2 h-4 w-4" />
              <span>{formatDate(exam.availableFrom!)}</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="mr-2 h-4 w-4" />
              <span>{formatExamPeriod(exam)}</span>
            </div>
            {exam.duration && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="mr-2 h-4 w-4" />
                <span>{exam.duration} minutes</span>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No availability set</p>
        )}
      </CardContent>
      <CardFooter>
        <Link href={`/exams/${exam.id}`} passHref>
          <Button className="w-full">{isActive ? 'Start Exam' : 'View Details'}</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
