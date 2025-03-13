import { Badge } from '@/components/ui/badge';
import { Exam } from '@/types/exam';
import { isExamActive } from '@/lib/examUtils';

interface ExamStatusBadgeProps {
  exam: Exam;
}

export function ExamStatusBadge({ exam }: ExamStatusBadgeProps) {
  const isActive = isExamActive(exam);

  if (!exam.status) {
    return isActive ? <Badge variant="success">Active Now</Badge> : null;
  }

  switch (exam.status) {
    case 'draft':
      return <Badge variant="outline">Draft</Badge>;
    case 'published':
      return isActive ? (
        <Badge variant="success">Active Now</Badge>
      ) : (
        <Badge variant="default">Published</Badge>
      );
    case 'archived':
      return <Badge variant="secondary">Archived</Badge>;
    default:
      return null;
  }
}
