import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { examService } from '@/services/examService';
import { Exam } from '@/types/exam';
import { isExamActive } from '@/lib/examUtils';

export function useExamAccess(examId: string | undefined) {
  const [hasAccess, setHasAccess] = useState(false);
  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);
  const [examIsActive, setExamIsActive] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!examId) return;

    // Check stored access
    const hasStoredAccess = sessionStorage.getItem(`exam-access-${examId}`) === 'true';
    if (hasStoredAccess) {
      setHasAccess(true);
    }

    // Fetch exam data
    const fetchExam = async () => {
      setLoading(true);
      try {
        const examData = await examService.getExamById(examId);
        setExam(examData);

        const active = isExamActive(examData);
        setExamIsActive(active);

        if (active && !examData.requiresAccessKey) {
          setHasAccess(true);
          sessionStorage.setItem(`exam-access-${examId}`, 'true');
        }
      } catch (error) {
        console.error('Failed to fetch exam:', error);
        toast({
          title: 'Error',
          description: 'Failed to load the exam. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchExam();
  }, [examId, toast]);

  const verifyAccessKey = async (accessKey: string): Promise<{ success: boolean; message?: string }> => {
    if (!examId) return { success: false, message: 'No exam ID provided' };

    try {
      const result = await examService.verifyAccessKey(examId, accessKey);

      if (result.valid) {
        setHasAccess(true);
        sessionStorage.setItem(`exam-access-${examId}`, 'true');
        return { success: true };
      }

      return { success: false, message: result.message };
    } catch (error) {
      console.error('Error verifying access key:', error);
      return {
        success: false,
        message: 'An error occurred while verifying the access key.'
      };
    }
  };

  return {
    exam,
    loading,
    hasAccess,
    setHasAccess,
    examIsActive,
    verifyAccessKey,
  };
}
