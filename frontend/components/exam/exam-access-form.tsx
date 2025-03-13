'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { ArrowRight } from 'lucide-react';
import { examService } from '@/services/examService';

interface ExamAccessFormProps {
  examId: string;
  onSuccess?: () => void;
  className?: string;
}

export function ExamAccessForm({ examId, onSuccess, className }: ExamAccessFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [accessKey, setAccessKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAccessSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!accessKey.trim()) {
      setError('Please enter an access key');
      return;
    }

    try {
      setLoading(true);
      const result = await examService.verifyAccessKey(examId, accessKey);

      if (result.valid) {
        // Store access information in session storage
        sessionStorage.setItem(`exam-access-${examId}`, 'true');

        toast({
          title: 'Access Granted',
          description: 'You now have access to the exam.',
        });

        // Call success callback or redirect
        if (onSuccess) {
          onSuccess();
        } else {
          router.push(`/exams/${examId}`);
        }
      } else {
        setError(result.message || 'Invalid access key. Please try again.');
      }
    } catch (error) {
      console.error('Error verifying access key:', error);
      setError('An error occurred while verifying your access key. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleAccessSubmit} className={`space-y-4 ${className || ''}`}>
      <div className="space-y-2">
        <label htmlFor="accessKey" className="text-sm font-medium">
          Access Key
        </label>
        <Input
          id="accessKey"
          type="text"
          placeholder="Enter your access key"
          value={accessKey}
          onChange={e => setAccessKey(e.target.value)}
          autoComplete="off"
          className={error ? 'border-destructive' : ''}
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>

      <div className="pt-2">
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <span className="mr-2">Verifying</span>
              <div className="h-4 w-4 border-2 border-t-white/0 border-white rounded-full animate-spin"></div>
            </>
          ) : (
            <>
              Continue to Exam <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
