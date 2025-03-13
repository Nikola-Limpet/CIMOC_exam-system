import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Clock } from 'lucide-react';
import { Exam } from '@/types/exam';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import { isExamActive, formatExamPeriod } from '@/lib/examUtils';
import { Badge } from '@/components/ui/badge';
import { ExamStatusBadge } from '@/components/exam/exam-status-badge';
import { ExamMetadata } from '@/components/exam/exam-metadata';

interface ExamCardProps {
  exam: Exam;
}

export function ExamCard({ exam }: ExamCardProps) {
  const isActive = isExamActive(exam);

  // Determine the correct URL based on if the exam requires an access key
  const examUrl = exam.requiresAccessKey ? `/exams/${exam.id}/access` : `/exams/${exam.id}`;

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle>{exam.title}</CardTitle>
          <ExamStatusBadge exam={exam} />
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
        <ExamMetadata exam={exam} />
      </CardContent>
      <CardFooter>
        <Link href={examUrl} passHref className="w-full">
          <Button className="w-full">{isActive ? 'Start Exam' : 'View Details'}</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
